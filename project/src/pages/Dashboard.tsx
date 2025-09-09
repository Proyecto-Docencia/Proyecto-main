import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Brain, 
  TrendingUp, 
  Clock, 
  Users,
  Award,
  Plus,
  ArrowRight,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Plantillas Creadas",
      value: "24",
      icon: FileText,
      color: "bg-blue-500",
      trend: "+12%"
    },
    {
      label: "Materiales Generados",
      value: "156",
      icon: BookOpen,
      color: "bg-green-500",
      trend: "+8%"
    },
    {
      label: "Horas Ahorradas",
      value: "32",
      icon: Clock,
      color: "bg-purple-500",
      trend: "+15%"
    },
    {
      label: "Estudiantes Impactados",
      value: "180",
      icon: Users,
      color: "bg-orange-500",
      trend: "+5%"
    }
  ];

  const recentActivities = [
    {
      type: "template",
      title: "Evaluación de Álgebra Lineal",
      description: "Plantilla de examen con 15 ejercicios progresivos",
      time: "Hace 2 horas",
      status: "Completado"
    },
    {
      type: "material",
      title: "Presentación: Funciones Cuadráticas",
      description: "Material interactivo con ejemplos visuales",
      time: "Ayer",
      status: "En progreso"
    },
    {
      type: "ai",
      title: "Sugerencia de IA: Metodología",
      description: "Nuevas estrategias para enseñanza de derivadas",
      time: "Hace 3 días",
      status: "Nuevo"
    }
  ];

  const quickActions = [
    {
      title: "Nueva Planificación",
      description: "Crear planificación de clase con IA",
      icon: Calendar,
      color: "bg-blue-600",
      path: "/plantillas"
    },
    {
      title: "Generar Material",
      description: "Crear recursos didácticos personalizados",
      icon: BookOpen,
      color: "bg-green-600",
      path: "/materiales"
    },
    {
      title: "Consultar IA",
      description: "Obtener sugerencias pedagógicas",
      icon: Brain,
      color: "bg-purple-600",
      path: "/centro-ia"
    },
    {
      title: "Ver Objetivos",
      description: "Revisar metas y progreso",
      icon: Target,
      color: "bg-orange-600",
      path: "/perfil"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido de vuelta, {user?.name?.split(' ')[1]}!
        </h1>
        <p className="text-blue-100 text-lg mb-6">
          Continuemos transformando la educación con inteligencia artificial
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Crear Nuevo Contenido</span>
          </button>
          <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium">
            Ver Tutoriales
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="p-4 border-2 border-slate-100 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {activity.type === 'template' && <FileText className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'material' && <BookOpen className="w-5 h-5 text-green-600" />}
                  {activity.type === 'ai' && <Brain className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{activity.title}</h4>
                  <p className="text-sm text-slate-600 truncate">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                  activity.status === 'Completado' ? 'bg-green-100 text-green-700' :
                  activity.status === 'En progreso' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
            Ver todas las actividades
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Sugerencias de IA</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              Metodología Sugerida: Aprendizaje Activo
            </h3>
            <p className="text-slate-600 text-sm mb-3">
              Para tu próxima clase de "Funciones", considera usar ejercicios interactivos 
              que permitan a los estudiantes experimentar con diferentes parámetros.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Ver detalles →
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">
              Recurso Recomendado: Simulador Gráfico
            </h3>
            <p className="text-slate-600 text-sm mb-3">
              Basado en tu historial, un simulador de funciones cuadráticas 
              podría mejorar la comprensión de tus estudiantes.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Generar recurso →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;