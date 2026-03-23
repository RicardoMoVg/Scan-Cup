export interface TriviaQuestion {
    id: number;
    number: number;
    total: number;
    level: string;
    streak: number;
    text: string;
    options: { id: string; text: string }[];
    correct: string;
}

export interface PlayerInfo {
    name: string;
    position: string;
    team: string;
}

export const playerNameMap: Record<string, PlayerInfo> = {
    'messi2026':    { name: 'Lionel Messi',        position: 'DEL', team: 'ARG' },
    'messi':        { name: 'Lionel Messi',        position: 'DEL', team: 'ARG' },
    'ochoa2026':    { name: 'Guillermo Ochoa',     position: 'POR', team: 'MEX' },
    'ochoa':        { name: 'Guillermo Ochoa',     position: 'POR', team: 'MEX' },
    'mbappe2026':   { name: 'Kylian Mbappé',       position: 'EXT', team: 'FRA' },
    'neymar2026':   { name: 'Neymar Jr.',          position: 'EXT', team: 'BRA' },
    'pulisic2026':  { name: 'Christian Pulisic',   position: 'EXT', team: 'USA' },
    'ronaldo2026':  { name: 'Cristiano Ronaldo',   position: 'DEL', team: 'POR' },
    'son2026':      { name: 'Son Heung-min',        position: 'EXT', team: 'KOR' },
    'takefusa2026': { name: 'Takefusa Kubo',       position: 'EXT', team: 'JPN' },
};

// Mapeo de modelId (QR escaneado) → CardId en la base de datos
export const modelToCardId: Record<string, string> = {
    'messi2026':    'MES-10',
    'messi':        'MES-10',
    'ochoa2026':    'OCH-01',
    'ochoa':        'OCH-01',
    'mbappe2026':   'MBP-09',
    'neymar2026':   'NEY-11',
    'pulisic2026':  'PUL-10',
    'ronaldo2026':  'CR7-07',
    'son2026':      'SON-07',
    'takefusa2026': 'TAK-08',
};

const LEVELS = ['Pro', 'Pro', 'Experto', 'Experto', 'Leyenda'];
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateTriviaQuestions(playerName: string): Promise<TriviaQuestion[]> {
    const cacheKey = `trivia_cache_${playerName}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const prompt = `Eres un experto en fútbol. Genera exactamente 5 preguntas de trivia de opción múltiple sobre el futbolista ${playerName}. Las preguntas deben ser variadas: logros, estadísticas, clubes, selección nacional e historia personal. Responde ÚNICAMENTE con un JSON válido con este formato exacto, sin texto adicional ni markdown:
{
  "preguntas": [
    {
      "texto": "¿Pregunta sobre ${playerName}?",
      "opciones": {"A": "opción1", "B": "opción2", "C": "opción3", "D": "opción4"},
      "correcta": "A"
    }
  ]
}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json"
                }
            })
        }
    );

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Límite de la API de Gemini alcanzado. Espera un momento antes de volver a intentar.');
        }
        throw new Error(`Error de API: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('La IA no devolvió resultados válidos.');
    }

    const rawText: string = data.candidates[0].content.parts[0].text;
    
    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch (e) {
        console.error("Error procesando JSON de Gemini:", rawText);
        throw new Error('El formato de la trivia no es compatible o está incompleto. Intenta de nuevo.');
    }

    if (!parsed.preguntas || !Array.isArray(parsed.preguntas)) {
        throw new Error('La estructura del JSON no contiene preguntas.');
    }

    const questions: TriviaQuestion[] = parsed.preguntas.slice(0, 5).map(
        (q: { texto: string; opciones: Record<string, string>; correcta: string }, i: number) => ({
            id: i + 1,
            number: i + 1,
            total: 5,
            level: LEVELS[i],
            streak: i + 1,
            text: String(q.texto),
            options: Object.entries(q.opciones).map(([id, text]) => ({ id, text: String(text) })),
            correct: String(q.correcta).toUpperCase().trim(),
        })
    );

    sessionStorage.setItem(cacheKey, JSON.stringify(questions));
    return questions;
}
