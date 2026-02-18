import type { Drink } from '../types/drink';
import './DrinkCard.css';

interface DrinkCardProps {
  drink: Drink;
  onClick: () => void;
  onDelete: () => void;
}

export function DrinkCard({ drink, onClick, onDelete }: DrinkCardProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}м ${secs}с`;
    }
    return `${secs}с`;
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      onDelete();
    }
  };

  return (
    <div className="drink-card" onClick={onClick}>
      <div className="drink-card-header">
        <h3>{drink.drinkType}</h3>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          aria-label="Удалить"
        >
          ✕
        </button>
      </div>
      
      <div className="drink-card-body">
        <div className="drink-info">
          <span className="info-label">Кофе:</span>
          <span className="info-value">{drink.coffeeBean}</span>
        </div>
        
        <div className="drink-info">
          <span className="info-label">Помол:</span>
          <span className="info-value">{drink.mahlgrad}</span>
        </div>
        
        <div className="drink-stats">
          <div className="stat">
            <span className="stat-icon">☕</span>
            <span>{drink.coffeeAmount}г</span>
          </div>
          <div className="stat">
            <span className="stat-icon">💧</span>
            <span>{drink.waterAmount}мл</span>
          </div>
          {drink.milkAmount && drink.milkAmount > 0 && (
            <div className="stat">
              <span className="stat-icon">🥛</span>
              <span>{drink.milkAmount}мл</span>
            </div>
          )}
          {drink.brewTime && drink.brewTime > 0 && (
            <div className="stat">
              <span className="stat-icon">⏱️</span>
              <span>{formatTime(drink.brewTime)}</span>
            </div>
          )}
        </div>

        <div className="drink-rating">
          {renderStars(drink.rating)}
        </div>

        {drink.review && (
          <div className="drink-review-preview">
            {drink.review.length > 80 
              ? `${drink.review.substring(0, 80)}...` 
              : drink.review}
          </div>
        )}
      </div>

      <div className="drink-card-footer">
        <span className="drink-date">{formatDate(drink.createdAt)}</span>
      </div>
    </div>
  );
}
