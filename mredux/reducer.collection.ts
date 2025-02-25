import { combineReducers } from "redux";
import { mainReducer } from "./reducers/main.reducer";
import { modalsReducer } from "./reducers/modals.reducer";
import { gameReducer } from "./reducers/game.reducer";
import {
  battlesReducer,
  createBattleReducer,
  winnerBattleReducer,
} from "./reducers/casebattle.reducer";
import { battleReducer } from "./reducers/casebattle.reducer";

export const ReducersCollection = combineReducers({
  mainReducer,
  modalsReducer,
  gameReducer,
  createBattleReducer,
  battleReducer,
  battlesReducer,
  winnerBattleReducer,
});
