import React from 'react';
import { Send, Plus } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import MarkdownMessage from '../components/MarkdownMessage';

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

const Chatbot: React.FC = () => {
  const { messages, input, setInput, sendMessage, loading, chatEndRef, nuevaSesion } = useChat([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
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
        <div className="p-5 border-b border-slate-200 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
              <img 
                src="/imagenes/Logo_sin_nombre.jpg" 
                alt="DANIA" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-slate-900">Asistente Educativo IA</div>
              <div className="text-xs text-slate-500">
                {loading ? (
                  <span className="text-blue-600">Pensando…</span>
                ) : (
                  <span className="text-green-600">En línea</span>
                )}
                <span> • Listo para ayudarte con documentos educativos</span>
              </div>
            </div>
          </div>
          <button
            onClick={nuevaSesion}
            className="px-3 py-2 rounded-lg text-blue-600 font-medium flex items-center gap-2 hover:bg-blue-50"
            title="Nueva conversación"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Nueva</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10">
              <p className="text-lg font-medium mb-2">¡Hola! Soy tu asistente educativo con IA</p>
              <p className="text-sm">Puedo ayudarte con información de los documentos educativos disponibles.</p>
              <p className="text-xs mt-4 text-slate-500">Ejemplo: "¿Qué dice el capítulo 2 sobre metodologías?"</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={
                  m.role === 'user'
                    ? 'max-w-[78%] bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm'
                    : 'max-w-[78%] bg-white text-slate-800 rounded-2xl px-4 py-3 shadow-sm border border-slate-200'
                }
              >
                <MarkdownMessage content={m.text} isUser={m.role === 'user'} />
                <div className={`text-[11px] mt-1 ${m.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{nowTime()}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
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
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              className="px-4 py-3 rounded-lg text-white font-medium flex items-center gap-2 shadow-sm"
              style={{
                background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                boxShadow: '0 4px 10px -2px rgba(37,99,235,.4)'
              }}
              onMouseDown={(e) => (e.currentTarget.style.filter = 'brightness(0.95)')}
              onMouseUp={(e) => (e.currentTarget.style.filter = '')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = '')}
              aria-label="Enviar"
              disabled={loading || !input.trim()}
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </div>
          <div className="text-xs text-slate-500 mt-2">💡 La IA busca en los documentos educativos para darte respuestas precisas</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
