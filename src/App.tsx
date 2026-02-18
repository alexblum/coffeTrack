import { useState, useEffect } from 'react';
import type { Drink } from './types/drink';
import { useSyncedStorage } from './hooks/useSyncedStorage';
import { getSyncConfig, isSupabaseConfigured } from './services/syncService';
import { DrinkForm } from './components/DrinkForm';
import { DrinkList } from './components/DrinkList';
import { DrinkDetails } from './components/DrinkDetails';
import { SyncSetup } from './components/SyncSetup';
import { SyncIndicator } from './components/SyncIndicator';
import { SyncSettings } from './components/SyncSettings';
import './App.css';

type View = 'list' | 'add' | 'details' | 'edit';

function App() {
  const { value: drinks, setValue: setDrinks, syncStatus, forceSync, syncDown } = useSyncedStorage<Drink[]>('coffeeTrackData', []);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [showSyncSetup, setShowSyncSetup] = useState(false);
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [syncSetupChecked, setSyncSetupChecked] = useState(false);

  // Проверка необходимости показа настройки синхронизации
  useEffect(() => {
    if (!syncSetupChecked && isSupabaseConfigured()) {
      const config = getSyncConfig();
      if (!config.enabled) {
        setShowSyncSetup(true);
      }
      setSyncSetupChecked(true);
    }
  }, [syncSetupChecked]);

  const handleAddDrink = (drink: Drink) => {
    setDrinks([...drinks, drink]);
    setCurrentView('list');
  };

  const handleUpdateDrink = (updatedDrink: Drink) => {
    setDrinks(drinks.map(d => d.id === updatedDrink.id ? updatedDrink : d));
    setCurrentView('list');
    setSelectedDrink(null);
  };

  const handleDeleteDrink = (id: string) => {
    setDrinks(drinks.filter(d => d.id !== id));
    if (selectedDrink?.id === id) {
      setCurrentView('list');
      setSelectedDrink(null);
    }
  };

  const handleDrinkClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setCurrentView('details');
  };

  const handleEditClick = () => {
    setCurrentView('edit');
  };

  const handleCloseDetails = () => {
    setCurrentView('list');
    setSelectedDrink(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('details');
  };

  const handleSyncSetupComplete = async () => {
    setShowSyncSetup(false);
    // Загрузить данные из облака после настройки
    await syncDown();
  };

  const handleSyncSetupSkip = () => {
    setShowSyncSetup(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-top">
            <div>
              <h1>☕ Coffee Track</h1>
              <p className="subtitle">Отслеживайте свои кофейные напитки</p>
            </div>
            {isSupabaseConfigured() && getSyncConfig().enabled && (
              <button 
                className="settings-btn"
                onClick={() => setShowSyncSettings(true)}
                title="Настройки синхронизации"
              >
                ⚙️
              </button>
            )}
          </div>
          {isSupabaseConfigured() && getSyncConfig().enabled && (
            <SyncIndicator syncStatus={syncStatus} onSync={forceSync} />
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {currentView === 'list' && (
            <>
              <div className="action-bar">
                <button 
                  className="btn btn-primary btn-add"
                  onClick={() => setCurrentView('add')}
                >
                  + Добавить напиток
                </button>
              </div>
              <DrinkList 
                drinks={drinks}
                onDrinkClick={handleDrinkClick}
                onDrinkDelete={handleDeleteDrink}
              />
            </>
          )}

          {currentView === 'add' && (
            <>
              <button 
                className="back-btn"
                onClick={() => setCurrentView('list')}
              >
                ← Назад к списку
              </button>
              <DrinkForm 
                onSubmit={handleAddDrink}
                onCancel={() => setCurrentView('list')}
              />
            </>
          )}

          {currentView === 'edit' && selectedDrink && (
            <>
              <button 
                className="back-btn"
                onClick={handleCancelEdit}
              >
                ← Назад к деталям
              </button>
              <DrinkForm 
                onSubmit={handleUpdateDrink}
                onCancel={handleCancelEdit}
                initialData={selectedDrink}
                isEdit
              />
            </>
          )}
        </div>
      </main>

      {currentView === 'details' && selectedDrink && (
        <DrinkDetails 
          drink={selectedDrink}
          onClose={handleCloseDetails}
          onEdit={handleEditClick}
        />
      )}

      {showSyncSetup && (
        <SyncSetup 
          onComplete={handleSyncSetupComplete}
          onSkip={handleSyncSetupSkip}
        />
      )}

      {showSyncSettings && (
        <SyncSettings onClose={() => setShowSyncSettings(false)} />
      )}

      <footer className="app-footer">
        <p>Coffee Track © 2026</p>
      </footer>
    </div>
  );
}

export default App;
