import { createActionGroup, emptyProps, props } from '@ngrx/store';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    'Set Loading': props<{ loading: boolean }>(),
    'Set Error': props<{ error: string | null }>(),
    'Set Online': props<{ online: boolean }>(),
    'Set Sync Status': props<{ syncStatus: SyncStatus; lastSyncTime?: Date }>(),
  },
});
