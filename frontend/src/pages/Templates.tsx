import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Users,
  Star,
  Download,
  Edit,
  Copy
} from 'lucide-react';

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas las Plantillas' },
    { id: 'lesson-plans', name: 'Planificaciones de Clase' },
    { id: 'evaluations', name: 'Evaluaciones' },
    { id: 'projects', name: 'Proyectos' },
    { id: 'activities', name: 'Actividades' }
  ];

  const templates = [
    {
      id: 1,
      title: "Planificación de Clase - Matemáticas",
      description: "Plantilla completa para planificar clases de matemáticas con objetivos, actividades y evaluación.",
      category: "lesson-plans",
      subject: "Matemáticas",
      duration: "90 min",
      students: "25-30",
      rating: 4.8,
      downloads: 156,
      lastUsed: "Hace 3 días",
      isAI: true
    },
    {
      id: 2,
      title: "Evaluación Diagnóstica - Ciencias",
      description: "Herramienta para evaluar conocimientos previos en ciencias naturales con análisis automático.",
      category: "evaluations",
      subject: "Ciencias",
      duration: "45 min",
      students: "20-35",
      rating: 4.9,
      downloads: 89,
      lastUsed: "Hace 1 semana",
      isAI: true
    },
    {
      id: 3,
      title: "Proyecto Investigativo - Historia",
      description: "Guía estructurada para proyectos de investigación histórica con rúbrica incluida.",
      category: "projects",
      subject: "Historia",
      duration: "2 semanas",
      students: "15-25",
      rating: 4.7,
      downloads: 73,
      lastUsed: "Hace 5 días",
      isAI: false
    },
    {
      id: 4,
      title: "Actividad Grupal - Lengua",
      description: "Dinámica colaborativa para análisis literario con roles definidos y objetivos claros.",
      category: "activities",
      subject: "Lengua y Literatura",
      duration: "60 min",
      students: "20-30",
      rating: 4.6,
      downloads: 124,
      lastUsed: "Hace 2 días",
      isAI: true
    },
    {
      id: 5,
      title: "Examen Parcial - Física",
      description: "Evaluación integral de conceptos básicos de mecánica con diferentes niveles de dificultad.",
      category: "evaluations",
      subject: "Física",
      duration: "120 min",
      students: "25-35",
      rating: 4.8,
      downloads: 97,
      lastUsed: "Hace 1 día",
      isAI: true
    },
    {
      id: 6,
      title: "Laboratorio Virtual - Química",
      description: "Guía para experimentos virtuales con simuladores y análisis de resultados.",
      category: "activities",
      subject: "Química",
      duration: "90 min",
      students: "15-20",
      rating: 4.9,
      downloads: 112,
      lastUsed: "Hace 4 días",
      isAI: true
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Plantillas Educativas</h1>
          <p className="text-slate-600 mt-2">
            Crea planificaciones personalizadas con la ayuda de inteligencia artificial
          </p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por título, materia o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                      {template.title}
                    </h3>
                    {template.isAI && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        IA
                      </span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {template.subject}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-700">{template.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {template.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{template.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{template.students}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-3 h-3" />
                  <span>{template.downloads}</span>
                </div>
              </div>

              {/* Last Used */}
              <p className="text-xs text-slate-400 mb-4">{template.lastUsed}</p>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-1">
                  <Edit className="w-4 h-4" />
                  <span>Usar</span>
                </button>
                <button className="px-3 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors duration-200">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-slate-600 mb-6">
            Intenta ajustar los filtros o crear una nueva plantilla
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2 mx-auto">
            <Plus className="w-5 h-5" />
            <span>Crear Nueva Plantilla</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Templates;