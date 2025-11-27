from django.urls import path
from . import views
from . import views_asistente_ia


urlpatterns = [
    path('mis/', views.mis_planificaciones, name='mis_planificaciones'),
    path('crear/', views.crear_planificacion, name='crear_planificacion'),
    path('<int:plan_id>/', views.planificacion_detalle, name='planificacion_detalle'),
    path('<int:plan_id>/validar/', views.validar_planificacion_ia, name='validar_planificacion_ia'),
    path('<int:plan_id>/pdf/', views.generar_pdf_planificacion, name='generar_pdf_planificacion'),
    
    # Planificaciones con Asistente IA
    path('asistente-ia/', views_asistente_ia.planificaciones_ia_list, name='planificaciones_ia_list'),
    path('asistente-ia/<int:pk>/', views_asistente_ia.planificacion_ia_detail, name='planificacion_ia_detail'),
    path('asistente-ia/<int:pk>/validar/', views_asistente_ia.validar_planificacion_ia, name='validar_ia'),
    path('asistente-ia/<int:pk>/pdf/', views_asistente_ia.generar_pdf_planificacion_ia, name='generar_pdf_ia'),
]
