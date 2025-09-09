import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield,
  Award,
  TrendingUp,
  Calendar,
  Edit,
  Mail,
  MapPin,
  GraduationCap,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Mi Perfil', icon: User },
    { id: 'achievements', name: 'Logros', icon: Award },
    { id: 'settings', name: 'Configuración', icon: Settings },
    { id: 'notifications', name: 'Notificaciones', icon: Bell }
  ];

  const achievements = [
    {
      title: "Innovador Digital",
      description: "Creaste tu primera plantilla con IA",
      icon: "🚀",
      earned: true,
      date: "15 de Marzo, 2024"
    },
    {
      title: "Mentor Activo",
      description: "Generaste 50+ materiales didácticos",
      icon: "👨‍🏫",
      earned: true,
      date: "22 de Marzo, 2024"
    },
    {
      title: "Explorador IA",
      description: "Usaste 10 funciones diferentes de IA",
      icon: "🧠",
      earned: true,
      date: "28 de Marzo, 2024"
    },
    {
      title: "Colaborador Experto",
      description: "Comparte 25+ recursos con colegas",
      icon: "🤝",
      earned: false,
      progress: 18
    },
    {
      title: "Maestro de la Eficiencia",
      description: "Ahorra 100+ horas con automatización",
      icon: "⚡",
      earned: false,
      progress: 32
    }
  ];

  const stats = [
    { label: "Días Activo", value: "45", trend: "+5 esta semana" },
    { label: "Plantillas Creadas", value: "24", trend: "+3 este mes" },
    { label: "Estudiantes Impactados", value: "180", trend: "+12 este mes" },
    { label: "Horas Ahorradas", value: "32", trend: "+8 este mes" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Profile Info */}
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Información Personal</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{user?.name}</h3>
                  <p className="text-slate-600">{user?.role}</p>
                  <p className="text-slate-500 text-sm">{user?.institution}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.role}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Institución
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.institution}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Correo Electrónico</p>
                        <p className="font-medium text-slate-900">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Especialidad</p>
                        <p className="font-medium text-slate-900">{user?.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Institución</p>
                        <p className="font-medium text-slate-900">{user?.institution}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                          <p className="text-sm text-slate-600">{stat.label}</p>
                          <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Mis Logros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      achievement.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`text-3xl ${achievement.earned ? 'opacity-100' : 'opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-green-800' : 'text-slate-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-green-600' : 'text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    {achievement.earned ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Desbloqueado el {achievement.date}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-600">Progreso</span>
                          <span className="text-sm font-medium text-slate-700">
                            {achievement.progress}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Configuración de Cuenta</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Preferencias de IA</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">Sugerencias automáticas de contenido</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">Análisis de metodologías pedagógicas</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">Generación automática de evaluaciones</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Idioma y Región</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Idioma Principal
                      </label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Español</option>
                        <option>English</option>
                        <option>Português</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        País/Región
                      </label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Argentina</option>
                        <option>Chile</option>
                        <option>Colombia</option>
                        <option>México</option>
                        <option>Perú</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Seguridad</h3>
                  <div className="space-y-3">
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                      Cambiar Contraseña
                    </button>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                      Verificación en Dos Pasos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Preferencias de Notificaciones</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Notificaciones por Email</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-slate-700">Nuevas sugerencias de IA</span>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-slate-700">Actualizaciones de plantillas</span>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-slate-700">Reportes semanales de actividad</span>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Notificaciones Push</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-slate-700">Recordatorios de planificación</span>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-slate-700">Nuevos materiales disponibles</span>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-600 mt-2">
          Gestiona tu información personal, logros y configuración de la plataforma
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
            <p className="text-green-600 text-xs">{stat.trend}</p>
          </div>
        ))}
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
                    ? 'border-blue-600 text-blue-600'
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
      <div>
        {activeTab === 'achievements' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Mis Logros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      achievement.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`text-3xl ${achievement.earned ? 'opacity-100' : 'opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-green-800' : 'text-slate-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-green-600' : 'text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    {achievement.earned ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Desbloqueado el {achievement.date}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-600">Progreso</span>
                          <span className="text-sm font-medium text-slate-700">
                            {achievement.progress}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default Profile;