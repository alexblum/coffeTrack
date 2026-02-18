# Настройка Supabase для Coffee Track

## Шаг 1: Создание проекта

1. Перейдите на [supabase.com](https://supabase.com)
2. Зарегистрируйтесь или войдите в аккаунт
3. Нажмите "New Project"
4. Заполните форму:
   - **Name**: CoffeeTrack (или любое другое имя)
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший регион
   - **Pricing Plan**: Free (500MB database, 2GB bandwidth)
5. Нажмите "Create new project" и дождитесь завершения

## Шаг 2: Создание таблиц

1. В левом меню выберите **SQL Editor**
2. Нажмите **New query**
3. Скопируйте и вставьте следующий SQL код:

```sql
-- Создание таблицы сессий пользователей
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индекса для быстрого поиска по access_code
CREATE INDEX idx_user_sessions_access_code ON user_sessions(access_code);

-- Создание таблицы напитков
CREATE TABLE drinks (
  id TEXT PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  drink_type TEXT NOT NULL,
  coffee_bean TEXT NOT NULL,
  coffee_amount NUMERIC NOT NULL,
  water_amount NUMERIC NOT NULL,
  milk_amount NUMERIC,
  mahlgrad TEXT NOT NULL,
  notes TEXT,
  brew_time NUMERIC,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индекса для быстрого поиска напитков по сессии
CREATE INDEX idx_drinks_session_id ON drinks(session_id);

-- Включение Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drinks ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для user_sessions
-- Разрешить чтение только для проверки access_code
CREATE POLICY "Anyone can read sessions to validate code"
  ON user_sessions FOR SELECT
  USING (true);

-- Разрешить создание новых сессий
CREATE POLICY "Anyone can create sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (true);

-- Политики безопасности для drinks
-- Пользователь может читать только свои напитки
-- Для простоты, разрешаем всем читать (так как проверка на клиенте по session_id)
CREATE POLICY "Users can read their own drinks"
  ON drinks FOR SELECT
  USING (true);

-- Пользователь может вставлять напитки
CREATE POLICY "Users can insert their own drinks"
  ON drinks FOR INSERT
  WITH CHECK (true);

-- Пользователь может удалять свои напитки
CREATE POLICY "Users can delete their own drinks"
  ON drinks FOR DELETE
  USING (true);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_drinks_updated_at BEFORE UPDATE ON drinks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Нажмите **Run** (или F5) для выполнения
5. Убедитесь, что все выполнено без ошибок

## Шаг 3: Получение API ключей

1. В левом меню выберите **Project Settings** (иконка шестеренки ⚙️)
2. Перейдите в раздел **API**
3. Скопируйте следующие значения:
   - **Project URL** (в разделе "Configuration" или "Project URL", например: `https://xxxxx.supabase.co`)
   - **API Key** с типом **anon** или **public** (длинный JWT токен в таблице "Project API keys")

⚠️ **ВАЖНО**: Используйте ключ с типом **anon/public**, НЕ **service_role**!

📖 **Подробная инструкция с скриншотами**: см. [SUPABASE_API_KEYS.md](./SUPABASE_API_KEYS.md)

## Шаг 4: Настройка переменных окружения

1. В корне проекта создайте файл `.env.local`
2. Добавьте следующие переменные:

```env
VITE_SUPABASE_URL=ваш_project_url
VITE_SUPABASE_ANON_KEY=ваш_anon_key
```

3. Замените значения на скопированные из Supabase

## Шаг 5: Перезапуск dev сервера

```bash
npm run dev
```

## Проверка работы

1. Откройте приложение в браузере
2. При первом запуске должен появиться экран настройки синхронизации
3. Создайте новый код доступа
4. Добавьте тестовый напиток
5. Проверьте в Supabase Table Editor, что данные появились в таблице `drinks`

## Структура базы данных

### Таблица `user_sessions`
| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Первичный ключ |
| access_code | TEXT | 6-значный код доступа (уникальный) |
| created_at | TIMESTAMP | Дата создания сессии |

### Таблица `drinks`
| Поле (БД) | Тип | Описание | Поле (JS) |
|-----------|-----|----------|-----------|
| id | TEXT | Первичный ключ (генерируется клиентом) | id |
| session_id | UUID | FK к user_sessions | - |
| drink_type | TEXT | Тип напитка | drinkType |
| coffee_bean | TEXT | Сорт кофе | coffeeBean |
| coffee_amount | NUMERIC | Количество кофе (г) | coffeeAmount |
| water_amount | NUMERIC | Количество воды (мл) | waterAmount |
| milk_amount | NUMERIC | Количество молока (мл, опционально) | milkAmount |
| mahlgrad | TEXT | Степень помола | mahlgrad |
| notes | TEXT | Заметки | notes |
| brew_time | NUMERIC | Время приготовления (сек, опционально) | brewTime |
| rating | INTEGER | Оценка (1-5) | rating |
| review | TEXT | Текстовый отзыв (опционально) | review |
| created_at | TIMESTAMP | Дата создания | createdAt |
| updated_at | TIMESTAMP | Дата обновления | - |

**Примечание**: База данных использует snake_case (например: `brew_time`), а JavaScript/TypeScript использует camelCase (например: `brewTime`). Конвертация происходит автоматически в `src/utils/caseConverter.ts`.

## Ограничения Free Tier

- **База данных**: 500MB
- **Bandwidth**: 2GB/месяц
- **API requests**: Unlimited
- **Pause after inactivity**: Проект засыпает через 7 дней неактивности

## Мониторинг использования

1. Перейдите в **Project Settings** → **Usage**
2. Отслеживайте:
   - Database size
   - Bandwidth
   - API requests

## Безопасность

- Row Level Security (RLS) включен для обеих таблиц
- Каждый пользователь имеет доступ только к своим данным через session_id
- Access code хранится в открытом виде (для простоты)
- Для продакшена рекомендуется хешировать access_code

## Troubleshooting

### Ошибка "relation does not exist"
- Убедитесь, что SQL скрипт выполнен полностью
- Проверьте в Table Editor наличие таблиц

### Ошибка "permission denied"
- Проверьте, что RLS политики созданы
- Убедитесь, что используется правильный API key (anon / public key, не service_role)

### Ошибка "Could not find the 'brewTime' column"
- Это ошибка маппинга camelCase ↔ snake_case
- Убедитесь, что используете последнюю версию кода
- База данных использует `brew_time`, а код автоматически конвертирует в `brewTime`
- Проверьте, что файл `src/utils/caseConverter.ts` существует

### Данные не синхронизируются
- Проверьте .env.local файл
- Убедитесь, что переменные окружения загружены (перезапустите dev сервер)
- Откройте DevTools → Console и проверьте ошибки
- Проверьте, что SQL скрипт выполнен полностью (все таблицы и колонки созданы)

## Полезные ссылки

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)
