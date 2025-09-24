import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Brain, 
  FileText, 
  BookOpen, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';
import LoginModal from '../components/LoginModal';

const Home: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Asistente IA Integrado",
      description: "Recibe sugerencias inteligentes para crear contenido educativo personalizado y efectivo."
    },
    {
      icon: FileText,
      title: "Plantillas Dinámicas",
      description: "Accede a plantillas editables que se adaptan automáticamente a tus necesidades curriculares."
    },
    {
      icon: BookOpen,
      title: "Material Didáctico",
      description: "Genera recursos educativos diversos con la ayuda de inteligencia artificial."
    },
    {
      icon: TrendingUp,
      title: "Análisis de Rendimiento",
      description: "Obtén insights sobre la efectividad de tus materiales y metodologías."
    }
  ];

  const testimonials = [
    {
      name: "Prof. Ana Martínez",
      role: "Docente de Ciencias",
      institution: "Colegio Nacional",
      rating: 5,
      comment: "EduAssist me ha permitido crear material más engaging para mis estudiantes. La IA realmente entiende las necesidades educativas."
    },
    {
      name: "Dr. Carlos Ruiz",
      role: "Coordinador Académico",
      institution: "Universidad Técnica",
      rating: 5,
      comment: "Las plantillas inteligentes han reducido mi tiempo de planificación en un 60%. Excelente herramienta."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">EduAssist</h1>
                <p className="text-xs text-slate-500">Plataforma Docente IA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Transforma tu
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> enseñanza </span>
                con Inteligencia Artificial
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Descubre cómo la IA puede potenciar tu labor docente. Crea materiales didácticos personalizados, 
                planifica clases más efectivas y transforma la experiencia educativa de tus estudiantes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Comenzar Ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Ver Demo</span>
                </button>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <Brain className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Asistente IA</h3>
                      <p className="text-sm text-slate-500">En línea</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-700">
                        "Necesito crear una evaluación para geometría básica"
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        He generado 5 ejercicios progresivos de geometría, incluyendo figuras interactivas 
                        y rúbrica de evaluación. ¿Te gustaría revisarlos?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Herramientas que Revolucionan la Educación
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nuestra plataforma integra inteligencia artificial de forma intuitiva, 
              diseñada específicamente para potenciar tu labor docente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Information Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                ¿Qué es la Inteligencia Artificial en Educación?
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                La IA educativa es una tecnología que analiza patrones de aprendizaje y 
                genera contenido personalizado. No reemplaza al docente, sino que 
                potencia su creatividad y eficiencia.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Personalización Automática</h4>
                    <p className="text-slate-600">Adapta el contenido según el nivel y necesidades de tus estudiantes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Generación de Contenido</h4>
                    <p className="text-slate-600">Crea ejercicios, evaluaciones y material didáctico en segundos.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Análisis Pedagógico</h4>
                    <p className="text-slate-600">Recibe sugerencias basadas en mejores prácticas educativas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  ¿Cómo Funciona?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Describe tu Necesidad</h4>
                      <p className="text-slate-600">Explica qué tipo de material o planificación necesitas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">IA Genera Propuestas</h4>
                      <p className="text-slate-600">El sistema crea múltiples opciones adaptadas a tu contexto.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Personaliza y Usa</h4>
                      <p className="text-slate-600">Edita el contenido según tu estilo y aplícalo en clase.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Lo que Dicen Nuestros Docentes
            </h2>
            <p className="text-xl text-slate-600">
              Educadores de toda América Latina confían en EduAssist
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                    <p className="text-xs text-slate-400">{testimonial.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Únete a la Revolución Educativa
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Más de 10,000 docentes ya están transformando su enseñanza con IA. 
            ¿Estás listo para el siguiente paso?
          </p>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Comenzar Gratis Hoy
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">EduAssist</h3>
                <p className="text-sm text-slate-400">Plataforma Docente IA</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              © 2024 EduAssist. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default Home;