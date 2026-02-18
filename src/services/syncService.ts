import { supabase, isSupabaseConfigured as checkSupabaseConfigured } from './supabase';
import type { Drink } from '../types/drink';
import type { SyncConfig } from '../types/sync';
import { drinkToDb, drinkFromDb } from '../utils/caseConverter';

const SYNC_CONFIG_KEY = 'coffeeTrack_syncConfig';

// Реэкспорт для удобства
export { checkSupabaseConfigured as isSupabaseConfigured };

// Генерация 6-значного кода доступа
export const generateAccessCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Получение конфигурации синхронизации из LocalStorage
export const getSyncConfig = (): SyncConfig => {
  try {
    const config = localStorage.getItem(SYNC_CONFIG_KEY);
    if (config) {
      return JSON.parse(config);
    }
  } catch (error) {
    console.error('Error reading sync config:', error);
  }
  return { enabled: false };
};

// Сохранение конфигурации синхронизации
export const saveSyncConfig = (config: SyncConfig): void => {
  try {
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving sync config:', error);
  }
};

// Создание новой сессии с кодом доступа
export const createSession = async (accessCode: string): Promise<string | null> => {
  if (!checkSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({ access_code: accessCode })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

// Проверка существования кода доступа и получение session_id
export const validateAccessCode = async (accessCode: string): Promise<string | null> => {
  if (!checkSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('id')
      .eq('access_code', accessCode)
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Error validating access code:', error);
    return null;
  }
};

// Синхронизация данных в облако
export const syncToCloud = async (drinks: Drink[]): Promise<boolean> => {
  if (!checkSupabaseConfigured()) {
    return false;
  }

  const config = getSyncConfig();
  if (!config.enabled || !config.sessionId) {
    return false;
  }

  try {
    // Удаляем все старые записи пользователя
    await supabase
      .from('drinks')
      .delete()
      .eq('session_id', config.sessionId);

    // Вставляем актуальные данные
    if (drinks.length > 0) {
      const drinksForDb = drinks.map(drink => drinkToDb(drink, config.sessionId!));

      const { error } = await supabase
        .from('drinks')
        .insert(drinksForDb);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error syncing to cloud:', error);
    return false;
  }
};

// Загрузка данных из облака
export const syncFromCloud = async (): Promise<Drink[] | null> => {
  if (!checkSupabaseConfigured()) {
    return null;
  }

  const config = getSyncConfig();
  if (!config.enabled || !config.sessionId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .eq('session_id', config.sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Конвертируем из snake_case в camelCase
    return data?.map(drinkFromDb) || [];
  } catch (error) {
    console.error('Error syncing from cloud:', error);
    return null;
  }
};

// Включение синхронизации с новым кодом
export const enableSyncWithNewCode = async (): Promise<string | null> => {
  const accessCode = generateAccessCode();
  const sessionId = await createSession(accessCode);

  if (!sessionId) {
    return null;
  }

  saveSyncConfig({
    enabled: true,
    accessCode,
    sessionId,
  });

  return accessCode;
};

// Включение синхронизации с существующим кодом
export const enableSyncWithExistingCode = async (accessCode: string): Promise<boolean> => {
  const sessionId = await validateAccessCode(accessCode);

  if (!sessionId) {
    return false;
  }

  saveSyncConfig({
    enabled: true,
    accessCode,
    sessionId,
  });

  return true;
};

// Отключение синхронизации
export const disableSync = (): void => {
  saveSyncConfig({ enabled: false });
};

// Проверка статуса синхронизации
export const isSyncEnabled = (): boolean => {
  const config = getSyncConfig();
  return config.enabled && checkSupabaseConfigured();
};
