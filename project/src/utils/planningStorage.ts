export interface Planificacion {
  id: string;
  titulo: string;
  asignatura: string;
  objetivos: string;
  contenidos: string;
  metodologia: string;
  evaluacion: string;
  fecha?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const keyFor = (email?: string | null) => `plans:${email || 'guest'}`;

export function getPlanificaciones(email?: string | null): Planificacion[] {
  try {
    const raw = localStorage.getItem(keyFor(email));
    return raw ? (JSON.parse(raw) as Planificacion[]) : [];
  } catch {
    return [];
  }
}

export function savePlanificacion(email: string | null | undefined, plan: Planificacion): void {
  const list = getPlanificaciones(email);
  const idx = list.findIndex(p => p.id === plan.id);
  if (idx >= 0) list[idx] = plan; else list.unshift(plan);
  localStorage.setItem(keyFor(email), JSON.stringify(list));
}

export function getPlanificacion(email: string | null | undefined, id: string): Planificacion | undefined {
  return getPlanificaciones(email).find(p => p.id === id);
}

export function deletePlanificacion(email: string | null | undefined, id: string): void {
  const filtered = getPlanificaciones(email).filter(p => p.id !== id);
  localStorage.setItem(keyFor(email), JSON.stringify(filtered));
}

export function clearAllPlanificaciones(email: string | null | undefined): void {
  localStorage.removeItem(keyFor(email));
}

export function downloadPlanificacion(plan: Planificacion) {
  // Genera una ventana imprimible con contenido con estilo simple
  const win = window.open('', '_blank');
  if (!win) return;
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${plan.titulo}</title>
      <style>
        body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #0f172a; }
        h1 { margin: 0 0 8px; }
        .meta { color: #475569; margin-bottom: 16px; }
        .section { margin: 16px 0; }
        .section h2 { font-size: 16px; margin: 0 0 8px; color: #1e293b; }
        .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #fff; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <h1>${plan.titulo}</h1>
      <div class="meta">Asignatura: <strong>${plan.asignatura || '-'}</strong></div>
      ${plan.fecha ? `<div class="meta">Fecha: <strong>${plan.fecha}</strong></div>` : ''}
      <div class="section">
        <h2>Objetivos</h2>
        <div class="box">${escapeHtml(plan.objetivos).replace(/\n/g, '<br/>')}</div>
      </div>
      <div class="section">
        <h2>Contenidos</h2>
        <div class="box">${escapeHtml(plan.contenidos).replace(/\n/g, '<br/>')}</div>
      </div>
      <div class="section">
        <h2>Metodología</h2>
        <div class="box">${escapeHtml(plan.metodologia).replace(/\n/g, '<br/>')}</div>
      </div>
      <div class="section">
        <h2>Evaluación</h2>
        <div class="box">${escapeHtml(plan.evaluacion).replace(/\n/g, '<br/>')}</div>
      </div>
      <button class="no-print" onclick="window.print()">Imprimir / Guardar PDF</button>
    </body>
  </html>`;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
export interface PlanningItem {
  id: string; // uuid
  title: string;
  subject: string;
  grade: string;
  objectives: string;
  activities: string;
  resources: string;
  evaluation: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

const KEY_PREFIX = 'plannings:';

function getKey(userEmail: string) {
  return `${KEY_PREFIX}${userEmail || 'anon'}`;
}

export function loadPlannings(userEmail: string): PlanningItem[] {
  try {
    const raw = localStorage.getItem(getKey(userEmail));
    return raw ? (JSON.parse(raw) as PlanningItem[]) : [];
  } catch {
    return [];
  }
}

export function savePlannings(userEmail: string, items: PlanningItem[]) {
  try {
    localStorage.setItem(getKey(userEmail), JSON.stringify(items));
  } catch {}
}

export function upsertPlanning(userEmail: string, item: PlanningItem) {
  const list = loadPlannings(userEmail);
  const idx = list.findIndex(p => p.id === item.id);
  if (idx >= 0) list[idx] = item; else list.unshift(item);
  savePlannings(userEmail, list);
}

export function getPlanning(userEmail: string, id: string): PlanningItem | undefined {
  return loadPlannings(userEmail).find(p => p.id === id);
}

export function deletePlanning(userEmail: string, id: string) {
  const list = loadPlannings(userEmail).filter(p => p.id !== id);
  savePlannings(userEmail, list);
}
