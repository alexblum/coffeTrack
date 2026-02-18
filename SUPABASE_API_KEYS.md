# Как получить API ключи в Supabase

## Где найти ключи в новом интерфейсе Supabase

### Вариант 1: Через Project Settings (рекомендуется)

1. **Откройте ваш проект** в Supabase Dashboard
2. **Нажмите на иконку шестеренки** (⚙️) в левом нижнем углу (Project Settings)
3. **Выберите раздел "API"** в меню слева
4. Вы увидите две секции:

#### Project URL
```
Configuration > Project URL
https://xxxxxxxxxxxxx.supabase.co
```
**Это ваш VITE_SUPABASE_URL**

#### Project API keys

Вы увидите таблицу с ключами:

| Name | Key | Type |
|------|-----|------|
| anon | eyJhbG... | public |
| service_role | eyJhbG... | secret |

**Копируйте ключ с типом "public"** - это ваш VITE_SUPABASE_ANON_KEY

⚠️ **ВАЖНО**: НЕ используйте ключ `service_role` в клиентском приложении! Он предназначен только для backend и обходит все правила безопасности (RLS).

### Вариант 2: Через Settings > API

1. Откройте проект в Supabase
2. Перейдите в **Settings** (внизу слева)
3. Выберите **API**
4. Найдите:
   - **URL** в секции "Config" или "Project URL"
   - **anon public** ключ в секции "Project API keys"

### Вариант 3: Через Home Dashboard

После создания проекта на главном экране (Home) обычно показываются:
- Project URL
- API keys (anon/public и service_role)

## Терминология

В разных версиях Supabase UI ключ может называться:
- **anon** (актуальное название)
- **anon public** (старое название)
- **public** (альтернативное название)

Все это один и тот же ключ - безопасный для использования на клиенте.

## Пример заполнения .env.local

```env
# Скопируйте из Project Settings > API > Configuration > Project URL
VITE_SUPABASE_URL=https://abcdefghijklmn.supabase.co

# Скопируйте из Project Settings > API > Project API keys > anon (public)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MTk4NTU3NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Типичные ошибки

### ❌ Неправильно:
```env
# Использование service_role ключа (ОПАСНО!)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...role":"service_role"...
```

### ✅ Правильно:
```env
# Использование anon/public ключа (БЕЗОПАСНО)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...role":"anon"...
```

## Проверка ключа

Вы можете проверить тип ключа, декодировав JWT токен на https://jwt.io/

В payload должно быть:
```json
{
  "role": "anon"  // ✅ Правильно
}
```

А НЕ:
```json
{
  "role": "service_role"  // ❌ Неправильно для клиента
}
```

## Безопасность

- ✅ **anon/public key** - безопасен для клиента, ограничен Row Level Security (RLS)
- ❌ **service_role key** - НЕ безопасен для клиента, обходит RLS, используется только на backend

## Дополнительная помощь

Если у вас возникли проблемы с поиском ключей:

1. Обновите страницу Supabase Dashboard
2. Попробуйте создать новый проект и посмотрите, где показываются ключи
3. Обратитесь к официальной документации: https://supabase.com/docs/guides/api/api-keys
4. Проверьте видео-туториалы на YouTube: "Supabase API keys"

## Контрольный список

- [ ] Получил Project URL (начинается с https://)
- [ ] Получил anon/public ключ (длинный JWT токен, начинается с eyJ...)
- [ ] Создал файл .env.local в корне проекта
- [ ] Вставил оба значения в .env.local
- [ ] Перезапустил dev сервер (npm run dev)
- [ ] Проверил, что ключ НЕ service_role
