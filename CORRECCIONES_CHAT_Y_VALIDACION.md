# Correcciones de Chat y Validación IA

## 📋 Resumen de Problemas Corregidos

**Fecha**: Noviembre 2025
**Archivos Modificados**: 3 archivos principales

---

## 🐛 Problema 1: Chat en PlanificacionAsistenteIA.tsx No Funcionaba

### **Síntoma**
- Mensaje de error: "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente."
- Chat no se conectaba al backend correctamente

### **Causa**
- Uso directo de `fetch('/api/chat/')` sin URL base del backend
- No utilizaba el sistema de sesiones de chat existente
- No importaba las funciones `crearChat` y `crearSesion` de `utils/api.ts`

### **Solución Implementada**
✅ **Archivo**: `frontend/src/pages/PlanificacionAsistenteIA.tsx`

1. **Agregado imports necesarios**:
```typescript
import { crearChat, crearSesion } from '../utils/api';
```

2. **Agregado estado para sesión de chat**:
```typescript
const [chatSesionId, setChatSesionId] = useState<number | null>(null);
```

3. **Reescrita función `sendChatMessage()`** para usar el sistema de chat existente:
   - Obtiene o crea sesión de chat guardada en localStorage
   - Usa `crearChat(contexto, currentSesionId)` en lugar de fetch directo
   - Mantiene la sesión entre recargas de página
   - El chat ahora funciona igual que en `Chatbot.tsx`

4. **Carga de sesión guardada en useEffect**:
```typescript
const sesionGuardada = localStorage.getItem('chat_planificacion_ia_sesion');
if (sesionGuardada) {
  setChatSesionId(Number.parseInt(sesionGuardada, 10));
}
```

### **Resultado**
✅ Chat funciona correctamente con el backend
✅ Sesiones se guardan por usuario
✅ Historial de chat se mantiene entre sesiones
✅ Compatible con el sistema de chat existente

---

## 🐛 Problema 2: Validación IA con Error 405 (Method Not Allowed)

### **Síntoma**
```
POST https://frontend-react-265462853523.us-central1.run.app/api/chat/crear/ 405 (Method Not Allowed)
Error al validar: SyntaxError: Unexpected token '<', "<html><h"... is not valid JSON
```

### **Causa**
- `fetch('/api/chat/crear/')` usa ruta relativa que apunta al **frontend** (Nginx)
- Nginx devuelve HTML de error 405 en lugar de JSON
- No utilizaba la URL base del backend (`VITE_API_BASE_URL`)

### **Solución Implementada**
✅ **Archivos Modificados**:

1. **`frontend/src/utils/api.ts`** - Actualizada función `crearChat`:
```typescript
export async function crearChat(mensaje_usuario: string, sesion_id?: number | null, usar_rag?: boolean) {
  const body: any = { mensaje_usuario };
  if (sesion_id) {
    body.sesion_id = sesion_id;
  }
  if (usar_rag !== undefined) {  // NUEVO
    body.usar_rag = usar_rag;
  }
  
  const resp = await fetch(api('chat/crear/'), {  // usa API_BASE
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo enviar el mensaje');
  }
  return resp.json();
}
```

2. **`frontend/src/pages/VerificacionIA.tsx`** - Reemplazado fetch directo:
   - **ANTES**: `fetch('/api/chat/crear/', ...)`
   - **DESPUÉS**: `await crearChat(promptCompleto, null, true)`
   - Agregado import: `import { ..., crearChat } from '../utils/api'`

### **Resultado**
✅ Validación llama correctamente al backend en Cloud Run
✅ RAG se activa con `usar_rag: true`
✅ Feedback de IA cita páginas específicas de los PDFs
✅ Error JSON parsing resuelto

---

## 🐛 Problema 3: Tabs en MisPlanificaciones (Debe Mostrar Todo Junto)

### **Síntoma**
- Dos tabs separados: "Planificaciones Tradicionales" y "Con Asistente IA"
- Usuario solicitó una sola vista "Mis Planificaciones" con todas juntas

### **Causa**
- Estado `vistaActual` controlaba qué lista mostrar
- Renderizado condicional basado en `vistaActual === 'tradicional'` o `vistaActual === 'asistente-ia'`

### **Solución Implementada**
✅ **Archivo**: `frontend/src/pages/MisPlanificaciones.tsx`

1. **Eliminado estado `vistaActual`**:
```typescript
// ANTES:
const [vistaActual, setVistaActual] = useState<'tradicional' | 'asistente-ia'>('tradicional');

// DESPUÉS: (eliminado)
```

2. **Eliminados tabs** (40+ líneas de código):
```typescript
// ANTES: <div> con 2 botones de tabs
// DESPUÉS: (eliminado completamente)
```

3. **Lista unificada** - Muestra ambos tipos de planificaciones:
```typescript
{/* Planificaciones Tradicionales */}
{!loading && list.map((p) => (
  <button key={`trad-${p.id}`} onClick={() => { setSelected(p); setSelectedIA(null); }}>
    📝 {p.titulo}
    ...
  </button>
))}

{/* Planificaciones con Asistente IA */}
{!loading && listIA.map((p) => (
  <button key={`ia-${p.id}`} onClick={() => { setSelectedIA(p); setSelected(null); }}>
    🤖 {p.datos_generales.substring(0, 60)}...
    ...
  </button>
))}
```

4. **Contador total actualizado**:
```typescript
<p className="profile-role">
  Gestiona tus planificaciones educativas - {list.length + listIA.length} planificación{...}
</p>
```

5. **Detalle unificado** - Muestra contenido según selección:
```typescript
{!selected && !selectedIA && (  // Placeholder cuando no hay selección
  <div>Selecciona una planificación...</div>
)}

{selected && (  // Detalle de planificación tradicional
  <div>...</div>
)}

{selectedIA && (  // Detalle de planificación con IA
  <div>...</div>
)}
```

6. **Botón "Nueva Planificación"** apunta a ruta fija:
```typescript
onClick={() => navigate('/planificacion/nueva')}
```

### **Resultado**
✅ Una sola lista "Mis Planificaciones" con todas las planificaciones
✅ Planificaciones tradicionales identificadas con 📝
✅ Planificaciones con IA identificadas con 🤖
✅ Selección única (al seleccionar una, se deselecciona la otra)
✅ Detalle correcto para cada tipo

---

## 📊 Resumen de Cambios por Archivo

### `frontend/src/pages/PlanificacionAsistenteIA.tsx`
- ✅ Agregado imports: `crearChat`, `crearSesion`
- ✅ Agregado estado: `chatSesionId`
- ✅ Reescrita función `sendChatMessage()` (50 líneas)
- ✅ Carga de sesión en useEffect
- **Líneas modificadas**: ~60

### `frontend/src/utils/api.ts`
- ✅ Agregado parámetro `usar_rag?: boolean` a `crearChat()`
- ✅ Condicional para incluir `usar_rag` en body
- **Líneas modificadas**: ~5

### `frontend/src/pages/VerificacionIA.tsx`
- ✅ Agregado import: `crearChat`
- ✅ Reemplazado fetch directo por `await crearChat(promptCompleto, null, true)`
- ✅ Simplificado código de validación
- **Líneas modificadas**: ~70 (eliminadas ~60, agregadas ~10)

### `frontend/src/pages/MisPlanificaciones.tsx`
- ✅ Eliminado estado `vistaActual`
- ✅ Eliminados tabs (2 botones, ~40 líneas)
- ✅ Lista unificada con ambos tipos de planificaciones
- ✅ Keys únicos: `trad-${id}` y `ia-${id}`
- ✅ Contador total: `list.length + listIA.length`
- ✅ Detalle condicional simplificado
- **Líneas eliminadas**: ~100
- **Líneas modificadas**: ~50

---

## 🧪 Testing Realizado

### Test 1: Chat en PlanificacionAsistenteIA.tsx
- ✅ Chat inicia correctamente
- ✅ Mensajes se envían al backend
- ✅ Respuestas de IA se muestran correctamente
- ✅ Sesión se guarda en localStorage
- ✅ Historial se mantiene al recargar página

### Test 2: Validación IA en VerificacionIA.tsx
- ✅ Selección de planificación funciona
- ✅ Selección de capítulos funciona
- ✅ Llamada al backend exitosa (no más error 405)
- ✅ Feedback de IA se muestra con formato correcto
- ✅ RAG cita páginas específicas de PDFs

### Test 3: MisPlanificaciones unificada
- ✅ Ambas listas se cargan correctamente
- ✅ Planificaciones se distinguen por emoji (📝/🤖)
- ✅ Selección funciona para ambos tipos
- ✅ Detalle correcto según tipo seleccionado
- ✅ Contador muestra total correcto

---

## 📝 Notas Adicionales

### Compatibilidad con Backend
- ✅ Endpoint `/api/v1/chat/crear/` recibe `usar_rag: true` correctamente
- ✅ Endpoint `/api/v1/chat/crear/` acepta `sesion_id` opcional
- ✅ Sistema RAG busca en 6 PDFs (incluido nuevo Etapa_ciclo_alfabetizacion_digital.pdf)

### localStorage Keys
- `chat_sesion_activa` - Sesión del chatbot principal
- `chat_planificacion_ia_sesion` - Sesión del chat en PlanificacionAsistenteIA
- `planificacion_asistente_{email}` - Borrador del formulario

### Warnings Restantes (ESLint)
- ⚠️ Form labels sin control asociado (18 warnings) - No bloquean funcionamiento
- ⚠️ Array index en keys (10 warnings) - Funcional, mejora futura
- ⚠️ onKeyPress deprecated (1 warning) - Cambiar a onKeyDown en futuro

---

## ✅ Estado Final

**Todos los problemas reportados han sido corregidos**:
1. ✅ Chat en PlanificacionAsistenteIA funciona correctamente
2. ✅ Validación IA llama al backend correcto (no más error 405)
3. ✅ MisPlanificaciones muestra todas las planificaciones en una sola lista

**Próximo paso**: Desplegar frontend actualizado a Google Cloud Run

```bash
cd frontend
gcloud builds submit --config cloudbuild.yaml .
```
