import { store } from "mredux";
import { GameReducer } from "mredux/reducers/game.reducer";
import { MainReducer } from "mredux/reducers/main.reducer";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import {
  UPDATE_GAME_STATE,
  UPDATE_MAIN_STATE,
  UPDATE_MODALS_STATE,
} from "mredux/types";

export const updateGameState = (payload: Partial<GameReducer>) => {
  store.dispatch({
    type: UPDATE_GAME_STATE,
    payload,
  });
};

export const updateMainState = (payload: Partial<MainReducer>) => {
  store.dispatch({
    type: UPDATE_MAIN_STATE,
    payload,
  });
};

export const updateModalsState = (payload: Partial<ModalsReducer>) => {
  store.dispatch({
    type: UPDATE_MODALS_STATE,
    payload,
  });
};
