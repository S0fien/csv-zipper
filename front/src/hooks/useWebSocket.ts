import { useEffect, useState } from 'react';
import { ApiResponseType } from '../types/ApiResponseType';

function useWebSocket(url: string) {
  const [, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ApiResponseType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Create WebSocket connection.
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setIsOpen(true);
    };

    newSocket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, parsed]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsOpen(false);
    };
    //
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsOpen(false);
    };

    // Update socket state
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [url]);

  return { messages, isOpen };
}

export default useWebSocket;
