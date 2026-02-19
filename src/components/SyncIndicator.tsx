import { useState } from 'react';
import type { SyncStatus } from '../types/sync';
import './SyncIndicator.css';

interface SyncIndicatorProps {
  syncStatus: SyncStatus;
  onSync?: () => void;
}

export function SyncIndicator({ syncStatus, onSync }: SyncIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTouchDevice] = useState(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0);

  const getStatusIcon = () => {
    switch (syncStatus.status) {
      case 'synced':
        return '☁️';
      case 'syncing':
        return '↻';
      case 'offline':
        return '☁️';
      case 'error':
        return '⚠️';
      default:
        return '☁️';
    }
  };

  const getStatusText = () => {
    switch (syncStatus.status) {
      case 'synced':
        return 'Синхронизировано';
      case 'syncing':
        return 'Синхронизация...';
      case 'offline':
        return 'Оффлайн режим';
      case 'error':
        return 'Ошибка синхронизации';
      default:
        return '';
    }
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSyncTime) return 'Нет данных';
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

  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      e.preventDefault();
      setShowTooltip(!showTooltip);
    } else if (onSync && syncStatus.status !== 'syncing') {
      onSync();
    }
  };

  return (
    <div 
      className={`sync-indicator sync-${syncStatus.status}`}
      onMouseEnter={() => !isTouchDevice && setShowTooltip(true)}
      onMouseLeave={() => !isTouchDevice && setShowTooltip(false)}
    >
      <button 
        className="sync-trigger" 
        onClick={handleClick}
        aria-label="Статус синхронизации"
      >
        <span className="sync-icon">{getStatusIcon()}</span>
      </button>
      
      <div className={`sync-tooltip ${showTooltip ? 'show' : ''}`}>
        <div className="sync-tooltip-header">
          <span className="sync-icon">{getStatusIcon()}</span>
          <span className="sync-tooltip-status">{getStatusText()}</span>
        </div>
        <div className="sync-tooltip-time">
          Последняя синхронизация: {formatLastSync()}
        </div>
        {onSync && syncStatus.status !== 'syncing' && (
          <button className="sync-tooltip-btn" onClick={() => { onSync(); setShowTooltip(false); }}>
            Синхронизировать сейчас
          </button>
        )}
      </div>
    </div>
  );
}
