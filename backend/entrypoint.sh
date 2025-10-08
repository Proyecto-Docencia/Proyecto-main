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
	# Desactivar salida inmediata para capturar código específico (2 = acceso denegado 1045)
	set +e
	/app/wait_for_db.sh
	WAIT_STATUS=$?
	set -e
else
	echo "[entrypoint] Script wait_for_db.sh no encontrado, continuando sin espera activa"
fi

if [ "$WAIT_STATUS" = "2" ]; then
	echo "[entrypoint] Abortando arranque normal por error 1045 (Access denied). Contenedor permanecerá vivo para depuración."
	echo "[entrypoint] Pasos recomendados:"
	echo "  1) Verifica conexión manual: mysql -h 127.0.0.1 -P ${DB_PORT:-3306} -u ${DB_USER} -p"
	echo "  2) Crea usuario y otorga privilegios si no existe (ver instrucciones previas)."
	echo "  3) Reinicia 'ia_backend' tras corregirlo."
	# Evita reinicio en bucle manteniendo proceso en foreground
	tail -f /dev/null
fi

if [ "$WAIT_STATUS" != "0" ]; then
	echo "[entrypoint] Falló la espera de la base de datos (código $WAIT_STATUS). Saliendo." >&2
	exit 1
fi

echo "[entrypoint] Ejecutando migraciones"
echo "[entrypoint] DB_ENGINE=$DB_ENGINE DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_NAME=$DB_NAME DB_USER=$DB_USER"
python manage.py migrate --noinput || {
	echo "[entrypoint] Migraciones fallaron" >&2
	exit 1
}

echo "[entrypoint] Lanzando gunicorn"
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS:-3}
