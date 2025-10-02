# Imagen para backend Django
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
		PYTHONUNBUFFERED=1
WORKDIR /app
# Instalar dependencias del sistema para mysqlclient
RUN apt-get update && apt-get install -y \
        build-essential default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY src ./src
COPY entrypoint.sh /entrypoint.sh
# Convertir fines de línea de CRLF (Windows) a LF (Unix)
RUN sed -i 's/\r$//' /entrypoint.sh
RUN chmod +x /entrypoint.sh
WORKDIR /app/src
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
