import type { Drink } from '../types/drink';
import './DrinkDetails.css';

interface DrinkDetailsProps {
  drink: Drink;
  onClose: () => void;
  onEdit: () => void;
}

export function DrinkDetails({ drink, onClose, onEdit }: DrinkDetailsProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} минут ${secs} секунд`;
    }
    return `${secs} секунд`;
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="drink-details-overlay" onClick={onClose}>
      <div className="drink-details" onClick={(e) => e.stopPropagation()}>
        <div className="drink-details-header">
          <h2>{drink.drinkType}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        <div className="drink-details-body">
          <div className="detail-section">
            <h3>Основная информация</h3>
            <div className="detail-row">
              <span className="detail-label">Сорт кофе:</span>
              <span className="detail-value">{drink.coffeeBean}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Степень помола:</span>
              <span className="detail-value">{drink.mahlgrad}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Дата приготовления:</span>
              <span className="detail-value">{formatDate(drink.createdAt)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Ингредиенты</h3>
            <div className="detail-row">
              <span className="detail-label">☕ Кофе:</span>
              <span className="detail-value">{drink.coffeeAmount} г</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">💧 Вода:</span>
              <span className="detail-value">{drink.waterAmount} мл</span>
            </div>
            {drink.milkAmount && drink.milkAmount > 0 && (
              <div className="detail-row">
                <span className="detail-label">🥛 Молоко:</span>
                <span className="detail-value">{drink.milkAmount} мл</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Приготовление</h3>
            {drink.brewTime && drink.brewTime > 0 && (
              <div className="detail-row">
                <span className="detail-label">⏱️ Время:</span>
                <span className="detail-value">{formatTime(drink.brewTime)}</span>
              </div>
            )}
            {drink.notes && (
              <div className="detail-notes">
                <span className="detail-label">Особенности:</span>
                <p className="notes-text">{drink.notes}</p>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Оценка</h3>
            <div className="rating-display">
              <span className="stars">{renderStars(drink.rating)}</span>
              <span className="rating-text">{drink.rating} из 5</span>
            </div>
            {drink.review && (
              <div className="review-text">
                <span className="detail-label">Отзыв:</span>
                <p className="review-content">{drink.review}</p>
              </div>
            )}
          </div>
        </div>

        <div className="drink-details-footer">
          <button className="btn btn-primary" onClick={onEdit}>
            Редактировать
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
