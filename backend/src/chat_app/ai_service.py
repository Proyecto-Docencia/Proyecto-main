# chat_app/ai_service.py

from openai import OpenAI
import os # Importamos 'os' por si queremos usar variables de entorno en el futuro

# Configuración del servidor Ollama (¡No cambiar estos valores si usas Ollama por defecto!)
OLLAMA_BASE_URL = "http://localhost:11434/v1"
MODEL_DEEPSEEK = "deepseek-1.5b" # Asegúrate de que este nombre coincida con tu modelo de Ollama

# Inicializar el cliente (esto se hace una sola vez)
client = OpenAI(
    api_key="ollama", # Clave de relleno
    base_url=OLLAMA_BASE_URL 
)

def consultar_deepseek(prompt_usuario: str) -> str:
    """
    Llama al modelo DeepSeek a través del servidor Ollama.
    
    Asegúrate de que el modelo esté corriendo con 'ollama run deepseek-1.5b' en una terminal.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL_DEEPSEEK,
            messages=[
                {"role": "user", "content": prompt_usuario}
            ],
            temperature=0.4, # Baja temperatura para respuestas más lógicas
            max_tokens=500 # Limita la longitud para evitar respuestas excesivas
        )
        
        # Retorna el contenido de la respuesta (string)
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"ERROR LLM: Falló la conexión con la API de DeepSeek. Detalle: {e}")
        # Retorna un mensaje de error claro en caso de fallo
        return "Disculpa, el servicio de IA local (Ollama) no está disponible o el modelo no está cargado."