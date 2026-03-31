import { useEffect, useRef } from 'react'
import type { Match, Narration } from '../types'

interface MatchDetailModalProps {
    match: Match
    onClose: () => void
}

function statusLabel(status: Match['status']): { text: string; live: boolean } {
    switch (status) {
        case 'first_half': return { text: 'PRIMER TIEMPO', live: true }
        case 'second_half': return { text: 'SEGUNDO TIEMPO', live: true }
        case 'half_time': return { text: 'DESCANSO', live: false }
        case 'not_started': return { text: 'POR JUGAR', live: false }
        case 'finished': return { text: 'FINALIZADO', live: false }
        default: return { text: '', live: false }
    }
}

function NarrationIcon({ type }: { type: Narration['type'] }) {
    switch (type) {
        case 'goal': return <span className="text-base">⚽</span>
        case 'card': return <span className="text-base">🟨</span>
        case 'status': return <span className="text-base">🔔</span>
        default: return <span className="text-base">🎙️</span>
    }
}

function NarrationBubble({ narration }: { narration: Narration }) {
    const isGoal = narration.type === 'goal'
    const isStatus = narration.type === 'status'

    return (
        <div className={`flex gap-3 items-start ${isGoal ? 'animate-pulse-once' : ''}`}>
            {/* Minute */}
            <div className="flex flex-col items-center shrink-0 pt-0.5">
                <span className="text-[10px] font-black text-gray-500 w-7 text-center">{narration.minute}'</span>
                <div className="w-px flex-1 bg-gray-700 mt-1" />
            </div>

            {/* Bubble */}
            <div className={`mb-3 rounded-2xl px-3 py-2.5 flex-1 flex gap-2 items-start
                ${isGoal
                    ? 'bg-wc-red/20 border border-wc-red/40'
                    : isStatus
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-wc-dark-bg'
                }`}>
                <NarrationIcon type={narration.type} />
                <p className={`text-sm leading-snug ${isGoal ? 'text-white font-bold' : isStatus ? 'text-gray-300 font-semibold' : 'text-gray-400'}`}>
                    {narration.text}
                </p>
            </div>
        </div>
    )
}

function EventBadge({ match }: { match: Match }) {
    return (
        <div className="flex flex-wrap gap-2">
            {match.events.map(ev => (
                <div key={ev.id} className="bg-white/10 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs text-white">
                    {ev.type === 'goal' && <span>⚽</span>}
                    {ev.type === 'yellow_card' && <span>🟨</span>}
                    {ev.type === 'red_card' && <span>🟥</span>}
                    {ev.type === 'substitution' && <span>🔄</span>}
                    <span className="font-bold">{ev.minute}'</span>
                    <span className="text-white/70">{ev.player}</span>
                    <span className="text-white/40 text-[10px]">{ev.team === 'home' ? match.homeTeam : match.awayTeam}</span>
                </div>
            ))}
            {match.events.length === 0 && (
                <span className="text-gray-500 text-xs">Sin eventos registrados aún.</span>
            )}
        </div>
    )
}

export function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
    const { text: statusText, live } = statusLabel(match.status)
    const narrationEndRef = useRef<HTMLDivElement>(null)

    // Guardar defensivamente para evitar crash si el servidor no ha enviado estos campos aún
    const narrations = match.narrations ?? []
    const venue = match.venue ?? 'Estadio por confirmar'

    // Auto-scroll al nuevo mensaje
    useEffect(() => {
        narrationEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [narrations.length])

    // Ordenar narraciones por minuto
    const sortedNarrations = [...narrations].sort((a, b) => a.minute - b.minute)

    const progressPct = Math.min((match.time / 90) * 100, 100)

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative flex flex-col bg-[#0d0d0d] rounded-t-3xl mt-auto max-h-[92vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="bg-wc-dark-bg px-5 pt-3 pb-5 shrink-0">
                    {/* Status + Close */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {live && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wc-red opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-wc-red" />
                                </span>
                            )}
                            <span className={`text-xs font-black tracking-widest ${live ? 'text-wc-red' : 'text-gray-400'}`}>
                                {statusText}
                            </span>
                            {(match.status === 'first_half' || match.status === 'second_half') && (
                                <span className="text-white/50 text-xs font-bold">{match.time}'</span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Teams + Score */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-4xl">{match.homeFlag}</span>
                            <span className="text-white text-sm font-bold text-center">{match.homeTeam}</span>
                        </div>
                        <div className="flex items-center gap-3 px-2">
                            <span className="text-white text-5xl font-black tabular-nums">{match.homeScore}</span>
                            <span className="text-gray-600 text-2xl font-bold">-</span>
                            <span className="text-white text-5xl font-black tabular-nums">{match.awayScore}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-4xl">{match.awayFlag}</span>
                            <span className="text-white text-sm font-bold text-center">{match.awayTeam}</span>
                        </div>
                    </div>

                    {/* Time progress bar */}
                    {(match.status === 'first_half' || match.status === 'second_half' || match.status === 'finished') && (
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-wc-red rounded-full transition-all duration-1000"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    )}

                    {/* Venue */}
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                        <span className="text-base">📍</span>
                        <span className="text-gray-400 text-xs font-medium">{venue}</span>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-5 py-4">
                    {/* Events */}
                    {match.events.length > 0 && (
                        <div className="mb-5">
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">Eventos del partido</span>
                            <EventBadge match={match} />
                        </div>
                    )}

                    {/* Narrations */}
                    <div className="mb-2">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-3">Narración en vivo</span>
                        {sortedNarrations.length === 0 ? (
                            <p className="text-gray-600 text-sm">El partido está por comenzar...</p>
                        ) : (
                            sortedNarrations.map(n => (
                                <NarrationBubble key={n.id} narration={n} />
                            ))
                        )}
                        <div ref={narrationEndRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}
