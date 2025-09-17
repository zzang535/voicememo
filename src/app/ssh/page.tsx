'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Terminal } from 'xterm';
import type { FitAddon } from '@xterm/addon-fit';
import { useStableWebSocket } from '@/hooks/useStableWebSocket';
import 'xterm/css/xterm.css';

interface SSHConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export default function SSHPage() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const terminalReady = useRef<boolean>(false);
  const pendingMessages = useRef<string[]>([]);
  const currentSessionId = useRef<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showConnectionForm, setShowConnectionForm] = useState(true);

  // Use refs to avoid closure issues in event handlers
  const isConnectedRef = useRef(false);

  const [sshConfig, setSSHConfig] = useState<SSHConfig>({
    host: '192.168.0.7',
    port: 22,
    username: 'hwangyoon',
    password: '',
  });

  // Fixed WebSocket handlers - no dependencies, handlers in refs
  const handlersConfig = useMemo(() => ({
    onOpen: () => {
      console.log('WebSocket connected - ready for SSH connection');
    },

    onMessage: (event: MessageEvent) => {
      console.log('Raw WebSocket message received:', event.data);
      try {
        const response = JSON.parse(event.data);
        console.log('Parsed WebSocket message:', response);

        switch (response.type) {
          case 'connected':
            console.log('SSH connection established successfully');
            if (response.sessionId) {
              currentSessionId.current = response.sessionId;
              console.log('Session ID received:', response.sessionId);
            }

            setIsConnected(true);
            isConnectedRef.current = true;
            setIsConnecting(false);
            setShowConnectionForm(false);
            addConnectionMessage(true);

            // Focus the terminal when connection is established
            setTimeout(() => {
              if (terminal.current) {
                terminal.current.focus();
              }
            }, 100);
            break;

          case 'data':
            console.log('Received SSH data:', response.data?.substring(0, 50));
            if (terminal.current && response.data) {
              try {
                if (terminalReady.current && terminal.current) {
                  try {
                    console.log('Writing to terminal:', response.data.substring(0, 50));
                    terminal.current.write(response.data);
                    console.log('Successfully wrote to terminal');
                  } catch (writeError) {
                    console.error('Terminal write error:', writeError);
                    pendingMessages.current.push(response.data);
                  }
                } else {
                  console.warn('Terminal not ready, queuing SSH data');
                  pendingMessages.current.push(response.data);
                  setTimeout(() => {
                    if (terminalReady.current && terminal.current) {
                      flushPendingMessages();
                    }
                  }, 200);
                }
              } catch (error) {
                console.error('Error processing SSH data:', error);
                pendingMessages.current.push(response.data);
              }
            }
            break;

          case 'error':
            console.log('SSH error:', response.error);

            // Don't disconnect for input-related errors, only for connection errors
            if (response.error && response.error.includes('Unknown message type')) {
              console.warn('Input message format error, but keeping connection alive');
              safeWriteToTerminal(`⚠️ Input error: ${response.error}`);
            } else {
              // Actual connection error - disconnect
              setConnectionError(response.error || 'Connection failed');
              setIsConnecting(false);
              setIsConnected(false);
              isConnectedRef.current = false;
              safeWriteToTerminal(`❌ Connection Error: ${response.error}`);
            }
            break;

          case 'disconnected':
            console.log('SSH connection disconnected');
            setIsConnected(false);
            isConnectedRef.current = false;
            setShowConnectionForm(true);
            safeWriteToTerminal('');
            safeWriteToTerminal('📡 SSH connection closed');
            break;

          default:
            console.log('Unknown message type:', response.type);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    },

    onClose: (event: CloseEvent) => {
      console.warn('SSH WebSocket closed:', event);
      setIsConnected(false);
      isConnectedRef.current = false;
      setShowConnectionForm(true);
    },

    onError: (event: Event) => {
      console.error('SSH WebSocket error:', event);
      setConnectionError('Failed to connect to SSH service');
      setIsConnecting(false);
    }
  }), []); // No dependencies - handlers are stable

  // Stable WebSocket connection
  const { websocket, closeWithTrace } = useStableWebSocket(
    'wss://voicememo-ws.bird89.com',
    handlersConfig
  );

  // Safe terminal operations utility functions
  const waitForTerminalReady = async (timeout = 3000): Promise<boolean> => {
    const startTime = Date.now();
    while (!terminalReady.current && Date.now() - startTime < timeout) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return terminalReady.current;
  };

  const safeWriteToTerminal = (text: string): boolean => {
    if (!terminal.current || !terminalReady.current) {
      // Terminal not ready, queue the message
      pendingMessages.current.push(text);
      return false;
    }

    try {
      terminal.current.writeln(text);
      return true;
    } catch (error) {
      console.warn('Error writing to terminal:', error);
      // Fallback: queue the message
      pendingMessages.current.push(text);
      return false;
    }
  };

  const flushPendingMessages = () => {
    if (!terminal.current || !terminalReady.current || pendingMessages.current.length === 0) {
      return;
    }

    try {
      pendingMessages.current.forEach(message => {
        // SSH data should use write(), not writeln()
        if (message.includes('\r') || message.includes('\n')) {
          terminal.current?.write(message);
        } else {
          terminal.current?.writeln(message);
        }
      });
      pendingMessages.current = [];
    } catch (error) {
      console.warn('Error flushing pending messages:', error);
    }
  };

  const addConnectionMessage = (success: boolean) => {
    if (success) {
      safeWriteToTerminal('');
      safeWriteToTerminal('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      safeWriteToTerminal('✅ SSH connection established!');
      safeWriteToTerminal('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      safeWriteToTerminal('');
    }
  };

  // Simplified SSH connection function
  const connectToSSH = () => {
    if (!sshConfig.host || !sshConfig.username || !sshConfig.password) {
      setConnectionError('Please fill in all required fields');
      return;
    }

    if (!websocket.current) {
      setConnectionError('WebSocket connection not established');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    console.log('Sending SSH connection request...');
    const connectRequest = {
      type: 'connect',
      config: sshConfig
    };

    try {
      websocket.current.send(JSON.stringify(connectRequest));
      console.log('SSH connection request sent:', connectRequest);
    } catch (error) {
      console.error('Error sending SSH connection request:', error);
      setConnectionError('Failed to send connection request');
      setIsConnecting(false);
    }
  };

  // Disconnect function
  const disconnectSSH = () => {
    if (websocket.current) {
      websocket.current.send(JSON.stringify({ type: 'disconnect' }));
    }
    closeWithTrace(1000, "user-disconnect");
    setIsConnected(false);
    isConnectedRef.current = false;
    setShowConnectionForm(true);
    currentSessionId.current = null;

    safeWriteToTerminal('');
    safeWriteToTerminal('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    safeWriteToTerminal('📡 SSH connection closed');
    safeWriteToTerminal('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    safeWriteToTerminal('SSH Terminal - Connect to remote server');
    safeWriteToTerminal('Fill in the connection form above to get started.');
  };

  // Initialize terminal
  useEffect(() => {
    console.log('Terminal initialization effect triggered', {
      hasTerminalRef: !!terminalRef.current,
      hasTerminal: !!terminal.current,
      terminalReady: terminalReady.current
    });

    if (terminalRef.current && !terminal.current) {
      const initTerminal = async () => {
        const { Terminal } = await import('xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        const { WebLinksAddon } = await import('@xterm/addon-web-links');

        fitAddon.current = new FitAddon();

        terminal.current = new Terminal({
          theme: {
            background: 'rgba(0, 0, 0, 0.95)',
            foreground: '#e5e7eb',
            cursor: '#10b981',
            cursorAccent: '#065f46',
            black: '#000000',
            red: '#ef4444',
            green: '#10b981',
            yellow: '#f59e0b',
            blue: '#3b82f6',
            magenta: '#a855f7',
            cyan: '#06b6d4',
            white: '#f3f4f6',
            brightBlack: '#6b7280',
            brightRed: '#f87171',
            brightGreen: '#34d399',
            brightYellow: '#fbbf24',
            brightBlue: '#60a5fa',
            brightMagenta: '#c084fc',
            brightCyan: '#22d3ee',
            brightWhite: '#ffffff',
          },
          fontSize: 14,
          fontFamily: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", Menlo, "Ubuntu Mono", monospace',
          cursorBlink: true,
          convertEol: true,
          allowProposedApi: true,
          scrollback: 1000,
          cols: 80,
          rows: 24,
        });

        const webLinksAddon = new WebLinksAddon();

        terminal.current.loadAddon(fitAddon.current);
        terminal.current.loadAddon(webLinksAddon);

        if (terminalRef.current) {
          terminal.current.open(terminalRef.current);

          // Wait for terminal to be fully rendered and initialized
          setTimeout(async () => {
            if (fitAddon.current && terminal.current) {
              fitAddon.current.fit();

              // Wait a bit more for renderer to initialize
              await new Promise(resolve => setTimeout(resolve, 200));

              // Check if renderer is ready
              const term = terminal.current as unknown as { _core?: { renderer?: { dimensions?: unknown } } };
              if (term._core?.renderer?.dimensions) {
                terminalReady.current = true;

                // Flush any pending messages first
                flushPendingMessages();

                // Now safe to write initial messages
                safeWriteToTerminal('SSH Terminal - Connect to remote server');
                safeWriteToTerminal('Fill in the connection form above to get started.');
                safeWriteToTerminal('');
              } else {
                // Fallback: wait a bit more and try again
                setTimeout(() => {
                  terminalReady.current = true;

                  // Flush any pending messages first
                  flushPendingMessages();

                  safeWriteToTerminal('SSH Terminal - Connect to remote server');
                  safeWriteToTerminal('Fill in the connection form above to get started.');
                  safeWriteToTerminal('');
                }, 300);
              }
            }
          }, 100);
        }

        // Handle terminal input - use onData which handles all input including IME
        terminal.current.onData((data) => {
          console.log('Terminal input data:', data, 'length:', data.length, 'charCodes:', data.split('').map(c => c.charCodeAt(0)));
          console.log('Input handler state check:', {
            isConnected: isConnectedRef.current,
            hasWebSocket: !!websocket.current,
            sessionId: currentSessionId.current,
            websocketReadyState: websocket.current?.readyState
          });

          if (isConnectedRef.current && websocket.current) {
            const message = {
              type: 'command',
              command: data
            };
            console.log('Sending command message:', message);
            try {
              websocket.current.send(JSON.stringify(message));
              console.log('Command message sent successfully');
            } catch (error) {
              console.error('Failed to send command message:', error);
            }
          } else {
            console.warn('Cannot send input - missing requirements:', {
              isConnected: isConnectedRef.current,
              hasWebSocket: !!websocket.current
            });
          }
        });

        // Ensure terminal has focus when connected
        terminal.current.focus();

        // Handle resize
        const handleResize = () => {
          if (fitAddon.current && terminal.current && terminalRef.current) {
            try {
              fitAddon.current.fit();
              if (isConnectedRef.current && websocket.current && terminal.current.cols && terminal.current.rows) {
                websocket.current.send(JSON.stringify({
                  type: 'resize',
                  cols: terminal.current.cols,
                  rows: terminal.current.rows
                }));
              }
            } catch (error) {
              console.warn('Error during terminal resize:', error);
            }
          }
        };

        window.addEventListener('resize', handleResize);
        (window as unknown as Record<string, unknown>).__sshTerminalResizeHandler = handleResize;
      };

      initTerminal();

      return () => {
        console.log('Terminal cleanup triggered - this should only happen on unmount!');
        console.trace('Terminal cleanup call stack:');

        const handler = (window as unknown as Record<string, unknown>).__sshTerminalResizeHandler;
        if (handler) {
          window.removeEventListener('resize', handler as EventListener);
          delete (window as unknown as Record<string, unknown>).__sshTerminalResizeHandler;
        }
        // DON'T close websocket here - it's managed by useStableWebSocket
        // if (websocket.current) {
        //   websocket.current.close();
        // }
        terminalReady.current = false;
        terminal.current?.dispose();
      };
    }
  }, []); // Remove isConnected dependency!

  // Focus management when connection state changes
  useEffect(() => {
    if (isConnected && terminal.current) {
      console.log('Connection established, focusing terminal');
      const focusTerminal = () => {
        if (terminal.current && terminalReady.current) {
          terminal.current.focus();
          console.log('Terminal focused');
        } else {
          setTimeout(focusTerminal, 100);
        }
      };
      focusTerminal();
    }
  }, [isConnected]);

  // Add global error handler to catch unhandled errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      console.error('Error message:', event.message);
      console.error('Error filename:', event.filename);
      console.error('Error lineno:', event.lineno);
      // Prevent the error from propagating
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the error from propagating
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">

        {/* Connection Form */}
        {showConnectionForm && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 mb-4 border border-gray-700">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-blue-400">🔐</span>
              SSH Connection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Host *
                </label>
                <input
                  type="text"
                  value={sshConfig.host}
                  onChange={(e) => setSSHConfig({ ...sshConfig, host: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value={sshConfig.port}
                  onChange={(e) => setSSHConfig({ ...sshConfig, port: parseInt(e.target.value) || 22 })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="22"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={sshConfig.username}
                  onChange={(e) => setSSHConfig({ ...sshConfig, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={sshConfig.password}
                  onChange={(e) => setSSHConfig({ ...sshConfig, password: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="password"
                />
              </div>
            </div>

            {connectionError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
                <p className="text-red-300 text-sm">{connectionError}</p>
              </div>
            )}

            <button
              onClick={connectToSSH}
              disabled={isConnecting}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Connecting...
                </>
              ) : (
                <>
                  🚀 Connect
                </>
              )}
            </button>
          </div>
        )}

        {/* Connected Status */}
        {isConnected && (
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">
                  Connected to {sshConfig.username}@{sshConfig.host}:{sshConfig.port}
                </span>
              </div>
              <button
                onClick={disconnectSSH}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Terminal */}
        <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
          <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>SSH Terminal</span>
              {isConnected && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="font-mono">{sshConfig.username}@{sshConfig.host}</span>
                </>
              )}
            </div>
          </div>
          <div className="p-4">
            <div
              ref={terminalRef}
              className="w-full outline-none"
              onClick={() => {
                console.log('Terminal container clicked, focusing...');
                if (terminal.current) {
                  terminal.current.focus();
                }
              }}
              onFocus={() => {
                console.log('Terminal container focused');
                if (terminal.current) {
                  terminal.current.focus();
                }
              }}
              tabIndex={0}
              style={{
                height: 'calc(100vh - 350px)',
                minHeight: '400px',
                maxHeight: '600px'
              }}
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            SSH Terminal • Secure remote access • Built with xterm.js & WebSocket
          </p>
        </div>
      </div>
    </div>
  );
}