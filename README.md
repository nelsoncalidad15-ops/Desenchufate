# DESENCHUFATE

Dashboard de control energetico para Grupo Zenova. El proyecto esta preparado para dos modos:

- Modo local: usa datos mock para desarrollar sin depender de Google Sheets ni gastar creditos.
- Modo produccion: consume una Web App de Google Apps Script publicada desde la hoja de respuestas del formulario.

## Trabajo local

1. Instala dependencias con `npm install`.
2. Crea un archivo `.env.local` con este contenido:

```env
VITE_USE_LIVE_DATA=false
VITE_GOOGLE_SHEETS_SCRIPT_URL=
```

3. Ejecuta `npm run dev`.
4. La app quedara en `http://localhost:3000` usando datos de ejemplo.

## GitHub

```bash
git init
git add .
git commit -m "Base inicial Desenchufate"
git branch -M main
git remote add origin TU_URL_DEL_REPO
git push -u origin main
```

## Netlify

Configuracion esperada:

- Build command: `npm run build`
- Publish directory: `dist`
- Variables de entorno:
  - `VITE_USE_LIVE_DATA=true`
  - `VITE_GOOGLE_SHEETS_SCRIPT_URL=TU_URL_DE_APPS_SCRIPT`

## Google Sheets + Apps Script

1. Crea el Google Form y vinculalo a una hoja.
2. Deja la hoja de respuestas con el nombre `Respuestas de formulario 1`.
3. En `Extensiones > Apps Script`, pega el contenido de `apps-script/Code.gs`.
4. Publica como `Aplicacion web` con acceso `Cualquier persona`.
5. Copia la URL y usala en Netlify.

## Archivos importantes

- `src/services/sourceDataService.ts`: decide entre datos mock o datos reales.
- `src/services/appsScriptTemplate.ts`: bloque listo para copiar en Apps Script.
- `apps-script/Code.gs`: mismo bloque, version archivo.
- `netlify.toml`: configuracion de build para Netlify.
