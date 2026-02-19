import { useState } from 'react';
import { enableSyncWithNewCode, enableSyncWithExistingCode } from '../services/syncService';
import './SyncSetup.css';

interface SyncSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function SyncSetup({ onComplete, onSkip }: SyncSetupProps) {
  const [mode, setMode] = useState<'choice' | 'new' | 'existing'>('choice');
  const [accessCode, setAccessCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateNew = async () => {
    setLoading(true);
    setError('');
    
    try {
      const code = await enableSyncWithNewCode();
      if (code) {
        setGeneratedCode(code);
        setMode('new');
      } else {
        setError('Не удалось создать код. Проверьте подключение к Supabase.');
      }
    } catch (err) {
      setError('Ошибка при создании кода доступа');
    } finally {
      setLoading(false);
    }
  };

  const handleUseExisting = async () => {
    if (accessCode.length !== 6) {
      setError('Код должен содержать 6 цифр');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const success = await enableSyncWithExistingCode(accessCode);
      if (success) {
        onComplete();
      } else {
        setError('Неверный код доступа');
      }
    } catch (err) {
      setError('Ошибка при проверке кода');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Код скопирован в буфер обмена!');
  };

  if (mode === 'new' && generatedCode) {
    return (
      <div className="sync-setup modal">
        <div className="sync-setup-content">
          <h2>Ваш код доступа создан!</h2>
          <div className="code-display">
            <span className="code">{generatedCode}</span>
            <button className="btn btn-secondary" onClick={copyCode}>
              Копировать
            </button>
          </div>
          <p className="info-text">
            Сохраните этот код! Он понадобится для синхронизации на других устройствах.
          </p>
          <button className="btn btn-primary" onClick={onComplete}>
            Готово
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'existing') {
    return (
      <div className="sync-setup modal">
        <div className="sync-setup-content">
          <h2>Введите код доступа</h2>
          <p>Введите 6-значный код с другого устройства</p>
          <input
            type="text"
            className="code-input"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            disabled={loading}
          />
          {error && <p className="error-text">{error}</p>}
          <div className="form-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleUseExisting}
              disabled={loading || accessCode.length !== 6}
            >
              {loading ? 'Проверка...' : 'Подключить'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setMode('choice')}
              disabled={loading}
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sync-setup">
      <div className="sync-setup-content">
        <div className="sync-banner-text">
          <h2>☁️ Синхронизация</h2>
          <p>Синхронизируйте данные между устройствами</p>
        </div>
        <div className="sync-options">
          <button 
            className="sync-option-btn"
            onClick={handleCreateNew}
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать код'}
          </button>

          <button 
            className="sync-option-btn"
            onClick={() => setMode('existing')}
            disabled={loading}
          >
            Ввести код
          </button>

          {onSkip && (
            <button className="skip-btn" onClick={onSkip} disabled={loading}>
              ✕
            </button>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
