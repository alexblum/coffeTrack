import type { Drink } from '../types/drink';
import { DrinkCard } from './DrinkCard';
import './DrinkList.css';

interface DrinkListProps {
  drinks: Drink[];
  onDrinkClick: (drink: Drink) => void;
  onDrinkDelete: (id: string) => void;
}

export function DrinkList({ drinks, onDrinkClick, onDrinkDelete }: DrinkListProps) {
  // Сортируем напитки по дате создания (новые сначала)
  const sortedDrinks = [...drinks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (drinks.length === 0) {
    return (
      <div className="drink-list-empty">
        <div className="empty-icon">☕</div>
        <h3>Пока нет записей</h3>
        <p>Добавьте свой первый напиток, чтобы начать отслеживание!</p>
      </div>
    );
  }

  return (
    <div className="drink-list">
      <div className="drink-list-header">
        <h2>Мои напитки</h2>
        <span className="drink-count">{drinks.length} {getDrinkWord(drinks.length)}</span>
      </div>
      <div className="drink-list-grid">
        {sortedDrinks.map((drink) => (
          <DrinkCard
            key={drink.id}
            drink={drink}
            onClick={() => onDrinkClick(drink)}
            onDelete={() => onDrinkDelete(drink.id)}
          />
        ))}
      </div>
    </div>
  );
}

function getDrinkWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'записей';
  }

  if (lastDigit === 1) {
    return 'запись';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'записи';
  }

  return 'записей';
}
