FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y pkg-config libmariadb-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "new_api.wsgi:application", "--bind", "0.0.0.0:8000"]
