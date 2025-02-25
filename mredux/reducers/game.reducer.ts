import { OpenRealBoxType } from "@/utils/api.service";
import { Action } from "..";

export interface GameReducer {
  itemWons:
    | (OpenRealBoxType & {
        boxId: string | null;
        gameId: string | null;
        demo: boolean;
        frequency?: number;
        woModal?: boolean;
      })[]
    | null;
  action: number;
  boxDetails: BoxType | null;
  gameStarted: boolean;
  boxes: BoxType[] | null;
  currentBoxId: string | null;
  spinAgain?: boolean;
  spinAgainDemo?: boolean;
  goToSpin?: boolean;
  ingame?: boolean;
  spins: number;
  fastSpin: boolean;
  spinsCompleted: boolean;
}

export const gameReducer = (
  state: GameReducer = {
    boxes: null,
    action: 0x0,
    gameStarted: false,
    boxDetails: null,
    itemWons: null,
    currentBoxId: null,
    ingame: false,
    spins: 1,
    fastSpin: false,
    spinsCompleted: false,
  },
  action: Action<GameReducer>
): GameReducer => {
  switch (action.type) {
    case "UPDATE_GAME_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
