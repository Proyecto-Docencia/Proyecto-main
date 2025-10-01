from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/plans/', include('plans_app.urls')),
    path('api/chat/', include('chat_app.urls')),
    path('api/rag/', include('rag_proxy.urls')),
]
