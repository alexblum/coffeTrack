import { useState } from 'react';
import { getSyncConfig, disableSync } from '../services/syncService';
import './SyncSettings.css';

interface SyncSettingsProps {
  onClose: () => void;
}

export function SyncSettings({ onClose }: SyncSettingsProps) {
  const config = getSyncConfig();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (config.accessCode) {
      navigator.clipboard.writeText(config.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisable = () => {
    if (window.confirm('Вы уверены, что хотите отключить синхронизацию? Данные останутся на устройстве.')) {
      disableSync();
      onClose();
      window.location.reload(); // Перезагрузка для применения изменений
    }
  };

  return (
    <div className="sync-settings-overlay" onClick={onClose}>
      <div className="sync-settings" onClick={(e) => e.stopPropagation()}>
        <div className="sync-settings-header">
          <h2>Настройки синхронизации</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sync-settings-body">
          {config.enabled && config.accessCode ? (
            <>
              <div className="setting-section">
                <h3>Код доступа</h3>
                <p className="description">
                  Используйте этот код для подключения других устройств
                </p>
                <div className="code-display">
                  <span className="code">{config.accessCode}</span>
                  <button 
                    className="btn btn-secondary" 
                    onClick={copyCode}
                  >
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
              </div>

              <div className="setting-section">
                <h3>Статус</h3>
                <p className="status-active">Синхронизация включена</p>
              </div>

              <div className="setting-section danger-zone">
                <h3>Опасная зона</h3>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDisable}
                >
                  Отключить синхронизацию
                </button>
                <p className="description">
                  Данные останутся на устройстве, но перестанут синхронизироваться
                </p>
              </div>
            </>
          ) : (
            <div className="setting-section">
              <p>Синхронизация отключена</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
