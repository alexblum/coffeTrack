import type { Drink } from '../types/drink';

// Тип для данных в базе (snake_case)
interface DrinkDB {
  id: string;
  session_id?: string;
  drink_type: string;
  coffee_bean: string;
  coffee_amount: number;
  water_amount: number;
  milk_amount?: number;
  mahlgrad: string;
  notes: string;
  brew_time?: number;
  rating: number;
  review?: string;
  created_at: string;
  updated_at?: string;
}

// Конвертация из camelCase в snake_case для БД
export const drinkToDb = (drink: Drink, sessionId: string): DrinkDB => {
  return {
    id: drink.id,
    session_id: sessionId,
    drink_type: drink.drinkType,
    coffee_bean: drink.coffeeBean,
    coffee_amount: drink.coffeeAmount,
    water_amount: drink.waterAmount,
    milk_amount: drink.milkAmount,
    mahlgrad: drink.mahlgrad,
    notes: drink.notes,
    brew_time: drink.brewTime,
    rating: drink.rating,
    review: drink.review,
    created_at: drink.createdAt,
    updated_at: new Date().toISOString(),
  };
};

// Конвертация из snake_case в camelCase из БД
export const drinkFromDb = (dbDrink: DrinkDB): Drink => {
  return {
    id: dbDrink.id,
    drinkType: dbDrink.drink_type,
    coffeeBean: dbDrink.coffee_bean,
    coffeeAmount: dbDrink.coffee_amount,
    waterAmount: dbDrink.water_amount,
    milkAmount: dbDrink.milk_amount,
    mahlgrad: dbDrink.mahlgrad,
    notes: dbDrink.notes,
    brewTime: dbDrink.brew_time,
    rating: dbDrink.rating,
    review: dbDrink.review,
    createdAt: dbDrink.created_at,
  };
};
