# Problema de Autenticación Cross-Origin Resuelto

## 🔍 Problema Identificado

Cuando el frontend se conectaba al backend en **local**, funcionaba porque:
- Frontend: `http://localhost:5179`
- Backend: `http://localhost:8000` 
- Ambos en **mismo dominio** (`localhost`) = **Same-Origin**

Pero al desplegar el backend a **Google Cloud Run**:
- Frontend: `http://localhost:5179`
- Backend: `https://backend-django-a6zccy3fma-uc.a.run.app`
- **Dominios diferentes** = **Cross-Origin**

## ❌ Error Específico

El backend retornaba **401 Unauthorized** porque:

1. **Faltaban configuraciones de cookies para cross-origin**
   - Las sesiones de Django usan cookies
   - Por defecto, las cookies NO se comparten entre dominios diferentes
   - El navegador bloqueaba las cookies del backend

2. **Configuración requerida para cross-origin con HTTPS:**
   ```python
   SESSION_COOKIE_SECURE = True      # Requiere HTTPS
   SESSION_COOKIE_SAMESITE = 'None'  # Permite cross-origin
   CSRF_COOKIE_SECURE = True         # Requiere HTTPS
   CSRF_COOKIE_SAMESITE = 'None'     # Permite cross-origin
   ```

## ✅ Solución Implementada

### Cambios en `backend/src/config/settings.py`

```python
# Configuración de cookies para cross-origin (necesario para frontend en dominio diferente)
SESSION_COOKIE_SECURE = not DEBUG  # True en producción (HTTPS)
SESSION_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'  # None permite cross-origin con HTTPS
SESSION_COOKIE_HTTPONLY = True  # Protección XSS
CSRF_COOKIE_SECURE = not DEBUG  # True en producción (HTTPS)
CSRF_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'  # None permite cross-origin con HTTPS
CSRF_COOKIE_HTTPONLY = False  # JavaScript debe leer CSRF token
```

### Explicación de cada configuración:

1. **`SESSION_COOKIE_SECURE = True`**
   - Requiere HTTPS para enviar la cookie
   - Protege contra ataques man-in-the-middle
   - Cloud Run usa HTTPS automáticamente ✅

2. **`SESSION_COOKIE_SAMESITE = 'None'`**
   - Permite que la cookie se envíe en requests cross-origin
   - **CRÍTICO** para que frontend en `localhost` pueda autenticarse con backend en `.run.app`
   - Requiere `SECURE = True` (solo funciona con HTTPS)

3. **`SESSION_COOKIE_HTTPONLY = True`**
   - JavaScript NO puede leer esta cookie
   - Protección contra XSS (Cross-Site Scripting)
   - La cookie solo se envía automáticamente con las requests

4. **`CSRF_COOKIE_SECURE = True`**
   - Igual que SESSION, requiere HTTPS

5. **`CSRF_COOKIE_SAMESITE = 'None'`**
   - Permite enviar el CSRF token cross-origin

6. **`CSRF_COOKIE_HTTPONLY = False`**
   - JavaScript **SÍ** puede leer esta cookie
   - Necesario para que el frontend pueda obtener el CSRF token y enviarlo en headers

## 🔐 Valores según entorno

```python
# En DESARROLLO (DEBUG=1):
SESSION_COOKIE_SECURE = False    # HTTP está OK
SESSION_COOKIE_SAMESITE = 'Lax'  # Permite same-site
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_SAMESITE = 'Lax'

# En PRODUCCIÓN (DEBUG=0):
SESSION_COOKIE_SECURE = True     # Requiere HTTPS
SESSION_COOKIE_SAMESITE = 'None' # Permite cross-origin
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
```

## 📊 Comparación: Local vs Cloud Run

| Aspecto | Local (funcionaba) | Cloud Run (fallaba) | Cloud Run (corregido) |
|---------|-------------------|---------------------|----------------------|
| **Dominio Frontend** | localhost:5179 | localhost:5179 | localhost:5179 |
| **Dominio Backend** | localhost:8000 | *.run.app | *.run.app |
| **Protocolo** | HTTP | HTTPS | HTTPS |
| **Same-Origin?** | ✅ Sí | ❌ No | ❌ No |
| **Cookies funcionan?** | ✅ Sí | ❌ No | ✅ Sí |
| **SameSite** | Lax (default) | Lax (bloqueado) | None ✅ |
| **Secure** | No requerido | Requerido | True ✅ |

## 🚀 Próximos pasos

1. ✅ **Redeployar backend** con nuevas configuraciones
2. 🔄 **Crear usuario de prueba** en la base de datos
3. ✅ **Verificar login** desde el frontend

## 📝 Credenciales de Prueba

Para probar la autenticación:
```
Email: test@docente.uss.cl
Contraseña: Test123456
```

## 🔗 Referencias

- [Django CORS Settings](https://pypi.org/project/django-cors-headers/)
- [SameSite Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Secure Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
