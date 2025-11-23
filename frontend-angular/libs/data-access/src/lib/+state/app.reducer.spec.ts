import { appReducer, initialAppState, AppState } from './app.reducer';
import { AppActions } from './app.actions';

describe('App Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' } as any;
      const result = appReducer(undefined, action);

      expect(result).toEqual(initialAppState);
    });
  });

  describe('setLoading action', () => {
    it('should set loading to true', () => {
      const action = AppActions.setLoading({ loading: true });
      const result = appReducer(initialAppState, action);

      expect(result.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const currentState: AppState = {
        ...initialAppState,
        loading: true,
      };
      const action = AppActions.setLoading({ loading: false });
      const result = appReducer(currentState, action);

      expect(result.loading).toBe(false);
    });
  });

  describe('setError action', () => {
    it('should set error message', () => {
      const errorMessage = 'Something went wrong';
      const action = AppActions.setError({ error: errorMessage });
      const result = appReducer(initialAppState, action);

      expect(result.error).toBe(errorMessage);
    });

    it('should clear error when null is passed', () => {
      const currentState: AppState = {
        ...initialAppState,
        error: 'Previous error',
      };
      const action = AppActions.setError({ error: null });
      const result = appReducer(currentState, action);

      expect(result.error).toBeNull();
    });
  });

  describe('setOnline action', () => {
    it('should set online status to true', () => {
      const action = AppActions.setOnline({ online: true });
      const result = appReducer(initialAppState, action);

      expect(result.online).toBe(true);
    });

    it('should set online status to false', () => {
      const action = AppActions.setOnline({ online: false });
      const result = appReducer(initialAppState, action);

      expect(result.online).toBe(false);
    });
  });

  describe('setSyncStatus action', () => {
    it('should set sync status to syncing', () => {
      const action = AppActions.setSyncStatus({
        syncStatus: 'syncing',
        lastSyncTime: new Date('2025-11-22T10:00:00Z')
      });
      const result = appReducer(initialAppState, action);

      expect(result.syncStatus).toBe('syncing');
      expect(result.lastSyncTime).toEqual(new Date('2025-11-22T10:00:00Z'));
    });

    it('should set sync status to synced', () => {
      const action = AppActions.setSyncStatus({
        syncStatus: 'synced',
        lastSyncTime: new Date('2025-11-22T10:05:00Z')
      });
      const result = appReducer(initialAppState, action);

      expect(result.syncStatus).toBe('synced');
      expect(result.lastSyncTime).toEqual(new Date('2025-11-22T10:05:00Z'));
    });

    it('should set sync status to failed', () => {
      const action = AppActions.setSyncStatus({
        syncStatus: 'failed',
        lastSyncTime: new Date('2025-11-22T10:10:00Z')
      });
      const result = appReducer(initialAppState, action);

      expect(result.syncStatus).toBe('failed');
      expect(result.lastSyncTime).toEqual(new Date('2025-11-22T10:10:00Z'));
    });
  });

  describe('complex state transitions', () => {
    it('should handle multiple actions in sequence', () => {
      let state = initialAppState;

      // Set loading
      state = appReducer(state, AppActions.setLoading({ loading: true }));
      expect(state.loading).toBe(true);

      // Go offline
      state = appReducer(state, AppActions.setOnline({ online: false }));
      expect(state.online).toBe(false);
      expect(state.loading).toBe(true); // Should preserve loading state

      // Set sync status to failed
      const syncTime = new Date('2025-11-22T10:15:00Z');
      state = appReducer(state, AppActions.setSyncStatus({
        syncStatus: 'failed',
        lastSyncTime: syncTime
      }));
      expect(state.syncStatus).toBe('failed');
      expect(state.lastSyncTime).toEqual(syncTime);
      expect(state.online).toBe(false); // Should preserve online state

      // Set error
      state = appReducer(state, AppActions.setError({ error: 'Sync failed' }));
      expect(state.error).toBe('Sync failed');

      // Clear loading
      state = appReducer(state, AppActions.setLoading({ loading: false }));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Sync failed'); // Should preserve error
    });
  });

  describe('state immutability', () => {
    it('should not mutate the previous state', () => {
      const previousState: AppState = {
        ...initialAppState,
        loading: false,
        error: null,
      };
      const previousStateCopy = { ...previousState };

      const action = AppActions.setLoading({ loading: true });
      const result = appReducer(previousState, action);

      expect(previousState).toEqual(previousStateCopy);
      expect(result).not.toBe(previousState);
    });
  });
});
