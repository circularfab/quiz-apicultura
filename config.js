// ════════════════════════════════════════════════════════════
//  PEGA AQUÍ la URL de tu implementación de Apps Script
//  (la que termina en /exec)
// ════════════════════════════════════════════════════════════
const API_URL = 'https://script.google.com/macros/s/AKfycbyktCDi8OBoOJjdV4V_A0u4MPoGCKf7LN-YWv92QO2z36ZNh9yhGv7s8vXgxtYY8dyl/exec';


// ─── No hace falta tocar nada de aquí para abajo ───

/** Llamada GET (configuración y ranking) */
async function apiGet(accion) {
  const r = await fetch(API_URL + '?accion=' + encodeURIComponent(accion) + '&t=' + Date.now());
  return procesar(r);
}

/** Llamada POST (acciones del juego).
 *  Se envía como text/plain a propósito: así el navegador no hace
 *  la petición previa CORS (preflight) que Apps Script no admite. */
async function apiPost(datos) {
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  });
  return procesar(r);
}

async function procesar(r) {
  if (!r.ok) throw new Error('Error de conexión (' + r.status + ')');
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'Error desconocido');
  return j.datos;
}
