import { NextRequest } from 'next/server';
import { spawn } from 'child_process';

const DANGEROUS_COMMANDS = [
  'rm -rf /',
  'sudo rm',
  'rm -r /',
  'mkfs',
  'dd if=',
  ':(){ :|:& };:',
  'chmod -R 777 /',
  'chown -R',
];

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return Response.json({ error: 'Invalid command' }, { status: 400 });
    }

    const cleanCommand = command.trim();

    if (DANGEROUS_COMMANDS.some(dangerous => cleanCommand.includes(dangerous))) {
      return Response.json({
        error: 'Command blocked for security reasons',
        exitCode: 1,
      }, { status: 403 });
    }

    if (cleanCommand.length > 1000) {
      return Response.json({
        error: 'Command too long',
        exitCode: 1,
      }, { status: 400 });
    }

    return new Promise((resolve) => {
      const child = spawn('sh', ['-c', cleanCommand], {
        stdio: 'pipe',
        env: {
          ...process.env,
          PATH: process.env.PATH,
          HOME: '/tmp',
          USER: 'webapp',
        },
        cwd: '/tmp',
        timeout: 30000,
      });

      let stdout = '';
      let stderr = '';
      let isResolved = false;

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
        if (stdout.length > 10000) {
          child.kill();
          if (!isResolved) {
            isResolved = true;
            resolve(Response.json({
              error: 'Output too large',
              stdout: stdout.substring(0, 10000) + '\n... (output truncated)',
              exitCode: 1,
            }));
          }
        }
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
        if (stderr.length > 5000) {
          stderr = stderr.substring(0, 5000) + '\n... (error output truncated)';
        }
      });

      child.on('close', (code) => {
        if (!isResolved) {
          isResolved = true;
          resolve(Response.json({
            stdout: stdout || '',
            stderr: stderr || '',
            exitCode: code || 0,
          }));
        }
      });

      child.on('error', (error) => {
        if (!isResolved) {
          isResolved = true;
          resolve(Response.json({
            error: `Execution error: ${error.message}`,
            exitCode: 1,
          }, { status: 500 }));
        }
      });

      setTimeout(() => {
        if (!isResolved) {
          child.kill('SIGKILL');
          isResolved = true;
          resolve(Response.json({
            error: 'Command timed out after 30 seconds',
            exitCode: 124,
          }, { status: 408 }));
        }
      }, 30000);
    });
  } catch (error) {
    return Response.json({
      error: 'Failed to parse request or execute command',
      exitCode: 1,
    }, { status: 500 });
  }
}