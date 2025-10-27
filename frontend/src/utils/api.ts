const API_BASE = (import.meta.env.VITE_API_BASE_URL || (window as any).__API_BASE__ || '').replace(/\/$/, '');
function api(path: string) {
  // Intenta primero versión v1; mantenemos compatibilidad: si backend elimina legacy, el frontend ya apunta a v1
  if (path.startsWith('/')) path = path.substring(1);
  return `${API_BASE}/api/v1/${path}`;
}

export async function fetchMisPlanificaciones() {
  const resp = await fetch(api('plans/mis/'), {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar planificaciones');
  return resp.json();
}

export async function crearPlanificacion(data: any) {
  const resp = await fetch(api('plans/crear/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('No se pudo crear la planificación');
  return resp.json();
}

export async function getPlanificacionDetalle(id: number) {
  const resp = await fetch(api(`plans/${id}/`), {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar la planificación');
  return resp.json();
}

export async function patchPlanificacion(id: number, data: any) {
  const resp = await fetch(api(`plans/${id}/`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('No se pudo actualizar la planificación');
  return resp.json();
}

export async function deletePlanificacion(id: number) {
  const resp = await fetch(api(`plans/${id}/`), {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo eliminar la planificación');
  return resp.json();
}

export async function crearChat(mensaje_usuario: string, sesion_id?: number | null) {
  const body: any = { mensaje_usuario };
  if (sesion_id) {
    body.sesion_id = sesion_id;
  }
  
  const resp = await fetch(api('chat/crear/'), {
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

export async function crearSesion(titulo?: string) {
  const resp = await fetch(api('chat/sesiones/crear/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ titulo: titulo || 'Nueva conversación' }),
  });
  if (!resp.ok) throw new Error('No se pudo crear la sesión');
  return resp.json();
}

export async function obtenerSesion(sesion_id: number) {
  const resp = await fetch(api(`chat/sesiones/${sesion_id}/`), {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar la sesión');
  return resp.json();
}

export async function fetchMisSesiones() {
  const resp = await fetch(api('chat/sesiones/'), {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar las sesiones');
  return resp.json();
}

export async function fetchProfile() {
  const resp = await fetch(api('auth/profile/'), {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar el perfil');
  return resp.json();
}

export async function saveProfile(data: any) {
  const resp = await fetch(api('auth/profile/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('No se pudo guardar el perfil');
  return resp.json();
}

export async function fetchMisChats() {
  const resp = await fetch(api('chat/mis/'), {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar los chats');
  return resp.json();
}
