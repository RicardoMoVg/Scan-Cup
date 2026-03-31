import { useState } from 'react';
import type { Card } from '../types';
import { CardFilterModal, type FilterOptions } from './CardFilterModal';
import { CardImage } from './CardImage';

interface CatalogCollectionProps {
    cards: Card[];
    onBack: () => void;
}

export function CatalogCollection({ cards, onBack }: CatalogCollectionProps) {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (card: Card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleApplyFilters = (filters: FilterOptions) => {
        console.log('Filters applied:', filters);
    };

    return (
        <div className="min-h-screen bg-midnight-grid text-pure-signal p-6 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-10">
                    <button
                        onClick={onBack}
                        className="mr-4 p-3 rounded-full hover:bg-carbon-core/50 transition border border-cyan-pulse/20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-cyan-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </button>
                    <h1 className="text-4xl font-bold text-pure-signal">Álbum Mundial</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            className="relative rounded-xl overflow-hidden shadow-lg transition duration-300 cursor-pointer bg-carbon-core border-2 border-cyan-pulse/30 hover:border-cyan-pulse hover:shadow-[0_0_20px_rgba(0,209,178,0.4)] hover:scale-105 transform"
                        >
                            <div className="aspect-3/4 relative bg-midnight-grid/50">
                                <CardImage
                                    card={card}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-cyan-pulse text-midnight-grid">
                                    #{card.id}
                                </div>
                                {card.isCollected && (
                                    <div className="absolute top-2 left-2 bg-cyan-pulse text-midnight-grid p-1 rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                )}
                                {card.rarity === 'legendary' && (
                                    <div className="absolute top-2 left-2 bg-yellow-400 text-midnight-grid px-2 py-1 rounded-full text-[10px] font-bold">
                                        ⭐ LEGENDARIA
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-linear-to-t from-carbon-core to-transparent">
                                <h3 className="font-bold text-lg truncate text-pure-signal">{card.name}</h3>
                                <p className="text-sm text-cyan-pulse/80 mt-1">
                                    {card.position} • {card.country}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCard && (
                <CardFilterModal
                    card={selectedCard}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onApplyFilters={handleApplyFilters}
                />
            )}
        </div>
    );
}
