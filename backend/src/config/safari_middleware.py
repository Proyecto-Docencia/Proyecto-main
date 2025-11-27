"""
Middleware para mejorar compatibilidad con Safari (Mac e iOS)
Safari es extremadamente estricto con cookies cross-origin
"""
from django.conf import settings


class SafariCookieMiddleware:
    """
    Middleware que garantiza que las cookies se envíen correctamente en Safari.
    Safari bloquea cookies third-party incluso con SameSite=None si no hay
    interacción previa del usuario.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Si el usuario está autenticado, asegurar que la cookie de sesión se envíe
        if request.user.is_authenticated and hasattr(request, 'session'):
            # Forzar que la sesión se guarde (importante para Safari)
            request.session.modified = True
            
            # Agregar headers adicionales para Safari
            response['Vary'] = 'Cookie'
            
            # Si no está en DEBUG, asegurar cookies cross-origin para Safari
            if not settings.DEBUG:
                # Establecer explícitamente la cookie de sesión en la respuesta
                # Esto ayuda a Safari a reconocer la cookie
                if request.session.session_key:
                    response.set_cookie(
                        key=settings.SESSION_COOKIE_NAME,
                        value=request.session.session_key,
                        max_age=settings.SESSION_COOKIE_AGE,
                        expires=None,
                        path=settings.SESSION_COOKIE_PATH,
                        domain=settings.SESSION_COOKIE_DOMAIN,
                        secure=settings.SESSION_COOKIE_SECURE,
                        httponly=settings.SESSION_COOKIE_HTTPONLY,
                        samesite=settings.SESSION_COOKIE_SAMESITE,
                    )
        
        return response


class CORSCredentialsMiddleware:
    """
    Middleware que asegura headers CORS correctos para Safari.
    Safari requiere que Access-Control-Allow-Credentials sea explícito.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Asegurar que Safari pueda enviar cookies
        origin = request.META.get('HTTP_ORIGIN')
        if origin and not settings.DEBUG:
            # Solo para cross-origin requests
            response['Access-Control-Allow-Credentials'] = 'true'
            
            # Safari necesita Vary para cachear correctamente
            vary_header = response.get('Vary', '')
            if 'Origin' not in vary_header:
                response['Vary'] = f"{vary_header}, Origin".strip(', ')
        
        return response
