from django.contrib import admin
from django.urls import path, include
from .views import healthz

# Versionamiento: nueva raíz /api/v1/ manteniendo compatibilidad con rutas existentes
api_v1_patterns = [
    path('auth/', include('auth_app.urls')),
    path('plans/', include('plans_app.urls')),
    path('chat/', include('chat_app.urls')),
    path('rag/', include('rag_proxy.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('healthz', healthz),
    # Nuevas rutas versionadas
    path('api/v1/', include((api_v1_patterns, 'api_v1'))),
    # Alias legacy (transición) - eliminar cuando frontend migre completamente
    path('api/auth/', include('auth_app.urls')),
    path('api/plans/', include('plans_app.urls')),
    path('api/chat/', include('chat_app.urls')),
    path('api/rag/', include('rag_proxy.urls')),
]
