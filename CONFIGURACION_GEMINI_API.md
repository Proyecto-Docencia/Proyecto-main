# Configuración de Gemini AI en el Backend

## 🤖 API Key de Gemini Configurada

Se ha agregado la API key de Gemini al backend desplegado en Google Cloud Run.

### Detalles de la API Key

- **Clave de API**: `AIzaSyAaBzjJ7nqxMtBd9GvTvAnGeTO7YQzbhIk`
- **Nombre**: token_ia
- **Proyecto**: projects/678953086053
- **Número del proyecto**: 678953086053

### ⚙️ Configuración Aplicada

#### 1. Variable de Entorno en Cloud Run

Se agregó `GEMINI_API_KEY` a las variables de entorno en `cloudbuild.yaml`:

```yaml
--update-env-vars
- GEMINI_API_KEY=${_GEMINI_API_KEY}

substitutions:
  _GEMINI_API_KEY: 'AIzaSyAaBzjJ7nqxMtBd9GvTvAnGeTO7YQzbhIk'
```

#### 2. Uso en el Código

El servicio de IA (`backend/src/chat_app/ai_service.py`) ya está configurado para usar la variable:

```python
API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client() if os.environ.get("GEMINI_API_KEY") else None
```

### 📊 Modelo Configurado

- **Modelo**: `gemini-1.5-flash` (configurable con `GEMINI_MODEL`)
- **Thinking Budget**: `0` (desactivado para respuestas rápidas)

### 🎯 Funcionalidad

El asistente de IA ahora puede:
- Responder preguntas sobre material educativo
- Ayudar con planificaciones de clases
- Asistir en temas académicos
- Generar contenido educativo

### 🔒 Seguridad

**⚠️ IMPORTANTE**: La API key está hardcodeada en el `cloudbuild.yaml`. Para mayor seguridad en producción, considera:

1. **Usar Secret Manager de Google Cloud**:
   ```bash
   # Crear secreto
   echo -n "AIzaSyAaBzjJ7nqxMtBd9GvTvAnGeTO7YQzbhIk" | gcloud secrets create gemini-api-key --data-file=-
   
   # En cloudbuild.yaml, usar:
   --set-secrets=GEMINI_API_KEY=gemini-api-key:latest
   ```

2. **Rotar la API key regularmente**

3. **Configurar restricciones de API**:
   - Limitar por IP
   - Limitar por aplicación
   - Establecer cuotas

### ✅ Verificación

Una vez desplegado, puedes verificar que funciona:

1. **Desde el frontend**: Usa el chatbot/asistente IA
2. **Con curl/PowerShell**:
   ```powershell
   $body = @{
       chat_id = 1
       message = "¿Qué es la pedagogía activa?"
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "https://backend-django-a6zccy3fma-uc.a.run.app/api/v1/chat/enviar/" `
       -Method POST `
       -Body $body `
       -ContentType "application/json" `
       -UseBasicParsing
   ```

### 🚀 Próximos Pasos

1. ✅ Desplegar backend con GEMINI_API_KEY
2. 🧪 Probar el chatbot desde el frontend
3. 📈 Monitorear uso y costos de la API
4. 🔐 Migrar a Secret Manager (recomendado)

### 📝 Variables de Entorno Disponibles

```bash
GEMINI_API_KEY=AIzaSyAaBzjJ7nqxMtBd9GvTvAnGeTO7YQzbhIk  # API key de Gemini
GEMINI_MODEL=gemini-1.5-flash                           # Modelo a usar (opcional)
GEMINI_THINKING_BUDGET=0                                # Presupuesto de "thinking" (opcional)
```

### 🔗 Referencias

- [Documentación de Gemini API](https://ai.google.dev/gemini-api/docs)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Restricciones de API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
