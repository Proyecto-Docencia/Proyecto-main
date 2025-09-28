import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

type ChatMessage = {
  id: string;
  type: 'user' | 'ai';
  message: string;
  time: string;
};

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      type: 'ai',
      message:
        'Te sugiero usar analogías culinarias: dividir una pizza, repartir dulces, etc. También puedes crear un juego donde los estudiantes representen fracciones con objetos físicos. ¿Te gustaría que genere algunos ejercicios específicos?',
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'online' | 'thinking'>('online');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      message: text,
      time: nowTime(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setStatus('thinking');

    // Simulación de respuesta (placeholder). Aquí luego conectamos al backend.
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        message:
          'Buena pregunta. Puedo proponerte una mini-secuencia didáctica con objetivo, actividades y evaluación. ¿Quieres enfoque lúdico o más guiado?',
        time: nowTime(),
      };
      setMessages((m) => [...m, aiMsg]);
      setStatus('online');
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ position:'relative', minHeight:'calc(100vh - 80px)' }}>
      <div style={{
        position:'absolute',
        inset:0,
        background:"url('/docs/FondoPortalUSS.jpg') center/cover no-repeat fixed",
        opacity:1,
        zIndex:0
      }} />
      <div style={{
        position:'absolute',
        inset:0,
        background:'rgba(255,255,255,0.25)',
        backdropFilter:'blur(0.5px)',
        zIndex:1
      }} />
    <div className="min-h-[calc(100vh-0px)] p-6" style={{ position:'relative', zIndex:2 }}>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold">
            AI
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-slate-900">Asistente Educativo IA</div>
            <div className="text-xs text-slate-500">
              {status === 'online' ? (
                <span className="text-green-600">En línea</span>
              ) : (
                <span className="text-blue-600">Pensando…</span>
              )}
              <span> • Listo para ayudarte</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((m) => (
            <div key={m.id} className={`w-full flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={
                  m.type === 'user'
                    ? 'max-w-[78%] bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm'
                    : 'max-w-[78%] bg-white text-slate-800 rounded-2xl px-4 py-3 shadow-sm border border-slate-200'
                }
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.message}</div>
                <div className={`text-[11px] mt-1 ${m.type === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-3 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta sobre metodologías, contenido, evaluaciones…"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            />
            <button
              onClick={send}
              className="px-4 py-3 rounded-lg text-white font-medium flex items-center gap-2 shadow-sm"
              style={{
                background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                boxShadow: '0 4px 10px -2px rgba(37,99,235,.4)'
              }}
              onMouseDown={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
              onMouseUp={(e) => (e.currentTarget.style.filter = '')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = '')}
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
          <div className="text-xs text-slate-500 mt-2">Sugerencia: "¿Cómo puedo hacer más atractiva una clase sobre fracciones?"</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
