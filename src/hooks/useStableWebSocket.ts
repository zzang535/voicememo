import { useEffect, useRef } from "react";

interface WebSocketHandlers {
  onOpen?: (ws: WebSocket) => void;
  onMessage?: (event: MessageEvent) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export function useStableWebSocket(url: string, handlers: WebSocketHandlers) {
  const wsRef = useRef<WebSocket | null>(null);
  const startedRef = useRef(false); // StrictMode double mount guard
  const handlersRef = useRef(handlers);

  // Update handlers ref when they change
  handlersRef.current = handlers;

  useEffect(() => {
    console.log('useStableWebSocket effect - started:', startedRef.current);

    // Prevent double mounting in React StrictMode/dev mode
    if (startedRef.current) {
      console.log('useStableWebSocket: Already started, skipping');
      return;
    }

    startedRef.current = true;
    console.log('useStableWebSocket: Starting WebSocket connection to', url);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    // Close tracing function
    const closeWithTrace = (code = 1000, reason = "manual-close") => {
      console.warn('CLOSE_CALL_STACK for WebSocket:');
      console.trace();
      try {
        ws.close(code, reason);
      } catch (error) {
        console.error('Error closing WebSocket:', error);
      }
    };

    ws.addEventListener("open", (event) => {
      console.log('WebSocket opened successfully');
      handlersRef.current.onOpen?.(ws);
    });

    ws.addEventListener("message", (event) => {
      handlersRef.current.onMessage?.(event);
    });

    ws.addEventListener("close", (event) => {
      console.warn("WS client close:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString(),
      });

      // Detailed close code information
      const closeReasons: { [key: number]: string } = {
        1000: 'Normal closure',
        1001: 'Going away',
        1002: 'Protocol error',
        1003: 'Unsupported data',
        1005: 'No status received',
        1006: 'Abnormal closure',
        1007: 'Invalid frame payload data',
        1008: 'Policy violation',
        1009: 'Message too big',
        1010: 'Mandatory extension',
        1011: 'Internal server error',
        1015: 'TLS handshake'
      };

      console.warn('Close code meaning:', closeReasons[event.code] || 'Unknown');
      handlersRef.current.onClose?.(event);
    });

    ws.addEventListener("error", (event) => {
      console.error('WebSocket error:', event);
      handlersRef.current.onError?.(event);
    });

    return () => {
      console.log('useStableWebSocket cleanup - closing connection');
      console.trace('Cleanup call stack:');

      // Cleanup with explicit code/reason for debugging
      try {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close(1000, "component-unmount");
        }
      } catch (error) {
        console.error('Error during cleanup close:', error);
      }

      wsRef.current = null;
      // Don't reset startedRef.current here to prevent re-connection in strict mode
    };
  }, [url]); // Only depend on URL, not handlers or other state

  // Method to manually close with tracing
  const closeWithTrace = (code = 1000, reason = "manual-close") => {
    console.warn('Manual WebSocket close requested:');
    console.trace('Manual close call stack:');

    if (wsRef.current) {
      try {
        wsRef.current.close(code, reason);
      } catch (error) {
        console.error('Error manually closing WebSocket:', error);
      }
    }
  };

  return {
    websocket: wsRef,
    closeWithTrace
  };
}