import type { SyncStatus } from '../types/sync';
import './SyncIndicator.css';

interface SyncIndicatorProps {
  syncStatus: SyncStatus;
  onSync?: () => void;
}

export function SyncIndicator({ syncStatus, onSync }: SyncIndicatorProps) {
  const getStatusIcon = () => {
    switch (syncStatus.status) {
      case 'synced':
        return '✓';
      case 'syncing':
        return '↻';
      case 'offline':
        return '⊗';
      case 'error':
        return '⚠';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    switch (syncStatus.status) {
      case 'synced':
        return 'Синхронизировано';
      case 'syncing':
        return 'Синхронизация...';
      case 'offline':
        return 'Оффлайн';
      case 'error':
        return 'Ошибка синхронизации';
      default:
        return '';
    }
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSyncTime) return '';
    const date = new Date(syncStatus.lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className={`sync-indicator sync-${syncStatus.status}`}>
      <span className="sync-icon">{getStatusIcon()}</span>
      <div className="sync-info">
        <span className="sync-status">{getStatusText()}</span>
        {syncStatus.lastSyncTime && (
          <span className="sync-time">{formatLastSync()}</span>
        )}
      </div>
      {onSync && syncStatus.status !== 'syncing' && (
        <button className="sync-btn" onClick={onSync} title="Синхронизировать">
          ↻
        </button>
      )}
    </div>
  );
}
