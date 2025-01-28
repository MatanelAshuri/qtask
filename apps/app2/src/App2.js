import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Shield, ShieldAlert } from 'lucide-react';

const WebSocketTest = () => {
  const [status, setStatus] = useState('Connecting...');
  const [isSecure, setIsSecure] = useState(false);
  const [details, setDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/app2/ws`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setStatus('Connected');
        setIsSecure(ws.url.startsWith('wss://'));
        setDetails({
          protocol: ws.protocol,
          url: ws.url,
          state: ws.readyState,
          timestamp: new Date().toISOString()
        });
        setError(null);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('Error');
        setError('Connection failed. Please check console for details.');
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event);
        setStatus('Disconnected');
        setError(`Connection closed: ${event.reason || 'Unknown reason'}`);
        setTimeout(connectWebSocket, 5000);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    };

    connectWebSocket();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Alert variant={isSecure ? "default" : "destructive"}>
        <AlertTitle className="flex items-center gap-2">
          {isSecure ? <Shield className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          Connection Status: {status}
        </AlertTitle>
        <div className="mt-2">
          <p>Secure WebSocket: {isSecure ? 'Yes' : 'No'}</p>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
          {details.url && (
            <div className="mt-2 text-sm space-y-1">
              <p>URL: {details.url}</p>
              <p>Protocol: {details.protocol || 'none'}</p>
              <p>State: {details.state}</p>
              <p>Connected at: {details.timestamp}</p>
            </div>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default WebSocketTest;