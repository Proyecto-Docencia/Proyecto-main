export async function fetchMisPlanificaciones() {
  const resp = await fetch('http://localhost:8081/api/plans/mis/', {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar planificaciones');
  return resp.json();
}

export async function crearPlanificacion(data: any) {
  const resp = await fetch('http://localhost:8081/api/plans/crear/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('No se pudo crear la planificación');
  return resp.json();
}

export async function getPlanificacionDetalle(id: number) {
  const resp = await fetch(`http://localhost:8081/api/plans/${id}/`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar la planificación');
  return resp.json();
}

export async function patchPlanificacion(id: number, data: any) {
  const resp = await fetch(`http://localhost:8081/api/plans/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('No se pudo actualizar la planificación');
  return resp.json();
}

export async function deletePlanificacion(id: number) {
  const resp = await fetch(`http://localhost:8081/api/plans/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo eliminar la planificación');
  return resp.json();
}

export async function fetchProfile() {
  const resp = await fetch('http://localhost:8081/api/auth/profile/', {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar el perfil');
  return resp.json();
}

export async function saveProfile(data: any) {
  const resp = await fetch('http://localhost:8081/api/auth/profile/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('No se pudo guardar el perfil');
  return resp.json();
}

/* Chat API helpers */
export async function crearChat(mensaje: string) {
  const resp = await fetch('http://localhost:8081/api/chat/crear/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ mensaje_usuario: mensaje }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('Error al crear chat: ' + text);
  }
  return resp.json();
}

export async function fetchMisChats() {
  const resp = await fetch('http://localhost:8081/api/chat/mis/', {
    method: 'GET',
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('No se pudo cargar los chats');
  return resp.json();
}
