# 🤖 Proceso de Validación con IA - Análisis Detallado

## 📋 Resumen Ejecutivo

El sistema de validación con IA utiliza **RAG (Retrieval-Augmented Generation)** para comparar planificaciones educativas con el contenido real de los PDFs del material "Alfabetización Digital en IA Generativa".

## 🔄 Flujo Completo del Proceso

```
Usuario → Selecciona Planificación + Capítulos
    ↓
Frontend envía a: POST /api/chat/crear/
    ↓
Backend RAG busca en vectores (embeddings de PDFs)
    ↓
Backend recupera chunks relevantes de los capítulos
    ↓
Backend construye prompt: Contexto + Planificación + Instrucciones
    ↓
Gemini analiza y genera feedback estructurado
    ↓
Backend guarda feedback en tabla PlanificacionAsistenteIA
    ↓
Frontend muestra feedback formateado al usuario
```

## 🧠 Componentes Técnicos

### 1. Sistema RAG (Retrieval-Augmented Generation)

**Ubicación**: `backend/src/rag_proxy/retrieval.py`

**Función**: Buscar información relevante en los PDFs de los capítulos

**Proceso**:
1. **Indexación previa** (se hace una vez):
   - Los PDFs se dividen en chunks (fragmentos de texto)
   - Cada chunk se convierte en un vector usando `sentence-transformers`
   - Vectores se guardan en archivo cache: `/app/rag_cache/embeddings.npz`

2. **Búsqueda en tiempo real**:
   - Query del usuario se convierte en vector
   - Se calcula similitud coseno con todos los chunks
   - Se devuelven top 3-5 chunks más relevantes (score > 0.25)

**Código clave**:
```python
def search(query: str, top_k: Optional[int] = None) -> List[Dict[str, Any]]:
    # Convierte query en vector
    q_vec = model.encode([query], normalize_embeddings=True)[0]
    
    # Calcula similitud con todos los chunks
    sims = (_MATRIX @ q_vec).tolist()
    
    # Filtra por score mínimo y devuelve top K
    scored = [chunk for chunk, score in zip(_CHUNKS, sims) if score >= MIN_SCORE]
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]
```

### 2. Endpoint de Chat con RAG

**Ubicación**: `backend/src/chat_app/views.py` → función `crear_chat`

**Ruta**: `POST /api/chat/crear/`

**Parámetros**:
```json
{
  "mensaje_usuario": "Prompt de validación completo",
  "usar_rag": true,  // CRÍTICO: Activa búsqueda en PDFs
  "sesion_id": null   // Opcional: ID de sesión existente
}
```

**Proceso interno**:
```python
# 1. Buscar contexto en PDFs usando RAG
resultados = search(mensaje_usuario, top_k=3)

# 2. Formatear contexto encontrado
contexto_rag = format_context(resultados)
# Ejemplo de salida:
# [Fuente: Capitulo2.pdf | Página 15]
# Los principios de IA Generativa en educación incluyen...

# 3. Construir prompt completo
prompt_completo = f"""
{contexto_rag}

**Pregunta del docente:** {mensaje_usuario}

Por favor, responde basándote en el contexto proporcionado.
"""

# 4. Enviar a Gemini
respuesta = consultar_gemini(prompt_completo)

# 5. Guardar en base de datos
chat = Chat.objects.create(
    user=request.user,
    mensaje_usuario=mensaje_usuario,
    respuesta_ia=respuesta
)
```

### 3. Integración en Frontend

**Ubicación**: `frontend/src/pages/VerificacionIA.tsx`

**Cambios implementados**:

#### ANTES ❌ (No usaba RAG):
```typescript
fetch('/api/chat/', {  // ← Ruta incorrecta
  body: JSON.stringify({
    message: prompt,  // ← Campo incorrecto
    context: 'validacion_planificacion'  // ← No activa RAG
  })
})
```

#### AHORA ✅ (Usa RAG correctamente):
```typescript
fetch('/api/chat/crear/', {  // ✅ Ruta correcta
  method: 'POST',
  credentials: 'include',  // ✅ Envía cookies de sesión
  body: JSON.stringify({
    mensaje_usuario: prompt,  // ✅ Campo correcto
    usar_rag: true  // ✅ ACTIVA BÚSQUEDA EN PDFs
  })
})
```

## 📊 Ejemplo Real de Validación

### Input del Usuario:
```
Planificación: "Uso de ChatGPT para análisis de datos en clase de estadística"
Capítulos seleccionados: Capítulo 2, Capítulo 3
```

### Paso 1: RAG busca en PDFs
Query: "Uso de ChatGPT para análisis de datos estadística IA Generativa educación"

Resultados encontrados:
```
[Fuente: Capitulo2.pdf | Página 12]
"La IA Generativa puede ser utilizada para crear ejemplos de datos 
estadísticos y ayudar a los estudiantes a comprender conceptos..."

[Fuente: Capitulo3.pdf | Página 8]
"Es importante considerar aspectos éticos al usar herramientas como 
ChatGPT, especialmente en el análisis de datos sensibles..."

[Fuente: Capitulo2.pdf | Página 15]
"Las herramientas de IA deben complementar, no reemplazar, el 
pensamiento crítico del estudiante en el análisis estadístico..."
```

### Paso 2: Construcción del Prompt
```
**Contexto de documentos educativos:**

[Fuente: Capitulo2.pdf | Página 12]
La IA Generativa puede ser utilizada para crear ejemplos de datos...

[Fuente: Capitulo3.pdf | Página 8]
Es importante considerar aspectos éticos al usar herramientas como...

[Fuente: Capitulo2.pdf | Página 15]
Las herramientas de IA deben complementar, no reemplazar...

**Pregunta del docente:** 
Actúa como experto... [prompt completo con planificación]

Por favor, responde basándote en el contexto proporcionado.
```

### Paso 3: Gemini Genera Feedback
```
📊 PUNTUACIÓN GENERAL: 7/10

✅ FORTALEZAS IDENTIFICADAS:
• La planificación incluye herramienta de IA (ChatGPT) alineada con Cap. 2
• Se menciona análisis de datos, aspecto clave del material
• Contexto educativo claro (clase de estadística)

⚠️ ÁREAS DE MEJORA:
• No se mencionan aspectos éticos (Cap. 3, pág. 8)
• Falta explicar cómo NO reemplazar pensamiento crítico (Cap. 2, pág. 15)
• No hay plan para validar resultados de IA

💡 RECOMENDACIONES ESPECÍFICAS:
1. Agregar sección sobre ética del uso de datos según Cap. 3
2. Incluir actividad donde estudiantes verifiquen análisis de ChatGPT
3. Diseñar rubrica de evaluación del pensamiento crítico

🎯 ALINEAMIENTO CON LOS CAPÍTULOS:
• Capítulo 2: Bien alineado en uso de herramienta, falta énfasis en complementariedad
• Capítulo 3: No aborda aspectos éticos mencionados en páginas 8-12

🏆 CONCLUSIÓN Y PRÓXIMOS PASOS:
La planificación tiene buena base pero necesita ajustes en aspectos 
éticos y verificación crítica antes de implementarse. Recomiendo 
incorporar las sugerencias del Capítulo 3 sobre uso responsable.
```

## 🔧 Configuración del Sistema RAG

### Variables de Entorno (backend):
```bash
# Modelo de embeddings (usa sentence-transformers)
RAG_MODEL_SENTENCE=all-MiniLM-L6-v2

# Ubicación del cache de vectores
RAG_EMBED_CACHE=/app/rag_cache/embeddings.npz

# Cantidad de chunks a devolver
RAG_TOP_K=5

# Score mínimo de similitud (0-1)
RAG_MIN_SCORE=0.25

# Backend: 'local' (embeddings locales) o 'azure' (Azure AI Search)
RAG_BACKEND=local
```

### Indexación de PDFs (se hace una vez):
```bash
# En el contenedor backend
python src/manage.py ingest_pdfs

# O usando docker-compose
docker-compose exec backend python src/manage.py ingest_pdfs
```

Este comando:
1. Lee todos los PDFs de `backend/src/rag_proxy/docs/`
2. Extrae texto con PyPDF2
3. Divide en chunks de ~500 caracteres
4. Genera embeddings con sentence-transformers
5. Guarda en `/app/rag_cache/embeddings.npz`

## ✅ Verificación de que RAG está Funcionando

### Test 1: Verificar que embeddings existen
```bash
docker-compose exec backend ls -lh /app/rag_cache/
# Debería mostrar: embeddings.npz (varios MB)
```

### Test 2: Test directo en Python
```python
from rag_proxy.retrieval import search

# Buscar información sobre ética
results = search("aspectos éticos IA educación", top_k=3)

for r in results:
    print(f"Score: {r['score']:.3f}")
    print(f"Fuente: {r['doc']} | Página {r['page']}")
    print(f"Texto: {r['text'][:200]}...")
    print("---")
```

### Test 3: Verificar en DevTools del navegador
1. Abrir DevTools → Network
2. Hacer validación con IA
3. Buscar request a `/api/chat/crear/`
4. En la respuesta JSON, buscar campo `usado_rag: true`
5. Si es `true`, RAG está funcionando ✅

## 🐛 Troubleshooting

### Problema: `usado_rag: false` en respuesta
**Causa**: Embeddings no generados o archivo no encontrado
**Solución**:
```bash
docker-compose exec backend python src/manage.py ingest_pdfs
```

### Problema: Feedback genérico (no menciona capítulos específicos)
**Causa 1**: RAG no activo (`usar_rag: false`)
**Solución**: Verificar que frontend envía `usar_rag: true`

**Causa 2**: Score de similitud muy bajo
**Solución**: Reducir `RAG_MIN_SCORE` en `.env`:
```bash
RAG_MIN_SCORE=0.15  # En lugar de 0.25
```

### Problema: Error "sentence-transformers no instalado"
**Causa**: Dependencias RAG no instaladas
**Solución**:
```bash
docker-compose exec backend pip install -r requirements-rag.txt
```

## 📈 Mejoras Futuras

### Corto Plazo:
- [ ] Filtrar búsqueda solo en capítulos seleccionados
- [ ] Mostrar fuentes citadas en el feedback
- [ ] Caché de embeddings por capítulo

### Mediano Plazo:
- [ ] Migrar a Azure AI Search para mejor escalabilidad
- [ ] Usar embeddings de Azure OpenAI
- [ ] Agregar re-ranking de resultados

### Largo Plazo:
- [ ] Fine-tuning del modelo con datos educativos
- [ ] Evaluación automática de calidad del feedback
- [ ] A/B testing de diferentes prompts

## 📚 Referencias

- **sentence-transformers**: https://www.sbert.net/
- **RAG Pattern**: https://arxiv.org/abs/2005.11401
- **Gemini API**: https://ai.google.dev/docs
