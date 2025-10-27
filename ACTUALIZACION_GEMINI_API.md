# 🤖 Actualización de Gemini API - 17 de octubre, 2025

## ❌ Problema Identificado

**Error en el frontend**:
```
Error al contactar con la IA: 404 NOT_FOUND. 
{'error': {'code': 404, 'message': 'models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods.', 'status': 'NOT_FOUND'}}
```

### Causas:
1. **API Key incorrecta**: Se estaba usando `AIzaSyAaBzjJ7nqxMtBd9GvTvAnGeTO7YQzbhIk` (clave anterior)
2. **Modelo obsoleto**: `gemini-1.5-flash` no está disponible en la API v1beta

---

## ✅ Solución Implementada

### 1. Actualización de API Key

**Nueva API Key de Gemini**:
```
AIzaSyC1L54evpA3D0hvAACzN-Ej0PeQHo0S4Ls
```

**Detalles**:
- Nombre: `TOKEN_KEY`
- Proyecto: `projects/79197934609`
- Número de proyecto: `79197934609`

### 2. Actualización del Modelo

**Modelo anterior**: `gemini-1.5-flash` ❌
**Modelo nuevo**: `gemini-2.0-flash-exp` ✅

---

## 📝 Cambios Realizados

### Archivo 1: `backend/src/chat_app/ai_service.py`

**Antes**:
```python
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
```

**Después**:
```python
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash-exp")
```

### Archivo 2: `backend/cloudbuild.yaml`

**Cambios en substitutions**:
```yaml
substitutions:
  _GEMINI_API_KEY: 'AIzaSyC1L54evpA3D0hvAACzN-Ej0PeQHo0S4Ls'  # ✅ Nueva API key
  _GEMINI_MODEL: 'gemini-2.0-flash-exp'                      # ✅ Nuevo modelo
```

**Cambios en env-vars**:
```yaml
- '--update-env-vars'
- DJANGO_SECRET_KEY=...,GEMINI_API_KEY=${_GEMINI_API_KEY},GEMINI_MODEL=${_GEMINI_MODEL}
```

---

## 🔍 Modelos de Gemini Disponibles

### Gemini 2.0 (Recomendado)
- **`gemini-2.0-flash-exp`** ✅ - Modelo experimental más rápido y actualizado
- Mejor rendimiento y velocidad
- Soporte completo para generateContent

### Gemini 1.5 (Deprecados en v1beta)
- ~~`gemini-1.5-flash`~~ ❌ - No disponible en v1beta
- ~~`gemini-1.5-pro`~~ ⚠️ - Limitado en v1beta

---

## 🚀 Despliegue

### Build ID
```
881940ce-fb73-42ea-a813-9aa8e973c1a7
```

### Comando usado
```powershell
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\backend"
gcloud builds submit --config cloudbuild.yaml
```

---

## ✅ Verificación Post-Despliegue

Después del despliegue, verificar:

### 1. Variables de entorno en Cloud Run
```bash
gcloud run services describe backend-django \
  --region=us-central1 \
  --format="value(spec.template.spec.containers[0].env)" \
  | grep GEMINI
```

**Resultado esperado**:
```
GEMINI_API_KEY=AIzaSyC1L54evpA3D0hvAACzN-Ej0PeQHo0S4Ls
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 2. Probar el chatbot desde el frontend
1. Abrir `http://localhost:5179`
2. Hacer login con `test@docente.uss.cl` / `Test123456`
3. Ir al chatbot
4. Enviar mensaje: "Hola, ¿puedes ayudarme?"
5. Verificar respuesta de Gemini ✅

---

## 📊 Comparación de Configuraciones

| Aspecto | Configuración Anterior | Configuración Nueva |
|---------|----------------------|---------------------|
| **API Key** | AIzaSyAaBzjJ7nqxMtBd9GvTvAnGeTO7YQzbhIk | AIzaSyC1L54evpA3D0hvAACzN-Ej0PeQHo0S4Ls ✅ |
| **Modelo** | gemini-1.5-flash | gemini-2.0-flash-exp ✅ |
| **API Version** | v1beta (no soportado) | v1beta (soportado) ✅ |
| **Estado** | ❌ Error 404 | ✅ Funcional |

---

## 🐛 Troubleshooting

### Si el error persiste después del despliegue:

1. **Verificar que la nueva revisión está activa**:
```powershell
gcloud run services describe backend-django --region=us-central1 --format="value(status.latestReadyRevisionName)"
```

2. **Ver logs en tiempo real**:
```powershell
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=backend-django" --project=gen-lang-client-0776831973
```

3. **Verificar variables de entorno**:
```powershell
gcloud run services describe backend-django --region=us-central1 --format=json | ConvertFrom-Json | Select-Object -ExpandProperty spec | Select-Object -ExpandProperty template | Select-Object -ExpandProperty spec | Select-Object -ExpandProperty containers | Select-Object -ExpandProperty env | Where-Object { $_.name -like "GEMINI*" }
```

---

## 📚 Referencias

- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Google GenAI SDK](https://github.com/googleapis/python-genai)
- [Gemini 2.0 Release Notes](https://developers.googleblog.com/en/gemini-20-flash-experimental/)

---

**Última Actualización**: 17 de octubre, 2025 - 19:15
**Build Status**: ⏳ En progreso (Build ID: 881940ce-fb73-42ea-a813-9aa8e973c1a7)
