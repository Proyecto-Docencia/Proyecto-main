export interface Material {
  id: number;
  title: string;
  description: string;
  type: 'CAPÍTULO' | 'SIMULADOR' | 'MULTIMEDIA' | 'EJERCICIOS' | string;
  subject: string;
  grade: string;
  isAI: boolean;
  date: string;
  video?: string;
  pdf?: string;
  concepts: string[];
  recommendedUse: string;
}

// Enlaces de video y PDF por material
const videoLinks: Record<number, string> = {
  1: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  2: 'https://www.youtube.com/embed/9bZkp7q19f0',
  3: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
  4: 'https://www.youtube.com/embed/L_jWHffIx5E',
  5: 'https://www.youtube.com/embed/tVj0ZTS4WF4',
  6: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
};

const pdfLinks: Record<number, string> = {
  // Solo disponibles: capítulos 2, 3 y 6
  1: '',
  2: '/docs/Capitulo2.pdf',
  3: '/docs/Capitulo3.pdf',
  4: '',
  5: '',
  6: '/docs/Capitulo6.pdf',
};

export const materials: Material[] = [
  {
    id: 1,
    title: 'Capítulo 1 - Trabajo Colaborativo',
    description:
      'Guía para diseñar experiencias colaborativas en el aula integrando IA generativa como miembro activo del equipo.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: true,
    date: 'Hace 3 días',
    video: videoLinks[1],
    pdf: pdfLinks[1],
    concepts: [
      'Roles colaborativos de la IA',
      'Ciclo de integración en el aula',
      'Evaluación del trabajo colaborativo',
      'Ejemplos por disciplina',
      'Competencias desarrolladas',
    ],
    recommendedUse:
      'Diseño de clases activas, proyectos grupales, formación docente en innovación educativa',
  },
  {
    id: 2,
    title: 'Capítulo 2 - Ciclo de Experiencias de Aprendizaje con IAGen',
    description:
      'Modelo paso a paso para diseñar, ejecutar y evaluar experiencias de aprendizaje universitarias integrando IA generativa como mediador pedagógico.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: true,
    date: 'Hace 1 semana',
    video: videoLinks[2],
    pdf: pdfLinks[2],
    concepts: [
      'Diagnóstico inicial de habilidades',
      'Planificación didáctica con IA',
      'Ejecución y monitoreo del aprendizaje',
      'Reflexión y asimilación de aprendizajes',
      'Evaluación del ciclo completo',
    ],
    recommendedUse:
      'Diseño de clases activas, formación docente, rediseño curricular con enfoque en competencias digitales',
  },
  {
    id: 3,
    title: 'Capítulo 3 - Alfabetización Digital en IAGen',
    description:
      'Guía práctica para desarrollar competencias en el uso ético, crítico y efectivo de herramientas de IA generativa en la educación superior.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: false,
    date: 'Hace 5 días',
    video: videoLinks[3],
    pdf: pdfLinks[3],
    concepts: [
      'Alfabetización digital en IAGen',
      'Uso ético y crítico de IA',
      'Diseño de prompts efectivos',
      'Evaluación de sesgos y limitaciones',
      'Ciclo de integración en el aula',
    ],
    recommendedUse:
      'Formación docente, introducción a IA en asignaturas, desarrollo de competencias digitales',
  },
  {
    id: 4,
    title: 'Simulador de Reacciones Químicas',
    description:
      'Herramienta interactiva para experimentar con diferentes reacciones químicas.',
    type: 'SIMULADOR',
    subject: 'Química',
    grade: '5° Secundaria',
    isAI: true,
    date: 'Hace 6 días',
    video: videoLinks[4],
    pdf: pdfLinks[4],
    concepts: ['Reacciones químicas', 'Simulación interactiva'],
    recommendedUse: 'Laboratorio virtual, prácticas de química',
  },
  {
    id: 5,
    title: 'Historia de la Revolución Industrial',
    description:
      'Presentación multimedia con línea de tiempo y mapas interactivos.',
    type: 'MULTIMEDIA',
    subject: 'Historia',
    grade: '3° Secundaria',
    isAI: true,
    date: 'Hace 3 días',
    video: videoLinks[5],
    pdf: pdfLinks[5],
    concepts: ['Revolución Industrial', 'Línea de tiempo', 'Mapas interactivos'],
    recommendedUse: 'Clases de historia, recursos multimedia',
  },
  {
    id: 6,
    title: 'Capítulo 6 - Evaluación y Retroalimentación con IAGen',
    description:
      'Marco y pautas para evaluar aprendizajes con apoyo de IA generativa, con énfasis en retroalimentación formativa y criterios de calidad.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: true,
    date: 'Hace 2 días',
    video: videoLinks[6],
    pdf: pdfLinks[6],
    concepts: [
      'Rúbricas asistidas por IA',
      'Retroalimentación formativa',
      'Evidencias de aprendizaje',
      'Ética y transparencia en evaluación',
    ],
    recommendedUse:
      'Evaluación de cursos, diseño de rúbricas, formación docente en retroalimentación efectiva',
  },
];

export function getMaterialById(id: number): Material | undefined {
  return materials.find((m) => m.id === id);
}
