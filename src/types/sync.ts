export interface UserSession {
  id: string;
  access_code: string;
  created_at: string;
}

export interface SyncStatus {
  status: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime?: string;
  error?: string;
}

export interface SyncConfig {
  enabled: boolean;
  accessCode?: string;
  sessionId?: string;
}

export type SyncState = 'idle' | 'syncing' | 'error';
