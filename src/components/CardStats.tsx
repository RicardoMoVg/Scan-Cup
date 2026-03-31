import { useEffect, useState } from 'react';
import type { Card } from '../types';
import { CardImage } from './CardImage';

interface CardStatsProps {
    card: Card;
    onClose: () => void;
}

export function CardStats({ card, onClose }: CardStatsProps) {
    const [animate, setAnimate] = useState(false);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        setAnimate(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const stats = {
        ritmo: card.stats?.speed || 88,
        tiro: card.stats?.shooting || 85,
        fisico: card.stats?.power || 90,
        defensa: 82,
        pase: 87,
        regate: 91
    };

    const overallRating = Math.round((stats.ritmo + stats.tiro + stats.pase + stats.regate + stats.defensa + stats.fisico) / 6);

    const StatBar = ({ label, value }: { label: string; value: number }) => (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-[10px] font-bold text-white/80 uppercase tracking-wider">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden w-full">
                <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
            <div
                className={`w-full max-w-sm h-[85vh] bg-wc-green rounded-[2rem] overflow-hidden shadow-2xl transform transition-all duration-500 ease-out flex flex-col relative border-4 border-emerald-900/20 ${animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="p-6 flex justify-between items-start z-10">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-lg">
                        <span className="text-2xl">🏆</span>
                        <span className="text-[10px] font-bold text-white uppercase mt-1 px-1 text-center leading-tight">{card.country}</span>
                    </div>

                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md border border-white/20 ${card.rarity === 'legendary' ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'
                        }`}>
                        {card.rarity || 'Common'}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative z-0 -mt-8">
                    <div className="absolute w-64 h-80 bg-black/40 blur-3xl rounded-full"></div>

                    <div className="relative transform hover:scale-105 transition-transform duration-500 z-10 w-64 aspect-3/4">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-[3px] border-white/10 backdrop-blur-sm bg-white/5">
                            <CardImage card={card} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-5 pt-16 text-white text-center">
                                <h2 className="text-2xl font-black mb-0.5 leading-none drop-shadow-md">{card.name}</h2>
                                <p className="text-xs text-white/70 font-bold uppercase tracking-widest">{card.position}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {showStats && (
                    <div className="absolute inset-x-6 top-1/4 bottom-32 bg-black/60 backdrop-blur-xl rounded-3xl p-6 z-20 flex flex-col border border-white/10 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold text-lg">Estadísticas</h3>
                            <button onClick={() => setShowStats(false)} className="text-white/50 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-wc-green flex items-center justify-center text-3xl font-black text-white border-2 border-white/20">
                                    {overallRating}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Media General</div>
                                    <div className="text-emerald-400 text-xs">Potencial Alto</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <StatBar label="Ritmo" value={stats.ritmo} />
                                <StatBar label="Tiro" value={stats.tiro} />
                                <StatBar label="Pase" value={stats.pase} />
                                <StatBar label="Regate" value={stats.regate} />
                                <StatBar label="Defensa" value={stats.defensa} />
                                <StatBar label="Físico" value={stats.fisico} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-6 z-20 mt-auto">
                    <div className="h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-between px-2 shadow-lg">



                        <button
                            onClick={() => setShowStats(!showStats)}
                            className={`flex-1 h-16 mx-2 rounded-[1.8rem] transition-all flex flex-col items-center justify-center gap-0.5 border-4 ${showStats
                                ? 'bg-white text-emerald-900 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-emerald-500 text-white border-white/20 shadow-lg'
                                }`}
                        >
                            <span className="text-2xl font-black">{overallRating}</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest opacity-90">Media</span>
                        </button>

                        <button
                            onClick={onClose}
                            className="flex-1 h-14 mx-1 rounded-[1.5rem] bg-yellow-500 hover:bg-yellow-600 text-white flex flex-col items-center justify-center gap-1 transition group border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Trivia</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
