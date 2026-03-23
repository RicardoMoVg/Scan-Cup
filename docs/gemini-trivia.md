# Trivia con IA — Conexión a Gemini API

## Resumen

Cuando el usuario escanea una carta QR y accede a la pantalla de trivia, la app genera automáticamente 5 preguntas personalizadas sobre ese futbolista usando la API de **Google Gemini 2.5 Flash**.

---

## Flujo completo

```
QR escaneado
    ↓
App.tsx identifica el modelId (ej: "messi2026")
    ↓
playerNameMap convierte modelId → PlayerInfo { name, position, team }
    ↓
generateTriviaQuestions(playerName) — llama a Gemini API
    ↓
Gemini devuelve JSON con 5 preguntas
    ↓
Se mapean al tipo TriviaQuestion[]
    ↓
Se guardan en sessionStorage (caché)
    ↓
Componente <Trivia /> recibe las preguntas y las muestra
```

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `src/utils/triviaApi.ts` | Lógica de llamada a Gemini y mapeo de jugadores |
| `src/components/Trivia.tsx` | UI de preguntas, respuestas y resultados |
| `src/App.tsx` | Orquesta el flujo: inicia la llamada y pasa los datos a Trivia |
| `.env` | Guarda la API Key (`VITE_GEMINI_API_KEY`) |

---

## triviaApi.ts — Detalles

### 1. Mapa de jugadores (`playerNameMap`)

Convierte el `modelId` (extraído del QR) en información del jugador:

```ts
const playerNameMap = {
  'messi2026':    { name: 'Lionel Messi',      position: 'DEL', team: 'ARG' },
  'ochoa2026':    { name: 'Guillermo Ochoa',   position: 'POR', team: 'MEX' },
  'mbappe2026':   { name: 'Kylian Mbappé',     position: 'EXT', team: 'FRA' },
  // ...
}
```

### 2. El prompt enviado a Gemini

Se construye dinámicamente con el nombre del jugador:

```
Eres un experto en fútbol. Genera exactamente 5 preguntas de trivia
de opción múltiple sobre el futbolista {playerName}.
Las preguntas deben ser variadas: logros, estadísticas, clubes,
selección nacional e historia personal.
Responde ÚNICAMENTE con un JSON válido con este formato exacto...
```

El prompt fuerza a Gemini a responder **solo con JSON** sin texto adicional ni markdown, usando `responseMimeType: "application/json"`.

### 3. Llamada HTTP a Gemini

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}

Body:
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,       // algo de aleatoriedad para preguntas variadas
    maxOutputTokens: 2048,
    responseMimeType: "application/json"
  }
}
```

### 4. Formato JSON esperado de Gemini

```json
{
  "preguntas": [
    {
      "texto": "¿En qué año ganó Messi su primer Balón de Oro?",
      "opciones": {
        "A": "2008",
        "B": "2009",
        "C": "2010",
        "D": "2011"
      },
      "correcta": "B"
    }
  ]
}
```

### 5. Transformación a `TriviaQuestion[]`

La respuesta de Gemini se parsea y se mapea al tipo interno:

```ts
const questions: TriviaQuestion[] = parsed.preguntas.slice(0, 5).map((q, i) => ({
  id: i + 1,
  number: i + 1,
  total: 5,
  level: LEVELS[i],   // ['Pro', 'Pro', 'Experto', 'Experto', 'Leyenda']
  streak: i + 1,
  text: q.texto,
  options: Object.entries(q.opciones).map(([id, text]) => ({ id, text })),
  correct: q.correcta.toUpperCase().trim(),
}))
```

### 6. Caché con sessionStorage

Para no consumir cuota de la API al repetir la misma trivia, las preguntas se guardan en `sessionStorage` con la clave `trivia_cache_{playerName}`. Si ya existe la caché, **no se llama a Gemini**.

```ts
const cacheKey = `trivia_cache_${playerName}`;
const cached = sessionStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached); // devuelve sin llamar a la API
```

La caché se limpia automáticamente al cerrar la pestaña del navegador.

---

## Niveles de dificultad

Las 5 preguntas siguen esta progresión de dificultad:

| Pregunta | Nivel |
|---|---|
| 1 | Pro |
| 2 | Pro |
| 3 | Experto |
| 4 | Experto |
| 5 | Leyenda |

---

## Manejo de errores

| Error | Causa | Mensaje al usuario |
|---|---|---|
| `status 429` | Límite de cuota de la API alcanzado | "Límite de la API de Gemini alcanzado. Espera un momento." |
| `status != 200` | Error genérico de la API | "Error de API: {status}" |
| JSON mal formado | Gemini devolvió texto inesperado | "El formato de la trivia no es compatible." |
| Sin campo `preguntas` | JSON válido pero estructura incorrecta | "La estructura del JSON no contiene preguntas." |

---

## XP y puntuación

Cada respuesta correcta equivale a **100 XP**. Al terminar, el puntaje total (`score * 100`) se envía al backend vía `POST /api/trivia/save-score` y se suma a los puntos del usuario en la base de datos.

---

## Configuración requerida

En el archivo `.env` del proyecto:

```
VITE_GEMINI_API_KEY=tu_clave_aqui
```

La clave se obtiene en [Google AI Studio](https://aistudio.google.com/app/apikey). El prefijo `VITE_` es obligatorio para que Vite la exponga al frontend.
