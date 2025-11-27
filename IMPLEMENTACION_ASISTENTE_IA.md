# 🤖 Sistema de Planificación con Asistente IA

## ✅ Implementación Completada

### Componentes Implementados

#### Backend (Django)
1. **Modelo**: `PlanificacionAsistenteIA` 
   - 18 campos de texto para las 20 preguntas del cuestionario
   - Campos de validación: `feedback_ia`, `capitulos_validados`, `ultima_validacion`
   - Estados: `borrador`, `completada`, `validada`

2. **API Endpoints**:
   ```
   GET/POST  /api/v1/plans/asistente-ia/
   GET/PUT/DELETE  /api/v1/plans/asistente-ia/<id>/
   POST  /api/v1/plans/asistente-ia/<id>/validar/
   ```

3. **Vistas** (`views_asistente_ia.py`):
   - `planificaciones_ia_list`: Lista y crea planificaciones
   - `planificacion_ia_detail`: Obtiene, actualiza y elimina por ID
   - `validar_planificacion_ia`: Guarda feedback de validación IA

#### Frontend (React + TypeScript)

1. **PlanificacionAsistenteIA.tsx** ✅
   - Cuestionario de 6 etapas con 20 preguntas
   - Chat IA siempre visible en panel lateral
   - Guardado automático en borrador (localStorage)
   - Al hacer clic en "Ver Planificación Completa" → guarda y navega

2. **VerPlanificacionAsistente.tsx** ✅
   - Muestra resultado formateado (8 secciones)
   - Botón "Guardar Planificación" → envía al backend
   - Botón "Validar con IA" → navega a validación
   - Limpia localStorage después de guardar

3. **VerificacionIA.tsx** ✅
   - Dropdown para seleccionar planificación (cargado desde backend)
   - Grid de capítulos para selección múltiple
   - Botón "Validar con IA" → envía prompt estructurado
   - Muestra feedback con formato (fortalezas, mejoras, recomendaciones)
   - Guarda feedback en backend automáticamente

4. **MisPlanificaciones.tsx** ✅
   - Tabs: "Planificaciones Tradicionales" | "Con Asistente IA"
   - Lista ambos tipos de planificaciones
   - Vista de detalle completa para cada tipo
   - Botones: Validar con IA, Eliminar
   - Muestra última validación si existe

## 📋 Flujo Completo

```
1. Usuario → Planificación Asistente IA
   ↓
2. Responde 20 preguntas (6 etapas) + Chat IA
   ↓
3. "Ver Planificación Completa" → VerPlanificacionAsistente
   ↓
4. Opción A: "Guardar Planificación" → Backend (estado: completada)
   Opción B: "Validar con IA" → VerificacionIA
   ↓
5. [Si validó] Selecciona capítulos → Feedback IA → Backend (estado: validada)
   ↓
6. Mis Planificaciones → Ver detalles → Editar/Eliminar
```

## 🚀 Instrucciones de Despliegue

### 1. Aplicar Migraciones (REQUERIDO)

#### Opción A: Usando el script PowerShell
```powershell
cd backend
.\aplicar-migraciones.ps1
```

#### Opción B: Manualmente
```powershell
cd backend
python src\manage.py migrate plans_app
```

### 2. Verificar que la migración se aplicó
```powershell
python src\manage.py showmigrations plans_app
```

Deberías ver:
```
plans_app
 [X] 0001_initial
 [X] 0002_profile
 [X] 0003_alter_planificacion_options_and_more  ← NUEVA
```

### 3. Iniciar el backend
```powershell
cd backend
python src\manage.py runserver
```

### 4. Iniciar el frontend
```powershell
cd frontend
npm run dev
```

## 🔍 Verificación

### Backend
1. Accede a Django Admin: `http://localhost:8000/admin`
2. Verifica que existe el modelo "Planificaciones con Asistente IA"

### Frontend
1. Accede a: `http://localhost:5173/planificacion/asistente-ia`
2. Completa el cuestionario
3. Guarda la planificación
4. Ve a "Mis Planificaciones" → Tab "Con Asistente IA"
5. Verifica que aparezca tu planificación

### Validación con IA
1. Desde "Mis Planificaciones", click en "🤖 Validar con IA"
2. Selecciona capítulos (2-6)
3. Click en "Validar con IA"
4. Verifica que aparezca el feedback estructurado
5. Vuelve a "Mis Planificaciones" → verás el feedback guardado

## 🗄️ Estructura de Base de Datos

### Tabla: `plans_app_planificacionasistenteIA`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Integer | Primary Key |
| `owner_id` | Integer | FK a User |
| `estado` | Varchar(20) | borrador/completada/validada |
| `datos_generales` | Text | Pregunta 1 |
| `diagnostico_estudiantes` | Text | Pregunta 2 |
| `habilidades_propias` | Text | Pregunta 3 |
| `objetivo_actividad` | Text | Pregunta 4 |
| `contexto_temporalidad` | Text | Pregunta 5 |
| `herramientas_iagen` | Text | Pregunta 6 |
| `metodologia_estrategia` | Text | Pregunta 7 |
| `indicadores_evaluacion` | Text | Pregunta 8 |
| `inicio_clase` | Text | Pregunta 9 |
| `desarrollo_clase` | Text | Pregunta 10 |
| `cierre_clase` | Text | Pregunta 11 |
| `pilares_eticos` | Text | Pregunta 12 |
| `registro_implementacion` | Text | Pregunta 13 |
| `evaluacion_experiencia` | Text | Pregunta 17 |
| `acciones_posteriores` | Text | Pregunta 18 |
| `facilitadores_obstaculos` | Text | Pregunta 19 |
| `reflexion_practica` | Text | Pregunta 20 |
| `feedback_ia` | JSON | Historial de validaciones |
| `capitulos_validados` | JSON | Capítulos usados |
| `ultima_validacion` | Text | Último feedback |
| `creado_en` | DateTime | Auto |
| `actualizado_en` | DateTime | Auto |

## 📝 Notas Técnicas

### Guardado Automático
- El formulario guarda en `localStorage` cada vez que cambias de etapa
- Clave: `formulario_borrador`
- Se limpia automáticamente después de guardar en backend

### Validación con IA
- Usa el endpoint `/api/chat/` existente
- Envía prompt estructurado con toda la planificación
- Recibe respuesta con formato específico (puntuación, fortalezas, mejoras, etc.)
- Guarda automáticamente en backend después de recibir feedback

### Estados de Planificación
- **borrador**: Guardado automático, aún no completado
- **completada**: Usuario hizo clic en "Guardar Planificación"
- **validada**: Usuario validó con IA y recibió feedback

## 🐛 Troubleshooting

### Error: "No module named 'google'"
- Solución: Ya implementado try/except en `ai_service.py`
- No afecta las migraciones

### Error: "Unknown server host 'db'"
- Normal si la base de datos no está corriendo
- Ignorar el warning durante `makemigrations`
- Aplicar migración cuando el servidor esté activo

### No aparecen las planificaciones IA
- Verificar que la migración se aplicó: `python src\manage.py showmigrations`
- Verificar que el backend está corriendo
- Verificar en DevTools → Network que las llamadas a `/api/v1/plans/asistente-ia/` retornan 200

### El feedback no se guarda
- Verificar en DevTools → Network la llamada a `/api/v1/plans/asistente-ia/<id>/validar/`
- Verificar que el backend está respondiendo
- Revisar logs del backend para errores

## ✨ Mejoras Futuras (Opcionales)

- [ ] Exportar planificación IA a PDF
- [ ] Editar planificaciones guardadas
- [ ] Comparar versiones de validación
- [ ] Notificaciones cuando la validación esté lista
- [ ] Guardar borradores también en backend (no solo localStorage)
