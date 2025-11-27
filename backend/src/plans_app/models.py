from django.db import models
from django.conf import settings


class Planificacion(models.Model):
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('en_validacion', 'En Validación'),
        ('validada', 'Validada'),
        ('finalizada', 'Finalizada'),
    ]
    
    # Información básica
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='planificaciones')
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    
    # Campos del formulario principal
    asignatura = models.CharField(max_length=200, blank=True)
    nivel_educativo = models.CharField(max_length=100, blank=True)
    curso = models.CharField(max_length=50, blank=True)
    unidad_tematica = models.CharField(max_length=200, blank=True)
    duracion_horas = models.IntegerField(null=True, blank=True)
    
    # Objetivos y competencias
    objetivo_general = models.TextField(blank=True)
    objetivos_especificos = models.JSONField(default=list, blank=True)
    competencias_disciplinares = models.JSONField(default=list, blank=True)
    competencias_genericas = models.JSONField(default=list, blank=True)
    
    # Metodología y evaluación
    metodologia = models.TextField(blank=True)
    estrategias_ensenanza = models.JSONField(default=list, blank=True)
    recursos_materiales = models.JSONField(default=list, blank=True)
    instrumentos_evaluacion = models.JSONField(default=list, blank=True)
    criterios_evaluacion = models.TextField(blank=True)
    
    # Contenido estructurado y actividades
    contenido_tematico = models.JSONField(default=dict, blank=True)
    actividades_aprendizaje = models.JSONField(default=list, blank=True)
    
    # Validación y feedback IA
    feedback_ia = models.JSONField(default=list, blank=True)  # Historial de feedback
    sugerencias_mejora = models.TextField(blank=True)
    validacion_final = models.BooleanField(default=False)
    
    # Metadatos
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)


class PlanificacionAsistenteIA(models.Model):
    """Modelo para planificaciones creadas con el Asistente IA"""
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('completada', 'Completada'),
        ('validada', 'Validada con IA'),
    ]
    
    # Relación con usuario
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='planificaciones_ia')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    
    # Identificación General (Pregunta 1)
    datos_generales = models.TextField(blank=True, help_text='Carrera, asignatura, semestre, etc.')
    
    # Etapa 1: Diagnóstico (Preguntas 2-3)
    diagnostico_estudiantes = models.TextField(blank=True, help_text='Conocimientos y brechas de estudiantes en IAGen')
    habilidades_propias = models.TextField(blank=True, help_text='Autoevaluación docente')
    
    # Paso 2: Planificar el Diseño (Preguntas 4-12)
    objetivo_actividad = models.TextField(blank=True, help_text='Objetivo claro y medible')
    contexto_temporalidad = models.TextField(blank=True, help_text='Contexto y temporalidad de la experiencia')
    herramientas_iagen = models.TextField(blank=True, help_text='Herramientas IAGen y escenarios')
    metodologia_estrategia = models.TextField(blank=True, help_text='Metodología o estrategia didáctica')
    indicadores_evaluacion = models.TextField(blank=True, help_text='Indicadores de evaluación')
    inicio_clase = models.TextField(blank=True, help_text='Inicio de la clase')
    desarrollo_clase = models.TextField(blank=True, help_text='Desarrollo de la clase')
    cierre_clase = models.TextField(blank=True, help_text='Cierre de la clase')
    pilares_eticos = models.TextField(blank=True, help_text='Aspectos éticos y de integridad académica')
    
    # Paso 3: Ejecutar (Pregunta 13)
    registro_implementacion = models.TextField(blank=True, help_text='Registro de la implementación')
    
    # Paso 4: Evaluar (Pregunta 17)
    evaluacion_experiencia = models.TextField(blank=True, help_text='Evaluación de la experiencia')
    
    # Paso 5: Asimilación (Pregunta 18)
    acciones_posteriores = models.TextField(blank=True, help_text='Acciones de consolidación')
    
    # Paso 6: Evaluación del Ciclo (Preguntas 19-20)
    facilitadores_obstaculos = models.TextField(blank=True, help_text='Facilitadores y obstáculos')
    reflexion_practica = models.TextField(blank=True, help_text='Reflexión sobre la práctica')
    
    # Validación con IA
    feedback_ia = models.JSONField(default=list, blank=True, help_text='Historial de validaciones con IA')
    capitulos_validados = models.JSONField(default=list, blank=True, help_text='Capítulos usados en validación')
    ultima_validacion = models.TextField(blank=True, help_text='Último feedback de IA')
    
    # Metadatos
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-actualizado_en']
        verbose_name = 'Planificación con Asistente IA'
        verbose_name_plural = 'Planificaciones con Asistente IA'
    
    def __str__(self):
        titulo = self.datos_generales[:50] if self.datos_generales else f'Planificación {self.id}'
        return f"{titulo} - {self.owner.email}"


class FeedbackValidacion(models.Model):
    """Modelo para almacenar el historial de feedback de validación"""
    planificacion = models.ForeignKey(Planificacion, on_delete=models.CASCADE, related_name='validaciones')
    feedback_texto = models.TextField()
    puntuacion = models.FloatField(null=True, blank=True)  # Puntuación de 1-10
    aspectos_positivos = models.JSONField(default=list, blank=True)
    aspectos_mejorar = models.JSONField(default=list, blank=True)
    sugerencias = models.JSONField(default=list, blank=True)
    alineamiento_capitulos = models.JSONField(default=dict, blank=True)  # Alineamiento con cap 1-7
    creado_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-creado_en']

    def __str__(self):
        return f"Feedback para {self.planificacion.titulo} - {self.creado_en.strftime('%d/%m/%Y')}"

