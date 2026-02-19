import { useState, useMemo, type FormEvent } from 'react';
import type { Drink } from '../types/drink';
import { DRINK_TYPES } from '../types/drink';
import { generateId } from '../utils/generateId';
import './DrinkForm.css';

interface DrinkFormProps {
  onSubmit: (drink: Drink) => void;
  onCancel?: () => void;
  initialData?: Drink;
  isEdit?: boolean;
  existingDrinks?: Drink[];
}

export function DrinkForm({ onSubmit, onCancel, initialData, isEdit = false, existingDrinks = [] }: DrinkFormProps) {
  const [formData, setFormData] = useState({
    drinkType: initialData?.drinkType || '',
    coffeeBean: initialData?.coffeeBean || '',
    coffeeAmount: initialData?.coffeeAmount || 0,
    waterAmount: initialData?.waterAmount || 0,
    milkAmount: initialData?.milkAmount || 0,
    mahlgrad: initialData?.mahlgrad || '',
    notes: initialData?.notes || '',
    brewTime: initialData?.brewTime || 0,
    rating: initialData?.rating || 5,
    review: initialData?.review || '',
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique coffee bean values from existing drinks (case-insensitive)
  const coffeeBeanSuggestions = useMemo(() => {
    const beans = new Map<string, string>(); // lowercase -> original
    existingDrinks.forEach(drink => {
      if (drink.coffeeBean) {
        const lowerBean = drink.coffeeBean.toLowerCase().trim();
        if (!beans.has(lowerBean)) {
          beans.set(lowerBean, drink.coffeeBean.trim());
        }
      }
    });
    return Array.from(beans.values()).sort();
  }, [existingDrinks]);

  // Filter suggestions based on current input
  const filteredSuggestions = useMemo(() => {
    if (!formData.coffeeBean) return coffeeBeanSuggestions;
    const input = formData.coffeeBean.toLowerCase();
    return coffeeBeanSuggestions.filter(bean => 
      bean.toLowerCase().includes(input)
    );
  }, [coffeeBeanSuggestions, formData.coffeeBean]);

  const handleSuggestionClick = (bean: string) => {
    setFormData({ ...formData, coffeeBean: bean });
    setShowSuggestions(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const drink: Drink = {
      id: initialData?.id || generateId(),
      drinkType: formData.drinkType,
      coffeeBean: formData.coffeeBean,
      coffeeAmount: Number(formData.coffeeAmount),
      waterAmount: Number(formData.waterAmount),
      milkAmount: formData.milkAmount ? Number(formData.milkAmount) : undefined,
      mahlgrad: formData.mahlgrad,
      notes: formData.notes,
      brewTime: formData.brewTime ? Number(formData.brewTime) : undefined,
      rating: Number(formData.rating),
      review: formData.review || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSubmit(drink);
    
    if (!isEdit) {
      // Сбросить форму после добавления
      setFormData({
        drinkType: '',
        coffeeBean: '',
        coffeeAmount: 0,
        waterAmount: 0,
        milkAmount: 0,
        mahlgrad: '',
        notes: '',
        brewTime: 0,
        rating: 5,
        review: '',
      });
    }
  };

  return (
    <form className="drink-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Редактировать напиток' : 'Добавить новый напиток'}</h2>
      
      <div className="form-group">
        <label htmlFor="drinkType">Тип напитка *</label>
        <select
          id="drinkType"
          value={formData.drinkType}
          onChange={(e) => setFormData({ ...formData, drinkType: e.target.value })}
          required
        >
          <option value="">Выберите тип</option>
          {DRINK_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group autocomplete-container">
        <label htmlFor="coffeeBean">Сорт/бренд кофе *</label>
        <input
          type="text"
          id="coffeeBean"
          value={formData.coffeeBean}
          onChange={(e) => {
            setFormData({ ...formData, coffeeBean: e.target.value });
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Например: Lavazza Crema e Gusto"
          required
          autoComplete="off"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {filteredSuggestions.map((bean) => (
              <li
                key={bean}
                className="suggestion-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(bean);
                }}
              >
                {bean}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mahlgrad">Степень помола *</label>
        <input
          type="text"
          id="mahlgrad"
          value={formData.mahlgrad}
          onChange={(e) => setFormData({ ...formData, mahlgrad: e.target.value })}
          placeholder="Например: средний, грубый, тонкий"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="coffeeAmount">Кофе (г) *</label>
          <input
            type="number"
            id="coffeeAmount"
            value={formData.coffeeAmount || ''}
            onChange={(e) => setFormData({ ...formData, coffeeAmount: Number(e.target.value) })}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="waterAmount">Вода (мл) *</label>
          <input
            type="number"
            id="waterAmount"
            value={formData.waterAmount || ''}
            onChange={(e) => setFormData({ ...formData, waterAmount: Number(e.target.value) })}
            min="0"
            step="1"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="milkAmount">Молоко (мл)</label>
          <input
            type="number"
            id="milkAmount"
            value={formData.milkAmount || ''}
            onChange={(e) => setFormData({ ...formData, milkAmount: Number(e.target.value) })}
            min="0"
            step="1"
            placeholder="Опционально"
          />
        </div>

        <div className="form-group">
          <label htmlFor="brewTime">Время (сек)</label>
          <input
            type="number"
            id="brewTime"
            value={formData.brewTime || ''}
            onChange={(e) => setFormData({ ...formData, brewTime: Number(e.target.value) })}
            min="0"
            step="1"
            placeholder="Опционально"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Особенности приготовления</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Например: Молоко взбивал до 65°C, предварительный пролив 5 сек"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Оценка: {formData.rating} ⭐</label>
        <input
          type="range"
          id="rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
          min="1"
          max="5"
          step="1"
        />
        <div className="rating-labels">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="review">Отзыв / Комментарий</label>
        <textarea
          id="review"
          value={formData.review}
          onChange={(e) => setFormData({ ...formData, review: e.target.value })}
          placeholder="Ваше мнение о вкусе, аромате, впечатления..."
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Сохранить' : 'Добавить'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
