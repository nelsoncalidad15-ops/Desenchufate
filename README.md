# DESENCHUFATE

Dashboard de control energetico para Grupo Cenoa. Cada area empieza el periodo con 10/10 (100%). Un desvio en un control puntuable deja al area en 9/10 (90%); los hallazgos adicionales y las observaciones no siguen descontando puntos. El puntaje de cada sede es el promedio de sus areas activas.

## Trabajo local

1. Crea `.env.local`:

```env
VITE_USE_LIVE_DATA=false
VITE_GOOGLE_SHEETS_SCRIPT_URL=
```

2. Ejecuta `npm run dev`.
3. Abre `http://localhost:3000`.

## Estructura del Google Sheet

Crea estas pestanas, respetando exactamente los encabezados de la primera fila:

| Pestana | Encabezados |
| --- | --- |
| `EMPRESAS` | `ID_EMPRESA`, `EMPRESA`, `SEDE`, `ACTIVA`, `ORDEN` |
| `AREAS` | `ID_AREA`, `ID_EMPRESA`, `AREA`, `ACTIVA`, `ORDEN` |
| `TIPOS_DESVIO` | `ID_TIPO`, `TIPO_DESVIO`, `PUNTOS_DESCUENTO`, `ICONO`, `ACTIVO`, `ORDEN` |
| `CONFIG` | `CLAVE`, `VALOR` |

Ejemplo de `EMPRESAS`: `EMP001 | Autosol | Jujuy | Si | 1`.

Ejemplo de `AREAS`: `AR001 | EMP001 | Taller | Si | 1`.

Ejemplo de `TIPOS_DESVIO`: `DES001 | Luz encendida sin necesidad | 1 | lightbulb | Si | 1`.

En `CONFIG` carga al menos: `PUNTAJE_INICIAL = 10`, `LIMITE_EXCELENTE = 10`, `LIMITE_BUENO = 9` y `LIMITE_ALERTA = 8`.

La columna `PUNTOS_DESCUENTO` se mantiene solo por compatibilidad: ya no participa en el calculo del puntaje.
## Formulario y Apps Script

Las preguntas del Google Form deben llamarse exactamente:

- `Empresa / Marca`
- `Sede / Sucursal`
- `Area Auditada`
- `Tipo de Desvio Detectado`
- `Tipo de Control` (Puntuable - Apertura, Puntuable - Cierre u Observacion)
- `Observaciones / Comentarios`
- `Fotografia de Evidencia`

La hoja de respuestas debe llamarse `Respuestas de formulario 1`.

No hace falta agregar un campo de turno al Form: cada envío conserva su fecha y hora. El sistema toma como una misma auditoría los desvíos de una misma área, en la misma fecha y turno: **Mañana** antes de las 14:00 y **Tarde** desde las 14:00. Por eso, durante una recorrida se carga un envío por cada desvío detectado.

1. En el Sheet abre `Extensiones > Apps Script`.
2. Pega [Code.gs](apps-script/Code.gs).
3. En `FORM_ID`, pega el identificador que aparece en la URL del Form, entre `/d/` y `/edit`.
4. Ejecuta una vez `actualizarOpcionesFormulario` y acepta los permisos. Las listas del Form se cargaran desde `EMPRESAS`, `AREAS` y `TIPOS_DESVIO`; tambien se creara o actualizara `Tipo de Control`.
5. Cada vez que modifiques esos catalogos, vuelve a ejecutar esa funcion. Mas adelante podemos automatizarlo con un disparador.
6. Publica `doGet` como `Implementar > Nueva implementacion > Aplicacion web`, con acceso `Cualquier persona`.

Las areas en el Form se muestran como `Empresa | Sede | Area` para evitar confusiones cuando se repite un nombre como "Ventas".

## Netlify

En Netlify conecta el repositorio y configura:

- Build command: `npm run build`
- Publish directory: `dist`
- `VITE_USE_LIVE_DATA=true`
- `VITE_GOOGLE_SHEETS_SCRIPT_URL=URL_DE_TU_APPS_SCRIPT`

## Archivos importantes

- [sourceDataService.ts](src/services/sourceDataService.ts): alterna entre datos locales y datos del Sheet.
- [Code.gs](apps-script/Code.gs): API de lectura y sincronizacion de listas del Form.
- [brandTheme.ts](src/utils/brandTheme.ts): colores de Autolux, Autosol y Autociel.
