import { useState } from 'react';
import type { Card } from '../types';
import { CardStats } from './CardStats';
import { CardImage } from './CardImage';

interface UserCollectionProps {
    cards: Card[];
}

export function UserCollection({ cards }: UserCollectionProps) {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [showStats, setShowStats] = useState(false);


    // Calculate stats
    const totalCards = cards.length;
    const collectedCount = cards.filter(c => c.isCollected).length;
    const progressPercentage = Math.round((collectedCount / totalCards) * 100);

    const handleCardClick = (card: Card) => {
        if (card.isCollected) {
            setSelectedCard(card);
            setShowStats(true);
        }
    };

    const handleCloseStats = () => {
        setShowStats(false);
        setSelectedCard(null);
    };



    return (
        <div className="min-h-screen bg-wc-light-bg pb-24 px-6 pt-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mi Colección</h1>
                <button className="p-3 bg-white rounded-full shadow-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            <div className="mb-10">
                <div className="flex justify-between text-sm font-bold text-gray-500 mb-3">
                    <span>PROGRESO TOTAL</span>
                    <span className="text-wc-green">{collectedCount}/{totalCards} ({progressPercentage}%)</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-wc-green to-wc-green-light rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {cards.map(card => (
                    <div
                        key={card.id}
                        className="relative group"
                        onClick={() => handleCardClick(card)}
                    >
                        {card.isCollected ? (
                            <div className={`relative aspect-3/4 rounded-xl overflow-hidden shadow-md border-2 transition-transform hover:scale-105 cursor-pointer ${card.rarity === 'legendary' ? 'border-yellow-400' : 'border-transparent'}`}>
                                <CardImage card={card} className="w-full h-full object-cover" />

                                <div className="absolute top-2 left-2">
                                    {card.rarity === 'legendary' && (
                                        <span className="bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded text-black shadow-lg">⭐ LEYENDA</span>
                                    )}
                                </div>

                                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black via-black/80 to-transparent p-3 pt-8">
                                    <div className="text-white text-sm font-bold truncate leading-tight">{card.name}</div>
                                    <div className="text-gray-300 text-xs mt-1">{card.position} • {card.country}</div>
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-white/90 rounded-full p-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-3/4 bg-red-50 rounded-xl border-2 border-dashed border-red-200 flex flex-col items-center justify-center p-4 text-center opacity-70 hover:opacity-90 transition-opacity">
                                <div className="w-12 h-12 rounded-full bg-red-100 text-wc-red flex items-center justify-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="text-wc-red font-bold text-xs uppercase">Falta</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedCard && showStats && (
                <CardStats
                    card={selectedCard}
                    onClose={handleCloseStats}
                />
            )}


        </div>
    );
}
