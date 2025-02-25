import { store } from "mredux";
import { LootUser } from "mredux/reducers/main.reducer";
import { UPDATE_MAIN_STATE } from "mredux/types";
import { Livefeed } from "./api.service";
import { updateMainState } from "./updateState";

class AwaiterHandler {
  public listuser: Partial<LootUser>[];
  public listfeed: any[];
  constructor() {
    this.listuser = [];
    this.listfeed = [];
  }

  public handleTicker() {
    let state = store.getState();
    let ingame = state.gameReducer.ingame;

    if (!ingame) {
      for (let il of this.listuser) {
        let user = store.getState().mainReducer.user;
        if (user) {
          store.dispatch({
            type: UPDATE_MAIN_STATE,
            payload: {
              user: Object.assign({}, user, il),
            },
          });
        }
      }

      for (let il of this.listfeed) {
        let drops = store.getState().mainReducer.recentDrops;
        updateMainState({
          recentDrops: [{ newElement: true, ...il }].concat(
            drops?.slice(0x0, drops.length - 0x1) ?? []
          ),
        });
      }
    }
  }

  public push(
    data: Partial<LootUser>,
    type: "listuser" | "listfeed" = "listuser"
  ) {
    if (data && type in this) {
      this[type].push(data);
    }
  }
}

export const waiterhandler = new AwaiterHandler();
