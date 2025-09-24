import React, { useState } from 'react';
import { 
  Brain, 
  MessageCircle, 
  Book, 
  Lightbulb, 
  HelpCircle,
  Send,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const AICenter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', name: 'Asistente IA', icon: MessageCircle },
    { id: 'learn', name: 'Aprender sobre IA', icon: Book },
    { id: 'tips', name: 'Consejos y Trucos', icon: Lightbulb },
    { id: 'faq', name: 'Preguntas Frecuentes', icon: HelpCircle }
  ];

  const aiFeatures = [
    {
      title: "Análisis Pedagógico",
      description: "La IA analiza metodologías educativas respaldadas por investigación",
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "Personalización Automática",
      description: "Adapta contenido según las necesidades específicas de tus estudiantes",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Optimización Continua",
      description: "Aprende de tus preferencias para mejorar las sugerencias",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  const chatHistory = [
    {
      type: 'user',
      message: '¿Cómo puedo hacer más atractiva una clase sobre fracciones?',
      time: '14:30'
    },
    {
      type: 'ai',
      message: 'Te sugiero usar analogías culinarias: dividir una pizza, repartir dulces, etc. También puedes crear un juego donde los estudiantes representen fracciones con objetos físicos. ¿Te gustaría que genere algunos ejercicios específicos?',
      time: '14:31'
    },
    {
      type: 'user',
      message: 'Sí, me gustaría ver algunos ejercicios prácticos',
      time: '14:32'
    },
    {
      type: 'ai',
      message: 'Perfecto. He creado 5 ejercicios prácticos con fracciones usando situaciones cotidianas: repartir pizza, compartir chocolate, dividir tiempo de recreo, etc. Cada ejercicio incluye material visual y diferentes niveles de dificultad.',
      time: '14:33'
    }
  ];

  const faqs = [
    {
      question: "¿La IA reemplazará a los docentes?",
      answer: "No, la IA es una herramienta de apoyo. Su objetivo es potenciar la creatividad y eficiencia del docente, no reemplazarlo. El conocimiento pedagógico y la conexión humana siguen siendo fundamentales."
    },
    {
      question: "¿Qué tan confiable es el contenido generado por IA?",
      answer: "Nuestro sistema está entrenado con contenido educativo validado y mejores prácticas pedagógicas. Sin embargo, siempre recomendamos revisar y personalizar el contenido según tu contexto específico."
    },
    {
      question: "¿Puedo usar la IA para todas las materias?",
      answer: "Sí, nuestro sistema está diseñado para adaptarse a diferentes áreas del conocimiento: matemáticas, ciencias, humanidades, idiomas y más."
    },
    {
      question: "¿Los estudiantes sabrán que uso IA?",
      answer: "Eso depende de ti. Puedes usar la IA como herramienta de preparación sin mencionarlo, o incluso enseñar a tus estudiantes sobre el uso responsable de la tecnología en educación."
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aquí se enviaría el mensaje al asistente IA
      setMessage('');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="space-y-6">
            {/* Chat Interface */}
            <div className="bg-white rounded-xl border border-slate-200 h-96 flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Asistente Educativo IA</h3>
                  <p className="text-sm text-slate-500">En línea • Listo para ayudarte</p>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.type === 'user' ? 'text-blue-200' : 'text-slate-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-slate-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregunta sobre metodologías, contenido, evaluaciones..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'learn':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                ¿Qué es la Inteligencia Artificial Educativa?
              </h2>
              <p className="text-slate-700 mb-6 leading-relaxed">
                La IA educativa es un conjunto de tecnologías que pueden analizar datos de aprendizaje, 
                identificar patrones y generar contenido personalizado para mejorar la experiencia educativa.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-lg border border-slate-200">
                      <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Cómo la IA Potencia tu Enseñanza</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Generación de Contenido</h4>
                    <p className="text-slate-600 leading-relaxed">
                      La IA puede crear ejercicios, evaluaciones, presentaciones y material didáctico 
                      basado en objetivos específicos y el nivel de tus estudiantes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Personalización Inteligente</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Adapta automáticamente el contenido según diferentes estilos de aprendizaje, 
                      niveles de dificultad y objetivos curriculares específicos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Sugerencias Pedagógicas</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Recibe recomendaciones sobre metodologías, estrategias de enseñanza y 
                      técnicas de evaluación basadas en investigación educativa actual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-slate-900">Consejos para Usar IA Efectivamente</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-slate-900 mb-2">1. Sé Específico en tus Solicitudes</h4>
                  <p className="text-slate-700 text-sm">
                    En lugar de "crear una evaluación", especifica: "crear una evaluación de álgebra 
                    para 3° secundaria, 15 preguntas, nivel intermedio, duración 60 minutos".
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-slate-900 mb-2">2. Proporciona Contexto</h4>
                  <p className="text-slate-700 text-sm">
                    Menciona el nivel de tus estudiantes, objetivos específicos y cualquier 
                    adaptación necesaria para obtener mejores resultados.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-slate-900 mb-2">3. Revisa y Personaliza</h4>
                  <p className="text-slate-700 text-sm">
                    Siempre revisa el contenido generado y adáptalo a tu estilo de enseñanza 
                    y las necesidades específicas de tu grupo.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-slate-900 mb-2">4. Experimenta y Aprende</h4>
                  <p className="text-slate-700 text-sm">
                    Prueba diferentes tipos de solicitudes y observa cómo la IA responde. 
                    Cada interacción mejora la calidad de futuras sugerencias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-slate-600 leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Centro de Inteligencia Artificial</h1>
          <p className="text-slate-600 mt-2">
            Aprende, consulta y potencia tu enseñanza con IA educativa
          </p>
        </div>
      </div>

      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold">Tu Asistente Educativo Inteligente</h2>
        </div>
        <p className="text-purple-100 text-lg mb-6 leading-relaxed">
          La IA educativa no es magia, es tecnología avanzada que entiende pedagogía. 
          Está aquí para amplificar tu experiencia y creatividad como docente.
        </p>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm">Disponible 24/7</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="text-sm">Respuestas en segundos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-300" />
            <span className="text-sm">Pedagógicamente validado</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Quick Start Guide */}
      {activeTab === 'chat' && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Ejemplos de Consultas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Planificación de Clases</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">"¿Cómo estructurar una clase sobre derivadas?"</p>
                <p className="text-slate-600">"Necesito actividades para enseñar el ciclo del agua"</p>
                <p className="text-slate-600">"Sugiere metodologías para literatura medieval"</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Evaluación y Material</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">"Crea una rúbrica para proyecto de historia"</p>
                <p className="text-slate-600">"Genera ejercicios de trigonometría básica"</p>
                <p className="text-slate-600">"¿Cómo evaluar comprensión lectora?"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICenter;