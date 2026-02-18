import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { syncToCloud, syncFromCloud, isSyncEnabled } from '../services/syncService';
import type { SyncStatus } from '../types/sync';

export function useSyncedStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'offline',
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Синхронизация в облако с debounce
  const syncUp = useCallback(async (data: T) => {
    if (!isSyncEnabled() || isSyncing) {
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatus({ status: 'syncing' });

      const success = await syncToCloud(data as any);
      
      if (success) {
        setSyncStatus({
          status: 'synced',
          lastSyncTime: new Date().toISOString(),
        });
      } else {
        setSyncStatus({
          status: 'offline',
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus({
        status: 'error',
        error: error instanceof Error ? error.message : 'Sync failed',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Загрузка из облака
  const syncDown = useCallback(async () => {
    if (!isSyncEnabled() || isSyncing) {
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatus({ status: 'syncing' });

      const cloudData = await syncFromCloud();
      
      if (cloudData !== null) {
        setStoredValue(cloudData as T);
        setSyncStatus({
          status: 'synced',
          lastSyncTime: new Date().toISOString(),
        });
      } else {
        setSyncStatus({ status: 'offline' });
      }
    } catch (error) {
      console.error('Sync down error:', error);
      setSyncStatus({
        status: 'error',
        error: error instanceof Error ? error.message : 'Sync failed',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, setStoredValue]);

  // Обновление значения с автоматической синхронизацией
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(value);
    
    // Планируем синхронизацию с задержкой
    const newValue = typeof value === 'function' 
      ? (value as (val: T) => T)(storedValue)
      : value;
    
    setTimeout(() => {
      if (isSyncEnabled()) {
        syncUp(newValue);
      }
    }, 1000); // Debounce 1 секунда
  }, [storedValue, setStoredValue, syncUp]);

  // Принудительная синхронизация
  const forceSync = useCallback(async () => {
    await syncUp(storedValue);
  }, [storedValue, syncUp]);

  // Загрузка данных из облака при монтировании
  useEffect(() => {
    if (isSyncEnabled()) {
      syncDown();
    }
  }, []); // Только при монтировании

  return {
    value: storedValue,
    setValue,
    syncStatus,
    forceSync,
    syncDown,
  };
}
