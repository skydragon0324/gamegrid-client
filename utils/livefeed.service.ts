import io from "socket.io-client";
import { store } from "mredux";
import { updateMainState } from "./updateState";
import { waiterhandler } from "./waiter";

export class LiveFeedWSHandler {
  // static instance = null;
  static instance: LiveFeedWSHandler | null = null;
  socketLivefeed: typeof io.Socket | null = null;

  static getInstance() {
    if (!LiveFeedWSHandler.instance) {
      LiveFeedWSHandler.instance = new LiveFeedWSHandler();
    }
    return LiveFeedWSHandler.instance;
  }

  connectLivefeed() {
    console.log("connecting livefeed");
    if (!this.socketLivefeed) {
      this.socketLivefeed = io.connect(
        `https://${process.env.NEXT_PUBLIC_WS_URL}/live-feed`,
        {
          transports: ["websocket"],
        }
      );
      console.log("connected livefeed");

      this.socketLivefeed.on("connect", () => {
        this.socketLivefeed?.on("live-feed:won-item", (data: any) => {
          try {
            console.log("livefeed:won-item from liveFeedWSHandler", data);
            typeof data === "string" && (data = JSON.parse(data));

            if (data && data?.item && data?.user) {
              let state = store.getState();
              let drops = state.mainReducer.recentDrops;
              let ingamestate = state.gameReducer.ingame;

              if (ingamestate) {
                waiterhandler.push(data, "listfeed");
              } else {
                updateMainState({
                  recentDrops: [{ newElement: true, ...data }].concat(
                    drops?.slice(0x0, drops.length - 0x1) ?? []
                  ),
                });
              }
            }
          } catch (e) {
            // console.log(e);
          }
        });
      });
    }
  }

  disconnectLivefeed() {
    console.log("disconnecting livefeed");
    if (this.socketLivefeed) {
      this.socketLivefeed.disconnect();
      this.socketLivefeed = null;
    }
    console.log("disconnected livefeed");
  }
}

export const liveFeedWSHandler = LiveFeedWSHandler.getInstance();
