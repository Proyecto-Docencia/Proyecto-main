/**
 * Utilidad para manejar CSRF tokens en iOS Safari
 * iOS Safari tiene problemas con cookies cross-origin, especialmente SameSite=None
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || (window as any).__API_BASE__ || '').replace(/\/$/, '');

/**
 * Inicializa el CSRF token llamando al endpoint específico
 * Esto es crítico para iOS Safari que puede no recibir cookies automáticamente
 */
export async function initializeCSRFToken(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/auth/csrf/`, {
      method: 'GET',
      credentials: 'include', // Importante: enviar y recibir cookies
    });
    
    if (!response.ok) {
      console.warn('No se pudo obtener CSRF token:', response.status);
    }
  } catch (error) {
    console.warn('Error al inicializar CSRF token:', error);
  }
}

/**
 * Obtiene el CSRF token de las cookies (si existe)
 * Útil para debugging en iOS
 */
export function getCSRFTokenFromCookie(): string | null {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Verifica si las cookies están funcionando correctamente
 * Útil para debugging de problemas en iOS
 */
export function checkCookieSupport(): boolean {
  try {
    // Intentar establecer una cookie de prueba
    document.cookie = 'test_cookie=1; path=/; SameSite=None; Secure';
    const hasCookie = document.cookie.includes('test_cookie=1');
    
    // Limpiar cookie de prueba
    document.cookie = 'test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    return hasCookie;
  } catch {
    return false;
  }
}

/**
 * Diagnostica problemas de cookies en iOS
 */
export function diagnoseCookieIssues(): {
  cookiesEnabled: boolean;
  csrfToken: string | null;
  sessionId: string | null;
  isSecureContext: boolean;
  userAgent: string;
  isSafari: boolean;
} {
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  return {
    cookiesEnabled: checkCookieSupport(),
    csrfToken: getCSRFTokenFromCookie(),
    sessionId: document.cookie.includes('sessionid') ? 'present' : null,
    isSecureContext: window.isSecureContext,
    userAgent: ua,
    isSafari,
  };
}

/**
 * Detecta si el navegador es Safari (Mac o iOS)
 */
export function isSafariBrowser(): boolean {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua);
}

/**
 * Espera un tiempo antes de continuar (útil para Safari que necesita tiempo para procesar cookies)
 */
export function waitForCookies(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
