# Correcciones para Safari (iOS y Mac) - Cookies y Autenticación

## Problema Identificado

Safari (tanto en iOS como en Mac) es más estricto con cookies cross-origin que otros navegadores. Los problemas comunes incluyen:

1. **Cookies SameSite=None requieren HTTPS**: Safari rechaza cookies SameSite=None en HTTP
2. **Cookies sin dominio específico**: iOS puede rechazar cookies que no tienen un dominio explícito
3. **CSRF tokens no se envían**: Safari bloquea cookies de terceros más agresivamente
4. **Session cookies perdidas**: Las cookies de sesión no persisten entre requests

## Cambios Implementados

### Backend (`backend/src/config/settings.py`)

1. **Configuración mejorada de cookies**:
   ```python
   SESSION_COOKIE_DOMAIN = os.environ.get('COOKIE_DOMAIN', None)
   CSRF_COOKIE_DOMAIN = os.environ.get('COOKIE_DOMAIN', None)
   SESSION_COOKIE_SECURE = not DEBUG  # True en producción
   CSRF_COOKIE_SECURE = not DEBUG
   SESSION_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'
   CSRF_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'
   SESSION_COOKIE_HTTPONLY = True
   CSRF_COOKIE_HTTPONLY = False  # JS debe poder leer CSRF
   SESSION_COOKIE_PATH = '/'
   CSRF_COOKIE_PATH = '/'
   
   # NUEVO: Configuración adicional crítica para Safari
   SESSION_COOKIE_AGE = 86400  # 24 horas
   SESSION_SAVE_EVERY_REQUEST = True  # Renovar en cada request
   SESSION_ENGINE = 'django.contrib.sessions.backends.db'
   ```

2. **Nuevos Middlewares Personalizados** (`backend/src/config/safari_middleware.py`):
   - `SafariCookieMiddleware`: Fuerza que las cookies de sesión se envíen en cada respuesta
   - `CORSCredentialsMiddleware`: Asegura headers CORS correctos para Safari
   - Agregan headers `Vary: Cookie, Origin` para cacheo correcto
   - Establecen cookies explícitamente en cada response

3. **Endpoint para CSRF token** (`backend/src/auth_app/views.py`):
   - Nuevo endpoint: `GET /api/v1/auth/csrf/`
   - Fuerza el envío de cookie CSRF antes de cualquier POST
   - Usa decorador `@ensure_csrf_cookie`

4. **Login mejorado para Safari** (`backend/src/auth_app/views.py`):
   ```python
   response.set_cookie(
       key='sessionid',
       value=request.session.session_key,
       max_age=86400,  # Explícito para Safari
       secure=not DEBUG,
       httponly=True,
       samesite='None' if not DEBUG else 'Lax',
       path='/'  # Explícito para Safari
   )
   # Headers adicionales
   response['Vary'] = 'Cookie, Origin'
   response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
   ```

### Frontend (`frontend/src/utils/csrf.ts`)

1. **Nuevas utilidades para Safari**: 
   - `initializeCSRFToken()`: Obtiene CSRF token antes del login
   - `getCSRFTokenFromCookie()`: Lee CSRF de cookies
   - `diagnoseCookieIssues()`: Diagnóstico para debugging
   - `isSafariBrowser()`: Detecta si es Safari (Mac o iOS)
   - `waitForCookies(ms)`: Espera para que Safari procese cookies

2. **AuthContext actualizado** (`frontend/src/contexts/AuthContext.tsx`):
   ```typescript
   const login = async (email: string, password: string) => {
     // CRÍTICO para Safari: Inicializar CSRF token primero
     await initializeCSRFToken();
     
     const resp = await fetch(loginUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password }),
       credentials: 'include',  // Enviar cookies
     });
     
     if (resp.ok) {
       // CRÍTICO para Safari: Esperar a que procese cookies
       if (isSafariBrowser()) {
         await waitForCookies(500);
       }
       
       // Continuar con carga de perfil...
     }
   };
   ```

### Deployment (`backend/cloudbuild.yaml`)

1. **Nueva variable de entorno**:
   ```yaml
   _COOKIE_DOMAIN: ''  # Vacío para permitir cualquier dominio
   ```

## Cómo Probar en Safari

### Opción 1: Safari en iPhone/iPad o Mac

1. **Abrir Safari en iOS**
2. **Navegar a la URL de producción**: `https://frontend-xxxxx.run.app`
3. **Intentar login**:
   - Email: `admin123@uss.cl`
   - Password: tu contraseña
4. **Verificar que funcione**:
   - El login debe completarse sin errores
   - Debes ser redirigido a `/materiales`
   - Las planificaciones deben guardarse correctamente

### Opción 2: Inspector Web iOS (desde Mac)

1. **En iPhone**: Configuración → Safari → Avanzado → Inspector Web (activar)
2. **En Mac**: Safari → Preferencias → Avanzado → Mostrar menú Desarrollar
3. **Conectar iPhone a Mac con cable**
4. **En Mac Safari**: Desarrollar → [Tu iPhone] → [Sitio web]
5. **Ver console logs**: Busca mensajes de `diagnoseCookieIssues()`

### Opción 3: Simulador iOS (Xcode)

```bash
# En Mac con Xcode instalado
open -a Simulator
# En el simulador, abrir Safari y navegar a tu URL
```

## Debugging en iOS

### Ver diagnóstico de cookies (en consola del navegador)

```javascript
// Pegar en consola de Safari iOS
console.log(document.cookie);
```

Deberías ver algo como:
```
sessionid=abc123...; csrftoken=xyz789...
```

### Verificar requests (Network tab en Inspector)

1. **Abrir Inspector Web** (desde Mac)
2. **Ir a Network tab**
3. **Hacer login**
4. **Verificar request a `/api/v1/auth/login/`**:
   - Headers → Request Headers → Cookie: debe incluir `csrftoken`
   - Headers → Response Headers → Set-Cookie: debe incluir `sessionid`

### Problemas comunes y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| "Invalid credentials" siempre | Cookie de sesión no se guarda | Verificar que HTTPS esté activo |
| "CSRF token missing" | iOS bloqueó cookie CSRF | El nuevo endpoint `/api/v1/auth/csrf/` lo resuelve |
| "Not authenticated" después de login | Cookie sessionid no persiste | Verificar `credentials: 'include'` en fetch |
| Planificaciones no se guardan | Sesión perdida entre requests | Verificar que todas las APIs usen `credentials: 'include'` |

## Checklist de Despliegue

- [x] Backend: Configuración de cookies actualizada
- [x] Backend: SESSION_SAVE_EVERY_REQUEST activado
- [x] Backend: Middlewares Safari creados (SafariCookieMiddleware, CORSCredentialsMiddleware)
- [x] Backend: Endpoint `/api/v1/auth/csrf/` creado
- [x] Backend: Login view mejorado con headers adicionales
- [x] Frontend: Utilidades Safari en `csrf.ts` (`isSafariBrowser`, `waitForCookies`)
- [x] Frontend: AuthContext espera cookies en Safari
- [x] Deployment: Variable `COOKIE_DOMAIN` añadida
- [x] **COMPLETADO**: Backend desplegado (Build: 34647e5e-f330-4ee3-b19c-39a6cadd0d2a)
- [x] **COMPLETADO**: Frontend desplegado (Build: d8727874-8327-44d9-ae10-2f14dd5ffb9e)
- [ ] **PENDIENTE**: Probar en Safari Mac
- [ ] **PENDIENTE**: Probar en Safari iOS

## Comandos de Despliegue

### Backend
```powershell
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\backend"
gcloud builds submit --config=cloudbuild.yaml
```

### Frontend
```powershell
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\frontend"
gcloud builds submit --config=cloudbuild.yaml
```

## Verificación Post-Despliegue

1. **Verificar CSRF endpoint**:
   ```bash
   curl -v https://backend-django-xxxxx.run.app/api/v1/auth/csrf/
   # Debe retornar Set-Cookie con csrftoken
   ```

2. **Verificar login**:
   ```bash
   curl -v -X POST https://backend-django-xxxxx.run.app/api/v1/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"email":"admin123@uss.cl","password":"tupassword"}' \
     --cookie-jar cookies.txt
   # Debe retornar Set-Cookie con sessionid
   ```

3. **Probar en iOS Safari**: Seguir pasos de "Cómo Probar en iOS"

## Notas Adicionales

- **HTTPS es obligatorio**: SameSite=None requiere Secure=True, que requiere HTTPS
- **Cloud Run usa HTTPS por defecto**: No hay cambios necesarios
- **COOKIE_DOMAIN vacío**: Permite que las cookies funcionen en cualquier dominio (localhost, *.run.app, etc.)
- **CORS_ALLOW_ALL_ORIGINS=1**: Necesario temporalmente, considerar restringir en producción

## Referencias

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Safari Cookie Behavior](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- [Django CSRF Protection](https://docs.djangoproject.com/en/5.0/ref/csrf/)
