import { useState, useEffect } from 'react';
import type { Card } from '../types';
import { CardImage } from './CardImage';

interface CardFilterModalProps {
    card: Card;
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
    rarity?: string[];
    country?: string[];
    position?: string[];
    minRating?: number;
    maxRating?: number;
}

export function CardFilterModal({ card, isOpen, onClose, onApplyFilters }: CardFilterModalProps) {
    const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number>(0);
    const [maxRating, setMaxRating] = useState<number>(100);

    const [activeFilter, setActiveFilter] = useState<'rarity' | 'position' | 'rating' | 'style' | 'bg' | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const rarities = ['common', 'rare', 'epic', 'legendary'];
    const positions = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];

    const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
        if (list.includes(item)) {
            setter(list.filter(i => i !== item));
        } else {
            setter([...list, item]);
        }
    };

    const handleApply = () => {
        const filters: FilterOptions = {
            rarity: selectedRarities.length > 0 ? selectedRarities : undefined,
            country: selectedCountries.length > 0 ? selectedCountries : undefined,
            position: selectedPositions.length > 0 ? selectedPositions : undefined,
            minRating: minRating > 0 ? minRating : undefined,
            maxRating: maxRating < 100 ? maxRating : undefined,
        };
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setSelectedRarities([]);
        setSelectedCountries([]);
        setSelectedPositions([]);
        setMinRating(0);
        setMaxRating(100);
    };

    const filterItems = [
        {
            id: 'rarity', label: 'Rareza', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 'position', label: 'Posición', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'rating', label: 'Media', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            )
        },
        {
            id: 'style', label: 'Estilo', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            )
        },
        {
            id: 'bg', label: 'Fondo', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-0 overflow-hidden">

            <div className="w-full h-full flex flex-col relative bg-neutral-900">
                <div className="h-14 flex justify-between items-center px-4 z-40 bg-black/40 border-b border-white/5 shrink-0">
                    <button onClick={onClose} className="p-2 -ml-2 text-white/70 hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex gap-6">
                        <button
                            onClick={handleReset}
                            className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleApply}
                            className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition"
                        >
                            Guardar
                        </button>
                    </div>
                </div>


                <div className="flex-1 flex flex-col items-center justify-center relative bg-[#121212] overflow-y-auto overflow-x-hidden" onClick={() => setActiveFilter(null)}>

                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] pointer-events-none fixed"></div>

                    <div className="flex flex-col items-center w-full py-8 gap-8">

                        <div className={`relative transition-all duration-500 ease-out z-10 ${activeFilter ? 'scale-95' : 'scale-100'}`}>
                            <div className="w-72 aspect-3/4 rounded-xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 ring-1 ring-white/5 bg-wc-green">
                                <div className="absolute top-5 left-5 z-20 w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl drop-shadow-md">🏆</span>
                                </div>

                                <CardImage card={card} className="absolute inset-0 w-full h-full object-cover z-0" />

                                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/95 via-black/60 to-transparent p-6 pt-24 text-white">
                                    <h2 className="text-3xl font-black leading-none mb-1 drop-shadow-xl">{card.name}</h2>
                                    <p className="text-sm font-bold text-emerald-400 uppercase tracking-[0.2em] drop-shadow-md">{card.position}</p>
                                </div>
                            </div>
                        </div>

                        {activeFilter && (
                            <div
                                className="w-full max-w-sm px-6 animate-fade-in-up z-20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                            {activeFilter === 'rarity' ? 'Rareza' : activeFilter === 'position' ? 'Posición' : activeFilter === 'rating' ? 'Medias' : 'Opciones'}
                                        </h3>
                                    </div>

                                    {activeFilter === 'rarity' && (
                                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                            {rarities.map(rarity => (
                                                <button
                                                    key={rarity}
                                                    onClick={() => toggleSelection(rarity, selectedRarities, setSelectedRarities)}
                                                    className={`flex-shrink-0 px-4 py-3 rounded-xl font-bold text-xs border transition-all ${selectedRarities.includes(rarity)
                                                        ? 'bg-emerald-500 border-emerald-500 text-black'
                                                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                                        }`}
                                                >
                                                    <span className="capitalize">{rarity}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {activeFilter === 'position' && (
                                        <div className="flex gap-2 flex-wrap">
                                            {positions.map(position => (
                                                <button
                                                    key={position}
                                                    onClick={() => toggleSelection(position, selectedPositions, setSelectedPositions)}
                                                    className={`px-4 py-2 rounded-lg font-bold text-xs border transition-all ${selectedPositions.includes(position)
                                                        ? 'bg-emerald-500 border-emerald-500 text-black'
                                                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                                        }`}
                                                >
                                                    {position}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {activeFilter === 'rating' && (
                                        <div className="space-y-6 pt-2">
                                            <div className="relative group">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-white/30">
                                                    <span>Mínimo</span>
                                                    <span className="text-white text-base">{minRating}</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full h-1 bg-zinc-700 rounded-lg accent-emerald-500 appearance-none cursor-pointer" />
                                            </div>
                                            <div className="relative group">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-white/30">
                                                    <span>Máximo</span>
                                                    <span className="text-white text-base">{maxRating}</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={maxRating} onChange={(e) => setMaxRating(Number(e.target.value))} className="w-full h-1 bg-zinc-700 rounded-lg accent-emerald-500 appearance-none cursor-pointer" />
                                            </div>
                                        </div>
                                    )}

                                    {(activeFilter === 'style' || activeFilter === 'bg') && (
                                        <div className="text-center py-4 text-white/20 text-xs font-bold uppercase tracking-widest">
                                            Próximamente
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div
                            className="w-full max-w-sm px-2 z-20 pb-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 flex justify-between items-center shadow-2xl">
                                {filterItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveFilter(item.id as any)}
                                        className="flex flex-col items-center justify-center w-16 h-16 gap-1 group relative outline-none"
                                    >
                                        <div className={`relative p-2.5 rounded-full transition-all duration-300 ${activeFilter === item.id
                                            ? 'bg-emerald-500 text-black rotate-0 scale-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                            : 'text-white/50 group-hover:text-white group-hover:bg-white/5'
                                            }`}>
                                            {item.icon}
                                        </div>

                                        <span className={`text-[8px] font-bold tracking-widest uppercase transition-all duration-200 ${activeFilter === item.id
                                            ? 'text-emerald-400 opacity-100'
                                            : 'text-white/30 opacity-0 group-hover:opacity-100'
                                            }`}>
                                            {activeFilter === item.id ? '•' : ''}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                                    {activeFilter ? filterItems.find(f => f.id === activeFilter)?.label : 'Filtros'}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
