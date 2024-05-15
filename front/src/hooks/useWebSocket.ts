import { useEffect, useState } from "react";

function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Create WebSocket connection.
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setIsOpen(true);
    };

    newSocket.onmessage = (event) => {
      console.log('new mess', event);
      const parsed = JSON.parse(event.data);
      console.log('parsed', parsed);
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
