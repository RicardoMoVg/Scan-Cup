import { API_BASE } from './apiBase';

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

export async function generateTriviaQuestions(playerName: string): Promise<TriviaQuestion[]> {
    const cacheKey = `trivia_cache_${playerName}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Sesión no iniciada. Inicia sesión para jugar la trivia.');

    const response = await fetch(`${API_BASE}/api/trivia/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerName })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
            throw new Error('Límite de la API alcanzado. Espera un momento antes de volver a intentar.');
        }
        throw new Error(errorData.message || `Error del servidor (${response.status})`);
    }

    const data = await response.json();
    if (!data.success || !data.questions) {
        throw new Error(data.message || 'El servidor no devolvió preguntas válidas.');
    }

    sessionStorage.setItem(cacheKey, JSON.stringify(data.questions));
    return data.questions as TriviaQuestion[];
}
