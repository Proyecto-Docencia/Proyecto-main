document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS DE EJEMPLO (Aquí es donde subes tus documentos) ---
    const documentos = [
        {
            id: 1,
            titulo: "Estrategias de Aprendizaje Activo",
            resumen: "Fomenta la participación estudiantil mediante técnicas interactivas y colaborativas.",
            contenido: `
                <h3>Introducción al Aprendizaje Activo</h3>
                <p>El aprendizaje activo es un enfoque pedagógico que involucra a los estudiantes en el proceso de aprendizaje a través de actividades y/o discusiones en clase, en lugar de escucharlos pasivamente en una exposición. Este método enfatiza la importancia de que los estudiantes "hagan" cosas y piensen en lo que están haciendo.</p>
                <h4>Técnicas Comunes:</h4>
                <ul>
                    <li><strong>Piensa-Pareja-Comparte (Think-Pair-Share):</strong> Los estudiantes piensan individualmente sobre una pregunta, luego la discuten con un compañero y finalmente comparten sus ideas con toda la clase.</li>
                    <li><strong>Aula Invertida (Flipped Classroom):</strong> Los estudiantes revisan el material de la lección (videos, lecturas) antes de la clase, y el tiempo en el aula se dedica a ejercicios, proyectos o discusiones.</li>
                    <li><strong>Aprendizaje Basado en Problemas (PBL):</strong> Los estudiantes trabajan en grupos para resolver un problema complejo y abierto, lo que los impulsa a buscar conocimiento y aplicarlo.</li>
                </ul>
            `,
            bibliografia: "Freeman, S., et al. (2014). Active learning increases student performance in science, engineering, and mathematics. Proceedings of the National Academy of Sciences."
        },
        {
            id: 2,
            titulo: "Evaluación Formativa en el Aula",
            resumen: "Técnicas para monitorear el progreso del estudiante y ajustar la enseñanza en tiempo real.",
            contenido: `
                <h3>El Poder de la Evaluación Formativa</h3>
                <p>A diferencia de la evaluación sumativa (como los exámenes finales), la evaluación formativa es un proceso continuo que ayuda a profesores y estudiantes a entender el nivel de comprensión actual. Su objetivo es proporcionar retroalimentación para mejorar el aprendizaje, no solo para calificar.</p>
                 <h4>Ejemplos Prácticos:</h4>
                <ul>
                    <li><strong>Boletos de Salida (Exit Tickets):</strong> Al final de la clase, los estudiantes responden una o dos preguntas cortas sobre la lección. Esto le da al profesor una visión rápida de la comprensión general.</li>
                    <li><strong>Cuestionarios de Bajo Riesgo:</strong> Pequeños quizzes que no tienen un gran peso en la calificación final, pero que ayudan a los estudiantes a practicar y al profesor a identificar áreas de dificultad.</li>
                    <li><strong>Autoevaluación y Coevaluación:</strong> Fomentar que los estudiantes evalúen su propio trabajo y el de sus compañeros con rúbricas claras.</li>
                </ul>
            `,
            bibliografia: "Black, P., & Wiliam, D. (1998). Assessment and Classroom Learning. Assessment in Education: Principles, Policy & Practice."
        },
        // AÑADE MÁS DOCUMENTOS AQUÍ
    ];

    // --- MANEJO DE LA NAVEGACIÓN ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const headerTitle = document.getElementById('headerTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            headerTitle.textContent = link.textContent;

            contentSections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // --- SECCIÓN MATERIAL ---
    const materialGrid = document.querySelector('.material-grid');
    const materialDetailView = document.getElementById('material-detail');
    const detailTitle = document.getElementById('detail-title');
    const detailContent = document.getElementById('detail-content');
    const closeDetailBtn = document.getElementById('close-detail');
    const playAudioBtn = document.getElementById('play-audio');

    function cargarMaterial() {
        materialGrid.innerHTML = '';
        documentos.forEach(doc => {
            const block = document.createElement('div');
            block.className = 'material-block';
            block.setAttribute('data-id', doc.id);
            block.innerHTML = `
                <h3>${doc.titulo}</h3>
                <p>${doc.resumen}</p>
            `;
            block.addEventListener('click', () => mostrarDetalle(doc.id));
            materialGrid.appendChild(block);
        });
    }

    function mostrarDetalle(id) {
        const doc = documentos.find(d => d.id === id);
        if (doc) {
            detailTitle.textContent = doc.titulo;
            detailContent.innerHTML = doc.contenido;
            materialGrid.style.display = 'none';
            materialDetailView.style.display = 'block';
        }
    }
    
    closeDetailBtn.addEventListener('click', () => {
        materialGrid.style.display = 'grid';
        materialDetailView.style.display = 'none';
        speechSynthesis.cancel(); // Detiene el audio si se está reproduciendo
    });

    playAudioBtn.addEventListener('click', () => {
        const textoParaLeer = detailContent.innerText;
        if ('speechSynthesis' in window && textoParaLeer) {
            const utterance = new SpeechSynthesisUtterance(textoParaLeer);
            utterance.lang = 'es-ES';
            speechSynthesis.cancel(); // Cancela cualquier audio previo
            speechSynthesis.speak(utterance);
        } else {
            alert('La síntesis de voz no es compatible con tu navegador o no hay texto que leer.');
        }
    });

    // --- SECCIÓN BIBLIOGRAFÍA ---
    const bibliografiaList = document.getElementById('bibliografia-list');
    function cargarBibliografia() {
        bibliografiaList.innerHTML = '';
        documentos.forEach(doc => {
            const item = document.createElement('li');
            item.textContent = doc.bibliografia;
            bibliografiaList.appendChild(item);
        });
    }

    // --- SECCIÓN PERFIL DOCENTE ---
    const perfilForm = document.getElementById('perfilForm');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formInputs = perfilForm.querySelectorAll('input:not([readonly])');

    editBtn.addEventListener('click', () => {
        formInputs.forEach(input => input.disabled = false);
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
    });
    
    perfilForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formInputs.forEach(input => input.disabled = true);
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        // Aquí podrías guardar los datos en localStorage o enviarlos a un servidor
        alert('Perfil actualizado con éxito.');
    });

    // --- INICIALIZACIÓN ---
    function init() {
        // Mostrar nombre de usuario
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            document.getElementById('userDisplayName').textContent = `Bienvenido, ${userEmail.split('@')[0]}`;
        }
        
        cargarMaterial();
        cargarBibliografia();
    }

    init();
});
