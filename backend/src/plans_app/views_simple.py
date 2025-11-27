import json
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from .models import Planificacion, FeedbackValidacion

ERR_AUTH = {'error': 'Authentication required'}
ERR_JSON = {'error': 'Invalid JSON'}
ERR_TITULO = {'error': 'Titulo is required'}


def _plan_to_dict(plan: Planificacion):
    """Convierte una planificación a diccionario para JSON"""
    return {
        'id': plan.id,
        'titulo': plan.titulo,
        'descripcion': plan.descripcion,
        'estado': plan.estado,
        'asignatura': plan.asignatura,
        'nivel_educativo': plan.nivel_educativo,
        'curso': plan.curso,
        'unidad_tematica': plan.unidad_tematica,
        'duracion_horas': plan.duracion_horas,
        'objetivo_general': plan.objetivo_general,
        'objetivos_especificos': plan.objetivos_especificos,
        'competencias_disciplinares': plan.competencias_disciplinares,
        'competencias_genericas': plan.competencias_genericas,
        'metodologia': plan.metodologia,
        'estrategias_ensenanza': plan.estrategias_ensenanza,
        'recursos_materiales': plan.recursos_materiales,
        'instrumentos_evaluacion': plan.instrumentos_evaluacion,
        'criterios_evaluacion': plan.criterios_evaluacion,
        'contenido_tematico': plan.contenido_tematico,
        'actividades_aprendizaje': plan.actividades_aprendizaje,
        'feedback_ia': plan.feedback_ia,
        'sugerencias_mejora': plan.sugerencias_mejora,
        'validacion_final': plan.validacion_final,
        'version': plan.version,
        'creado_en': plan.creado_en.isoformat(),
        'actualizado_en': plan.actualizado_en.isoformat(),
    }


@csrf_exempt
@require_http_methods(["GET"])
def mis_planificaciones(request):
    """Obtiene todas las planificaciones del usuario"""
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    
    plans = Planificacion.objects.filter(owner=request.user)
    return JsonResponse({'results': [_plan_to_dict(p) for p in plans]}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def crear_planificacion(request):
    """Crea una nueva planificación desde el formulario"""
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(ERR_JSON, status=400)

    titulo = (payload.get('titulo') or '').strip()
    if not titulo:
        return JsonResponse(ERR_TITULO, status=400)

    plan = Planificacion.objects.create(
        owner=request.user,
        titulo=titulo,
        descripcion=payload.get('descripcion', ''),
        asignatura=payload.get('asignatura', ''),
        nivel_educativo=payload.get('nivel_educativo', ''),
        curso=payload.get('curso', ''),
        unidad_tematica=payload.get('unidad_tematica', ''),
        duracion_horas=payload.get('duracion_horas'),
        objetivo_general=payload.get('objetivo_general', ''),
        objetivos_especificos=payload.get('objetivos_especificos', []),
        competencias_disciplinares=payload.get('competencias_disciplinares', []),
        competencias_genericas=payload.get('competencias_genericas', []),
        metodologia=payload.get('metodologia', ''),
        estrategias_ensenanza=payload.get('estrategias_ensenanza', []),
        recursos_materiales=payload.get('recursos_materiales', []),
        instrumentos_evaluacion=payload.get('instrumentos_evaluacion', []),
        criterios_evaluacion=payload.get('criterios_evaluacion', ''),
        contenido_tematico=payload.get('contenido_tematico', {}),
        actividades_aprendizaje=payload.get('actividades_aprendizaje', []),
        estado='borrador'
    )
    
    return JsonResponse(_plan_to_dict(plan), status=201)


@csrf_exempt
@require_http_methods(["POST"])
def validar_planificacion_ia(request, plan_id: int):
    """Placeholder para validación con IA"""
    return JsonResponse({'message': 'Funcionalidad en desarrollo'}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def generar_pdf_planificacion(request, plan_id: int):
    """Placeholder para generación de PDF"""
    return JsonResponse({'message': 'Funcionalidad en desarrollo'}, status=200)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "DELETE"])
def planificacion_detalle(request, plan_id: int):
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    plan = get_object_or_404(Planificacion, id=plan_id, owner=request.user)

    if request.method == 'GET':
        return JsonResponse(_plan_to_dict(plan))

    if request.method == 'PATCH':
        return _patch_plan(request, plan)

    if request.method == 'DELETE':
        plan.delete()
        return JsonResponse({'message': 'Deleted'})

    return HttpResponseNotAllowed(["GET", "PATCH", "DELETE"])


def _patch_plan(request, plan: Planificacion):
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(ERR_JSON, status=400)
    if 'titulo' in payload:
        t = (payload.get('titulo') or '').strip()
        if not t:
            return JsonResponse(ERR_TITULO, status=400)
        plan.titulo = t
    if 'descripcion' in payload:
        plan.descripcion = payload.get('descripcion') or ''
    if 'contenido' in payload:
        plan.contenido = payload.get('contenido') or {}
    plan.save()
    return JsonResponse(_plan_to_dict(plan))