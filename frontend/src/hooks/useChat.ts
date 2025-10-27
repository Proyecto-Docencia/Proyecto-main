import { useState, useRef, useEffect } from 'react';
import { crearChat, obtenerSesion, crearSesion } from '../utils/api';

export type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
  id?: number;
  fecha?: string;
};

export const useChat = (initialMessages: ChatMessage[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sesionId, setSesionId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Cargar sesión activa del localStorage
  useEffect(() => {
    const cargarSesion = async () => {
      const sesionGuardada = localStorage.getItem('chat_sesion_activa');
      if (sesionGuardada) {
        try {
          const id = Number.parseInt(sesionGuardada, 10);
          const sesion = await obtenerSesion(id);
          setSesionId(id);
          
          // Convertir mensajes del backend al formato del chat
          const mensajesFormateados: ChatMessage[] = [];
          for (const msg of sesion.mensajes) {
            mensajesFormateados.push(
              { role: 'user', text: msg.mensaje_usuario, id: msg.id, fecha: msg.fecha },
              { role: 'ai', text: msg.respuesta_ia, id: msg.id, fecha: msg.fecha }
            );
          }
          setMessages(mensajesFormateados);
        } catch (error) {
          console.error('Error al cargar sesión:', error);
          // Si falla, limpiar localStorage
          localStorage.removeItem('chat_sesion_activa');
        }
      }
    };
    
    cargarSesion();
  }, []);

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
      // Crear sesión si no existe
      let currentSesionId = sesionId;
      if (!currentSesionId) {
        const nuevaSesion = await crearSesion(userMessage.substring(0, 50));
        currentSesionId = nuevaSesion.id;
        setSesionId(currentSesionId);
        if (currentSesionId) {
          localStorage.setItem('chat_sesion_activa', currentSesionId.toString());
        }
      }

      // Enviar mensaje con sesion_id
      const resp = await crearChat(userMessage, currentSesionId);
      const aiResponse = resp?.respuesta_ia || 'La IA no devolvió una respuesta válida.';
      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse, id: resp.id, fecha: resp.fecha }]);
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

  const nuevaSesion = () => {
    setMessages([]);
    setSesionId(null);
    localStorage.removeItem('chat_sesion_activa');
  };

  return {
    messages,
    input,
    loading,
    sesionId,
    setInput,
    sendMessage,
    nuevaSesion,
    chatEndRef,
  };
};
