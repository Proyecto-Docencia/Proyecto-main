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
  Save,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Campos editables
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || ''); // Carreras que imparte
  const [institution, setInstitution] = useState(user?.institution || '');
  const [telefono, setTelefono] = useState('');
  const [rut, setRut] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');
  const [facultad, setFacultad] = useState('');

  const tabs = [
    { id: 'profile', name: 'Mi Perfil', icon: User }
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Aquí puedes agregar lógica para guardar los cambios en backend o localStorage si lo deseas
  };

  const renderTabContent = () => {
    // Solo queda la pestaña de perfil
    return (
      <div className="space-y-8">
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
                {(name || user?.name || '').split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
              <p className="text-slate-600">{role}</p>
              <p className="text-slate-500 text-sm">{institution}</p>
            </div>
          </div>
          {isEditing ? (
            <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSave}>
              {/* Información personal */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  placeholder="+56912345678"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">RUT</label>
                <input
                  type="text"
                  placeholder="12.345.678-9"
                  value={rut}
                  onChange={e => setRut(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
                <input
                  type="text"
                  placeholder="Av. Siempre Viva 742"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Comuna</label>
                <input
                  type="text"
                  placeholder="Santiago"
                  value={comuna}
                  onChange={e => setComuna(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {/* Información docente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Facultad</label>
                <input
                  type="text"
                  placeholder="Tecnología"
                  value={facultad}
                  onChange={e => setFacultad(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Carreras que imparte</label>
                <input
                  type="text"
                  placeholder="Ej: Ingeniería, Informática"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Institución</label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Información personal */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Correo Electrónico</p>
                    <p className="font-medium text-slate-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Dirección</p>
                    <p className="font-medium text-slate-900">{direccion}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Comuna</p>
                    <p className="font-medium text-slate-900">{comuna}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Teléfono</p>
                    <p className="font-medium text-slate-900">{telefono}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">RUT</p>
                    <p className="font-medium text-slate-900">{rut}</p>
                  </div>
                </div>
              </div>
              {/* Información docente */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Facultad</p>
                    <p className="font-medium text-slate-900">{facultad}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Carreras que imparte</p>
                    <p className="font-medium text-slate-900">{role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Institución</p>
                    <p className="font-medium text-slate-900">{institution}</p>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="md:col-span-2 space-y-4">
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
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-600 mt-2">
          Gestiona tu información personal
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
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
