from django.urls import path
from .views import (
    test_chat,
    mis_chats, 
    crear_chat,
    mis_sesiones,
    crear_sesion,
    obtener_sesion,
)

urlpatterns = [
    # Test endpoint
    path("test/", test_chat, name="test_chat"),
    
    # Endpoints de sesiones (nuevo)
    path("sesiones/", mis_sesiones, name="mis_sesiones"),
    path("sesiones/crear/", crear_sesion, name="crear_sesion"),
    path("sesiones/<int:sesion_id>/", obtener_sesion, name="obtener_sesion"),
    
    # Endpoints legacy (mantener compatibilidad)
    path("mis/", mis_chats, name="mis_chats"),
    path("crear/", crear_chat, name="crear_chat"),
]
