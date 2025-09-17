'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (terminalRef.current && !terminal.current) {
      // Create terminal instance
      terminal.current = new Terminal({
        theme: {
          background: 'rgba(0, 0, 0, 0.95)',
          foreground: '#e5e7eb',
          cursor: '#10b981',
          cursorAccent: '#065f46',
          selection: 'rgba(59, 130, 246, 0.3)',
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

      // Create addons
      fitAddon.current = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      // Load addons
      terminal.current.loadAddon(fitAddon.current);
      terminal.current.loadAddon(webLinksAddon);

      // Open terminal
      terminal.current.open(terminalRef.current);

      // Welcome message
      terminal.current.writeln('Welcome to Voice Memo Terminal!');
      terminal.current.writeln('');
      terminal.current.writeln('Available commands:');
      terminal.current.writeln('  help     - Show this help message');
      terminal.current.writeln('  clear    - Clear the terminal');
      terminal.current.writeln('  ls       - List directory contents');
      terminal.current.writeln('  pwd      - Show current directory');
      terminal.current.writeln('  cd       - Change directory');
      terminal.current.writeln('  cat      - Display file contents');
      terminal.current.writeln('  mkdir    - Create directory');
      terminal.current.writeln('  touch    - Create file');
      terminal.current.writeln('  rm       - Remove files/directories');
      terminal.current.writeln('  echo     - Echo text back');
      terminal.current.writeln('  claude   - Send text to Claude Code (simulated)');
      terminal.current.writeln('');
      terminal.current.write(`${currentPath}$ `);

      // Fit terminal to container
      fitAddon.current.fit();

      // Command handling
      let currentLine = '';
      let commandHistory: string[] = [];
      let historyIndex = -1;

      const executeCommand = async (command: string) => {
        const args = command.trim().split(' ');
        const cmd = args[0].toLowerCase();

        terminal.current?.writeln('');

        if (isExecuting) {
          terminal.current?.writeln('Another command is already executing...');
          terminal.current?.write(`${currentPath}$ `);
          return;
        }

        switch (cmd) {
          case '':
            break;
          case 'help':
            terminal.current?.writeln('Available commands:');
            terminal.current?.writeln('  help     - Show this help message');
            terminal.current?.writeln('  clear    - Clear the terminal');
            terminal.current?.writeln('  ls       - List directory contents');
            terminal.current?.writeln('  pwd      - Show current directory');
            terminal.current?.writeln('  cd       - Change directory');
            terminal.current?.writeln('  cat      - Display file contents');
            terminal.current?.writeln('  mkdir    - Create directory');
            terminal.current?.writeln('  touch    - Create file');
            terminal.current?.writeln('  rm       - Remove files/directories');
            terminal.current?.writeln('  echo     - Echo text back');
            terminal.current?.writeln('  claude   - Send text to Claude Code (simulated)');
            terminal.current?.writeln('  history  - Show command history');
            break;
          case 'clear':
            terminal.current?.clear();
            break;
          case 'echo':
            const echoText = args.slice(1).join(' ');
            terminal.current?.writeln(echoText || '');
            break;
          case 'claude':
            const claudeText = args.slice(1).join(' ');
            if (claudeText) {
              terminal.current?.writeln(`Sending to Claude Code: "${claudeText}"`);
              terminal.current?.writeln('(This is a simulation - integrate with actual Claude Code API)');
            } else {
              terminal.current?.writeln('Usage: claude <text>');
            }
            break;
          case 'history':
            commandHistory.forEach((cmd, index) => {
              terminal.current?.writeln(`  ${index + 1}: ${cmd}`);
            });
            break;
          case 'cd':
            const newPath = args[1] || '/home/user';
            if (newPath.startsWith('/')) {
              setCurrentPath(newPath);
            } else if (newPath === '..') {
              const pathParts = currentPath.split('/').filter(p => p);
              pathParts.pop();
              setCurrentPath('/' + pathParts.join('/') || '/');
            } else {
              const newFullPath = currentPath === '/' ? `/${newPath}` : `${currentPath}/${newPath}`;
              setCurrentPath(newFullPath);
            }
            break;
          case 'pwd':
            terminal.current?.writeln(currentPath);
            break;
          case 'ls':
          case 'cat':
          case 'mkdir':
          case 'touch':
          case 'rm':
            setIsExecuting(true);
            try {
              const fullCommand = args.join(' ');
              const response = await fetch('/api/terminal', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: `cd "${currentPath}" && ${fullCommand}` }),
              });

              const result = await response.json();

              if (result.stdout) {
                result.stdout.split('\n').forEach((line: string) => {
                  if (line.trim()) {
                    terminal.current?.writeln(line);
                  }
                });
              }

              if (result.stderr) {
                result.stderr.split('\n').forEach((line: string) => {
                  if (line.trim()) {
                    terminal.current?.writeln(`\x1b[31m${line}\x1b[0m`);
                  }
                });
              }

              if (result.error) {
                terminal.current?.writeln(`\x1b[31mError: ${result.error}\x1b[0m`);
              }
            } catch (error) {
              terminal.current?.writeln(`\x1b[31mFailed to execute command: ${error}\x1b[0m`);
            } finally {
              setIsExecuting(false);
            }
            break;
          default:
            setIsExecuting(true);
            try {
              const response = await fetch('/api/terminal', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: `cd "${currentPath}" && ${command}` }),
              });

              const result = await response.json();

              if (result.stdout) {
                result.stdout.split('\n').forEach((line: string) => {
                  if (line.trim()) {
                    terminal.current?.writeln(line);
                  }
                });
              }

              if (result.stderr) {
                result.stderr.split('\n').forEach((line: string) => {
                  if (line.trim()) {
                    terminal.current?.writeln(`\x1b[31m${line}\x1b[0m`);
                  }
                });
              }

              if (result.error) {
                terminal.current?.writeln(`\x1b[31mError: ${result.error}\x1b[0m`);
              }
            } catch (error) {
              terminal.current?.writeln(`\x1b[31mFailed to execute command: ${error}\x1b[0m`);
            } finally {
              setIsExecuting(false);
            }
        }

        terminal.current?.write(`${currentPath}$ `);
      };

      // Handle keyboard input
      terminal.current.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) { // Enter
          if (currentLine.trim()) {
            commandHistory.push(currentLine);
            historyIndex = commandHistory.length;
          }
          executeCommand(currentLine);
          currentLine = '';
        } else if (domEvent.keyCode === 8) { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            terminal.current?.write('\b \b');
          }
        } else if (domEvent.keyCode === 38) { // Up arrow
          if (historyIndex > 0) {
            historyIndex--;
            // Clear current line
            for (let i = 0; i < currentLine.length; i++) {
              terminal.current?.write('\b \b');
            }
            currentLine = commandHistory[historyIndex] || '';
            terminal.current?.write(currentLine);
          }
        } else if (domEvent.keyCode === 40) { // Down arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            // Clear current line
            for (let i = 0; i < currentLine.length; i++) {
              terminal.current?.write('\b \b');
            }
            currentLine = commandHistory[historyIndex] || '';
            terminal.current?.write(currentLine);
          } else if (historyIndex === commandHistory.length - 1) {
            historyIndex++;
            // Clear current line
            for (let i = 0; i < currentLine.length; i++) {
              terminal.current?.write('\b \b');
            }
            currentLine = '';
          }
        } else if (domEvent.keyCode === 67 && domEvent.ctrlKey) { // Ctrl+C
          terminal.current?.writeln('^C');
          currentLine = '';
          terminal.current?.write(`${currentPath}$ `)
        } else if (printable) {
          currentLine += key;
          terminal.current?.write(key);
        }
      });

      // Handle resize
      const handleResize = () => {
        fitAddon.current?.fit();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        terminal.current?.dispose();
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white text-xl font-bold flex items-center gap-2">
              <span className="text-green-400">$</span>
              Web Terminal
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              {isExecuting && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                  Executing...
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            Current directory: <span className="text-blue-400 font-mono">{currentPath}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Type "help" for available commands. Use Ctrl+C to cancel current input.
          </p>
        </div>

        <div className="bg-black/95 backdrop-blur-sm rounded-lg border border-gray-700 shadow-2xl overflow-hidden">
          <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Terminal</span>
              <span className="text-gray-600">•</span>
              <span className="font-mono">{currentPath}</span>
            </div>
          </div>
          <div className="p-4">
            <div
              ref={terminalRef}
              className="w-full"
              style={{
                height: 'calc(100vh - 250px)',
                minHeight: '400px',
                maxHeight: '600px'
              }}
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            Voice Memo Terminal • Built with xterm.js • Supports real command execution
          </p>
        </div>
      </div>
    </div>
  );
}