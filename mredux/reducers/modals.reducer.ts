import { ItemBoxType, OpenRealBoxType } from "@/utils/api.service";
import { Action } from "..";
import { GameReducer } from "./game.reducer";
import { BoxInventory } from "./main.reducer";

export interface ItemWon {
  id: string;
  name: string;
  slug: string;
  price: number;
}

export interface ModalsReducer {
  authModal: boolean;
  authTab: number;
  buyxpModal: number;
  statisModal: boolean;
  itemsUserWon: GameReducer["itemWons"] | null;
  itemOpened: ItemBoxType | null;
  closeRequestDropDowns: boolean;
  sellItemModal: BoxInventory[] | null;
  sellItemModalTab: number;
  fairnessData: {
    gameId: string;
    publicSeed: string;
    boxId: string;
  } | null;
  walletModal: boolean;
  walletTab: number;
  notificationModal: {
    type: "success" | "error" | "warning" | "info";
    children: React.ReactNode;
    loading?: boolean;
  } | null;
  fairnessModal: boolean;
  closedModalCode: boolean;
  howItWorksModal: boolean;
  createBattleModal: boolean;
  detailBattleModal: boolean;
  roomId: string;
  rematchBattleModal: boolean;
  joinModal: Battle | null;
}

export const modalsReducer = (
  state: ModalsReducer = {
    // Auth Modal
    authModal: false,
    authTab: 0x0,
    statisModal: false,
    closeRequestDropDowns: false,
    // Won item Modal
    itemsUserWon: null,
    // Sell Item Modal
    sellItemModal: null,
    sellItemModalTab: 0x0,

    closedModalCode: false,

    // Buy XP Modal
    buyxpModal: -0x1,

    itemOpened: null,
    // Fairness Modal
    fairnessData: null,

    // Wallet Modal
    walletModal: false,
    walletTab: 0x0,

    // Notification Modal
    notificationModal: null,

    // Fairness 2
    fairnessModal: false,

    // How it works
    howItWorksModal: false,

    // battle modal states
    createBattleModal: false,

    detailBattleModal: false,
    roomId: "",
    rematchBattleModal: false,
    joinModal: null,
  },
  action: Action<ModalsReducer>
): ModalsReducer => {
  switch (action.type) {
    case "UPDATE_MODALS_STATE":
      // let jn = null;
      // let active = Object.values(action.payload)[0x0];

      // if (active) {
      //   let il: keyof ModalsReducer;
      //   for (il in state) {
      //     if (state[il]) {
      //       jn = Object.assign({}, jn ?? {}, { [il]: false });
      //     }
      //   }
      // }

      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
