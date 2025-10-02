import { useState, useRef, useEffect } from 'react';
import { crearChat } from '../utils/api';

export type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
};

export const useChat = (initialMessages: ChatMessage[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const resp = await crearChat(userMessage);
      const aiResponse = resp?.respuesta_ia || 'La IA no devolvió una respuesta válida.';
      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Error al contactar la IA:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Disculpa, hubo un error al procesar tu consulta. Por favor intenta de nuevo.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    loading,
    setInput,
    sendMessage,
    chatEndRef,
  };
};
