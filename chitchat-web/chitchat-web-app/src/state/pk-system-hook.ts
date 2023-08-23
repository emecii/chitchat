import {
  createHook,
  createStore,
  StoreActionApi,
} from 'react-sweet-state';
import { baseState, BaseState, baseActions, BaseActions } from './index';

// defaults.devtools = true;

const store = createStore<BaseState, BaseActions>({
  initialState: baseState,
  actions: baseActions,
  name: 'pk-system-store',
});

export type pkSystemApi = StoreActionApi<BaseState>;
export const usePkSystemHook = createHook(store);
