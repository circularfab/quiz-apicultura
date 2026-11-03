# Juego de preguntas · Feria de la Apicultura

Juego de preguntas estilo quiz: cada visitante juega desde su móvil y su puntuación aparece en un ranking proyectado en el stand.

- **Juego (móvil):** `index.html`
- **Ranking (pantalla):** `ranking.html`
- **Conexión con el servidor:** `config.js` → variable `API_URL`

## Cómo funciona

Las páginas están alojadas en GitHub Pages. Las preguntas, la corrección y las puntuaciones están en una hoja de Google Sheets, gestionada por un script de Google Apps Script (`Code.gs`, que **no** se sube aquí: vive en la hoja).

## Mantenimiento

- **Cambiar preguntas:** editar la hoja "Preguntas" de Google Sheets. No hay que tocar nada aquí.
- **Ocultar un nombre del ranking:** escribir `X` en la columna "Oculto" de la hoja "Resultados".
- **Cambiar tiempos, título o tamaño del top:** bloque `CONFIG` del script de Apps Script y volver a implementar (*Nueva versión*, sin crear una implementación nueva).
