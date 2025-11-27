"""
Vistas para el módulo de Planificaciones con Asistente IA
"""
import json
import io
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from .models import PlanificacionAsistenteIA


def _planificacion_ia_to_dict(plan: PlanificacionAsistenteIA):
    """Convierte una planificación IA a diccionario para JSON"""
    return {
        'id': plan.id,
        'estado': plan.estado,
        'datos_generales': plan.datos_generales,
        'diagnostico_estudiantes': plan.diagnostico_estudiantes,
        'habilidades_propias': plan.habilidades_propias,
        'objetivo_actividad': plan.objetivo_actividad,
        'contexto_temporalidad': plan.contexto_temporalidad,
        'herramientas_iagen': plan.herramientas_iagen,
        'metodologia_estrategia': plan.metodologia_estrategia,
        'indicadores_evaluacion': plan.indicadores_evaluacion,
        'inicio_clase': plan.inicio_clase,
        'desarrollo_clase': plan.desarrollo_clase,
        'cierre_clase': plan.cierre_clase,
        'pilares_eticos': plan.pilares_eticos,
        'registro_implementacion': plan.registro_implementacion,
        'evaluacion_experiencia': plan.evaluacion_experiencia,
        'acciones_posteriores': plan.acciones_posteriores,
        'facilitadores_obstaculos': plan.facilitadores_obstaculos,
        'reflexion_practica': plan.reflexion_practica,
        'feedback_ia': plan.feedback_ia,
        'capitulos_validados': plan.capitulos_validados,
        'ultima_validacion': plan.ultima_validacion,
        'creado_en': plan.creado_en.isoformat(),
        'actualizado_en': plan.actualizado_en.isoformat(),
        'owner_email': plan.owner.email,
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def planificaciones_ia_list(request):
    """
    GET: Lista todas las planificaciones del usuario
    POST: Crea una nueva planificación
    """
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    if request.method == 'GET':
        planificaciones = PlanificacionAsistenteIA.objects.filter(owner=request.user)
        return JsonResponse({
            'planificaciones': [_planificacion_ia_to_dict(p) for p in planificaciones],
            'total': planificaciones.count()
        })
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        # Crear nueva planificación
        planificacion = PlanificacionAsistenteIA.objects.create(
            owner=request.user,
            estado=data.get('estado', 'borrador'),
            datos_generales=data.get('datos_generales', ''),
            diagnostico_estudiantes=data.get('diagnostico_estudiantes', ''),
            habilidades_propias=data.get('habilidades_propias', ''),
            objetivo_actividad=data.get('objetivo_actividad', ''),
            contexto_temporalidad=data.get('contexto_temporalidad', ''),
            herramientas_iagen=data.get('herramientas_iagen', ''),
            metodologia_estrategia=data.get('metodologia_estrategia', ''),
            indicadores_evaluacion=data.get('indicadores_evaluacion', ''),
            inicio_clase=data.get('inicio_clase', ''),
            desarrollo_clase=data.get('desarrollo_clase', ''),
            cierre_clase=data.get('cierre_clase', ''),
            pilares_eticos=data.get('pilares_eticos', ''),
            registro_implementacion=data.get('registro_implementacion', ''),
            evaluacion_experiencia=data.get('evaluacion_experiencia', ''),
            acciones_posteriores=data.get('acciones_posteriores', ''),
            facilitadores_obstaculos=data.get('facilitadores_obstaculos', ''),
            reflexion_practica=data.get('reflexion_practica', ''),
        )
        
        return JsonResponse({
            'message': 'Planificación creada exitosamente',
            'planificacion': _planificacion_ia_to_dict(planificacion)
        }, status=201)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def planificacion_ia_detail(request, pk):
    """
    GET: Obtiene una planificación específica
    PUT: Actualiza una planificación
    DELETE: Elimina una planificación
    """
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    planificacion = get_object_or_404(PlanificacionAsistenteIA, pk=pk, owner=request.user)
    
    if request.method == 'GET':
        return JsonResponse(_planificacion_ia_to_dict(planificacion))
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        # Actualizar campos
        for field in ['estado', 'datos_generales', 'diagnostico_estudiantes', 'habilidades_propias',
                      'objetivo_actividad', 'contexto_temporalidad', 'herramientas_iagen',
                      'metodologia_estrategia', 'indicadores_evaluacion', 'inicio_clase',
                      'desarrollo_clase', 'cierre_clase', 'pilares_eticos',
                      'registro_implementacion', 'evaluacion_experiencia', 'acciones_posteriores',
                      'facilitadores_obstaculos', 'reflexion_practica']:
            if field in data:
                setattr(planificacion, field, data[field])
        
        planificacion.save()
        
        return JsonResponse({
            'message': 'Planificación actualizada exitosamente',
            'planificacion': _planificacion_ia_to_dict(planificacion)
        })
    
    elif request.method == 'DELETE':
        planificacion.delete()
        return JsonResponse({'message': 'Planificación eliminada exitosamente'})


@csrf_exempt
@require_http_methods(["POST"])
def validar_planificacion_ia(request, pk):
    """
    POST: Valida una planificación con IA y guarda el feedback
    """
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    planificacion = get_object_or_404(PlanificacionAsistenteIA, pk=pk, owner=request.user)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    feedback = data.get('feedback', '')
    capitulos = data.get('capitulos', [])
    
    # Agregar al historial de feedback
    validacion_entry = {
        'fecha': planificacion.actualizado_en.isoformat(),
        'feedback': feedback,
        'capitulos': capitulos
    }
    
    planificacion.feedback_ia.append(validacion_entry)
    planificacion.ultima_validacion = feedback
    planificacion.capitulos_validados = capitulos
    planificacion.estado = 'validada'
    planificacion.save()
    
    return JsonResponse({
        'message': 'Validación guardada exitosamente',
        'planificacion': _planificacion_ia_to_dict(planificacion)
    })


@csrf_exempt
@require_http_methods(["GET"])
def generar_pdf_planificacion_ia(request, pk):
    """Genera y descarga la planificación IA como PDF"""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    plan = get_object_or_404(PlanificacionAsistenteIA, pk=pk, owner=request.user)
    
    try:
        # Importar reportlab para generar PDF
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
        from reportlab.lib import colors
        from reportlab.lib.units import inch
        
        # Crear buffer de memoria para el PDF
        buffer = io.BytesIO()
        
        # Crear documento PDF
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=36)
        
        # Definir estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1,  # Centro
            textColor=colors.HexColor('#2563eb'),
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=13,
            spaceAfter=12,
            spaceBefore=16,
            textColor=colors.HexColor('#1f2937'),
            fontName='Helvetica-Bold'
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=12,
            leading=14
        )
        
        # Construir contenido del PDF
        story = []
        
        # Título principal
        story.append(Paragraph("PLANIFICACIÓN CON ASISTENTE IA", title_style))
        story.append(Spacer(1, 20))
        
        # Función helper para agregar secciones
        def add_section(title, content):
            if content and content.strip():
                story.append(Paragraph(title, heading_style))
                story.append(Paragraph(content.replace('\n', '<br/>'), normal_style))
                story.append(Spacer(1, 8))
        
        # Secciones del formulario
        add_section("I. DATOS GENERALES", plan.datos_generales)
        add_section("II. DIAGNÓSTICO DE ESTUDIANTES", plan.diagnostico_estudiantes)
        add_section("III. HABILIDADES PROPIAS DEL DOCENTE", plan.habilidades_propias)
        add_section("IV. OBJETIVO DE LA ACTIVIDAD", plan.objetivo_actividad)
        add_section("V. CONTEXTO Y TEMPORALIDAD", plan.contexto_temporalidad)
        add_section("VI. HERRAMIENTAS DE IA GENERATIVA", plan.herramientas_iagen)
        add_section("VII. METODOLOGÍA Y ESTRATEGIA", plan.metodologia_estrategia)
        add_section("VIII. INDICADORES DE EVALUACIÓN", plan.indicadores_evaluacion)
        
        # Momentos de la clase
        story.append(Paragraph("IX. DESARROLLO DE LA CLASE", heading_style))
        add_section("Inicio", plan.inicio_clase)
        add_section("Desarrollo", plan.desarrollo_clase)
        add_section("Cierre", plan.cierre_clase)
        
        # Ética y reflexión
        add_section("X. PILARES ÉTICOS", plan.pilares_eticos)
        add_section("XI. REGISTRO DE IMPLEMENTACIÓN", plan.registro_implementacion)
        add_section("XII. EVALUACIÓN DE LA EXPERIENCIA", plan.evaluacion_experiencia)
        add_section("XIII. ACCIONES POSTERIORES", plan.acciones_posteriores)
        add_section("XIV. FACILITADORES Y OBSTÁCULOS", plan.facilitadores_obstaculos)
        add_section("XV. REFLEXIÓN SOBRE LA PRÁCTICA", plan.reflexion_practica)
        
        # Validación IA si existe
        if plan.ultima_validacion:
            story.append(PageBreak())
            story.append(Paragraph("VALIDACIÓN CON IA", title_style))
            story.append(Spacer(1, 20))
            
            if plan.capitulos_validados:
                story.append(Paragraph("Capítulos consultados:", heading_style))
                for cap in plan.capitulos_validados:
                    story.append(Paragraph(f"• {cap}", normal_style))
                story.append(Spacer(1, 12))
            
            story.append(Paragraph("Retroalimentación:", heading_style))
            story.append(Paragraph(plan.ultima_validacion.replace('\n', '<br/>'), normal_style))
        
        # Información de pie de página
        story.append(Spacer(1, 30))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=8,
            textColor=colors.grey,
            alignment=1
        )
        story.append(Paragraph(f"Documento generado el {plan.actualizado_en.strftime('%d/%m/%Y %H:%M')}", footer_style))
        story.append(Paragraph(f"Estado: {plan.estado.upper()}", footer_style))
        
        # Construir PDF
        doc.build(story)
        
        # Preparar respuesta
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        
        # Nombre del archivo
        nombre_archivo = plan.datos_generales[:50] if plan.datos_generales else f"Planificacion_IA_{plan.id}"
        nombre_archivo = "".join(c for c in nombre_archivo if c.isalnum() or c in (' ', '_', '-')).strip()
        
        response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}.pdf"'
        
        return response
        
    except ImportError:
        return JsonResponse({
            'error': 'La biblioteca ReportLab no está instalada. Ejecuta: pip install reportlab'
        }, status=500)
    except Exception as e:
        return JsonResponse({
            'error': f'Error al generar PDF: {str(e)}'
        }, status=500)
