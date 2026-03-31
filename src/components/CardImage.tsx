import { useMemo } from 'react';
import type { Card } from '../types';
import { modelToCardId } from '../utils/triviaApi';

interface CardImageProps {
  card: Card;
  className?: string;
}

export function CardImage({ card, className = "" }: CardImageProps) {
  const modelId = useMemo(() => {
    const found = Object.entries(modelToCardId).find(([_, value]) => value === card.id);
    return found ? found[0] : null;
  }, [card.id]);

  if (modelId) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={`/textures/textV2/${modelId}_1.png`} alt={`${card.name} bg`} className="absolute inset-0 w-full h-full object-cover z-0" loading="lazy" />
        <img src={`/textures/textV2/${modelId}_2.png`} alt={`${card.name} player`} className="absolute inset-0 w-full h-full object-cover z-10" loading="lazy" />
        <img src={`/textures/textV2/${modelId}_3.png`} alt={`${card.name} frame`} className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none" loading="lazy" />
      </div>
    );
  }

  return (
    <img src={card.imageUrl} alt={card.name} className={className} loading="lazy" />
  );
}
