// ── Rosters por equipo ──────────────────────────────────────────────────
const ROSTERS = {
    'México':    ['Memo Ochoa', 'Edson Álvarez', 'Hirving Lozano', 'Raúl Jiménez', 'Alexis Vega', 'Henry Martín', 'Orbelín Pineda', 'Héctor Herrera', 'Jorge Sánchez', 'César Montes'],
    'Argentina': ['Lionel Messi', 'Julián Álvarez', 'Lautaro Martínez', 'Rodrigo De Paul', 'Paulo Dybala', 'Alexis Mac Allister', 'Ángel Di María', 'Thiago Almada', 'Nahuel Molina', 'Lisandro Martínez'],
    'Brasil':    ['Vinícius Jr.', 'Rodrygo', 'Endrick', 'Richarlison', 'Casemiro', 'Bruno Guimarães', 'Raphinha', 'Lucas Paquetá', 'Marquinhos', 'Militão'],
    'Francia':   ['Kylian Mbappé', 'Antoine Griezmann', 'Ousmane Dembélé', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Marcus Thuram', 'Kingsley Coman', 'Adrien Rabiot', 'Jules Koundé', 'Dayot Upamecano'],
    'Alemania':  ['Jamal Musiala', 'Florian Wirtz', 'Leroy Sané', 'Thomas Müller', 'Kai Havertz', 'Joshua Kimmich', 'Toni Kroos', 'Ilkay Gündogan', 'Antonio Rüdiger', 'Niklas Süle'],
    'España':    ['Pedri', 'Gavi', 'Lamine Yamal', 'Álvaro Morata', 'Nico Williams', 'Dani Olmo', 'Rodri', 'Fabián Ruiz', 'Dani Carvajal', 'Aymeric Laporte'],
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

function uid(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── Datos iniciales ─────────────────────────────────────────────────────
export function startSimulation(io) {
    let matches = [
        {
            id: 'm1',
            homeTeam: 'México',
            homeFlag: '🇲🇽',
            awayTeam: 'Argentina',
            awayFlag: '🇦🇷',
            homeScore: 0,
            awayScore: 0,
            time: 0,
            status: 'first_half',
            venue: 'Estadio Azteca · Ciudad de México, México',
            events: [],
            narrations: [
                makeNarration('n_m1_0', 0, '¡Arranca el partido en el Azteca! México recibe a Argentina en un duelo histórico. El estadio está completamente lleno.', 'status'),
            ],
        },
        {
            id: 'm2',
            homeTeam: 'Brasil',
            homeFlag: '🇧🇷',
            awayTeam: 'Francia',
            awayFlag: '🇫🇷',
            homeScore: 1,
            awayScore: 0,
            time: 30,
            status: 'first_half',
            venue: 'AT&T Stadium · Arlington, Texas, EUA',
            events: [
                { id: 'e1', type: 'goal', minute: 23, player: 'Vinícius Jr.', team: 'home' }
            ],
            narrations: [
                makeNarration('n_m2_0', 0, '¡Comienza el encuentro en el AT&T Stadium! Brasil vs Francia, un choque de titanes.', 'status'),
                makeNarration('n_m2_23', 23, '¡GOOOOL DE BRASIL! Vinícius Jr. recibe en profundidad, se va de dos defensores y define con la zurda. ¡Magistral! 1-0.', 'goal'),
                makeNarration('n_m2_26', 26, 'Francia intenta reaccionar. Los Bleus aumentan la presión en campo brasileño.', 'commentary'),
                makeNarration('n_m2_29', 29, `Mbappé busca el empate. Disparo que despeja la defensa con apuros.`, 'commentary'),
            ],
        },
        {
            id: 'm3',
            homeTeam: 'Alemania',
            homeFlag: '🇩🇪',
            awayTeam: 'España',
            awayFlag: '🇪🇸',
            homeScore: 2,
            awayScore: 2,
            time: 80,
            status: 'second_half',
            venue: 'MetLife Stadium · East Rutherford, Nueva Jersey, EUA',
            events: [
                { id: 'e2', type: 'goal', minute: 15, player: 'Álvaro Morata', team: 'away' },
                { id: 'e3', type: 'goal', minute: 42, player: 'Jamal Musiala', team: 'home' },
                { id: 'e4', type: 'goal', minute: 60, player: 'Lamine Yamal', team: 'away' },
                { id: 'e5', type: 'goal', minute: 75, player: 'Florian Wirtz', team: 'home' },
                { id: 'e6', type: 'yellow_card', minute: 38, player: 'Rodri', team: 'away' },
                { id: 'e7', type: 'substitution', minute: 62, player: 'Kai Havertz', team: 'home' },
            ],
            narrations: [
                makeNarration('n_m3_0', 0, '¡Arranca el choque europeo en MetLife Stadium! Alemania vs España, clásico del fútbol mundial.', 'status'),
                makeNarration('n_m3_15', 15, '¡GOOOL DE ESPAÑA! Álvaro Morata cabecea impecable un centro de Pedri. La Roja se adelanta. 0-1.', 'goal'),
                makeNarration('n_m3_38', 38, '🟨 Tarjeta amarilla para Rodri (España) por una falta sobre Wirtz.', 'card'),
                makeNarration('n_m3_42', 42, '¡EMPATA ALEMANIA! Jamal Musiala, con una volea de ensueño, bate al portero español antes del descanso. 1-1.', 'goal'),
                makeNarration('n_m3_45', 45, 'Termina el primer tiempo. 1-1 en el marcador. Partido de altísimo nivel.', 'status'),
                makeNarration('n_m3_46', 46, '¡Arranca el segundo tiempo! España sale decidida a recuperar la ventaja.', 'status'),
                makeNarration('n_m3_60', 60, '¡GOOOL DE ESPAÑA! ¡Lamine Yamal, con 17 años, aparece en el área chica y empuja el balón al fondo! ¡Prodigio! 1-2.', 'goal'),
                makeNarration('n_m3_62', 62, '🔄 Sustitución en Alemania: entra Kai Havertz buscando más presencia en ataque.', 'commentary'),
                makeNarration('n_m3_75', 75, '¡EMPATA ALEMANIA OTRA VEZ! Florian Wirtz dispara desde fuera del área y el balón entra en el ángulo. ¡Increíble! 2-2.', 'goal'),
                makeNarration('n_m3_78', 78, 'El estadio está en pie. 2-2 con 10 minutos por jugar. Cualquiera puede ganar esto.', 'commentary'),
            ],
        }
    ];

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
                    uid('ht'),
                    45,
                    `Pitido final del primer tiempo. ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}. Los equipos se van al descanso.`,
                    'status'
                ));
                setTimeout(() => {
                    match.status = 'second_half';
                    match.narrations.push(makeNarration(
                        uid('st'),
                        46,
                        `¡Arranca el segundo tiempo! Los equipos regresan al campo dispuestos a definir el marcador.`,
                        'status'
                    ));
                    io.emit('matches:update', matches);
                }, 15000); // 15 s de descanso simulado
            }

            // ── Fin del partido (min 90) ──────────────────────────────────
            if (match.time >= 90) {
                match.status = 'finished';
                match.time = 90;
                match.narrations.push(makeNarration(
                    uid('end'),
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

                match.events.push({ id: uid('g'), type: 'goal', minute: match.time, player, team: side });

                const goalTexts = [
                    `¡¡¡GOOOOL DE ${scoringTeam.toUpperCase()}!!! ${player} anota en el minuto ${match.time}. ${match.homeScore}-${match.awayScore}. ¡El estadio explota!`,
                    `¡GOOOL! ${player} no perdona y pone el ${match.homeScore}-${match.awayScore} para ${scoringTeam}. ¡Qué tanto!`,
                    `¡Qué golazo de ${player}! Define con clase en el ${match.time}' y pone el ${match.homeScore}-${match.awayScore}.`,
                ];
                match.narrations.push(makeNarration(
                    uid('gn'),
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

                match.events.push({ id: uid('yc'), type: 'yellow_card', minute: match.time, player, team: side });

                const cardTexts = [
                    `🟨 Tarjeta amarilla para ${player} (${cardTeam}) en el minuto ${match.time}.`,
                    `🟨 El árbitro amonesta a ${player} de ${cardTeam}. Falta dura en el ${match.time}'.`,
                ];
                match.narrations.push(makeNarration(
                    uid('cn'),
                    match.time,
                    cardTexts[Math.floor(Math.random() * cardTexts.length)],
                    'card'
                ));
            }

            // ── Sustitución (~1% por minuto, solo 2ª parte desde min 55) ─
            if (match.time >= 55 && match.status === 'second_half' && Math.random() < 0.01) {
                const isHomeChange = Math.random() > 0.5;
                const subTeam = isHomeChange ? match.homeTeam : match.awayTeam;
                const playerOut = randomPlayer(subTeam);
                const playerIn = randomPlayer(subTeam);
                if (playerOut !== playerIn) {
                    const side = isHomeChange ? 'home' : 'away';
                    match.events.push({ id: uid('sub'), type: 'substitution', minute: match.time, player: playerIn, team: side });
                    match.narrations.push(makeNarration(
                        uid('subn'),
                        match.time,
                        `🔄 Sustitución en ${subTeam}: sale ${playerOut}, entra ${playerIn} en el minuto ${match.time}.`,
                        'commentary'
                    ));
                }
            }

            // ── Comentario general (~12% por minuto) ─────────────────────
            if (Math.random() < 0.12) {
                match.narrations.push(makeNarration(
                    uid('cm'),
                    match.time,
                    randomCommentary(match),
                    'commentary'
                ));
            }

            return match;
        });

        if (updated) {
            io.emit('matches:update', matches);
        }
    }, 3000);
}
