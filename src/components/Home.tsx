import { useEffect, useState } from 'react';
import type { User, Match } from '../types';
import { LiveMatches } from './LiveMatches';
import { MatchDetailModal } from './MatchDetailModal';
import { Timeline } from './Timeline';
import { useMatches, type GoalNotification } from '../hooks/useMatches';

function GoalToast({ notification, onDismiss }: { notification: GoalNotification; onDismiss: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 4000)
        return () => clearTimeout(timer)
    }, [notification.id, onDismiss])

    const scoringFlag = notification.scoringTeam === 'home' ? notification.homeFlag : notification.awayFlag
    const scoringTeamName = notification.scoringTeam === 'home' ? notification.homeTeam : notification.awayTeam

    return (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-slide-down">
            <div className="bg-[#1A1A1A] border border-wc-red/50 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
                <div className="w-9 h-9 bg-wc-red/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-lg">⚽</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm">
                        {scoringFlag} ¡GOL DE {scoringTeamName.toUpperCase()}! · {notification.minute}'
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                        {notification.player} · {notification.homeFlag} {notification.homeScore}–{notification.awayScore} {notification.awayFlag}
                    </p>
                </div>
                <button onClick={onDismiss} className="text-gray-500 hover:text-gray-300 text-xs shrink-0 px-1">✕</button>
            </div>
        </div>
    )
}

interface HomeProps {
    user: User;
    onScanClick: () => void;
    onViewCollection: () => void;
    onStartTour: () => void;
}

export function Home({ user, onScanClick, onViewCollection, onStartTour }: HomeProps) {
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const { matches, connected, goalNotification, clearGoalNotification } = useMatches();

    // Obtener siempre la versión más actualizada del partido seleccionado
    const selectedMatch = selectedMatchId
        ? matches.find(m => m.id === selectedMatchId) ?? null
        : null;

    return (
        <div className="min-h-screen bg-wc-light-bg pb-20">
            {goalNotification && (
                <GoalToast notification={goalNotification} onDismiss={clearGoalNotification} />
            )}
            <div className="bg-wc-red rounded-b-[40px] pt-16 pb-20 px-6 relative shadow-xl z-0">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="bg-white/20 p-2 rounded-full">
                            <span className="text-white font-bold text-sm">⚽ WC26</span>
                        </div>
                        <span className="text-white/80 text-sm font-medium">APP OFICIAL</span>
                    </div>

                    <button
                        onClick={onStartTour}
                        className="bg-white/20 hover:bg-white/30 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm transition"
                        title="¿Cómo funciona?"
                    >
                        ?
                    </button>
                </div>

                <h1 className="text-4xl font-bold text-white leading-tight mb-2">
                    Arma tu<br />Equipo Soñado.
                </h1>

                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                        id="scan-button"
                        onClick={onScanClick}
                        className="w-28 h-28 bg-wc-green-light rounded-full border-4 border-white flex items-center justify-center shadow-xl active:scale-95 transition-transform hover:shadow-2xl"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </button>
                    <div className="text-base font-bold text-wc-green-light text-center mt-3">ESCANEAR</div>
                </div>
            </div>

            <div className="px-6 mt-20 mb-8">
                <div className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-4">Actividad Reciente</div>
                <div id="recent-activity" className="bg-wc-dark-bg text-white rounded-2xl p-6 shadow-lg flex justify-between items-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

                    <div className="flex-1 flex flex-col items-center justify-center z-10">
                        <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-widest">Cartas Coleccionadas</div>
                        <div className="text-5xl font-black text-white flex items-baseline drop-shadow-lg">
                            {user.collectionCount}
                        </div>
                        <div className="w-full max-w-[200px] h-2 bg-gray-700/50 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-linear-to-r from-wc-green to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '13%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <LiveMatches matches={matches} connected={connected} onMatchClick={(m: Match) => setSelectedMatchId(m.id)} />

            <div className="px-6 relative z-10">
                <button id="view-collection-btn" onClick={onViewCollection} className="w-full py-4 bg-wc-red text-white font-bold rounded-xl hover:bg-red-700 transition shadow-[0_10px_20px_rgba(230,57,70,0.3)] hover:shadow-[0_15px_25px_rgba(230,57,70,0.4)] hover:-translate-y-1">
                    Ver Mi Colección
                </button>
            </div>

            <div className="mt-6 mb-8">
                <Timeline />
            </div>

            {selectedMatch && (
                <MatchDetailModal
                    match={selectedMatch}
                    onClose={() => setSelectedMatchId(null)}
                />
            )}
        </div>
    );
}
