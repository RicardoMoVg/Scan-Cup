export interface Card {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isCollected?: boolean;
    // New fields for design
    country?: string; // e.g. "Argentina"
    position?: string; // e.g. "FW"
    stats?: {
        speed: number;
        shooting: number;
        power: number;
    };
    rarity?: 'common' | 'rare' | 'legendary';
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    level: number;
    points: number;
    // New fields
    rank?: number;
    collectionCount?: number;
}

export interface MatchEvent {
    id: string;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
    minute: number;
    player: string;
    team: 'home' | 'away';
}

export interface Narration {
    id: string;
    minute: number;
    text: string;
    type: 'goal' | 'card' | 'commentary' | 'status';
}

export interface Match {
    id: string;
    homeTeam: string;
    homeFlag: string;
    awayTeam: string;
    awayFlag: string;
    homeScore: number;
    awayScore: number;
    time: number; // in minutes (0-90)
    status: 'not_started' | 'first_half' | 'half_time' | 'second_half' | 'finished';
    events: MatchEvent[];
    venue: string;
    narrations: Narration[];
}
