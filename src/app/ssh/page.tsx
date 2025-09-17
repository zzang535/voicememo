'use client';

import { useEffect, useRef, useState } from 'react';
import type { Terminal } from 'xterm';
import type { FitAddon } from '@xterm/addon-fit';
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
  const websocket = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showConnectionForm, setShowConnectionForm] = useState(true);

  const [sshConfig, setSSHConfig] = useState<SSHConfig>({
    host: '',
    port: 22,
    username: '',
    password: '',
  });

  // Initialize terminal
  useEffect(() => {
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
        });

        const webLinksAddon = new WebLinksAddon();

        terminal.current.loadAddon(fitAddon.current);
        terminal.current.loadAddon(webLinksAddon);

        if (terminalRef.current) {
          terminal.current.open(terminalRef.current);
        }

        terminal.current.writeln('SSH Terminal - Connect to remote server');
        terminal.current.writeln('Fill in the connection form above to get started.');
        terminal.current.writeln('');

        fitAddon.current.fit();

        // Handle terminal input
        terminal.current.onKey(({ key, domEvent }) => {
          if (isConnected && websocket.current) {
            // Send input to SSH server via WebSocket
            websocket.current.send(JSON.stringify({
              type: 'command',
              command: key
            }));
          }
        });

        // Handle resize
        const handleResize = () => {
          fitAddon.current?.fit();
          if (isConnected && websocket.current && terminal.current) {
            websocket.current.send(JSON.stringify({
              type: 'resize',
              cols: terminal.current.cols,
              rows: terminal.current.rows
            }));
          }
        };

        window.addEventListener('resize', handleResize);
        (window as any).__sshTerminalResizeHandler = handleResize;
      };

      initTerminal();

      return () => {
        const handler = (window as any).__sshTerminalResizeHandler;
        if (handler) {
          window.removeEventListener('resize', handler);
          delete (window as any).__sshTerminalResizeHandler;
        }
        if (websocket.current) {
          websocket.current.close();
        }
        terminal.current?.dispose();
      };
    }
  }, [isConnected]);

  // Connect to SSH server
  const connectToSSH = async () => {
    if (!sshConfig.host || !sshConfig.username || !sshConfig.password) {
      setConnectionError('Please fill in all required fields');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Connect to WebSocket server
      const ws = new WebSocket('wss://voicememo-ws.bird89.com');
      websocket.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        // Send SSH connection request
        ws.send(JSON.stringify({
          type: 'connect',
          config: sshConfig
        }));
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          switch (response.type) {
            case 'connected':
              setIsConnected(true);
              setIsConnecting(false);
              setShowConnectionForm(false);
              terminal.current?.clear();
              terminal.current?.writeln('✅ SSH connection established!');
              terminal.current?.writeln('');
              break;

            case 'data':
              if (terminal.current && response.data) {
                terminal.current.write(response.data);
              }
              break;

            case 'error':
              setConnectionError(response.error || 'Connection failed');
              setIsConnecting(false);
              setIsConnected(false);
              terminal.current?.writeln(`❌ Error: ${response.error}`);
              break;

            case 'disconnected':
              setIsConnected(false);
              setShowConnectionForm(true);
              terminal.current?.writeln('');
              terminal.current?.writeln('📡 SSH connection closed');
              break;
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Failed to connect to SSH service');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setShowConnectionForm(true);
        websocket.current = null;
      };

    } catch (error) {
      setConnectionError('Failed to establish connection');
      setIsConnecting(false);
    }
  };

  // Disconnect from SSH
  const disconnectSSH = () => {
    if (websocket.current) {
      websocket.current.send(JSON.stringify({ type: 'disconnect' }));
      websocket.current.close();
    }
    setIsConnected(false);
    setShowConnectionForm(true);
    terminal.current?.clear();
    terminal.current?.writeln('SSH Terminal - Connect to remote server');
    terminal.current?.writeln('Fill in the connection form above to get started.');
  };

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
              className="w-full"
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