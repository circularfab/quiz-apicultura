// ════════════════════════════════════════════════════════════
//  PEGA AQUÍ la URL de tu implementación de Apps Script
//  (la que termina en /exec)
// ════════════════════════════════════════════════════════════
const API_URL = 'https://script.google.com/macros/s/AKfycbyktCDi8OBoOJjdV4V_A0u4MPoGCKf7LN-YWv92QO2z36ZNh9yhGv7s8vXgxtYY8dyl/exec';


// ─── No hace falta tocar nada de aquí para abajo ───

const ESPERA_MAX_MS = 15000;          // si el servidor no contesta en 15 s, se da por perdida
const REINTENTOS = [1000, 2500];      // pausas antes de reintentar (2 reintentos)

/** Error de red (se puede reintentar) frente a error del juego (no tiene sentido reintentar) */
class ErrorRed extends Error {}

async function llamar(url, opciones) {
  let ultimo;
  for (let intento = 0; intento <= REINTENTOS.length; intento++) {
    if (intento > 0) await new Promise(r => setTimeout(r, REINTENTOS[intento - 1]));
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = ctrl ? setTimeout(() => ctrl.abort(), ESPERA_MAX_MS) : null;
    try {
      const r = await fetch(url, Object.assign({}, opciones, ctrl ? { signal: ctrl.signal } : {}));
      if (!r.ok) throw new ErrorRed('Error de conexión (' + r.status + ')');
      const j = await r.json();
      if (!j.ok) { const e = new Error(j.error || 'Error desconocido'); e.delJuego = true; throw e; }
      return j.datos;
    } catch (e) {
      if (e.delJuego) throw e;   // p. ej. "Código del stand no válido": no se reintenta
      ultimo = e.name === 'AbortError' ? new ErrorRed('El servidor tarda demasiado') : e;
    } finally {
      if (t) clearTimeout(t);
    }
  }
  const e = new ErrorRed('Sin conexión: ' + (ultimo && ultimo.message || 'error de red'));
  e.deRed = true;
  throw e;
}

/** Llamada GET (configuración y ranking) */
function apiGet(accion, extra) {
  let url = API_URL + '?accion=' + encodeURIComponent(accion) + '&t=' + Date.now();
  for (const k in (extra || {})) url += '&' + k + '=' + encodeURIComponent(extra[k]);
  return llamar(url, {});
}

/** Llamada POST (acciones del juego).
 *  Se envía como text/plain a propósito: así el navegador no hace
 *  la petición previa CORS (preflight) que Apps Script no admite.
 *  Reintentar es seguro: el servidor reconoce los reenvíos y no duplica nada. */
function apiPost(datos) {
  return llamar(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(datos)
  });
}