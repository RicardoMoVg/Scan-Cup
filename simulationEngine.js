import { randomUUID } from 'crypto';

// ── Pool de equipos ──────────────────────────────────────────────────────
const TEAMS = [
    { name: 'México',    flag: '🇲🇽' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Brasil',    flag: '🇧🇷' },
    { name: 'Francia',   flag: '🇫🇷' },
    { name: 'Alemania',  flag: '🇩🇪' },
    { name: 'España',    flag: '🇪🇸' },
    { name: 'Portugal',  flag: '🇵🇹' },
    { name: 'Inglaterra',flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { name: 'Países Bajos', flag: '🇳🇱' },
    { name: 'Uruguay',   flag: '🇺🇾' },
    { name: 'Colombia',  flag: '🇨🇴' },
    { name: 'Marruecos', flag: '🇲🇦' },
    { name: 'Japón',     flag: '🇯🇵' },
    { name: 'USA',       flag: '🇺🇸' },
    { name: 'Croacia',   flag: '🇭🇷' },
    { name: 'Senegal',   flag: '🇸🇳' },
];

// ── Pool de sedes ────────────────────────────────────────────────────────
const VENUES = [
    'Estadio Azteca · Ciudad de México, México',
    'AT&T Stadium · Arlington, Texas, EUA',
    'MetLife Stadium · East Rutherford, Nueva Jersey, EUA',
    'Rose Bowl · Pasadena, California, EUA',
    'Estadio Akron · Guadalajara, México',
    'BC Place · Vancouver, Canadá',
    'Allegiant Stadium · Las Vegas, Nevada, EUA',
    'Hard Rock Stadium · Miami, Florida, EUA',
    'Levi\'s Stadium · Santa Clara, California, EUA',
    'SoFi Stadium · Inglewood, California, EUA',
];

// ── Rosters por equipo ──────────────────────────────────────────────────
const ROSTERS = {
    'México':       ['Memo Ochoa', 'Edson Álvarez', 'Hirving Lozano', 'Raúl Jiménez', 'Alexis Vega', 'Henry Martín', 'Orbelín Pineda', 'Héctor Herrera', 'Jorge Sánchez', 'César Montes'],
    'Argentina':    ['Lionel Messi', 'Julián Álvarez', 'Lautaro Martínez', 'Rodrigo De Paul', 'Paulo Dybala', 'Alexis Mac Allister', 'Ángel Di María', 'Thiago Almada', 'Nahuel Molina', 'Lisandro Martínez'],
    'Brasil':       ['Vinícius Jr.', 'Rodrygo', 'Endrick', 'Richarlison', 'Casemiro', 'Bruno Guimarães', 'Raphinha', 'Lucas Paquetá', 'Marquinhos', 'Militão'],
    'Francia':      ['Kylian Mbappé', 'Antoine Griezmann', 'Ousmane Dembélé', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Marcus Thuram', 'Kingsley Coman', 'Adrien Rabiot', 'Jules Koundé', 'Dayot Upamecano'],
    'Alemania':     ['Jamal Musiala', 'Florian Wirtz', 'Leroy Sané', 'Thomas Müller', 'Kai Havertz', 'Joshua Kimmich', 'Toni Kroos', 'Ilkay Gündogan', 'Antonio Rüdiger', 'Niklas Süle'],
    'España':       ['Pedri', 'Gavi', 'Lamine Yamal', 'Álvaro Morata', 'Nico Williams', 'Dani Olmo', 'Rodri', 'Fabián Ruiz', 'Dani Carvajal', 'Aymeric Laporte'],
    'Portugal':     ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'Rafael Leão', 'João Cancelo', 'Rúben Dias', 'Vitinha', 'João Félix', 'Diogo Jota', 'Gonçalo Inácio'],
    'Inglaterra':   ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka', 'Phil Foden', 'Marcus Rashford', 'Declan Rice', 'Trent Alexander-Arnold', 'Kyle Walker', 'John Stones', 'Jordan Pickford'],
    'Países Bajos': ['Virgil van Dijk', 'Memphis Depay', 'Cody Gakpo', 'Xavi Simons', 'Frenkie de Jong', 'Davy Klaassen', 'Nathan Aké', 'Denzel Dumfries', 'Steven Bergwijn', 'Wout Weghorst'],
    'Uruguay':      ['Darwin Núñez', 'Federico Valverde', 'Luis Suárez', 'Rodrigo Bentancur', 'Ronald Araújo', 'José María Giménez', 'Matías Vecino', 'Facundo Pellistri', 'Maxi Gómez', 'Sergio Rochet'],
    'Colombia':     ['James Rodríguez', 'Luis Díaz', 'Falcao García', 'Radamel Falcao', 'Cuadrado', 'Yerlan Zapata', 'David Ospina', 'Wilmar Barrios', 'Jhon Córdoba', 'Matheus Uribe'],
    'Marruecos':    ['Achraf Hakimi', 'Hakim Ziyech', 'Youssef En-Nesyri', 'Sofyan Amrabat', 'Noussair Mazraoui', 'Romain Saïss', 'Azzedine Ounahi', 'Abdessamad Ezzalzouli', 'Munir El Haddadi', 'Yassine Bounou'],
    'Japón':        ['Takumi Minamino', 'Daichi Kamada', 'Kaoru Mitoma', 'Ritsu Doan', 'Hiroki Sakai', 'Maya Yoshida', 'Wataru Endo', 'Ao Tanaka', 'Takehiro Tomiyasu', 'Shuichi Gonda'],
    'USA':          ['Christian Pulisic', 'Gio Reyna', 'Tyler Adams', 'Weston McKennie', 'Brenden Aaronson', 'Sergiño Dest', 'Matt Turner', 'Walker Zimmerman', 'Tim Weah', 'Ricardo Pepi'],
    'Croacia':      ['Luka Modrić', 'Ivan Perišić', 'Mateo Kovačić', 'Marcelo Brozović', 'Bruno Petković', 'Dejan Lovren', 'Joško Gvardiol', 'Ante Budimir', 'Mario Pašalić', 'Dominik Livaković'],
    'Senegal':      ['Sadio Mané', 'Edouard Mendy', 'Kalidou Koulibaly', 'Idrissa Gueye', 'Ismaïla Sarr', 'Famara Diédhiou', 'Cheikhou Kouyaté', 'Formose Mendy', 'Boulaye Dia', 'Pape Matar Sarr'],
};

function randomPlayer(teamName) {
    const roster = ROSTERS[teamName] || ['Jugador'];
    return roster[Math.floor(Math.random() * roster.length)];
}

// ── Comentarios generales ───────────────────────────────────────────────
const COMMENTARY_TEMPLATES = [
    (m) => `${m.homeTeam} mantiene la posesión en campo contrario.`,
    (m) => `Gran presión de ${m.awayTeam} en la salida de ${m.homeTeam}.`,
    (m) => `El árbitro detiene brevemente el juego por una falta menor.`,
    (m) => `Tiro de esquina para ${m.homeTeam}, despejado por la defensa.`,
    (m) => `¡Disparo que sale muy desviado! ${m.awayTeam} no aprovecha.`,
    (m) => `El portero de ${m.homeTeam} sale a cortar un peligroso centro.`,
    (m) => `Falta en el mediocampo, el juego se detiene momentáneamente.`,
    (m) => `${m.awayTeam} intenta una jugada por la banda derecha.`,
    (m) => `El ritmo del partido aumenta. Ambos equipos buscan el gol.`,
    (m) => `Gran salvada del portero. El juego continúa vibrante.`,
    (m) => `Tiro libre desde la frontal del área... sale al córner.`,
    (m) => `${m.homeTeam} recupera el balón rápidamente y contraataca.`,
    (m) => `¡Ocasión clarísima fallada! El estadio no puede creerlo.`,
    (m) => `El VAR revisa una posible falta dentro del área... sin novedad.`,
    (m) => `Fuerte disparo de larga distancia. El balón sale por encima del travesaño.`,
    (m) => `El técnico de ${m.awayTeam} da instrucciones desde la banda.`,
    (m) => `Buen pressing de ${m.homeTeam} en campo rival.`,
    (m) => `Duelo intenso en el mediocampo, ningún equipo cede terreno.`,
];

function randomCommentary(match) {
    const fn = COMMENTARY_TEMPLATES[Math.floor(Math.random() * COMMENTARY_TEMPLATES.length)];
    return fn(match);
}

function makeNarration(id, minute, text, type) {
    return { id, minute, text, type };
}

function uid() {
    return randomUUID();
}

// ── Generador de partidos aleatorios ────────────────────────────────────

/** Fisher-Yates shuffle — devuelve una copia mezclada del array */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Genera 3 partidos con equipos y sedes distintos, sorteados al azar.
 * Los partidos arrancan en momentos diferentes para dar variedad:
 *   - Partido 1: primer tiempo, minuto 0-20
 *   - Partido 2: primer tiempo avanzado, minuto 25-40
 *   - Partido 3: segundo tiempo, minuto 55-80
 */
function createInitialMatches() {
    const selectedTeams = shuffle(TEAMS).slice(0, 6);  // 6 equipos distintos → 3 duelos
    const selectedVenues = shuffle(VENUES).slice(0, 3);

    const kickoffMinutes = [
        Math.floor(Math.random() * 20),            // 0-19 (primer tiempo temprano)
        25 + Math.floor(Math.random() * 16),       // 25-40 (primer tiempo avanzado)
        55 + Math.floor(Math.random() * 26),       // 55-80 (segundo tiempo)
    ];

    return [0, 1, 2].map((i) => {
        const home = selectedTeams[i * 2];
        const away = selectedTeams[i * 2 + 1];
        const time = kickoffMinutes[i];
        const status = time <= 45 ? 'first_half' : 'second_half';
        const venue = selectedVenues[i];
        const id = `m${i + 1}_${Date.now()}`;

        return {
            id,
            homeTeam: home.name,
            homeFlag: home.flag,
            awayTeam: away.name,
            awayFlag: away.flag,
            homeScore: 0,
            awayScore: 0,
            time,
            status,
            venue,
            events: [],
            narrations: [
                makeNarration(uid(), 0, `¡Arranca el partido en ${venue.split('·')[0].trim()}! ${home.name} se enfrenta a ${away.name}. El estadio está listo.`, 'status'),
            ],
        };
    });
}

export function startSimulation(io) {
    let matches = createInitialMatches();
    let restartScheduled = false;

    // ── WebSocket: enviar estado inicial al conectar ──────────────────────
    io.on('connection', (socket) => {
        console.log(`[WebSocket] Cliente conectado: ${socket.id}`);
        socket.emit('matches:update', matches);

        socket.on('disconnect', () => {
            console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
        });
    });

    // ── Intervalo de simulación: 3 s = 1 minuto de juego ─────────────────
    setInterval(() => {
        let updated = false;

        matches = matches.map((match) => {
            if (match.status === 'not_started' || match.status === 'finished' || match.status === 'half_time') {
                return match;
            }

            updated = true;
            match.time += 1;

            // ── Transición al descanso (min 45) ──────────────────────────
            if (match.time === 45 && match.status === 'first_half') {
                match.status = 'half_time';
                match.narrations.push(makeNarration(
                    uid(),
                    45,
                    `Pitido final del primer tiempo. ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}. Los equipos se van al descanso.`,
                    'status'
                ));
                setTimeout(() => {
                    match.status = 'second_half';
                    match.narrations.push(makeNarration(
                        uid(),
                        46,
                        `¡Arranca el segundo tiempo! Los equipos regresan al campo dispuestos a definir el marcador.`,
                        'status'
                    ));
                    io.emit('matches:update', matches);
                }, 15000); // 15 s de descanso simulado
                return match; // Bug 1: evitar eventos en el minuto de transicion
            }

            // ── Fin del partido (min 90) ──────────────────────────────────
            if (match.time >= 90) {
                match.status = 'finished';
                match.time = 90;
                match.narrations.push(makeNarration(
                    uid(),
                    90,
                    `¡Pitido final! Termina el partido. Resultado definitivo: ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}.`,
                    'status'
                ));
                return match;
            }

            // ── Gol (~2% por minuto) ─────────────────────────────────────
            if (Math.random() < 0.02) {
                const isHomeGoal = Math.random() > 0.5;
                const scoringTeam = isHomeGoal ? match.homeTeam : match.awayTeam;
                const player = randomPlayer(scoringTeam);
                const side = isHomeGoal ? 'home' : 'away';

                if (isHomeGoal) match.homeScore += 1;
                else match.awayScore += 1;

                match.events.push({ id: uid(), type: 'goal', minute: match.time, player, team: side });

                const goalTexts = [
                    `¡¡¡GOOOOL DE ${scoringTeam.toUpperCase()}!!! ${player} anota en el minuto ${match.time}. ${match.homeScore}-${match.awayScore}. ¡El estadio explota!`,
                    `¡GOOOL! ${player} no perdona y pone el ${match.homeScore}-${match.awayScore} para ${scoringTeam}. ¡Qué tanto!`,
                    `¡Qué golazo de ${player}! Define con clase en el ${match.time}' y pone el ${match.homeScore}-${match.awayScore}.`,
                ];
                match.narrations.push(makeNarration(
                    uid(),
                    match.time,
                    goalTexts[Math.floor(Math.random() * goalTexts.length)],
                    'goal'
                ));
            }

            // ── Tarjeta amarilla (~1.5% por minuto) ──────────────────────
            if (Math.random() < 0.015) {
                const isHomeCard = Math.random() > 0.5;
                const cardTeam = isHomeCard ? match.homeTeam : match.awayTeam;
                const player = randomPlayer(cardTeam);
                const side = isHomeCard ? 'home' : 'away';

                match.events.push({ id: uid(), type: 'yellow_card', minute: match.time, player, team: side });

                const cardTexts = [
                    `🟨 Tarjeta amarilla para ${player} (${cardTeam}) en el minuto ${match.time}.`,
                    `🟨 El árbitro amonesta a ${player} de ${cardTeam}. Falta dura en el ${match.time}'.`,
                ];
                match.narrations.push(makeNarration(
                    uid(),
                    match.time,
                    cardTexts[Math.floor(Math.random() * cardTexts.length)],
                    'card'
                ));
            }

            // ── Sustitución (~1% por minuto, solo 2ª parte desde min 55) ─
            if (match.time >= 55 && match.status === 'second_half' && Math.random() < 0.01) {
                const isHomeChange = Math.random() > 0.5;
                const subTeam = isHomeChange ? match.homeTeam : match.awayTeam;
                const roster = ROSTERS[subTeam] || ['Jugador A', 'Jugador B'];
                const outIdx = Math.floor(Math.random() * roster.length);
                const playerOut = roster[outIdx];
                const remaining = roster.filter((_, i) => i !== outIdx); // Bug 6: garantiza jugadores distintos
                const playerIn = remaining[Math.floor(Math.random() * remaining.length)];
                const side = isHomeChange ? 'home' : 'away';
                match.events.push({ id: uid(), type: 'substitution', minute: match.time, player: playerIn, team: side });
                match.narrations.push(makeNarration(
                    uid(),
                    match.time,
                    `🔄 Sustitución en ${subTeam}: sale ${playerOut}, entra ${playerIn} en el minuto ${match.time}.`,
                    'commentary'
                ));
            }

            // ── Tarjeta roja (~0.3% por minuto) ─────────────────────────── Bug 5
            if (Math.random() < 0.003) {
                const isHomeCard = Math.random() > 0.5;
                const cardTeam = isHomeCard ? match.homeTeam : match.awayTeam;
                const player = randomPlayer(cardTeam);
                const side = isHomeCard ? 'home' : 'away';
                match.events.push({ id: uid(), type: 'red_card', minute: match.time, player, team: side });
                const redCardTexts = [
                    `🟥 ¡Tarjeta ROJA para ${player} (${cardTeam}) en el minuto ${match.time}! Se queda con diez.`,
                    `🟥 ¡Expulsado ${player} de ${cardTeam}! El árbitro no dudó en el ${match.time}'.`,
                ];
                match.narrations.push(makeNarration(
                    uid(),
                    match.time,
                    redCardTexts[Math.floor(Math.random() * redCardTexts.length)],
                    'card'
                ));
            }

            // ── Comentario general (~12% por minuto) ─────────────────────
            if (Math.random() < 0.12) {
                match.narrations.push(makeNarration(
                    uid(),
                    match.time,
                    randomCommentary(match),
                    'commentary'
                ));
            }

            // Bug 2: limitar narrations para evitar crecimiento ilimitado de memoria
            if (match.narrations.length > 100) {
                match.narrations = match.narrations.slice(-100);
            }

            return match;
        });

        if (updated) {
            io.emit('matches:update', matches);
        }

        // Reiniciar cuando todos los partidos terminan
        const allFinished = matches.every(m => m.status === 'finished');
        if (allFinished && !restartScheduled) {
            restartScheduled = true;
            console.log('[Simulacion] Todos los partidos finalizados. Nueva ronda en 10s...');
            setTimeout(() => {
                matches = createInitialMatches();
                restartScheduled = false;
                console.log('[Simulacion] ¡Nueva ronda iniciada!');
                io.emit('matches:update', matches);
            }, 10000);
        }
    }, 3000);
}
