#!/bin/sh
set -e

echo "[entrypoint] Arrancando backend"

# Normalizar DB_ENGINE si viene como 'postgresql'
if [ "$DB_ENGINE" = "postgresql" ]; then
	export DB_ENGINE=postgresql
fi

WAIT_STATUS=0
if [ -f /app/wait_for_db.sh ]; then
	chmod +x /app/wait_for_db.sh
	# Desactivar salida inmediata para capturar cÃ³digo especÃ­fico (2 = acceso denegado 1045)
	set +e
	/app/wait_for_db.sh
	WAIT_STATUS=$?
	set -e
else
	echo "[entrypoint] Script wait_for_db.sh no encontrado, continuando sin espera activa"
fi

if [ "$WAIT_STATUS" = "2" ]; then
	echo "[entrypoint] ERROR 1045 (Access denied) al conectar a la DB con el usuario '${DB_USER}'." >&2
	echo "[entrypoint] Sugerencias: revisar usuario/clave, privilegios y que la DB '${DB_NAME}' exista." >&2
	# En Cloud Run no podemos quedarnos bloqueados (no abrirÃ­amos el puerto). Detectar entorno por K_SERVICE.
	if [ -n "$K_SERVICE" ]; then
		echo "[entrypoint] EjecutÃ¡ndose en Cloud Run: saliendo con error para reinicio automÃ¡tico." >&2
		exit 1
	else
		echo "[entrypoint] Entorno local: dejando contenedor vivo para depuraciÃ³n (tail -f)."
		tail -f /dev/null
	fi
fi

if [ "$WAIT_STATUS" != "0" ]; then
	echo "[entrypoint] FallÃ³ la espera de la base de datos (cÃ³digo $WAIT_STATUS). Saliendo." >&2
	exit 1
fi

echo "[entrypoint] Ejecutando migraciones"
echo "[entrypoint] DB_ENGINE=$DB_ENGINE DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_NAME=$DB_NAME DB_USER=$DB_USER"
python manage.py migrate --noinput || {
	echo "[entrypoint] Migraciones fallaron" >&2
	exit 1
}

# Ingestar PDFs para RAG si está habilitado
if [ "$ENABLE_RAG" = "1" ]; then
	echo "[entrypoint] ENABLE_RAG=1 detectado, verificando embeddings RAG..."
	EMBED_CACHE_PATH="${RAG_EMBED_CACHE:-/app/rag_cache/embeddings.npz}"
	
	if [ ! -f "$EMBED_CACHE_PATH" ]; then
		echo "[entrypoint] Cache de embeddings no encontrado, ejecutando ingesta de PDFs..."
		python manage.py ingest_pdfs --dir=rag_proxy/docs || {
			echo "[entrypoint] ADVERTENCIA: Ingesta de PDFs falló, pero continuando..." >&2
		}
	else
		echo "[entrypoint] Cache de embeddings encontrado en $EMBED_CACHE_PATH, omitiendo ingesta"
	fi
fi

echo "[entrypoint] Lanzando gunicorn con configuración optimizada para 8 CPUs"
# Workers = (2 x CPU) + 1 = 17 (pero limitamos a 9 para dejar recursos a RAG)
# Threads = 2 por worker para I/O concurrente
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:${PORT:-8080} \
  --workers ${GUNICORN_WORKERS:-9} \
  --threads ${GUNICORN_THREADS:-2} \
  --worker-class ${GUNICORN_WORKER_CLASS:-sync} \
  --timeout ${GUNICORN_TIMEOUT:-300} \
  --graceful-timeout ${GUNICORN_GRACEFUL_TIMEOUT:-300} \
  --max-requests ${GUNICORN_MAX_REQUESTS:-1000} \
  --max-requests-jitter ${GUNICORN_MAX_REQUESTS_JITTER:-50} \
  --preload
