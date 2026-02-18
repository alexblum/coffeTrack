export interface Drink {
  id: string;
  drinkType: string;
  coffeeBean: string;
  coffeeAmount: number; // в граммах
  waterAmount: number; // в мл
  milkAmount?: number; // в мл (опционально)
  mahlgrad: string; // степень помола
  notes: string; // особенности приготовления
  brewTime?: number; // время приготовления в секундах (опционально)
  rating: number; // оценка от 1 до 5
  review?: string; // текстовый отзыв/комментарий (опционально)
  createdAt: string; // ISO строка даты
}

export const DRINK_TYPES = [
  'Гейзерная',
  'French Press'
] as const;

export type DrinkType = typeof DRINK_TYPES[number];
