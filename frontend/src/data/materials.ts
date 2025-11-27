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
  podcast?: string; // Nuevo: ruta a archivo mp4 (podcast) específico del capítulo
  inlineHtml?: string; // Contenido HTML inline que se mostrará independientemente de la existencia del PDF
  concepts: string[];
  recommendedUse: string;
}

// Enlaces de video y PDF por material
const videoLinks: Record<number, string> = {
  1: '', // Video local en /public/docs
  2: '',
  3: '/docs/Videos/alfabetizacin-digital-Cap3.mp4', 
  4: '/docs/Videos/pensamiento-crtico-Cap4.mp4', 
  5: '/docs/Videos/Tiempo-autónomo-CAP5.mp4', 
  6: '/docs/Videos/colaboracion-Cap6.mp4', 
  7: '/docs/Videos/Creatividad-(CAP7).mp4', 
};

// Enlaces a podcasts (archivos mp4 con audio – “Podcast de cada capitulo”)
const podcastLinks: Record<number, string> = {
  1: '',
  2: '/docs/Podcast%20de%20cada%20capitulo/Marco_educativo_para_integrar_la_IAGen__(CAP2).mp4',
  3: '/docs/Podcast%20de%20cada%20capitulo/Alfabetizaci%C3%B3n_en_IAGen%20Cap%203.mp4',
  4: '/docs/Podcast%20de%20cada%20capitulo/Pensamiento_Cr%C3%ADtico__Cap4.mp4',
  5: '/docs/Podcast%20de%20cada%20capitulo/Aut%C3%B3nomo__Cap5.mp4',
  6: '/docs/Podcast%20de%20cada%20capitulo/Colaboraci%C3%B3n_(Trabajo%20colaborativo)Cap6.mp4',
  7: '/docs/Podcast%20de%20cada%20capitulo/Creatividad_Aumentada_(CAP7).mp4',
};

const pdfLinks: Record<number, string> = {
  // Disponibles físicamente en /public/docs: 2, 3, 4, 5, 6 (notar acentos en algunos archivos)
  1: '',
  2: '/docs/Capitulo2.pdf',
  3: '/docs/Capitulo3.pdf',
  // Archivos en disco: Cápitulo4.pdf (con tilde en la A) y Capítulo5.pdf (tilde en la i)
  4: '/docs/C%C3%A1pitulo4.pdf', // encodeURI('Cápitulo4.pdf')
  5: '/docs/Cap%C3%ADtulo5.pdf', // encodeURI('Capítulo5.pdf')
  6: '/docs/Capitulo6.pdf',
  7: '', //Falta el PDF físico capitulo 7
};

export const materials: Material[] = [
  {
    id: 1,
    title: 'Capítulo 1 - Faltante',
    description:
      'Guía para diseñar experiencias colaborativas en el aula integrando IA generativa como miembro activo del equipo.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: true,
    date: 'Hace 3 días',
    video: videoLinks[1],
    pdf: pdfLinks[1],
    podcast: podcastLinks[1],
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
    podcast: podcastLinks[2],
    inlineHtml: `
      <h2>Capítulo 2.- Ciclo de Experiencias de Aprendizaje mediadas con IAGen en la educación Superior</h2>

      <p>(Elaboración propia, equipo Marco Educativo IAG, 2025)</p>

      <p>El ciclo de experiencias de aprendizaje mediadas con IAGen, orienta el trabajo educativo que deben desarrollar los académicos con la finalidad de lograr una docencia efectiva en la integración de la IAGen en su asignatura, busca que las experiencias de aprendizaje que se implementen tributen al logro de los resultados de aprendizaje de su programa y estén alineadas con el perfil de egreso de la carrera a la cual pertenece.</p>

      <p>A continuación, se describen las etapas del ciclo de manera global, las cuales son una orientación que se debe replicar en cada una de las habilidades desarrolladas en este marco educativo: alfabetización digital, pensamiento crítico, trabajo autónomo, colaboración y creatividad.</p>

      <h3>Etapa 1.- Identificar la Experiencia de Aprendizaje</h3>
      <p><strong>¿Cuál es el estado inicial personal y de mi curso?</strong></p>
      <p><strong>¿Cuál es la experiencia de aprendizaje que necesito desarrollar en mi asignatura que puede ser mediada positivamente con el uso de la IAGen?</strong></p>
      <p>En esta fase, el académico como facilitador del proceso de enseñanza y aprendizaje debe reflexionar con el fin de identificar cuál es el estado o las necesidades que se necesitan desarrollar tanto en él o ella como sus estudiantes con relación a cada una de las habilidades desarrolladas en el marco para explorar y definir cómo la IAGen puede ser una catalizador o mediador de aprendizaje, dicho de otra forma, esta etapa consiste en realizar un diagnóstico.</p>

      <p>A partir de esta auto evaluación, identifica el desafío o acción necesaria y define qué hará. Este ejercicio reflexivo levantará un estado inicial en cada habilidad de el o los cursos que lidere. Es adecuado que el diagnóstico permita que su desafío contemple las fortalezas y debilidades personales y las de sus
      estudiantes, para abordar integralmente el trabajo a realizar. Cuando se aborda la integración de tecnología en el proceso de enseñanza debe ser paso a paso y en conjunto con sus estudiantes, para lograr rediseñar y transformar el proceso.</p>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP2/esquema_etapa_1_CAP2.png" alt="Esquema Etapa 1" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>

      <h3>Etapa 2.- Planificar la experiencia de aprendizaje</h3>
      <p><strong>¿Cómo será el paso a paso de la experiencia de enseñanza y aprendizaje?</strong></p>
      <p>En esta etapa se debe diseñar o planificar la experiencia de aprendizaje. Por lo tanto, se debe seguir una secuencia didáctica general y transversal a todas las disciplinas, que al menos contemple los siguientes pasos:</p>

      <ol>
        <li>Seleccionar que habilidad desea abordar primero.</li>
        <li>Identifica dentro de su Syllabus o cronograma cuándo es oportuno realizar su experiencia.</li>
        <li>Ajustar el objetivo identificado, el cual debe estar alineado con el programa de su asignatura.</li>
        <li>Determinar los indicadores de evaluación.</li>
        <li>Determinar contenidos y/o actitudes que busca desarrollar en su experiencia de aprendizaje.</li>
        <li>Diseñar la o las actividades que sean necesarias para el inicio, desarrollo y cierre de su experiencia.</li>
        <li>Identificar cuánto tiempo tomará la ejecución de su experiencia y ajustar a su cronograma.</li>
        <li>Identificar, seleccionar o crear los recursos y materiales que serán necesarios.</li>
        <li>Elaborar un instrumento para evaluar su experiencia considerando los indicadores ya elaborados.</li>
      </ol>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP2/esquema_etapa_2_CAP2.png" alt="Esquema Etapa 2" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>

      <p>Aquí, es importante recordar que el uso e integración de la IAGen son un mediador, un gatillador, no el fin en sí mismo, si bien es importante el buen manejo y uso, integrar la IAGen tiene el foco en desarrollar habilidades superiores relacionadas con su asignatura.</p>

      <p>Finalmente, es absolutamente necesario que al planificar su experiencia tenga presente los pilares del modelo desarrollado al inicio del marco: integridad académica y uso ético de la inteligencia artificial, formación en alfabetización en IAG y desarrollo de competencias digitales, diseño y evaluación de estrategias de enseñanza y aprendizaje, y privacidad, seguridad y protección de datos.</p>

      <h3>Etapa 3. Ejecución de la experiencia de aprendizaje</h3>
      <p><strong>¿Se está logrando el objetivo definido?</strong></p>
      <p><strong>¿Puedo observar y medir los indicadores de evaluación definidos?</strong></p>
      <p>Este momento es donde se lleva a cabo la experiencia de aprendizaje y se implementa según la planificación hecha. En dicho espacio y tiempo podrá apreciar las reacciones, desempeños y reflexiones de sus estudiantes.</p>

      <p>Es necesario que cierre su actividad para poder evaluar no solo el logro del objetivo de la experiencia, sino que también pueda comparar el resultado de su clase con el análisis que tomó en la primera etapa del ciclo. Esta etapa requiere de su preparación y disposición positiva, la cual es fundamental para enganchar y motivar, cómo desarrollar un ambiente positivo y favorable para el aprendizaje.</p>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP2/esquema_etapa_3_CAP2.png" alt="Esquema Etapa 3" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>

      <h3>Etapa 4. Reflexión de la Experiencia</h3>
      <p><strong>¿Qué avances se lograron?</strong></p>
      <p>Después de ejecutar la actividad, el profesor debe reflexionar sobre la experiencia vivida, esto no se relaciona directamente con el nivel de logro de la actividad planificada, lo contempla, pero va más allá, es el momento para evaluar y comparar el estado inicial que usted identificó en la primera etapa del ciclo.</p>

      <p>Esto implica hacerse preguntas orientadoras para una reflexión personal y conjunta, y para proyectar el aprendizaje más allá de la ejecución, conectándolo con el perfil de egreso de la carrera y la disciplina de manera transversal.</p>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP2/esquema_etapa_4_CAP2.png" alt="Esquema Etapa 4" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>

      <h3>Etapa 5. Asimilación de la experiencia de aprendizaje</h3>
      <p><strong>¿De qué manera mis estudiantes están transfiriendo técnicas, habilidades o aprendizajes desarrollados en la experiencia de aprendizaje?</strong></p>
      <p><strong>¿Qué cambios ha generado este proceso en mi práctica docente?</strong></p>

      <p>Tras la reflexión, conclusiones y proyecciones se establece un período de tiempo en donde el docente monitorea cómo se está instalando el objetivo planteado, cómo se procesa en usted y en sus estudiantes. Asimilar un aprendizaje toma tiempo, no basta con una sola experiencia, se requiere espacio para integrar, se requiere monitoreo, apoyos, mantener en la memoria de los estudiantes o en el hacer de su clase el objetivo propuesto.</p>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP2/esquema_etapa_5_CAP2.png" alt="Esquema Etapa 5" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>

      <h3>Etapa 6. Evaluación del ciclo.</h3>
      <p><strong>¿Qué barreras y facilitadores se visibilizan en el ciclo completo?</strong></p>
      <p><strong>¿Cómo fue la experiencia y el impacto en el proceso de enseñanza del docente y aprendizaje en los estudiantes?</strong></p>
      <p><strong>¿Qué nuevas experiencias se pueden iniciar en el corto o largo plazo?</strong></p>

      <p>Esta es la etapa final del ciclo, donde el profesor evalúa el proceso completo. Se pregunta si el ciclo identificado se ha cerrado, si falta algún elemento, o si esta experiencia abre una nueva oportunidad para otro proceso más complejo o el reinicio de una nueva acción. Se sugiere el uso de preguntas orientadoras para guiar esta revisión y ajuste en relación con lo identificado en la primera etapa.</p>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP2/esquema_etapa_6_CAP2.png" alt="Esquema Etapa 6" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>
    `,
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
    podcast: podcastLinks[3],
    inlineHtml: `
      <h2>Capítulo3. Alfabetización Digital en Inteligencia Artificial Generativa (IAGen)</h2>

      <p>La irrupción de la Inteligencia Artificial Generativa (IAGen) ha abierto un nuevo horizonte en la educación superior. Este capítulo está diseñado para ser una guía práctica y clara que te ayudará a navegar este ecosistema tecnológico y, lo más importante, a empoderar a tus estudiantes en su uso. Aquí encontrarás conceptos claves, orientaciones didácticas y ejemplos concretos para que puedas desarrollar esta habilidad transversal en tu propia asignatura, sin importar tu disciplina.</p>

      <h3>¿Qué es la alfabetización digital en IAGen?</h3>
      <p>La alfabetización en IAGen es un concepto dinámico que se construye sobre las bases de la alfabetización digital y la IA en general, adaptándose a las características únicas de los modelos generativos. Va más allá del simple uso de herramientas; es la capacidad de comprender, evaluar críticamente y utilizar las tecnologías de IAGen de manera efectiva, ética y responsable.</p>

      <div class="esquema-etapa">
        <img src="/docs/Esquemas%20PDF/CAP3/esquema_inicio_del_CAP3.png" alt="esquema inicio CAP3" style="max-width:100%;height:auto;margin-top:1rem;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.08);" />
      </div>

      <p>Según Long y Magerko (2020), la alfabetización en IA se refiere a "un conjunto de competencias que permite a los individuos evaluar críticamente las tecnologías de IA; comunicarse y colaborar eficazmente con la IA; y utilizar la IA como una herramienta en línea, en el hogar y en el lugar de trabajo" (p. 2). Complementando, Zhang y Magerko (2025), la definen como "un conjunto de directrices para diseñar intervenciones de aprendizaje destinadas a mejorar la comprensión de los usuarios sobre la IA generativa, permitiéndoles interactuar con ella de manera efectiva, responsable y crítica".</p>

      <p>Por lo tanto, se entiende por Alfabetización Digital en IAGen, como el conjunto de habilidades en la que se capacita tanto a estudiantes y académicos para comprender los principios y el funcionamiento de las herramientas de IAGen, evaluar críticamente sus capacidades y limitaciones, y utilizarlas de manera efectiva y ética en su disciplina.</p>

      <p>Un uso responsable, ético y con propósito educativo de la IAGen está alineado con el desarrollo de competencias digitales docentes. Este enfoque se correlaciona con el modelo de integración de tecnologías SAMR de Rubén Puentedura, el cual nos permite reflexionar cómo la IAGen puede transformar la enseñanza. El objetivo es que, tanto tú como tus estudiantes, transiten desde la sustitución hacia la redefinición, creando nuevas actividades y ambientes de aprendizaje que, sin el uso de la IAGen, serían imposibles de concebir (Belkina, et al 2025).</p>

      <h3>¿Por qué es necesario abordar y desarrollar esta área en la docencia universitaria?</h3>
      <p>La Inteligencia Artificial Generativa está transformando rápidamente el panorama en la formación profesional y social. Es esencial que nuestros estudiantes no solo sean usuarios, sino ciudadanos y profesionales alfabetizados digitalmente en IAGen, capaces de comprender, utilizar de forma efectiva y navegar de manera ética en este nuevo ecosistema tecnológico (Jin, et al 2025). Este desarrollo es un pilar fundamental para la integración eficiente de la IAGen en la docencia, pues fomenta el pensamiento crítico al enfatizar sus limitaciones y sesgos. Al abordar esta área, se contribuye a disminuir la brecha entre la adopción de la tecnología y las respuestas educativas institucionales (García-Acuña et al 2023; Unesco, 2023).</p>

      <p>Considerando lo anterior, tu rol como profesor se transforma, de usuario a guía en la tecnología, y de un evaluador de producto a un transformador y evaluador de proceso (UNESCO, 2025), ya que te centras en cómo los estudiantes interactúan, exploran, comprenden y resuelven con la IAGen, más allá de solo evaluar el resultado final de una interacción.</p>

      <h3>¿Qué competencias desarrollan los estudiantes cuando sus profesores la implementan en sus clases?</h3>
      <p>Cuando los profesores integran la alfabetización digital en IAGen en sus clases, los estudiantes desarrollan un conjunto de competencias claves:</p>
      <ul>
        <li><strong>Uso de la IAGen con propósito:</strong> Capacita a los estudiantes para utilizar diversas herramientas de IAGen de manera efectiva y eficiente para propósitos académicos y profesionales relacionados con la disciplina y desafíos actuales o futuros.</li>
        <li><strong>Comprensión de su funcionamiento e implicancias:</strong> Entienden qué es la IAGen, cómo funciona a un nivel conceptual y cuáles son sus capacidades, así como las implicaciones éticas y sociales de su uso.</li>
        <li><strong>Pensamiento crítico:</strong> Reconocen las limitaciones, riesgos y desafíos éticos asociados al uso de la IAGen. Son capaces de analizar y evaluar críticamente el contenido, identificando falencias, alucinaciones y sesgos inherentes.</li>
        <li><strong>Toma de decisiones informadas y responsables:</strong> Aplican prácticas de uso responsable, transparente y seguro de la IAGen en su trayectoria académica y futura vida profesional.</li>
        <li><strong>Gestión de la privacidad y seguridad de los datos personales:</strong> Comprenden que el contenido que crea un recurso de IAGen es responsabilidad de quien lo activa, y que se deben resguardar los datos que se proporcionan en el prompt.</li>
      </ul>

      <h3>¿Qué aspectos se deben abordar cuando se decide desarrollar esta área en el curso?</h3>
      <p>Para desarrollar la alfabetización en IAGen, se deben abordar los siguientes aspectos y acciones en tu asignatura:</p>
      <ul>
        <li><strong>Incorporar la alfabetización en IAGen en las metodologías de enseñanza:</strong> Proyectos, clase invertida, ABP, estudio de caso, etc.</li>
        <li><strong>Asegurar que los estudiantes tengan acceso a las herramientas:</strong> Evaluar y elegir las herramientas de IAGen más apropiadas.</li>
        <li><strong>Emplear competencias digitales con base en los indicadores de la OCDE:</strong> Promover la inclusión digital para apoyar a la diversidad de estudiantes y sus diversas necesidades y ritmos de aprendizaje.</li>
        <li><strong>Evaluar las políticas de seguridad y privacidad de las herramientas de IAGen:</strong> Garantizar la protección de los datos de los estudiantes al utilizar herramientas de IAGen en el proceso de enseñanza-aprendizaje.</li>
        <li><strong>Transparentar el uso de IAGen en la asignatura:</strong> Comunicar claramente porqué, cuándo y cómo se ha utilizado el recurso. Se recomienda citar el uso de IAGen siguiendo las pautas establecidas.</li>
        <li><strong>Analizar los sesgos:</strong> Fomentar una actitud crítica ante las respuestas de la herramienta, ya que pueden tener sesgos (culturales, de género, políticos, etc.).</li>
      </ul>

      <p>Tal como lo señala Joseph E, la meta es trabajar para que todos seamos a “Robot-proof”, a prueba de robot, desarrollando diversas habilidades para poder trabajar y crear junto a máquinas inteligentes. (Ulloa-Cazarez, 2020)</p>

    <h3>¿Cómo se desarrolla el ciclo de integración de IAGen en la alfabetización digital?</h3>

    <p>El ciclo de experiencias de aprendizaje mediadas con IAGen es una guía para lograr una docencia efectiva en la integración de la IAGen en tu asignatura. A continuación, te explicamos cada etapa aplicada a la alfabetización digital:</p>

    <h3>Paso 1. Identificar el estado inicial con relación a la alfabetización digital en IAGen de su grupo curso.</h3>
    <p>El objetivo de este primer paso es determinar un diagnóstico y definir el objetivo que vas a desarrollar. Como facilitador, debes diagnosticar el estado inicial puedes usar preguntas como:</p>
    <ul>
        <li>¿Qué conocimientos tienen mis estudiantes sobre IAGen?</li>
        <li>¿Pueden diferenciar IAGen de otras IA?</li>
        <li>¿Saben para qué sirve un prompt?</li>
        <li>¿Han utilizado IAGen para resolver algún desafío asociado a la diciplina o temáticas de la asignatura?</li>
    </ul>
    <p>Este proceso puede ser en un diálogo abierto con su curso en un plenario estructurado con preguntas, por un cuestionario u otra actividad que usted defina. Sus resultados serán datos que le permitirán tomar una decisión más precisa, ajustada a su realidad y necesidades de su programa de asignatura.</p>
    <p>Con base en las respuestas, defines el objetivo de aprendizaje que quieres lograr, por ejemplo:</p>
    <ul>
        <li>Determinar en trabajo de equipo los beneficios, sesgos, barreras u otras acciones que arrojan las iteraciones realizadas con Claude o ChatGpt como respuesta a los prompt elaborados para solucionar los desafíos del caso.</li>
    </ul>

    <h3>Paso 2. Planificar la experiencia de aprendizaje seleccionada para avanzar en la alfabetización digital en IAGen.</h3>
    <p>En esta etapa tiene como objetivo diseñar la actividad en coherencia con su syllabus, semestre o trimestre. En función del objetivo, determina:</p>
    <ul>
        <li>Indicadores de evaluación.</li>
        <li>Tiempo de duración.</li>
        <li>Escenario o contexto de su actividad (sala de clase, salida, centro de práctica, otros)</li>
        <li>Estrategia o metodología.</li>
        <li>Contenidos a trabajar.</li>
        <li>Materiales y recursos de IAGen que va a utilizar en su actividad (ChatGPT, Gemini, Perplexity, otro)</li>
        <li>Diseña las actividades de inicio, desarrollo y cierre de su clase o proyecto de acuerdo con la temporalidad definida.</li>
        <li>Elabore el instrumento de evaluación considerando los indicadores ya definidos. Como es una actividad específica dentro de su asignatura es aconsejable para registrar el logro de este proceso y pueda tomar decisiones a futuro.</li>
    </ul>

    <h3>Paso 3: Ejecutar la experiencia de aprendizaje</h3>
  <p>Es el momento de llevar a cabo la actividad. Tu rol es de <strong>facilitador y observador</strong>. Guía a los estudiantes para que experimenten, analicen, comparen y reflexionen sobre los resultados. Anímalos a explorar y a no temer a los resultados inesperados, ya que son oportunidades de aprendizaje. Registre hallazgos o comentarios que llamen su atención, tome nota de las interacciones de los estudiantes, las preguntas frecuentes y los descubrimientos inesperados. Esto será útil para la fase de evaluación. Recuerde ir monitoreando los indicadores en su instrumento de evaluación.</p>

    <h3>Paso 4: Evaluar la actividad ejecutada.</h3>
    <p>Esta fase te permite reflexionar sobre la experiencia vivida. Utiliza el instrumento de evaluación que diseñaste (pauta, rúbrica, etc.) y elabora una retroalimentación personal y para sus estudiantes. Reflexione sobre sus propias competencias y habilidades, identifique mejoras y fortalezas en usted y en sus estudiantes. Estas acciones son fundamentales para la mejora continua. Comparta este proceso con sus estudiantes al inicio de la clase siguiente, por mensajería en la plataforma u otros en función de su cronograma. Al menos para esta actividad planificada asigne un espacio y momento para evaluar el proceso vivido, cómo resultó la actividad, se cumplió lo esperado, qué descubrió en el proceso tanto en usted como en los estudiantes con relación a la alfabetización digital.</p>
    <p>Preguntas globales que pueden guiar este proceso:</p>
    <ul>
        <li>¿Los estudiantes demostraron una comprensión clara de qué es la IAGen y cómo funciona? ¿Identificaron sus limitaciones y sesgos?</li>
        <li>¿Fueron capaces de usar la IAGen de manera efectiva (ej. buenos prompts) para la tarea propuesta?</li>
        <li>¿Qué aspectos de mi diseño o implementación funcionaron mejor para facilitar la alfabetización digital? ¿Qué mejoraría la próxima vez?</li>
        <li>¿Qué apoyo adicional necesitaría yo o mis estudiantes para seguir profundizando en la alfabetización digital en IAGen?</li>
    </ul>

    <div class="nota">
        <p><strong>Nota. Transparencia Obligatoria:</strong> Modele y monitoree la exigencia de siempre declaren explícitamente cómo y con qué propósito fue utilizada la IAGen en la asignatura.</p>
    </div>

    <h3>Paso 5: Asimilación de la experiencia de aprendizaje.</h3>
    <p>Incorporar o asimilar un aprendizaje necesita tiempo y oportunidades de experimentar. Considere unas semanas para reforzar en sus clases acciones asociadas a la experiencia que implementó, elabore ejercicios similares y acotados en donde sus estudiantes puedan repetir lo aprendido para generar la asimilación en dichos espacios presenciales o fuera de clase, indague sobre como transfieren y los resultados obtenidos. De ser posible registre hallazgos o relatos de su estudiantes, siempre pensando en la mejora continua.</p>

    <h3>Paso 6. Evaluación del ciclo completo.</h3>
    <p>El objetivo de esta etapa es mirar en retrospectiva el ciclo completo para identificar mejoras, aciertos y proyecciones.</p>
    <p>Preguntas que pueden facilitar la reflexión y proyección.</p>
    <ul>
        <li>¿Cuáles fueron los facilitadores u obstáculos en el ciclo planificado?</li>
        <li>¿Qué tan fluida fue la integración de las herramientas digitales, favoreció a resolver desafíos de la disciplina y programa de la asignatura?</li>
        <li>¿De qué manera esta experiencia transformó tu enseñanza?</li>
        <li>¿Qué nuevas experiencias de aprendizaje digital podrían iniciar a corto o largo plazo?</li>
    </ul>

    <h2>¿Qué indicadores de evaluación puedo usar para identificar los logros en mi curso?</h2>

    <p>Puedes usar los siguientes indicadores concretos para elaborar tus propios instrumentos de evaluación:</p>
    <ul>
        <li>Participa en la evaluación del potencia educativos de recursos de IAGen.</li>
        <li>Ejercita la elaboración de prompts y al mismo tiempo analiza su efectividad.</li>
        <li>Utiliza al menos 1 estrategia de diseño prompts.</li>
        <li>Identifica limitaciones y sesgos en los contenidos generados.</li>
        <li>Utiliza el recurso de IAGen definido para la asignatura.</li>
        <li>Evalúa la calidad de la información recibida.</li>
        <li>Toma decisiones considerando aspectos éticos.</li>
        <li>Declara explícitamente cómo y con qué propósito utilizó la IAGen en su trabajo.</li>
        <li>Es capaz de trabajar con autonomía una vez que exploro ideas con apoyo de la IAGen.</li>
    </ul>

    <h2>¿Qué experiencias se pueden trabajar para desarrollar esta habilidad?</h2>

    <ul>
        <li>Ejercitar el diseño de prompts utilizando estrategias para su elaboración</li>
        <li>Entrenar un Chat Bot para la asignatura, en la aplicación POE (<a href="https://poe.com/login">https://poe.com/login</a>) es posible crear un chat con estas características.</li>
        <li>Diseñar material diversificado para la asignatura o carrera utilizando Notebook LM (<a href="https://notebooklm.google/">https://notebooklm.google/</a>)</li>
    </ul>
    <h2>Un ejemplo de experiencia de aprendizaje elaborada con el ciclo.</h2>
    <p>Planificación 1. En búsqueda del recurso de IAGen más adecuado para la asignatura o disciplina.</p>

    <table>
        <thead>
            <tr>
                <th>Objetivo</th>
                <th>Indicadores</th>
                <th>Recursos de IAGen seleccionados</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Analizar comparativamente el funcionamiento de tres recursos de inteligencia artificial generativa (IAGen) ante un mismo y distintos prompts, aplicados a un desafío propio de su disciplina, mediante el trabajo colaborativo</td>
                <td>
                    <ul>
                        <li>Exploran las características, funciones y limitaciones de al menos tres herramientas de IAGen.</li>
                        <li>Comparan la calidad y pertinencia de los contenidos generados por cada recurso de IAGen ante un mismo prompt disciplinar.</li>
                        <li>Argumentan de manera fundamentada cuál de los recursos de IAGen resulta más efectivo según los criterios de la tarea académica propuesta.</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>ChayGpt</li>
                        <li>Gemini</li>
                        <li>Perplexity</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <th>Inicio</th>
                <th>Desarrollo</th>
                <th>Cierre</th>
            </tr>
            <tr>
                <td>
                    <p>Los estudiantes conocen el diagnóstico hecho por el profesor sobre la alfabetización digital del grupo curso, objetivo de la clase y el propósito del ciclo. Exploran de manera guiada los tres recursos seleccionados, opinan, preguntan, responden, otros.</p>
                    <p>Se organizan en grupos</p>
                    <p>Análisis del problema a resolver. Elaboración de prompt.</p>
                    <p>Comparación, reflexión grupal y argumentación grupal.</p>
                </td>
                <td>
                    <p>Los estudiantes se organizan en grupos, reciben, comentan y aclaran dudas de las tareas a realizar como equipos.</p>
                    <p>Se organizan al interior de cada equipo y comienzan a resolver las tareas.</p>
                    <p>Elaboran un prompt que les permita resolver el desafio presentado, iteran con el mismo prompt en los tres recursos.</p>
                    <p>Comparan, analizan y evalúan los resultados. Comparten en plenario conocer el proceso de los otros grupos, reciben y entregan retroalimentación. Rediseñan el prompt con nuevos ajustes, replican el ejercicio para evaluar el proceso y producción de cada recurso. Identifican la fuente de información, veracidad y calidad. Revisan sesgos u otros análisis solicitados por el profesor.</p>
                </td>
                <td>
                    <p>Cada grupo comparte su análisis final.</p>
                    <p>Concluyen cómo curso, la efectividad de cada plataforma de IAGen en función de su disciplina y el uso más eficiente que lograron identificar.</p>
                    <p>Concluyen en función de los sesgos, fuentes de información y riesgos identificados.</p>
                    <p>Evalúan si se cumplió el objetivo de la clase.</p>
                    <p>Entregan al profesor el trabajo solicitado a mano escrita o por la plataforma de la asignatura.</p>
                </td>
            </tr>
        </tbody>
    </table>
    `,
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
    title: 'Capítulo 4 - Pensamiento Crítico',
    description:
      'Explora el desarrollo del pensamiento crítico en contextos universitarios mediante el uso de IA generativa. Presenta estrategias para fomentar el análisis, la argumentación y la toma de decisiones informadas, integrando la IA como herramienta para enriquecer debates, evaluar posturas y promover la reflexión ética.',
    type: 'CAPÍTULO',
    subject: 'Química',
    grade: '5° Secundaria',
    isAI: true,
    date: 'Hace 6 días',
    video: videoLinks[4],
    pdf: pdfLinks[4],
    podcast: podcastLinks[4],
      inlineHtml: `
    <h2>Capítulo 4. Pensamiento Crítico</h2>

  <p>En la era de la Inteligencia Artificial Generativa (IAGen), la capacidad de generar textos, códigos e imágenes de manera instantánea y convincente ha transformado radicalmente el acceso a la información. En este contexto, el <strong>Pensamiento Crítico (PC)</strong> pasa de ser una habilidad deseable a un imperativo ético y profesional. Este capítulo provee una guía práctica para integrar la IAGen en su docencia, no como un sustituto del intelecto, sino como una poderosa herramienta para desarrollar en sus estudiantes la capacidad de analizar, evaluar y mejorar tanto sus propios razonamientos como los resultados producidos por la IA, cultivando un juicio profesional insustituible.</p>

    <h3>¿Qué es el pensamiento crítico?</h3>

    <p>El Pensamiento Crítico es la habilidad intelectualmente disciplinada para conceptualizar, analizar, sintetizar y/o evaluar información recopilada o generada por la observación, la experiencia, la reflexión, el razonamiento o la comunicación, como una guía para la creencia y la acción.</p>

    <p>Para su aplicación en el aula universitaria y en el contexto de la IAGen, es útil considerarlo desde dos perspectivas complementarias:</p>

    <ol>
        <li>
            <p><strong>Habilidades y Disposiciones (Faccione):</strong> Peter A. Faccione (1990, en el Informe Delphi) define el Pensamiento Crítico como un juicio autorregulado y con propósito. Este juicio se manifiesta en seis habilidades cognitivas clave:</p>
            <ul>
                <li>Interpretación: Entender el significado de datos e información.</li>
                <li>Análisis: Identificar las relaciones de inferencia reales y supuestas.</li>
                <li>Evaluación: Valorar la credibilidad de las afirmaciones y la fuerza lógica de las relaciones.</li>
                <li>Inferencia: Identificar y asegurar los elementos necesarios para llegar a conclusiones razonables.</li>
                <li>Explicación: Presentar los resultados del razonamiento de manera coherente y convincente.</li>
                <li>Autorregulación: Monitorear y corregir el propio juicio.</li>
            </ul>
        </li>
    </ol>
    <ol>
        <li>
            <p><strong>Estándares Intelectuales (Paul &amp; Elder):</strong> Richard Paul y Linda Elder (2006) complementan esto al enfocarse en la necesidad de aplicar estándares intelectuales universales al proceso de pensamiento. Para evaluar los *outputs* de una IAGen, un estudiante debe juzgar si el texto es:</p>
            <ul>
                <li>Claro (¿Es fácil de entender?).</li>
                <li>Preciso (¿Es verdadero o verificable?).</li>
                <li>Relevante (¿Se relaciona con el problema en cuestión?).</li>
                <li>Lógico (¿Las conclusiones se derivan de las premisas?).</li>
                <li>Justo (¿Se han considerado otros puntos de vista?).</li>
            </ul>
        </li>
    </ol>

    <h2>¿Por qué es necesario abordarlo y desarrollar las habilidades del pensamiento crítico en la docencia universitaria?</h2>

    <p>El desarrollo del Pensamiento Crítico en la universidad es vital por tres razones fundamentales, especialmente en la era de la IAGen:</p>

    <ol>
  <li><strong>Navegación en la Información Asistida por IA:</strong> La IAGen produce información a una velocidad sin precedentes. Los estudiantes ya no solo buscan información, sino que deben evaluar y depurar el contenido generado por un algoritmo. Necesitan PC para identificar sesgos algorítmicos, información falsa (<strong>alucinaciones</strong>) y falacias lógicas que la IA puede replicar o amplificar.</li>
  <li><strong>Desarrollo de Juicio Profesional:</strong> El PC es la base para la toma de decisiones éticas y fundamentadas. En el futuro profesional, ninguna IA reemplazará la responsabilidad final y el juicio contextual de un experto. La docencia debe asegurar que el estudiante use la IA para aumentar su capacidad analítica, no para sustituirla.</li>
  <li><strong>Conexión con el Perfil de Egreso:</strong> El Pensamiento Crítico es una competencia transversal clave en la mayoría de los perfiles de egreso universitarios. Abordarlo a través de la IAGen garantiza que esta habilidad se desarrolle en un contexto tecnológico, actual y relevante para el mercado laboral.</li>
    </ol>

    <h2>¿Qué competencias desarrollan los estudiantes cuando sus profesores favorecen estas habilidades en sus clases?</h2>

    <p>Al enfocar el diseño de experiencias de aprendizaje en el PC mediado por IAGen, los estudiantes desarrollan competencias esenciales:</p>
    <ul>
  <li><strong>Alfabetización Crítica en IAGen:</strong> Capacidad para comprender cómo funciona la IA, sus limitaciones y la necesidad de la intervención humana para validar sus resultados (UNESCO, 2023).</li>
  <li><strong>Análisis Multimodal de Evidencia:</strong> Habilidad para contrastar la evidencia generada por la IAGen (texto, tablas, códigos) con la evidencia de fuentes académicas tradicionales.</li>
  <li><strong>Meta-cognición y Autorregulación:</strong> El estudiante aprende a monitorear su propio proceso de razonamiento al corregir el producto de la IA. Se preguntan constantemente: "¿Por qué la IA dijo esto? ¿Es correcto? ¿Cómo lo mejoraría con mi conocimiento disciplinar?".</li>
  <li><strong>Proactividad y Prompt Engineering Crítico:</strong> Desarrollo de la habilidad de formular *prompts* (instrucciones) precisos y estratégicos, lo cual exige claridad en el objetivo, el contexto y los criterios de éxito, elementos intrínsecos al Pensamiento Crítico.</li>
    </ul>

    <h2>¿Qué aspectos se deben abordar cuando se decide desarrollar esta área en el curso?</h2>

    <p>Al diseñar actividades, se deben enfatizar dos aspectos cruciales:</p>

    <ol>
        <li>
            <p><strong>La Ética y Responsabilidad en el Uso</strong></p>
            <p>Se debe enseñar a los estudiantes a ser conscientes de:</p>
            <ul>
                <li>Autoría y Honestidad Académica: Clarificar cuándo y cómo se puede citar la IAGen como herramienta, y cuándo el trabajo debe ser 100% de autoría propia.</li>
                <li>Privacidad de Datos: El riesgo de ingresar información sensible o confidencial a modelos de IA.</li>
                <li>Sesgos Algorítmicos: La necesidad de evaluar si la información generada por la IA reproduce o amplifica prejuicios sociales o culturales que estaban presentes en sus datos de entrenamiento.</li>
            </ul>
        </li>
        <li>
            <p><strong>El Juicio Humano como Filtro Final</strong></p>
            <p>El foco de la actividad no debe ser obtener la respuesta de la IAGen, sino evaluarla. El profesor debe diseñar tareas que obliguen al estudiante a:</p>
            <ul>
                <li>Debatir la Salida: Usar el texto de la IA como un contrapunto o una propuesta inicial falible.</li>
                <li>Mejorar Críticamente: Identificar errores, debilidades o falta de profundidad en el contenido generado para luego refinarlo y elevarlo al nivel de rigor académico requerido.</li>
            </ul>
        </li>
    </ol>

    <h2>¿Cómo se desarrolla el ciclo de integración de IAGen en el fomento de las habilidades del pensamiento crítico?</h2>

    <p>El desarrollo de esta habilidad se articula a través del Ciclo de Experiencias de Aprendizaje mediadas con IAGen, el cual orienta el trabajo educativo en 6 fases iterativas:</p>

    <h3>Paso 1. Identificar el estado inicial con relación al desarrollo del pensamiento crítico de su grupo curso.</h3>
    <ul>
  <li><strong>Acción del Profesor:</strong> Diagnosticar ¿Cuál es su nivel de PC actual? El diagnóstico debe enfocarse en la disposición a usar la IA y la capacidad de evaluar una fuente de información.</li>
        <li>También es necesario un proceso de autoevaluación con relación a cómo y de qué manera como docente promueve actividades del desarrollo del pensamiento crítico, por ejemplo:
            <ul>
                <li>Los ejercicios que solicita en su asignatura qué habilidades fomentan, de qué manera los monitorea para comprobar las habilidades deseadas.</li>
                <li>Cuando realiza una evaluación distribuye las preguntas o acciones evaluativas en diversas habilidades y complejidad, luego de aplicar la evaluación logra identificar en qué habilidad sus estudiantes son más talentoso y en dónde están los desafíos.</li>
            </ul>
        </li>
        <li>El diagnóstico puede ser una autopercepción de los estudiantes, pero su ojo crítico es fundamental. Teniendo claro este panorama puede determinar su objetivo, su primer desafío.</li>
    </ul>

    <h3>Paso 2. Planificar la experiencia de aprendizaje seleccionada para avanzar en el Pensamiento Crítico.</h3>
    <ul>
        <li>Diseñar una actividad para desarrollar PC, requiere tomar una postura, cuando se usa IAGen con fines educativos las habilidades del PC guían las interacciones con la máquina, por lo tanto, en el uso mediado de la IAGen que el docente organiza busca desafiar a los estudiantes en el análisis, evaluación, argumentación, interpretación, autorregulación, etc..</li>
        <li>Vuelva a revisar el objetivo que ha definido y cómo se articula con su asignatura, planifique una experiencia secuenciada en donde los y las estudiantes tengan diversas acciones como evaluar un producto de la IAGen, comparar productos humanos con los de la máquina, debatir o competir con la máquina en argumentación, solo asignar un rol a la IA en una habilidad y las otras las desarrolla el estudiante o el grupo, etc..</li>
        <li>Defina el objetivo, elabore los indicadores de evaluación, y diseñe los momentos de su clase inicio, desarrollo y cierre.</li>
        <li>Seleccione la herramienta de IAGen a utilizar, los materiales y otros recursos que sean necesarios.</li>
        <li>Diseñe su instrumento de evaluación que contenga los indicadores ya definidos.</li>
    </ul>

    <h3>Paso 3: Ejecutar la experiencia de aprendizaje</h3>
    <ul>
        <li>Ejecute la actividad, el docente debe actuar como facilitador y mediador, monitoreando cómo interactúan los estudiantes con la IAGen.</li>
        <li>Promover y recordar los indicadores de evaluación, reforzar y registrar hallazgos, comentarios u otros que puedan surgir en el proceso.</li>
    </ul>

    <h3>Paso 4: Evaluar la actividad ejecutada.</h3>
    <ul>
        <li>Una vez que culmine la experiencia, dedique un espacio para evaluar en plenario con sus estudiantes los indicadores de evaluación, este momento parte del cierre de la actividad es relevante en su actividad, si no tiene el tiempo necesario postergue la evaluación, pero dedique el tiempo que necesita.</li>
        <li>Formule preguntas para gatillar el diálogo y use el instrumento para evaluar conjuntamente, registre las opiniones, busque mejoras con sus estudiantes.</li>
        <li>Motive a sus estudiantes a seguir utilizando la o las estrategias desarrolladas para usar la IAGen implementando la o las habilidades de PC trabajada.</li>
        <li>Luego, en calma autoevalúe el proceso desde su rol cómo docente, qué ha descubierto, identifique los aciertos y en función de la evaluación conjunta esboce nuevos caminos para la mejora.</li>
    </ul>

    <h3>Paso 5: Asimilación de la experiencia de aprendizaje.</h3>
    <ul>
        <li>Durante un tiempo que sea adecuado, quizás un par de clases posteriores a la experiencia diseñada, monitorea y consulta si han transferido lo aprendido, conecta la o las habilidades trabajadas con otros procesos o formas de abordar y observa si los estudiantes transfieren, hazlos conscientes de la importancia de autodirigir las habilidades del PC.</li>
        <li>Promueve la meta-cognición. Guiar la reflexión sobre lo aprendido: ¿Qué hice yo que la IA no pudo hacer? ¿Cómo mejoró mi capacidad de análisis después de corregir el texto de la IA? ¿De qué manera incorporaré este nuevo conocimiento?, ¿qué he identificado o mejorado sobre cómo ejercer las habilidades del PC.?.</li>
    </ul>

    <h3>Paso 6. Evaluación del ciclo completo.</h3>
    <ul>
        <li>Evaluar el proceso completo, reúnase con los estudiantes y revise el ciclo completo, levante fortalezas y debilidades, identifique oportunidades futuras de mejora.</li>
        <li>¿Se logró el objetivo de PC? ¿La IAGen fue un facilitador o una barrera?</li>
        <li>¿Qué ajustes se necesitan para el próximo ciclo?, ¿qué descubrió en su propia práctica docente?.</li>
        <li>Con este panorama puede iniciar un nuevo ciclo. Este paso asegura la mejora continua de la práctica docente.</li>
    </ul>

    <h3>¿Qué indicadores de evaluación puedo usar para identificar los logros en mi curso?</h3>

    <p>Los indicadores deben centrarse en las habilidades de Faccione y los estándares de Paul &amp; Elder:</p>

    <table>
        <thead>
            <tr>
                <th>Habilidad de Pensamiento Crítico</th>
                <th>Indicadores de Logro en el uso de la IAGen (Conductas Observables) para las y los estudiantes.</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Análisis</td>
                <td>Identifica y desglosa los supuestos implícitos y explícitos en un texto generado por la IAGen.</td>
            </tr>
            <tr>
                <td>Evaluación</td>
                <td>Juzga la credibilidad de las fuentes citadas por la IAGen y valora la fuerza lógica de la evidencia presentada.</td>
            </tr>
            <tr>
                <td>Inferencia / Autorregulación</td>
                <td>Propone y justifica correcciones o mejoras al *output* de la IAGen, demostrando la aplicación de estándares como la precisión y la profundidad.</td>
            </tr>
            <tr>
                <td>Explicación</td>
                <td>Articula una justificación clara de por qué el contenido de la IA es insuficiente o incorrecto, utilizando lenguaje técnico de la disciplina.</td>
            </tr>
        </tbody>
    </table>

    <h2>¿Qué experiencias se pueden trabajar para desarrollar esta habilidad?</h2>

    <table>
        <thead>
            <tr>
                <th>Nombre de la Experiencia</th>
                <th>Descripción Breve</th>
                <th>Habilidad de PC Fomentada</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>El Abogado del Diablo Algorítmico</td>
                <td>Pedir a la IAGen que genere una posición controvertida o un argumento débil sobre un tema de estudio. El estudiante debe analizar las falacias y refutar lógicamente cada punto.</td>
                <td>Análisis, Evaluación, Inferencia.</td>
            </tr>
            <tr>
                <td>Desafío de Relevancia</td>
                <td>Solicitar a la IAGen que elabore un plan de proyecto o un resumen. El estudiante debe identificar la información redundante o irrelevante para el contexto específico y reescribir un *prompt* mejorado.</td>
                <td>Claridad, Precisión, Relevancia.</td>
            </tr>
            <tr>
                <td>El "Caso Alucinado"</td>
                <td>Encargar a la IAGen la creación de una bibliografía sobre un tema. El estudiante debe evaluar y verificar la existencia y la pertinencia de las fuentes citadas, identificando las "alucinaciones" (citas falsas).</td>
                <td>Evaluación, Autorregulación, Precisión.</td>
            </tr>
        </tbody>
    </table>

    <h2>Un ejemplo de experiencia de aprendizaje elaborada con el ciclo.</h2>

  <p><strong>Experiencia:</strong> Análisis Crítico de un Plan de Negocio Generado por IA.</p>

    <ol>
  <li><strong>Identificar:</strong> Los estudiantes de Ingeniería Comercial tienen dificultades para identificar supuestos de mercado no validados. Se define el objetivo: que sean capaces de evaluar la solidez y los supuestos clave de una propuesta.</li>
  <li><strong>Planificar:</strong> El profesor pide a la IAGen que genere un Plan de Negocio detallado para un nuevo producto. La consigna es que la IA omita intencionalmente un análisis de riesgo.</li>
  <li><strong>Ejecutar:</strong> Los estudiantes, en grupos, reciben el Plan de IA. Deben aplicar los estándares de PC para identificar las omisiones críticas (falta de análisis de riesgo, supuestos de crecimiento no justificados, etc.). Luego, deben redactar una carta de inversión donde detallan por qué el plan es insuficiente.</li>
  <li><strong>Evaluar:</strong> El profesor evalúa la carta de inversión, enfocándose en la calidad del análisis crítico y la justificación de las debilidades del plan de IA (Paso 4).</li>
  <li><strong>Asimilación:</strong> Los estudiantes debaten si la IAGen es útil para la ideación inicial, pero no para la validación final. Comprenden que el juicio humano agrega el factor de riesgo y la ética (Paso 5).</li>
    </ol>
      `,
    concepts: ['Reacciones químicas', 'Simulación interactiva'],
    recommendedUse: 'Laboratorio virtual, prácticas de química',
  },
  {
    id: 5,
    title: 'Capítulo 5 - Trabajo Autónomo',
    description:
      'Propone un enfoque para fortalecer el trabajo autónomo en estudiantes universitarios con apoyo de IA generativa. Detalla fases de planificación, ejecución y evaluación individual, destacando el rol de la IA en la organización de tareas, generación de ideas, retroalimentación personalizada y mejora continua del aprendizaje.',
    type: 'CAPÍTULO',
    subject: 'Historia',
    grade: '3° Secundaria',
    isAI: true,
    date: 'Hace 3 días',
    video: videoLinks[5],
    pdf: pdfLinks[5],
    podcast: podcastLinks[5],
      inlineHtml: `
        <h1>Capítulo 5. Trabajo Autónomo</h1>

    <p>Ingresar a la universidad y sostener una formación profesional presenta demandas y desafíos que exigen a los estudiantes equilibrar su desarrollo profesional y personal, sin embargo, tener un equilibrio saludable y armonioso es un dolor académico que a menudo se siente y expresa en sus experiencias estudiantiles. El tiempo fuera de clase se transforma muchas veces en una carga que es compleja distribuir y coordinar adecuadamente. Es recurrente observar dificultades en el manejo del tiempo autónomo para lograr aprendizajes efectivos, profundos y autorregulados, bajo este escenario es donde la IAGen emerge como una aliada estratégica. Este capítulo busca entregar orientaciones para visualizar los apoyos que se pueden entregar a las y los estudiantes integrando experiencias de aprendizaje mediadas con el uso de la IAGen como una extensión personalizada de la presencia y acompañamiento del docente a través de actividades dirigidas con recursos de IA, siempre bajo un uso ético, crítico, consiente y productivo, que permita al estudiante manejar a su favor el uso de IA y no depender de ella para todo.</p>

    <h2>¿Qué es el trabajo autónomo en el contexto universitario?</h2>
    <p>El tiempo autónomo se refiere a los espacios y momentos en que las y los estudiantes en educación superior realizan diversas acciones asociadas a su formación fuera del tiempo de clases formal, la clase. Estas acciones son diversas, tales como: trabajos, investigaciones, estudiar, entre otras, además pueden ser individuales o en colaboración con otros, todas acciones que se orientan a profundizar y fortalecer el aprendizaje.</p>

    <blockquote class="cita">
        <p>"El aprendizaje autónomo es un proceso que requiere de estrategias cognitivas y conductuales que permitan al alumno planificar, organizar y reestructurar sus recursos y contexto para llevar a cabo sus metas" (Romero et. al, 2024, p.11369).</p>
    </blockquote>

    <p>La siguiente definición acuñada por Solorzano (2017: citado por Romero et. al, 2024), describe concretamente este proceso y las características que se deben considerar:</p>

    <blockquote class="cita">
        <p>El aprendizaje autónomo es el proceso intelectual, mediante el cual el sujeto pone en ejecución estrategias cognitivas y metacognitivas, secuenciales, objetivas, procedimentales y formalizadas para obtener conocimientos estratégicos. Este proceso está regido por principios de acción como: un interés manifiesto en razones que motiven la actuación deliberada; el reconocimiento de experiencias de aprendizaje previas; el establecimiento de nuevas relaciones entre aprendizaje-trabajo-vida cotidiana, así como entre teoría y práctica; la identificación de la motivación intrínseca y el desarrollo del potencial personal de la autorregulación (p. 245).</p>
    </blockquote>

    <p>En la era digital, el aprendizaje autónomo es una realidad, la pregunta es, cuál es la calidad de dicho aprendizaje. Este capítulo busca intensionar que dicho aprendizaje sea de calidad, estamos frente a una nueva dimensión del aprendizaje, las y los estudiantes de este siglo pueden tener el control de qué, cuándo y cómo aprender, tienen acceso a la información, procesos, metodologías y evaluaciones, esta flexibilidad, inmediatez y acceso es un gran desafío para la docencia actual, pero exige del aprendiz madurez, competencias digitales, experiencias de aprendizaje modeladas correctamente para que su aprendizaje autónomo sea de calidad, entonces el rol docente actual cobra una nueva dimensión, explicar contenidos no es prioridad, modelar procesos y mediar en la resolución de problemas, acompañar en procesos de análisis y evaluación, cocreación en equipos, entre otras acciones pasan a tomar un rol protagónico en la clase. El aprendizaje digital autónomo es una forma de aprendizaje propia de este siglo (Cruceta, 2025).</p>

    <h3>¿Por qué es necesario que los docentes universitarios orientemos a los estudiantes con relación al uso de la IAGen en su tiempo autónomo para guiar su autoaprendizaje?</h3>

    <p>La IAGen ha demostrado ser eficiente en apoyar procesos personalizados, por lo tanto, es una excelente herramienta para contribuir a estructurar y apoyar a las y los estudiantes en el uso y planificación de su tiempo autónomo, fomentando un aprendizaje autorregulado en donde es posible identificar el error y aprender de ello para la mejora. Nunca en la historia de la humanidad el profesor ha podido dar respuestas en un formato $24/7$ a sus estudiantes, por primera vez la IAGen brinda la oportunidad de estar disponible cuando el estudiante lo requiere, además, personalizar la experiencia del estudiante a su ritmo, nivel de complejidad y volver a consultar o preguntar todas las veces que sea necesario.</p>
    <p>Bajo esta perspectiva un recurso de IAGen seleccionado por el docente o mejor aún, preparado y entrenado por el docente, con orientaciones, contenido y con un modelamiento específico, el estudiante puede aprender en clases bajo la orientación docente y luego transferir a su tiempo autónomo, se transforma en una extensión del docente de asignatura al tiempo y espacio que el estudiante lo demande. (Salgado Montiel &amp; BRUNO AGUIRRE, 2024)</p>
    <p>La IAGen, puede realizar una serie de tareas que optimizan el tiempo autónomo: resumir, profundizar, explicar infinitas veces, realizar esquemas, resúmenes de audio, mapas mentales, otros, un asistente de IAGen diversifica los contenidos de clase y los ajusta al ritmo de cada estudiante, es un colega o par disciplinario con un gran potencial de enseñanza. Estos atributos deben estar direccionados, en dos tiempos, modelar en la clase para que luego el estudiante transfiera en momentos y espacios fuera de la clase.</p>
    <p>En el tiempo de clase se aprende para adquirir habilidad y destreza, es fundamental que los estudiantes experimentan bajo su guía o bajo su acompañamiento ejercicios, acciones que muestren el potencial para el aprendizaje personalizado y así el estudiante tome estas herramientas y las utilice fuera de la clase de manera adecuada. Este modelaje es fundamental para garantizar el acceso y la comprensión del uso para el autoaprendizaje, de esta forma se disminuyen las brechas de alfabetización digital para elevar la eficiencia en el uso de este recurso digital, que no es una moda, ya que se ha instalado en la vida formativa, laboral y doméstica. El gran desafío es que las y los estudiantes identifiquen si el uso se justifica y de qué manera se hace un uso ético, responsable y en pro o a favor del desarrollo de sus habilidades cognitivas, evitando descansar en las respuestas de la máquina y superar este nivel hacia la transformación de su propio aprendizaje, en el fondo es ejercer una autodeterminación adecuada ante la IAGen.</p>
    <p>En conclusión, la invitación es a usar la IAGen como un asistente docente que facilitará el aprendizaje fuera de la clase, para que el tiempo de clase se transforme, se rediseñe a nuevas experiencias de enseñanza y aprendizaje.</p>

    <h3>¿Qué ganamos para el proceso de enseñanza aprendizaje?</h3>
    <p>Se ha demostrado que el uso de la IAGen favorece el aprendizaje autónomo mejorando los aprendizajes de los estudiantes (Quiñones, 2024). La literatura científica ha determinado una correlación positiva entre las estrategias de aprendizaje autorregulado y el rendimiento académico, como también en el rendimiento no académico (Demuner-Flores, 2023), que se relaciona con la satisfacción y compromiso del estudiante por perseverar en tareas que le interesa superar. Cuando se fomenta el aprendizaje autorregulado, los docentes generan indirectamente que las y los estudiantes se sientan más comprometidos y satisfecho con su propio proceso formativo, más aún con los atributos que posee la IAGen en su experiencia de uso.</p>
    <p>La personalización de la IAGen en el aprendizaje transfiere a las y los estudiantes un rol protagónico. Los académicos al promover estas acciones propician en los estudiantes que se transforman en agentes de aprendizaje activos, al incentivar el cuestionamiento y análisis crítico en cada iteración con la IAGen, propiciando una cadena de intercambio positivo para las necesidades e intereses de aprendizaje para cada estudiante.</p>
    <p>Si bien guiar al estudiante para que saque provecho de su tiempo autónomo y logre un aprendizaje autorregulado es una necesidad, al mismo tiempo este aprendizaje se debe comunicar y socializar, por lo tanto, en el tiempo de clase es también importante desarrollar habilidades blandas (Olivera, 2023), que den la oportunidad de compartir los aprendizajes fuera de la clase. Estas habilidades son necesarias para la vida laboral, el conocimiento técnico es importante, pero no tiene sentido si el estudiante, futuro profesional, no sabe cómo relacionarse, compartir, apoyar y utilizar su conocimiento para trabajar en equipo y/o liderar grupos de trabajo.</p>
    <p>Si el asistente IAGen apoya a los estudiantes fuera del tiempo de clase, en la clase el profesor tiene la oportunidad de generar experiencias de mayor nivel de exigencia o profundidad, los docentes pueden rediseñar sus experiencias de clase para profundizar en desafíos reales, crear proyectos, dar espacio a la creatividad u otros procesos para explotar realmente la experiencia, conocimiento y capacidad profesional y humana del profesor en aprendizajes de mayor valor. Introducir paulatinamente la IAGen y cuando sea necesario en el proceso de enseñanza es una oportunidad que se puede aprovechar.</p>

    <h2>¿Qué competencias desarrollan los estudiantes cuando sus profesores guían el tiempo autónomo en su asignatura?</h2>

    <p>La autonomía en el aprendizaje se basa en tres elementos fundamentales: la <strong>reflexión</strong>, <strong>autorregulación</strong> y la <strong>colaboración</strong>. Estas competencias transversales a cualquier disciplina universitaria, si se fomentan y refuerzan preparan a las y los estudiantes para el éxito académico, para desarrollar habilidades blandas y desarrollar una actitud de aprendiz para la vida.</p>

    <p>Estas habilidades no se adquieren de manera espontánea y menos de manera aislada, sino a través de experiencias cíclicas guiadas por un docente (Fuentes et. al, 2023), dicho proceso planteado por los autores citados se resume a continuación:</p>
    <ul>
    <li><strong>Autorregulación.</strong> Es una habilidad que se manifiesta cuando las y los estudiantes toman o asumen un rol activo en su propio aprendizaje. Se define como el control que ejercen sobre su cognición, comportamiento, emociones y motivación por alcanzar los objetivos que se han propuesto, por lo tanto, es posible observar que es capaz de planificar, organizar y gestionar los recursos y herramientas que tiene a su alcance para lograr sus propias metas.</li>
    <li><strong>Reflexión y pensamiento crítico.</strong> La primera habilidad implica pensar de manera profunda y cuidadosa, lo cual se logra por medio de acciones sistemáticas que son un pensamiento organizado y crítico. Estas competencias permiten que las y los estudiantes cuestionen sus propias ideas, evalúen la eficiencia de sus planes, la calidad de sus productos e identifiquen las razones de sus logros o fracasos.</li>
    <li><strong>Colaboración.</strong> No es extraño hablar de habilidades de colaboración, el aprendizaje personal debe ser comunicado con otros, en un proceso de pares o con otros se resuelven temas afines o desafíos comunes, esta colaboración fomenta una interdependencia positiva que desarrolla habilidades interpersonales y de comunicación efectiva que alimentan el proceso interior de los integrantes del grupo. Alimenta el ciclo entre la autorregulación, reflexión y la colaboración.</li>
    </ul>

    <p>De manera complementaria el ciclo de Zimerman, se basa en la teoría sociocognitiva y pone un especial énfasis en como la motivación influye en la autorregulación por aprender (Panadero y Alonso-tapia, 2014). Propone un ciclo que se compone de tres fases interconectadas que pueden ser potenciadas con la mediación modelada del uso de la IAGen.</p>

    <table>
        <thead>
            <tr>
                <th>Fase Zimmerman</th>
                <th>Características</th>
                <th>Mediación de la IAGen</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Premeditación (Forethought)</strong></td>
                <td>Fase inicial en donde las y los estudiantes descomponen la tarea a realizar, evalúan su capacidad de resolver, para establecer objetivos y planes de acción. La motivación es clave y se encuentra influenciada por las emociones que se han genera con experiencias previas, en otras palabras, por su creencia en sí mismo, su confianza para tener éxito. Qué expectativas genera, que valor y orientación asume, ¿establece un plan para la obtener una calificación que le permita aprobar o para aprender en profundidad?</td>
                <td>Un estudiante podría aprender bajo el modelaje del docente como fragmentar tareas o desafíos simples o complejos, esta graduación de complejidad la realiza el estudiante. El apoyo y mediación de la IAGen, puede realizar una descomposición manejable por el estudiante con la finalidad de elaborar un plan ajustado a su ritmo y competencias para facilitar el éxito, basada en la información que entrega el estudiante sobre lo que sí maneja y lo que no comprende.</td>
            </tr>
            <tr>
                <td><strong>Desempeño (Performance)</strong></td>
                <td>Durante esta fase las y los estudiantes ejecutan su plan y despliegan instrucciones internas, gestionan su tiempo, y crean un espacio de estudio favorable como también gestionan o solicitan apoyo. El automonitoreo u observación de su ejecución se divide en un monitoreo cognitivo que evalúa el proceso y el auto registro de sus acciones, documentan su progreso.</td>
                <td>La IAGen puede retroalimentar las tareas generadas en la secuencia de pasos establecidas para las metas individuales. Esto permite ir modificando o profundizando en cada paso. El estudiante puede detener el proceso para hacer consultas y luego volver a la tarea las veces que sean necesarias. Puede solicitar a la IAGen que lo ayude a mantenerse en la tarea, a centrar su atención y otras necesidades que presente el estudiante. Estas acciones deben ser modeladas por el docente para que el estudiante aprenda a sacar el máximo de potencial para su propio proceso.</td>
            </tr>
            <tr>
                <td><strong>Autorreflexión (Self reflection)</strong></td>
                <td>Es esta fase final, las y los estudiantes generan una autoevaluación de su trabajo, se juzgan y explican por qué tuvieron éxito o fracasaron. Se producen dos estados emocionales y cognitivos, generando auto juicio y auto reacción, en función de las causas identificadas, algunos adaptan sus decisiones para mantener su motivación y buscan mejorar, otros, adoptan reacciones o juicios autodefensivos evitando modelos de trabajo generados por el profesor en clases o en estrategias en el grupo de tareas similares en el futuro. Estas reacciones sin dudas van a influenciar premeditadamente el siguiente ciclo de aprendizaje.</td>
                <td>Aquí la IAGen puede ser un excelente aliado, puede simular evaluaciones, cuestionarios de práctica, reforzar ejercicios siguiendo una metodología, practicar una estrategia con casos, etc. De hecho, se genera un ecosistema seguro en donde el estudiante no es sometido a juicio publico si se equivoca, recibe una retroalimentación directa. Para lograr el máximo de eficiencia es necesario apreciar consecuencias y buscan espacios de compartir colaboración.</td>
            </tr>
        </tbody>
    </table>

    <h2>¿Qué aspectos se deben abordar cuando se decide desarrollar esta habilidad en el curso?</h2>

    <p>Es necesario trabajar en la alfabetización digital general y en el uso de la IAGen cómo se ha revisado a lo largo de esta guía. Es fundamental el rol y modelaje del docente y vincular el uso de la IAGen bajo aspectos éticos y responsables en su uso. Y quizás uno de los componentes prioritarios es planificar acciones que sean significativas y articuladas con la disciplina, con la finalidad de el aprendizaje autorregulado tribute a logros para el estudiantes en diversos aspectos de su formación profesional y personal.</p>

    <h3>¿Cómo se desarrolla el ciclo de integración de IAGen en el tiempo autónomo?</h3>

    <p>Para fomentar el aprendizaje autorregulado de calidad en el tiempo autónomo de las y los estudiantes se deben planificar poco a poco experiencias que pueden estar alojadas en la plataforma educativa virtual de la universidad o en recurso digitales que permitan al estudiante ejercitar lo aprendido en clase de manera productiva e idealmente enganchando su motivación por aprender. La invitación es a idear acciones que guíen con éxito a cada integrante del curso, entonces hay que ir paso a paso y evaluando la efectividad del proceso.</p>

    <h3>Paso 1. Identificar el estado inicial con relación al uso del tiempo autónomo en su grupo curso con relación al aprendizaje autorregulado y la calidad de él.</h3>
    <p>Quizás este primer paso sea poco explorado en la experiencia de la mayoría de los académicos universitarios, pero como se ha revisado en el capítulo es una realidad que amenaza el tiempo de clase y la futura autonomía de los profesionales que egresan. Esta etapa busca que cada docente levante e indague sobre los planes de estudio que tienen sus estudiantes, cómo, en qué y de qué manera, usan la IAGen para su aprendizaje autorregulado, qué herramientas utilizan cómo las integran, hay diferencias de uso, qué brechas y fortalezas detecta. Se puede realizar por medio de una encuesta, actividad grupal u otro medio, incluya en esta exploración las experiencias emocionales y el autoconcepto de eficacia en su estudios, recuerde que las experiencias han generado un historial de emociones y auto imagen de su eficiencia, lo cual afecta positiva o negativamente en el aprendizaje autorregulado. Una vez obtenga sus resultados, podrá elaborar su estado o perfil de inicio y determinar un objetivo de trabajo. Ajuste sus metas para ir paso a paso.</p>

    <h3>Paso 2. Planificar experiencia de aprendizaje autónoma mediada con el uso de la IAGen.</h3>
    <p>Planifique una experiencia de aprendizaje. Revise nuevamente el objetivo, determine indicadores de evaluación, luego diseñe o ajuste la actividad, en este caso es recomendable que inicie con una actividad acotada para garantizar éxito y captar el interés, compromiso y aumentar la motivación por este tipo de experiencias. Considere acciones individuales puntuales, como: realizar acciones estructuradas para lograr una búsqueda eficiente, profundizar en un tema siguiendo una secuencia de patrones, realizar un ejercicio siguiendo una estrategia, etc. acciones que le permitan al estudiante replicar lo que observa y practica en clases para luego hacerlo de manera autónoma usando un recurso de IAGen ya determinado o que él o ella elija libremente. Aquí los indicadores de evaluación son claves para que el estudiante pueda auto chequear si logra el objetivo establecido. Considere en el diseño de la actividad un espacio asincrónico o presencial para compartir los resultados y la experiencia, recuerde que es importante desarrollar habilidades blandas en esta dinámica. Determine los materiales o recursos, el tiempo de realización. Diseñe y comparta la pauta de evaluación, la cual puede ser de gran ayuda para que el estudiante replique el paso a paso y registre sus resultados. En la pauta pueden estar incluido ejemplos de prompts, indicadores de autoevaluación y reflexión.</p>

    <h3>Paso 3: Ejecutar la experiencia de aprendizaje</h3>
    <p>Implemente la actividad en la clase para que modele el ejercicio y brinde el tiempo necesario fuera de la clase para que los estudiantes tengan la oportunidad de practicar lo ejercitado en clases. A diferencia de otros capítulos usted no participará presencialmente del desarrollo de la actividad, en el inicio modelo, el desarrollo y cierre se hace fuera de la clase.</p>

    <h3>Paso 4: Evaluar la actividad ejecutada.</h3>
    <p>Cuando haya implementado todos los momentos de su experiencia, inicio, desarrollo y cierre, evalúe la actividad. Levante el reporte de la experiencia de sus estudiantes sobre el trabajo realizado. Rescate buenas prácticas desde su propia autopercepción y motive a que los estudiantes reflexionen sobre su propias mejoras. El foco el fortalecer su autoaprendizaje, no hay experiencias buenas o malas, son procesos personales diversos, sin embargo, retome los indicadores y que el grupo evalúe sus desempeños y ajusten cambios para mejorar en nuevas experiencias, seda el espacio y asuma los desafíos que a usted le corresponden.</p>

    <h3>Paso 5: Asimilación de la experiencia de aprendizaje.</h3>
    <p>Luego de la evaluación, brinde más tiempo para volver a replicar los aprendido en nuevas acciones directamente solicitadas o monitoree si lo aprendido lo están utilizando de manera autónoma. Indague con cautela y refuerce positivamente los intentos y persistencia en sus estudiantes.</p>

    <h3>Paso 6. Evaluación del ciclo completo.</h3>
    <p>Genere un espacio dentro de su clase para evaluar la experiencia, pero desde el inicio del ciclo, con la finalidad de medir el impacto obtenido y cómo se puede avanzar en esta habilidad, busque nuevas ideas o necesidades que señalen sus estudiantes, explore en cocreación conjunta cómo dar el siguiente paso e inicie un nuevo ciclo. Una acción posible es volver al diagnóstico e identificar las mejoras para seleccionar una nueva acción. Pero también, evalué su propia práctica, cuál es su aprendizaje, sus logros e identifique acciones de mejora personales para su docencia.</p>

    <h2>¿Qué indicadores de evaluación puedo usar para identificar los logros en mi curso?</h2>
    <ul>
        <li>Define la tarea a realizar.</li>
        <li>Determina el tiempo a utilizar.</li>
        <li>Organiza su proceso de trabajo de forma clara.</li>
        <li>Utiliza la IA para ajustar su plan, clarificar su plan, otras.</li>
        <li>Evalúa la efectividad de su plan.</li>
        <li>Reflexiona sobre los cambios a realizar para la mejora.</li>
        <li>Evalúa su resultado y desempeño.</li>
    </ul>

    <h2>¿Qué experiencias se pueden trabajar para desarrollar esta habilidad?</h2>
    <ul>
        <li><strong>Micro tutorías con IAGen.</strong> El estudiante dedica un tiempo específico profundizando en el contenido o temáticas de la asignatura realizando preguntas que deja el profesor para complementar la clase. Para esta acción el profesor a diseñado un Chat Bot con bibliografía que él ha seleccionado para su asignatura, con la finalidad de que las respuesta son tengan alucinaciones o contenido inadecuado. Esta iteración permite a las y los estudiantes comprender mejor los contenidos, explorar y/o profundizar según sus intereses y el académico tiene la seguridad de las fuentes en las cuales exploran sus estudiantes.</li>
        <li><strong>Revisiones autónomas de textos con retroalimentación de la IAGen.</strong> En función de preguntas, misiones o plantillas editables elaboradas por el profesor los estudiantes interactúan con un recurso de IAGen como ChatGpt o el asistente virtual de la asignatura y resuelven las acciones solicitadas por el profesor en función de un texto, tema o desafío. Es importante que el profesor oriente y estructure el trabajo del tiempo autónomo, muchos estudiantes necesitan fortalecer su hábitos o rutinas de estudio.</li>
        <li><strong>Autoevaluaciones simuladas con apoyo de un recurso de IAGen o el Chat Bot de la asignatura.</strong> Solicite a sus estudiantes que formulen preguntas de evaluación de textos o temas que usted trabaja en clases con el apoyo de un recurso de IAGen, es importante que realicen preguntas de diversos niveles de complejidad, preguntas literales, inferenciales, valóricas, apreciativas o creativas. Las preguntas que formulen sus estudiantes pueden ser utilizadas para controles sorpresa o para reforzar el aprendizaje. Elaborar preguntas es un ejercicio desafiante para el pensamiento crítico y exige tener diversas miradas ante un tema en particular.</li>
        <li><strong>Plantillas de iteración</strong> para proyectos, lluvia de idea, trabajos comparados (el estudiante compara la respuesta de un ejercicio con la respuesta de la IAGen), resolución de ejercicios pequeños o buscar diferentes puntos de vista ante un mismo hecho. Otros.</li>
    </ul>

    <h2>Un ejemplo de experiencia de aprendizaje elaborada con el ciclo.</h2>

    <table>
        <thead>
            <tr>
                <th colspan="3">Nombre de la actividad: Asistente Virtual del ramo</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="3"><strong>Objetivo:</strong> Construir colaborativamente con los estudiantes del curso un cuaderno para la asignatura utilizando Notebook LM, facilitando el trabajo del tiempo autónomo individual o colaborativo, basado en un recurso pedagógico de calidad y efectivo.</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Indicadores:</strong></td>
            </tr>
            <tr>
                <td colspan="3">
                    <ul>
                        <li>Cada estudiante o en grupos llegan a la clase con la cantidad de textos revisado.</li>
                        <li>Revisan que los textos cumplan los criterios de calidad solicitados.</li>
                        <li>Un integrante por grupo carga el cuaderno.</li>
                        <li>Todos los estudiantes ingresar al cuaderno de la asignatura.</li>
                        <li>Realizan pruebas de uso: resúmenes, preguntas de autoevaluación, podcast, mapas mentales, otros.</li>
                        <li>Todos los estudiantes tienen acceso a la base de datos completa con la cual fue alimentado el cuaderno. Con estos indicadores se construye el instrumento de evaluación de la actividad.</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <th>Inicio</th>
                <th>Desarrollo</th>
                <th>Cierre</th>
            </tr>
            <tr>
                <td>Los estudiantes acceden y conocen los atributos de un cuaderno en la aplicación. Discuten y dialogan sus pro y contras para la asignatura.</td>
                <td>El docente crea el cuaderno para la asignatura. Cada grupo revisa los textos de otro grupo para chequear si los textos cumplen con los criterios de inclusión. Cada grupo sube los textos a la carpeta colectiva de base de datos. Un integrante por grupo sube los documentos seleccionados al cuaderno de la asignatura. Todos acceden al cuaderno y a la base de datos completa. En grupo o en forma individual revisan una herramienta del cuaderno y crean un recurso.</td>
                <td>En plenario cada grupo presenta el recurso creado, lo analizan y evalúan fortalezas y debilidades. Finalmente, evalúan la clase revisando el instrumento de evaluación de la clase y realizan comentarios sobre el potencial educativo y las expectativas.</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Tiempo:</strong> 60 minutos</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Monitoreo:</strong> En este caso se recomienda realizar un monitoreo del uso del cuaderno, durante el semestre solicitar productos para la clase y así monitorear tanto el uso como los apoyos o aportes que ha creado el uso del recurso para la asignatura. El acceso al cuaderno debe estar publicado en la plataforma y asignatura del curso para que todos accedan sin dificultades.</td>
            </tr>
        </tbody>
    </table>
      `,
    concepts: ['Revolución Industrial', 'Línea de tiempo', 'Mapas interactivos'],
    recommendedUse: 'Clases de historia, recursos multimedia',
  },
  {
    id: 6,
    title: 'Capítulo 6 - Trabajo Colaborativo',
    description:
      'Guía práctica para integrar la IA generativa como miembro activo en equipos de trabajo colaborativo universitario. Propone un ciclo de planificación, ejecución y evaluación centrado en habilidades como co-creación, pensamiento crítico y comunicación, con énfasis en el rol ético y estratégico de la IA en procesos de aprendizaje compartido.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: true,
    date: 'Hace 3 días',
  video: videoLinks[6],
  pdf: pdfLinks[6],
  podcast: podcastLinks[6],
    inlineHtml: `
    <h2>Capítulo 6. Trabajo Colaborativo</h2>

    <p>La colaboración efectiva es una habilidad indispensable en el mundo actual. Tanto en la formación universitaria como en el ámbito laboral, no solo es importante trabajar en equipo; también es clave incorporar herramientas tecnológicas para optimizar los procesos colaborativos. El objetivo es gestionar acciones educativas que generen oportunidades en favor de la co-creación y el logro de metas comunes adoptando el uso de la IAGen en el desarrollo de su asignatura. Este capítulo pretende orientar a los académicos de la universidad en el diseño de experiencias de aprendizaje colaborativas, en donde el equipo de estudiantes reflexione y tome decisiones sobre cómo y de qué manera la IAGen sea un miembro más del equipo, contribuyendo a sacar el mejor potencial del grupo. En este contexto, la integración de la IAGen puede ser vista como un miembro más en el equipo, facilitando a sus integrantes la ideación, prototipado, reflexión, puntos de vistas u otros roles que el equipo necesite.</p>

    <h2>¿Qué es el trabajo colaborativo en un contexto de integración de tecnología como la IAGen?</h2>

    <p>En primera instancia, para el presente estudio se entenderá por trabajo colaborativo a todo tipo de actividad interaccional que se puede desarrollar desde una comunidad de trabajo o grupo que tiene como propósito identificar y resolver problemáticas que se reflejen con el diseño, creación, nuevas prácticas, instrumentos o conceptos (Engeström, 2008; 2022; Kurki et al., 2024). Bajo el escenario en donde se permite el uso de la IAGen en la clase y en donde el docente necesita resolver diversos desafíos en su asignatura, una forma potente, atrevida y entretenida de resolver problemas disciplinares es conformando equipos de trabajo. Sin embargo, en estas condiciones es más adecuado decir equipo de análisis que colaboran entre ellos con sus conclusiones, nuevas ideas para elaborar el promt y buscar más puntos de vistas para evaluar e iterar con el integrante del equipo llamado compañero IAGen, que como todos los integrantes de un equipo tiene talentos y atributos que lo hacen aportar al equipo. Posicionándose bajo este nuevo panorama del trabajo de equipo o equipo de análisis desarrollamos este capítulo.</p>

    <blockquote class="cita">
        <p>John Lafkas (2024[JR1]), dice: Si se siente amenazado por la perspectiva de que la IA general reduzca su eficacia docente, calme su ansiedad recordando lo siguiente:</p>
        <ul>
            <li>Las soluciones de IA se basan en predicciones probabilísticas, mientras que la enseñanza de casos consiste en aprender a esperar lo inesperado.</li>
            <li>Las soluciones de IA pueden amplificar su valor como facilitador.</li>
            <li>Las soluciones de IA pueden liberar tiempo para profundizar en el tema y conducir a un aprendizaje más profundo.</li>
        </ul>
    </blockquote>

    <p>En conclusión, la colaboración toma una nueva faceta, el uso de la IAGen no reemplaza la colaboración y tampoco la perjudica, todo lo contrario, la eleva a un estatus superior. A través de su uso se supera el qué, ya que los equipos avanzan a profundizar en por qué y cómo abordar una solución o desarrollar una idea.</p>

    <h2>¿Por qué es necesario abordar y desarrollar las habilidades de colaboración al enfrentar el uso de la IAGen en la docencia universitaria?</h2>

    <p>Bajo este contexto es importante apreciar que la colaboración en un entorno de convivencia con tecnología tiene componentes particulares. La tecnología genera servicios que aumentan la producción y la comunicación del grupo de integrantes, y la IAGen como tecnología emergente multiplica dichas posibilidades. Respecto a las responsabilidades profesionales y tal como es señalado desde el Marco Orientador de Competencias Digitales Docentes (2025), existen diversas competencias digitales que la componen, como lo son: la comunicación, práctica reflexiva, desarrollo profesional, ética profesional y el trabajo colaborativo, todas están en el marco de la competencia del compromiso laboral.</p>

    <p>Por tal motivo, emplear tecnologías digitales para colaborar entre pares (estudiante-estudiante, estudiante-profesor, estudiantes-IAGen y viceversa) brinda la posibilidad del intercambio de conocimientos y experiencias que amplían el aprendizaje tanto individual como colectivo. Además, este tipo de trabajo implica un comportamiento digital ético, la que incluye normas, formas del cómo se aprende, entiende y disposición en poner en práctica cuando se utilizan espacios digitales (Unesco, 2023, p.10). Por su parte, el 2024 se plantearon los Objetivos de Desarrollo Sostenible (Sustainable Development Goals And Disability, SDGs) y las consideraciones éticas de la inteligencia artificial (IA) generativa ofrecen oportunidades únicas para transformar los enfoques pedagógicos tradicionales y promover la colaboración y el pensamiento crítico de los estudiantes. Considerar a la IAGen como un integrante que asume el rol que el equipo necesita es sin dudas u factor facilitador, es un miembro más con diversos talentos y capacidad de adaptarse al rimo y requerimientos del equipo, de ahí la importancia que este proceso sea monitoreado y acompañado por un docente que colabore en potenciar aún más las interacciones de co-creación que se generan en el ecosistema que se conforma al interior de cada equipo (Cruz, 2023[JB2]).</p>

    <h2>¿Qué competencias desarrollan los estudiantes cuando sus profesores favorecen estas habilidades en sus clases?</h2>

    <p>Kurki et al. (2024), en su estudio destacan que se identifican cuatro funciones beneficiosas que entregan el uso de herramientas de IAGen, las que corresponde a: 1) Asistente de tareas, 2) Asistente de participación, 3) Asistente de procesos y 4) Asistente de interacción. El detalle se puede observar en la Tabla 1.</p>

    <h3>Tabla 1. Funciones y beneficios de la Inteligencia Artificial (IA) en el desarrollo colaborativo.</h3>
    <p>Tabla adaptada y traducida del estudio de Kurki et al. (2024)</p>

    <table>
        <thead>
            <tr>
                <th>Función</th>
                <th>Beneficios</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Asistente de tareas</td>
                <td>Resumen, visualización y categorización de las discusiones.</td>
            </tr>
            <tr>
                <td>Asistente de participación</td>
                <td>Apoya la igualdad de contribuciones; Se escucha la voz de todos. Apoya la formación de una visión común (solo desarrolladores de plataformas)</td>
            </tr>
            <tr>
                <td>Asistente de procesos</td>
                <td>Apoya la continuidad del proceso.</td>
            </tr>
            <tr>
                <td>Asistente de interacción</td>
                <td>Estímulo para discusiones adicionales. Categorizaciones, estimular el diálogo, por ejemplo, permite contribuciones a temas interesantes. Admite la creación de sentido (solo desarrolladores de plataformas).</td>
            </tr>
        </tbody>
    </table>

    <p>Considerando estas competencias y aquellas que señala la literatura revisada permite identificar los siguientes atributos que vale la pena revisar y reflexionar cuando la IAGen es un colaborador en el trabajo del equipo.</p>
    <ul>
        <li>La IAGen colabora con el equipo para desbloquear la ideación y potenciar ideas creativas o novedosas, siempre y cuando los demás integrantes o el docente anime a buscar nuevas visiones o caras de la moneda. Puede ofrecer múltiples prototipos basado en las entradas o iteraciones que tiene el equipo. Entonces, potencia al equipo para definir soluciones más ambiciosas o soluciones que se han revisado con mayor profundidad, es posible señalar que el uso de la IAGen facilita escenarios o propuestas para profundizar en la solución que se está configurando como respuesta al problema inicial.</li>
        <li>Aumenta la productividad y la eficiencia, colabora directamente en tareas de búsqueda de información, categorizar, integrar información y realizar resúmenes, tareas que tomaban más tiempo, liberando a los estudiantes para dedicarse a procesos mentales más profundos. Sin embargo, es necesario buscar un equilibrio y en esto los docentes deben estar alertas, hay momentos para decidir cuándo integrar a la IA y en qué momentos debemos decir ahora no es necesario, este trabajo lo debe abordar el estudiante de manera directa.</li>
        <li>Optimiza la gestión de proyectos, puede colaborar en diferentes etapas de un proyecto en función de las necesidades que tenga el equipo, lo importante es que el equipo actúe y trabaje como un equipo analítico en todas las etapas en las cuales colabora la IAGen.</li>
    </ul>

    <h2>¿Qué aspectos se deben abordar cuando se decide desarrollar esta área en el curso?</h2>

    <p>Ruiz-Rojas et al. (2024), señalan que las herramientas de IA generativa como lo son, ChatGPT 4, Tome Al, YOU.COM, Canva, Google Docs y Zoom 6.0.0, en los últimos tiempos han significado un avance en la tecnología educativa, ya que, otorgan tanto al profesorado como a los estudiantes herramientas que contribuyen a diseñar de manera innovadora la interacción con los contenidos de un curso y profundizar en estos. Del mismo modo, si la enseñanza tiene un enfoque desde el aprendizaje colaborativo con la integración de la IAGen fomenta el pensamiento crítico, por ejemplo, un estudio de Li et al. (2024) compara los métodos Humano-Humano y Humano-Máquina con el uso del ChatGPT evidenciaron que los profesores logran eficiencia más significativa acompañada de pensamiento crítico, siendo una recomendación del estudio refinar el andamiaje del aprendizaje colaborativo para optimizar las estrategias educativas asistidas por IAGen. Por tal motivo, las herramientas de la IAGen al basarse en algoritmos avanzados que generan contenidos permiten proporcionar una retroalimentación integrada (siempre verificando las fuentes) y generan oportunidades facilitadoras de interacciones. Algunos estudios, señalan que el trabajo colaborativo es una práctica fundamental que implica esfuerzos conjuntos para lograr objetivos compartidos, por tanto, para lograr una comunicación y que permita el intercambio de ideas entre pares, se requiere de una comunicación efectiva, cooperación entre los integrantes del equipo, la distribución equitativa de las tareas y la capacidad de resolver problemas de manera conjunta, siendo los asistentes digitales facilitadores para el desarrollo colaborativo (Bittner et al., 2021; Thornhill-Miller et al., 2023).</p>

    <p>En concreto cuando integre el uso de la IAGen en el trabajo de equipo de su asignatura promueva las siguientes actitudes y acciones en sus estudiantes:</p>
    <ul>
        <li>Seleccione previamente en qué tipo de actividades será aceptado el uso de la IAGen dentro del trabajo de equipo.</li>
        <li>Dependiendo del objetivo que usted desea desarrollar tiene dos caminos con relación a cuál será el rol de la IAGen dentro del grupo.
            <ul>
                <li>El primer camino, puede ser que el equipo de análisis de colaboración asigne un rol a la IAGen y defina en qué etapas participará y porqué, una vez que el equipo resolvió esta situación inician su trabajo respetando lo acordado.</li>
                <li>El segundo camino, decida usted qué tipo de tareas podrá abordar, resolver o colaborar en el proceso del equipo.</li>
            </ul>
        </li>
        <li>Siempre refuerce y monitoreo el uso responsable, ético, verificación de fuentes, análisis de sesgos y otros relacionados con su disciplina en el trabajo que realiza cada equipo.</li>
    </ul>

    <h2>¿Cómo se desarrolla el ciclo de integración de IAGen en el fomento de las habilidades de colaboración al interior de un equipo de trabajo?</h2>

    <h3>Paso 1. Identificar el estado inicial con relación a cómo será el uso de la IAGen en el trabajo colaborativo de su asignatura</h3>
    <p>Aquí usted evalúa el contexto de sus estudiantes y establece el "por qué" de su actividad, pensando en las habilidades de colaboración que busca desarrollar.</p>
    <p>Realice un diagnóstico inicial de habilidades colaborativas:</p>
    <ul>
    <li><strong>Acción del Profesor:</strong> Reflexione sobre el nivel actual de colaboración de sus estudiantes. ¿Cómo se comunican en grupo? ¿Gestionan bien las discrepancias? ¿Dividen el trabajo de forma equitativa? ¿Cómo usan ya la tecnología para colaborar (si lo hacen)?</li>
    <li><strong>Preguntas Guía:</strong>
            <ul>
                <li>¿En qué aspectos de la colaboración (ej. ideación, consenso, división de roles, feedback) mis estudiantes necesitan desarrollar más habilidades?"</li>
                <li>¿Qué problemas o proyectos en mi asignatura requieren una solución genuinamente colaborativa y podrían beneficiarse de la IAGen como 'facilitador' o 'generador de ideas'?</li>
                <li>¿Cuál será el rol que jugará la IAGen en la colaboración al interior de cada grupo?</li>
            </ul>
        </li>
    </ul>
    <p>Defina el Objetivo de Aprendizaje Específico de la Actividad (Enfoque en Colaboración):</p>
    <ul>
        <li>Formule un objetivo claro y medible para esta actividad, centrándose en el desarrollo de competencias colaborativas y en el programa de su asignatura. Use verbos de acción relacionados con la co-creación, negociación, comunicación grupal, gestión de proyectos compartidos, entre otros.</li>
        <li>Ejemplo: Co-crear una propuesta innovadora para [un problema disciplinar], utilizando la IAGen generando diversas ideas y resumiendo los puntos de acuerdo/desacuerdo dentro del equipo.</li>
    </ul>

    <h3>Paso 2. Planificar la experiencia de aprendizaje seleccionada para avanzar en la colaboración efectiva.</h3>
    <p>Aquí es donde usted estructura la experiencia de aprendizaje, definiendo cómo la IAGen apoyará la colaboración del equipo.</p>
    <p>a.- Contextualice y estructure la actividad:</p>
    <ul>
        <li>Determine el momento óptimo en su Syllabus. Especifique los contenidos de la asignatura que el equipo deberá abordar colaborativamente y las habilidades de colaboración que se desarrollarán. Calcule la duración estimada y el tamaño ideal de los equipos.</li>
        <li>Considere metodologías como el Aprendizaje Basado en Proyectos (ABP), estudios de caso grupales, debates asistidos o desafíos de co-creación.</li>
        <li>Revise el objetivo definido y realice los últimos ajustes, luego determine los indicadores de evaluación para su actividad. Estos indicadores permitirán evaluar el logro de su objetivo de clase y diseñar el instrumento de registro final.</li>
    </ul>
    <p>b.- Seleccione las herramientas de IAGen y diseñe escenarios para la colaboración:</p>
    <ul>
        <li>Elija las herramientas de IAGen pertinentes que faciliten la interacción grupal (ej. IAGen para lluvia de ideas, para resumir diálogos, para generar diferentes perspectivas).</li>
        <li>Diseñe tareas que requieran la interacción del equipo con la IAGen, fomentando la discusión, la toma de decisiones consensuada y la co-creación.</li>
        <li>Ejemplo para ideación colaborativa (Marketing): El equipo debe desarrollar una campaña de marketing para un nuevo producto. Utilicen la IAGen para generar 10 ideas de eslóganes y 5 enfoques de campaña diferentes. Luego, el equipo debe discutir y seleccionar los 3 mejores eslóganes y el mejor enfoque, justificando su decisión."(Fomenta co-creación y negociación).</li>
        <li>Ejemplo para consenso y negociación (Derecho/Salud/Educación): Afronten un dilema ético complejo. Cada miembro del equipo debe usar la IAGen para generar argumentos a favor de dos posturas opuestas. Luego, el equipo debe usar la IAGen para resumir los puntos clave de cada argumento y proponer un punto intermedio o de consenso, que todos los miembros validen. (Fomenta el análisis de perspectivas y resolución de conflictos).</li>
        <li>Ejemplo para el diálogo y análisis grupal (Diseño/Desarrollo de Software): El equipo ha creado un prototipo inicial de una aplicación. Utilicen la IAGen para generar 'feedback' de un usuario potencial sobre el prototipo. El equipo debe discutir este feedback, identificar las mejoras más críticas y planificar su implementación. (Fomenta la comunicación y la toma de decisiones compartida).</li>
        <li>Proporcione a sus estudiantes indicaciones claras sobre qué rol o tarea tendrá la IAGen en un contexto colaborativo y qué actitudes deben asumir ellos: "Discutan los prompts antes de usarlos", "Critiquen las respuestas de la IA como equipo", "Decidan juntos qué usar y qué descartar de la IA".</li>
    </ul>
    <p>c.- Desarrolle las acciones/actividades (Inicio, Desarrollo, Cierre de la Experiencia):</p>
    <ul>
    <li><strong>Inicio de la actividad, formación de equipos y presentación del Desafío.</strong> Forme los equipos. Presente el desafío colaborativo y explique cómo el equipo incorpora en el trabajo el uso de la IAGen. Permita que los equipos se organizan y comprenden la tarea colaborativa que tendrá la IAGen en la actividad.</li>
    <li><strong>Desarrollo de la actividad, colaboración Asistida por IAGen.</strong> Durante esta fase, su rol es de observación activa y facilitación de la dinámica de equipo. Monitoree cómo interactúan los equipos con la IAGen y entre sí. Intervenga para guiar la discusión o el uso de la IAGen, no para resolver el problema por ellos. Los equipos trabajan colaborativamente en la tarea, utilizando la IAGen según los escenarios diseñados. Discuten las sugerencias de la IA, negocian ideas, dividen el trabajo y co-crean el producto final. Respetan el rol asignado inicialmente a la IAGen dentro del equipo. Deben registrar cómo la IAGen facilitó o desafió su colaboración.</li>
    <li><strong>Momento de Cierre. Presentación del producto o solución colaborativa y reflexión grupal.</strong> Facilite la presentación de los productos colaborativos. Luego, guíe una reflexión grupal sobre el proceso de colaboración, el rol de la IAGen y los aprendizajes sobre el trabajo en equipo. Los equipos presentan su trabajo final y luego, en una sesión o informe, reflexionan sobre:
            <ul>
                <li>¿Cómo la IAGen facilitó la co-creación o la resolución de conflictos en nuestro equipo?</li>
                <li>¿Qué desafíos encontramos al integrar la IAGen en nuestra colaboración y cómo los superamos?</li>
                <li>¿Qué estrategias de comunicación o división de tareas funcionaron mejor en nuestro equipo?</li>
                <li>Si tuviéramos que repetir esta actividad, ¿cómo usaríamos la IAGen de forma diferente para mejorar nuestra colaboración?</li>
            </ul>
        </li>
    </ul>
    <p>d.- Elabore un instrumento de evaluación</p>
    <ul>
        <li>Diseñe una rúbrica o pauta que evalúe tanto el producto final grupal como el proceso colaborativo y el uso estratégico de la IAGen en el equipo.</li>
    </ul>

    <h3>Paso 3: Ejecutar la experiencia de aprendizaje</h3>
    <p>Esta es la fase de implementación de su planificación en el aula o entorno de aprendizaje.</p>
    <ul>
        <li>Durante la actividad, observe las dinámicas de los equipos. Promueva la discusión, la escucha activa y la negociación. La IAGen debe ser una chispa para la interacción humana, no un reemplazo de ella.</li>
        <li>Asegúrese de que la tarea sea lo suficientemente compleja como para que la colaboración sea necesaria y el uso de la IAGen sea un recurso compartido por todo el equipo.</li>
        <li>Supervise que la IAGen se use de forma colaborativa y que todos los miembros entiendan cómo se integra en las contribuciones individuales. Que los miembros del equipo analizan y evalúan ética y críticamente las iteraciones.</li>
        <li>Registre situaciones que llamen su atención, novedades, hallazgos, otros. Utilice su instrumento de evaluación y planificación para monitorear el proceso de su actividad.</li>
    </ul>

    <h3>Paso 4: Evaluar la actividad ejecutada.</h3>
    <p>Esta fase es crucial para que los estudiantes consoliden sus habilidades colaborativas y para que usted mejore sus futuras actividades.</p>
    <ul>
        <li>Evalúe los entregables y el proceso colaborativo utilizando el instrumento de evaluación diseñado, en un diálogo abierto que propicie la participación de los equipos con la intención de comprobar el grado de cumplimiento del objetivo de la clase. Al finalizar proporcione retroalimentación específica sobre las fortalezas observadas, áreas de mejora en la colaboración y el uso de la IAGen con estos fines.</li>
        <li>Verifique que los equipos hayan respetado o declarado explícitamente cómo y con qué propósito utilizaron la IAGen en su trabajo.</li>
        <li>En este paso la pregunta clave es: ¿Se cumplió el objetivo de la actividad?, ¿la colaboración al interior de cada equipo fue eficiente y en pro del objetivo?</li>
    </ul>

    <h3>Paso 5: Asimilación de la experiencia de aprendizaje.</h3>
    <ul>
        <li>Recuerde que es necesario tiempo y práctica para instalar y transferir aprendizajes, la colaboración es una habilidad de que trabaja en función de las experiencias y sus resultados.</li>
        <li>Luego de la actividad verifique o consulte si las técnicas aprendidas o acciones trabajadas en los equipos las siguen utilizando, cómo ha evolucionado este proceso, qué rol están asignado a la IAGen en sus tareas de colaboración, han logrado respetar el rol asignado a la IAGen y no depender en todo momento de la IAGen para sus trabajos en equipo.</li>
        <li>También monitoree su propia evolución, ideas preconcebidas y hallazgos, registre sus conclusiones o acciones.</li>
    </ul>

    <h3>Paso 6. Evaluación del ciclo completo.</h3>
    <ul>
        <li>Reflexione sobre la efectividad de la actividad para fomentar la colaboración con IAGen. Considere tanto el éxito del producto final de su primera actividad cómo en la asimilación de sus estudiantes.</li>
    <li><strong>Preguntas Orientadoras para la Evaluación del Ciclo:</strong>
            <ul>
                <li>¿Los estudiantes demostraron una mejora en sus habilidades de co-creación, comunicación y resolución de conflictos?</li>
                <li>¿La IAGen fue un catalizador efectivo para la colaboración, o generó algún desafío inesperado en la dinámica grupal?</li>
                <li>¿Qué estrategias específicas de uso de la IAGen para la colaboración funcionaron mejor y cuáles no?</li>
                <li>¿Cómo puedo diseñar futuras actividades para profundizar aún más la colaboración, utilizando la IAGen de formas más avanzadas?</li>
            </ul>
        </li>
        <li>Finalmente utilice los aprendizajes de sus estudiantes y los personales para ajustar futuras planificaciones, ya sea refinando esta actividad o diseñando nuevas, reiniciando así el ciclo de mejora continua.</li>
    </ul>

    <h2>¿Qué indicadores de evaluación puedo usar para identificar los logros en mi curso?</h2>
    <p>Es necesario centrase en la colaboración de los integrantes y cómo el uso de la IAGen en el proceso de enseñanza y aprendizaje ha facilitado las habilidades de colaboración como: comunicación, participación, escucha atenta, respeto por opiniones diferentes, preocupación por el cumplimento de tareas y por el desarrollo de cada miembro del equipo, entre otras habilidades que se esperan de la colaboración al interior de un equipo de trabajo.</p>
    <p>Algunos criterios como ejemplo:</p>
    <ul>
        <li>El equipo evalúa críticamente los productos de la IAGen.</li>
        <li>El equipo crea prompt de manera colaborativa con la finalidad de mejorar la eficiencia, buscando nuevas opciones, impactos otros.</li>
        <li>El equipo propone otras visiones o puntos de vistas para evaluar el contenido de la IAGen y seguir escalando o profundizando en el proceso.</li>
        <li>El equipo logra resolver el problema inicial.</li>
        <li>El producto final ha vivido un ciclo de mejorar, tras sucesivas iteraciones cada vez más efectivas.</li>
        <li>El equipo respeta el rol asignado al compañero IAGen, con la finalidad de no solo depender de sus talentos y potenciar los propios.</li>
    </ul>
    <p>*Recuerde que los indicadores de evaluación deben estar en coherencia con el objetivo y deben ser definidos en la segunda etapa.</p>

    <h2>¿Qué experiencias se pueden trabajar para desarrollar esta habilidad?</h2>
    <p>Algunas ideas globales para liberar la imaginación.</p>

    <h3>Tema: Abordando planes de tratamiento.</h3>
    <ul>
    <li><strong>¿Qué hace el integrante IA?</strong> La IAgen actúa como un asistente médico inteligente. Le das la información de un paciente (su historia, exámenes, etc.) y ella te propone un borrador de plan de tratamiento. Piensa en ella como una herramienta que te ayuda a encontrar las mejores opciones de medicinas, terapias y dietas, y te advierte si hay algún riesgo, como dos medicinas que no se llevan bien.</li>
    <li><strong>¿Qué hace el equipo analítico?</strong> Los estudiantes se convierten en "expertos" que revisan el plan propuesto por la IA. En grupo, analizan cada parte del tratamiento para ver si es la mejor opción. Usan libros y estudios médicos para comprobarlo, identificando los puntos buenos y malos del plan. Luego, lo modifican y explican por qué hicieron esos cambios, defendiendo su versión final como la mejor para el paciente.</li>
    </ul>

    <h3>Tema: Creando diseños más resistentes y baratos con la IA.</h3>
    <ul>
    <li><strong>¿Qué hace el integrante IA?</strong> La IAGen es como un laboratorio de pruebas virtual. Los estudiantes le dan el diseño de una pieza y la IA la analiza para ver si se romperá fácilmente, si hay partes débiles o si se podría hacer más ligera o barata. Es una herramienta para jugar con el diseño, probando diferentes materiales y formas para ver cuál funciona mejor.</li>
    <li><strong>¿Qué hace el equipo analítico?</strong> Los estudiantes dibujan una pieza inicial en la computadora y se la dan a la IA. Con las sugerencias de la IA, la mejoran poco a poco, haciendo cambios para que sea más fuerte, más ligera o barata de producir. Al final, presentan un informe mostrando el diseño final y explican por qué lo cambiaron, comparándolo con el diseño original para demostrar que su versión mejorada es la mejor.</li>
    </ul>

    <h3>Tema: Creando una marca única.</h3>
    <ul>
    <li><strong>¿Qué rol se asigna al integrante IA?</strong> La IAgen es tu compañero creativo. Le das una idea de marca (nombre, a quién va dirigida, sus valores, etc.) y ella te muestra muchas ideas de logotipos, colores y tipos de letra. También puede crear ejemplos rápidos de cómo se vería la marca en una página web, en una taza o en redes sociales.</li>
    <li><strong>¿Qué hace el equipo analítico?</strong> Los estudiantes primero escriben una descripción detallada de la marca que quieren crear. Luego, usan la IA para ver muchas ideas, pero no se quedan con la primera que les gusta. En vez de eso, eligen las mejores ideas y las perfeccionan a mano o de manera digital, dándoles un toque personal que la IA no puede dar. Presentan el resultado final, explicando cómo usaron la IA como una herramienta para generar ideas, pero que la verdadera creatividad y decisión estratégica fueron suyas.</li>
    </ul>

    <h2>Un ejemplo de experiencia de aprendizaje elaborada con el ciclo.</h2>
    <p>Planificación 6. Creando a partir de un marco legal. Intervención y sensibilización</p>

    <table>
        <thead>
            <tr>
                <th>Objetivo</th>
                <th>Indicadores</th>
                <th>Recursos de IAGen seleccionados</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Elaborar un prototipo o diseño general de un producto identificando alcances y desafíos (Plan de intervención, sensibilización o manual de buenas prácticas), producto del análisis crítico de un marco legal o normativo relevante para su disciplina, colaborativamente en equipo.</td>
                <td>
                    <ul>
                        <li>Identifican y sintetizan correctamente los puntos clave del marco legal o normativo asignado, incluyendo su propósito y principales disposiciones.</li>
                        <li>Diseñan una propuesta de acción coherente y viable que aborda los desafíos o las oportunidades identificadas en el análisis del marco legal.</li>
                        <li>Presentan de manera clara y colaborativa los hallazgos de su análisis y plan de acción, demostrando los roles que cada integrante del equipo asumió en el trabajo de equipo.</li>
                    </ul>
                </td>
                <td>
                    <ul>
                        <li>Gemini</li>
                        <li>Napkin ia</li>
                        <li>Canva</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <th>Inicio</th>
                <th>Desarrollo</th>
                <th>Cierre</th>
            </tr>
            <tr>
                <td>
                    <p>Se presenta el objetivo de la clase y la importancia del marco legal a trabajar en función de su impacto en la disciplina en áreas relevantes (ley laboral, educativa, salud, etc.).</p>
                    <p>Se forman los grupos y se asignan roles en los integrantes, se comparte pauta de evaluación. Como también cada grupo podría asumir un desafío diferente que al final del proceso se crea una doble cadena de colaboración (Campaña de difusión y educación, normativa de implementación, intervención, etc.).</p>
                </td>
                <td>
                    <p>Cada grupo inicia su trabajo siguiendo los pasos de la pauta entregada por el profesor. En función de sus roles se organizan e inician su trabajo siguiendo los pasos respectivos.</p>
                    <p>Asignan a cada paso un tiempo específico para lograr el desafío. Esta planificación puede durar solo una clase o dos dependiendo de la profundidad que se asigne al desafío.</p>
                    <p>En este momento de la clase los estudiantes deben tener la oportunidad de asignar a la IAGen una función, evaluar sus propuestas e integrar sus propias ideas, análisis y co-creaciones.</p>
                    <p>Organizan sus presentación al plenario.</p>
                </td>
                <td>
                    <p>Cada grupo presenta su trabajo siguiendo un orden estratégico que el profesor define.</p>
                    <p>Se brinda el espacio para consultas comentarios de los estudiantes primero y luego el docente.</p>
                    <p>Se cierra la clase reflexionando sobre el trabajo y su impacto, pero a la vez sobre el proceso y el trabajo realizado con el apoyo de la IAGen, identificando fortalezas y mejoras futuras.</p>
                </td>
            </tr>
            <tr>
                <td colspan="3"><strong>Tiempo:</strong> 60 minutos</td>
            </tr>
            <tr>
                <td colspan="3"><strong>Monitoreo:</strong> En este caso se recomienda realizar un monitoreo del uso del cuaderno, durante el semestre solicitar productos para la clase y así monitorear tanto el uso como los apoyos o aportes que ha creado el uso del recurso para la asignatura. El acceso al cuaderno debe estar publicado en la plataforma y asignatura del curso para que todos accedan sin dificultades.</td>
            </tr>
        </tbody>
    </table>
    `,
    concepts: ['Revolución Industrial', 'Línea de tiempo', 'Mapas interactivos'],
    recommendedUse: 'Clases de historia, recursos multimedia',
  },
  {
    id: 7,
    title: 'Capítulo 7 - Creatividad',
    description:
      'Guía para diseñar experiencias colaborativas en el aula integrando IA generativa como miembro activo del equipo.',
    type: 'CAPÍTULO',
    subject: 'Educación universitaria / Transversal',
    grade: 'N/A',
    isAI: true,
    date: 'Hace 3 días',
  video: videoLinks[7],
  pdf: pdfLinks[7],
  podcast: podcastLinks[7],
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
];

export function getMaterialById(id: number): Material | undefined {
  return materials.find((m) => m.id === id);
}
