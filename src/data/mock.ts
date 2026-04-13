import type { Card, User } from '../types';
import MessiImg from '../assets/Images/Messi.png';

export const mockUser: User = {
    id: "8821",
    name: "Carlos Montalvo",
    email: "carlos@scancup.com",
    avatarUrl: "https://images.unsplash.com/photo-1546519638-68e109498ee3?q=80&w=2670&auto=format&fit=crop",
    level: 12,
    points: 4500,
    rank: 42,
    collectionCount: 3
};

// Helper function to create cards
const createCard = (id: string, name: string, country: string, position: string, isCollected: boolean = false, rarity: 'common' | 'rare' | 'legendary' = 'common'): Card => ({
    id,
    name,
    description: `Jugador profesional de ${country}`,
    imageUrl: MessiImg, // Updated to use local Messi image
    isCollected,
    country,
    position,
    stats: { speed: 75 + Math.floor(Math.random() * 20), shooting: 75 + Math.floor(Math.random() * 20), power: 75 + Math.floor(Math.random() * 20) },
    rarity
});

export const mockCards: Card[] = [
    // 3 Collected cards
    {
        id: "MES-10",
        name: "Lionel Messi",
        description: "El capitán legendario, maestro del regate y la visión.",
        imageUrl: MessiImg,
        isCollected: true,
        country: "Argentina",
        position: "DEL",
        stats: { speed: 85, shooting: 96, power: 80 },
        rarity: 'legendary'
    },
    {
        id: "MBP-09",
        name: "Kylian Mbappé",
        description: "Velocidad explosiva y definición letal.",
        imageUrl: MessiImg,
        isCollected: true,
        country: "Francia",
        position: "EXT",
        stats: { speed: 97, shooting: 92, power: 88 },
        rarity: 'rare'
    },
    {
        id: "MOD-10",
        name: "Luka Modrić",
        description: "El motor del mediocampo, elegancia y precisión.",
        imageUrl: MessiImg,
        isCollected: true,
        country: "Croacia",
        position: "MC",
        stats: { speed: 75, shooting: 82, power: 70 },
        rarity: 'common'
    },

    // 45 Uncollected cards
    createCard("CR7-07", "Cristiano Ronaldo", "Portugal", "DEL", false, 'legendary'),
    createCard("NEY-11", "Neymar Jr", "Brasil", "EXT", false, 'rare'),
    createCard("HAL-09", "Erling Haaland", "Noruega", "DEL", false, 'rare'),
    createCard("SAL-11", "Mohamed Salah", "Egipto", "EXT", false, 'rare'),
    createCard("LEW-09", "Robert Lewandowski", "Polonia", "DEL", false, 'common'),
    createCard("BEN-09", "Karim Benzema", "Francia", "DEL", false, 'common'),
    createCard("KDB-17", "Kevin De Bruyne", "Bélgica", "MC", false, 'rare'),

    createCard("VVD-04", "Virgil van Dijk", "Holanda", "DEF", false, 'common'),
    createCard("COU-23", "Thibaut Courtois", "Bélgica", "POR", false, 'common'),
    createCard("KAN-07", "N'Golo Kanté", "Francia", "MC", false, 'common'),
    createCard("SON-07", "Son Heung-min", "Corea del Sur", "EXT", false, 'common'),
    createCard("MAH-26", "Riyad Mahrez", "Argelia", "EXT", false, 'common'),
    createCard("CAS-14", "Casemiro", "Brasil", "MC", false, 'common'),
    createCard("ALL-13", "Alisson Becker", "Brasil", "POR", false, 'common'),

    createCard("RUD-02", "Antonio Rüdiger", "Alemania", "DEF", false, 'common'),
    createCard("MAR-05", "Marquinhos", "Brasil", "DEF", false, 'common'),
    createCard("DIA-03", "Rúben Dias", "Portugal", "DEF", false, 'common'),
    createCard("KOU-26", "Kalidou Koulibaly", "Senegal", "DEF", false, 'common'),
    createCard("WAL-02", "Kyle Walker", "Inglaterra", "DEF", false, 'common'),
    createCard("CAN-19", "João Cancelo", "Portugal", "DEF", false, 'common'),
    createCard("REE-03", "Reece James", "Inglaterra", "DEF", false, 'common'),

    createCard("BRU-08", "Bruno Fernandes", "Portugal", "MC", false, 'common'),
    createCard("BAR-18", "Pedri", "España", "MC", false, 'common'),
    createCard("GAV-06", "Gavi", "España", "MC", false, 'common'),
    createCard("BEL-08", "Jude Bellingham", "Inglaterra", "MC", false, 'rare'),
    createCard("FRE-20", "Frenkie de Jong", "Holanda", "MC", false, 'common'),
    createCard("VER-23", "Marco Verratti", "Italia", "MC", false, 'common'),
    createCard("THI-06", "Thiago Alcántara", "España", "MC", false, 'common'),

    createCard("VIN-07", "Vinícius Jr", "Brasil", "EXT", false, 'rare'),
    createCard("RAP-10", "Raphinha", "Brasil", "EXT", false, 'common'),
    createCard("SAK-07", "Bukayo Saka", "Inglaterra", "EXT", false, 'common'),
    createCard("FOD-20", "Phil Foden", "Inglaterra", "EXT", false, 'common'),
    createCard("GRI-07", "Antoine Griezmann", "Francia", "DEL", false, 'common'),
    createCard("MUL-25", "Thomas Müller", "Alemania", "DEL", false, 'common'),
    createCard("KAN-09", "Harry Kane", "Inglaterra", "DEL", false, 'rare'),

    createCard("OSI-09", "Victor Osimhen", "Nigeria", "DEL", false, 'common'),
    createCard("RAC-11", "Marcus Rashford", "Inglaterra", "EXT", false, 'common'),
    createCard("CHU-17", "Chuameni", "Francia", "MC", false, 'common'),
    createCard("ROD-16", "Rodri", "España", "MC", false, 'common'),
    createCard("KOV-08", "Mateo Kovačić", "Croacia", "MC", false, 'common'),
    createCard("MIL-04", "Eder Militão", "Brasil", "DEF", false, 'common'),
    createCard("ARA-04", "Ronald Araújo", "Uruguay", "DEF", false, 'common'),
    createCard("KOS-15", "Diogo Costa", "Portugal", "POR", false, 'common'),
    createCard("DON-21", "Gianluigi Donnarumma", "Italia", "POR", false, 'common'),
    createCard("TER-01", "Marc-André ter Stegen", "Alemania", "POR", false, 'common'),

    // Cartas escaneables por QR que faltaban en el catálogo local
    createCard("OCH-01", "Guillermo Ochoa",   "México", "POR", false, 'rare'),
    createCard("PUL-10", "Christian Pulisic", "USA",    "EXT", false, 'rare'),
    createCard("TAK-08", "Takefusa Kubo",     "Japón",  "EXT", false, 'rare'),
];

