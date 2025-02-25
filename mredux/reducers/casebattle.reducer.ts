import {
  UPDATE_BATTLES,
  UPDATE_CURRENT_BATTLE_STATE,
  UPDATE_IS_WAITING_ROUND,
} from "mredux/types";
import { Action, store } from "..";

export const createBattleReducer = (
  state: CreateBattleReducer = {
    userId: "",
    privateMode: false,
    crazyMode: false,
    fastMode: false,
    teams: 2,
    teamsSize: 1,
    boxes: [],
  },
  action: Action<CreateBattleReducer>
): CreateBattleReducer => {
  switch (action.type) {
    case "UPDATE_CREATE_BATTLE_STATE":
      return Object.assign({}, state, action.payload);
    case "RESET_CREATE_BATTLE":
      return {
        userId: "",
        privateMode: false,
        crazyMode: false,
        fastMode: false,
        teams: 2,
        teamsSize: 1,
        boxes: [],
      };
    default:
      return state;
  }
};

export const battleReducer = (
  state: BattleReducer = {
    battle: {
      id: "",
      owner: null,
      name: "",
      price: 0,
      boxes: [],
      players: [],
      lastProcessedRound: 0,
      nextRoundToProcess: 0,
      teams: 2,
      teamsSize: 1,
      winnerTeam: 0,
      winnings: 0,
      winningsPerPlayer: 0,
      chooseWinnerMethod: null,
      state: "",
      publicSeed: "",
      privateSeed: "",
      clientSeed: "",
      fastOpenings: false,
      privateGame: false,
      spectatorsCount: 0,
      eosSeed: null,
      nonce: 0,
    },
    isWaitingRound: false,
  },
  action: Action<Battle>
): BattleReducer => {
  switch (action.type) {
    case "UPDATE_CURRENT_BATTLE_STATE":
      return Object.assign({}, state, { battle: action.payload });
    case "UPDATE_IS_WAITING_ROUND":
      return Object.assign({}, state, { isWaitingRound: action.payload });
    default:
      return state;
  }
};

export const battlesReducer = (
  state: BattlesReducer = {
    battles: [],
  },
  action: Action<Battle[]>
): BattlesReducer => {
  switch (action.type) {
    case "UPDATE_BATTLES":
      return Object.assign({}, state, { battles: action.payload });
    default:
      return state;
  }
};

export const winnerBattleReducer = (
  state: WinnerBattleReducer = {
    winners: [],
  },
  action: Action<WinnerBattleReducer>
): WinnerBattleReducer => {
  switch (action.type) {
    case "UPDATE_WINNER_BATTLE_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export const updateCurrentBattleState = (payload: Partial<Battle>) => {
  store.dispatch({
    type: UPDATE_CURRENT_BATTLE_STATE,
    payload,
  });
};

export const updateBattles = (payload: Partial<Battle[]>) => {
  store.dispatch({
    type: UPDATE_BATTLES,
    payload,
  });
};

export const updateIsWaitingRound = (payload: Partial<boolean>) => {
  store.dispatch({
    type: UPDATE_IS_WAITING_ROUND,
    payload,
  });
};
