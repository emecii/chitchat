import { pkSystemState, PkSystemState } from './pk-system-state';
import { pkSystemAction, PkSystemAction } from './pk-system-action'
export const baseState = {
    ...pkSystemState,
};

export const baseActions = {
   ...pkSystemAction,
};

export type BaseState = PkSystemState;

export type BaseActions = PkSystemAction;