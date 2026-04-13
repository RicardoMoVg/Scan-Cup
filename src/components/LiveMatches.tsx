import type { Match } from '../types'

function statusLabel(status: Match['status']) {
    switch (status) {
        case 'first_half':
        case 'second_half':
            return { text: 'EN VIVO', live: true }
        case 'half_time':
            return { text: 'DESCANSO', live: false }
        case 'not_started':
            return { text: 'POR JUGAR', live: false }
        case 'finished':
            return { text: 'FINALIZADO', live: false }
    }
}

function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
    const { text, live } = statusLabel(match.status)
    const lastGoal = [...match.events].reverse().find(e => e.type === 'goal')
    const isActive = match.status === 'first_half' || match.status === 'second_half'
    const isFinished = match.status === 'finished'

    return (
        <div
            className={`bg-wc-dark-bg rounded-2xl p-4 shadow-lg relative overflow-hidden shrink-0 w-[280px] cursor-pointer active:scale-95 transition-transform ${isFinished ? 'opacity-50 grayscale' : ''}`}
            onClick={onClick}
        >
            {/* Background glow for live matches */}
            {live && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 bg-wc-red rounded-full blur-3xl opacity-10 pointer-events-none" />
            )}

            {/* Status badge + time */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    {live && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wc-red opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-wc-red" />
                        </span>
                    )}
                    <span className={`text-[10px] font-black tracking-widest ${live ? 'text-wc-red' : 'text-gray-400'}`}>
                        {text}
                    </span>
                </div>
                {isActive && (
                    <span className="text-white/60 text-xs font-bold">{match.time}'</span>
                )}
            </div>

            {/* Teams + Score */}
            <div className="flex items-center justify-between gap-2">
                {/* Home team */}
                <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-3xl">{match.homeFlag}</span>
                    <span className="text-white text-[11px] font-bold text-center leading-tight">{match.homeTeam}</span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 px-2">
                    <span className="text-white text-3xl font-black tabular-nums">{match.homeScore}</span>
                    <span className="text-gray-500 text-lg font-bold">-</span>
                    <span className="text-white text-3xl font-black tabular-nums">{match.awayScore}</span>
                </div>

                {/* Away team */}
                <div className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-3xl">{match.awayFlag}</span>
                    <span className="text-white text-[11px] font-bold text-center leading-tight">{match.awayTeam}</span>
                </div>
            </div>

            {/* Last event */}
            <div className="mt-3 min-h-[20px]">
                {lastGoal ? (
                    <p className="text-center text-[10px] text-gray-400 truncate">
                        ⚽ {lastGoal.minute}' {lastGoal.player}
                        <span className="text-gray-600"> · {lastGoal.team === 'home' ? match.homeTeam : match.awayTeam}</span>
                    </p>
                ) : (
                    <p className="text-center text-[10px] text-gray-600">Sin goles</p>
                )}
            </div>
        </div>
    )
}

interface LiveMatchesProps {
    matches: Match[]
    connected: boolean
    onMatchClick: (match: Match) => void
}

export function LiveMatches({ matches, connected, onMatchClick }: LiveMatchesProps) {
    const allFinished = matches.length > 0 && matches.every(m => m.status === 'finished')

    return (
        <div className="px-6 mb-6">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400 uppercase font-bold tracking-wider">Partidos en Vivo</span>
                <span className={`text-[10px] font-bold ${connected ? 'text-wc-green' : 'text-gray-500'}`}>
                    {connected ? '● Conectado' : '○ Conectando...'}
                </span>
            </div>

            {matches.length === 0 ? (
                <div className="bg-wc-dark-bg rounded-2xl p-6 text-center text-gray-500 text-sm">
                    {connected ? 'Sin partidos activos' : 'Cargando partidos...'}
                </div>
            ) : (
                <>
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                        {matches.map(match => (
                            <div key={match.id} className="snap-start">
                                <MatchCard match={match} onClick={() => onMatchClick(match)} />
                            </div>
                        ))}
                    </div>
                    {allFinished && (
                        <div className="mt-3 bg-wc-dark-bg rounded-2xl px-4 py-3 flex items-center gap-3">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wc-green opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-wc-green" />
                            </span>
                            <span className="text-gray-400 text-xs font-semibold">Preparando nueva ronda de partidos...</span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
