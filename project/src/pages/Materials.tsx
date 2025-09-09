import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Share2,
  Heart,
  Brain,
  Image,
  Video,
  FileText,
  Presentation
} from 'lucide-react';

const Materials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const materialTypes = [
    { id: 'all', name: 'Todos los Materiales' },
    { id: 'presentations', name: 'Presentaciones' },
    { id: 'worksheets', name: 'Hojas de Trabajo' },
    { id: 'videos', name: 'Videos Educativos' },
    { id: 'interactive', name: 'Recursos Interactivos' }
  ];

  const materials = [
    {
      id: 1,
      title: "Introducción a las Funciones Cuadráticas",
      description: "Presentación interactiva con gráficos dinámicos y ejercicios paso a paso.",
      type: "presentations",
      subject: "Matemáticas",
      grade: "3° Secundaria",
      format: "PowerPoint + Interactivos",
      size: "2.4 MB",
      downloads: 234,
      likes: 45,
      isAI: true,
      thumbnail: "🔢",
      createdAt: "Hace 2 días"
    },
    {
      id: 2,
      title: "Ecosistemas y Biodiversidad",
      description: "Video educativo con animaciones sobre la importancia de los ecosistemas.",
      type: "videos",
      subject: "Ciencias Naturales",
      grade: "2° Secundaria",
      format: "MP4 HD",
      size: "45.2 MB",
      downloads: 187,
      likes: 62,
      isAI: true,
      thumbnail: "🌱",
      createdAt: "Hace 1 semana"
    },
    {
      id: 3,
      title: "Análisis de Textos Narrativos",
      description: "Hoja de trabajo con guía para análisis literario y comprensión lectora.",
      type: "worksheets",
      subject: "Lengua y Literatura",
      grade: "4° Secundaria",
      format: "PDF",
      size: "1.8 MB",
      downloads: 98,
      likes: 28,
      isAI: false,
      thumbnail: "📚",
      createdAt: "Hace 4 días"
    },
    {
      id: 4,
      title: "Simulador de Reacciones Químicas",
      description: "Herramienta interactiva para experimentar con diferentes reacciones químicas.",
      type: "interactive",
      subject: "Química",
      grade: "5° Secundaria",
      format: "Web App",
      size: "Online",
      downloads: 156,
      likes: 71,
      isAI: true,
      thumbnail: "⚗️",
      createdAt: "Hace 6 días"
    },
    {
      id: 5,
      title: "Historia de la Revolución Industrial",
      description: "Presentación multimedia con línea de tiempo y mapas interactivos.",
      type: "presentations",
      subject: "Historia",
      grade: "3° Secundaria",
      format: "HTML5",
      size: "8.7 MB",
      downloads: 142,
      likes: 39,
      isAI: true,
      thumbnail: "🏭",
      createdAt: "Hace 3 días"
    },
    {
      id: 6,
      title: "Ejercicios de Gramática Avanzada",
      description: "Conjunto de ejercicios progresivos para dominar la gramática española.",
      type: "worksheets",
      subject: "Lengua y Literatura",
      grade: "4° Secundaria",
      format: "PDF Interactivo",
      size: "3.2 MB",
      downloads: 89,
      likes: 24,
      isAI: true,
      thumbnail: "✏️",
      createdAt: "Hace 1 semana"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentations': return Presentation;
      case 'worksheets': return FileText;
      case 'videos': return Video;
      case 'interactive': return Brain;
      default: return BookOpen;
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || material.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Material Didáctico</h1>
          <p className="text-slate-600 mt-2">
            Recursos educativos generados con IA para potenciar tu enseñanza
          </p>
        </div>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Generar Material</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar materiales por título, materia o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                {materialTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const TypeIcon = getTypeIcon(material.type);
          return (
            <div key={material.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-50">
                  {material.thumbnail}
                </div>
                {material.isAI && (
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium flex items-center space-x-1">
                      <Brain className="w-3 h-3" />
                      <span>IA</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <button className="px-4 py-2 bg-white text-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 font-medium flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Vista Previa</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Content */}
                <div className="flex items-center space-x-2 mb-3">
                  <TypeIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">{material.subject}</span>
                  <span className="text-sm text-slate-500">•</span>
                  <span className="text-sm text-slate-500">{material.grade}</span>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                  {material.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {material.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{material.format}</span>
                  <span>{material.size}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{material.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{material.likes}</span>
                    </div>
                  </div>
                  <span className="text-xs">{material.createdAt}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                  </button>
                  <button className="px-3 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No se encontraron materiales
          </h3>
          <p className="text-slate-600 mb-6">
            Intenta ajustar los filtros o generar nuevo material didáctico
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2 mx-auto">
            <Plus className="w-5 h-5" />
            <span>Generar Nuevo Material</span>
          </button>
        </div>
      )}

      {/* AI Suggestion Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Sugerencia de IA</h3>
        </div>
        <p className="text-slate-700 mb-4">
          Basado en tu actividad reciente, la IA sugiere crear material interactivo sobre 
          <strong> "Teorema de Pitágoras" </strong> para complementar tu próxima planificación.
        </p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm">
          Generar Material Sugerido
        </button>
      </div>
    </div>
  );
};

export default Materials;