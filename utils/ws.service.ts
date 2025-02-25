import {
  updateBattles,
  updateCurrentBattleState,
  updateIsWaitingRound,
} from "./../mredux/reducers/casebattle.reducer";
import { store } from "mredux";
import { updateMainState } from "./updateState";
import io from "socket.io-client";
import { getBattleById } from "./api.service";
import { waiterhandler } from "./waiter";
import toast from "react-hot-toast";
import { handleErrorRequest } from "./handler";
import { getBoxFromBoxId, getItemFromItemId } from "@/utils/battleUtils";

export class WsHandler {
  public socket: typeof io.Socket | null;
  public socketUser: typeof io.Socket | null;
  public socketLivefeed: typeof io.Socket | null;
  public socketBattle: typeof io.Socket | null;
  public authenticated: boolean;

  constructor() {
    this.socket = null;
    this.socketUser = null;
    this.socketLivefeed = null;
    this.socketBattle = null;
    this.authenticated = false;
  }

  public init() {
    this.socket = io.connect(process.env.NEXT_PUBLIC_WS_URL ?? "", {
      transports: ["websocket"],
    });

    this.socketUser = io.connect(
      `https://${process.env.NEXT_PUBLIC_WS_URL}/user`,
      {
        transports: ["websocket"],
      }
    );

    this.socketUser.on("connect", () => {
      let token = localStorage.getItem("token");

      if (token) {
        this.socketUser?.emit("auth:authenticate", { token });

        this.socketUser?.on("user:balance-update", (data: string) => {
          try {
            let balance = String(data).trim();
            let state = store.getState();
            let userdata = state.mainReducer.user;
            if (balance && balance.match(/^[0-9\.\,]+$/) && userdata) {
              updateMainState({
                user: {
                  ...userdata,
                  usdBalance: Number(balance),
                },
              });
            }
          } catch (e) {
            // console.log(e);
          }
        });

        this.socketUser?.on("user:xp-update", (data: string) => {
          try {
            let lcb = String(data).trim();
            let state = store.getState();
            let userdata = state.mainReducer.user;
            let ingamestate = state.gameReducer.ingame;
            if (lcb && lcb.match(/^[0-9\.\,]+$/) && userdata) {
              if (ingamestate) {
                waiterhandler.push({
                  xpBalance: Number(lcb),
                });
              } else {
                updateMainState({
                  user: {
                    ...userdata,
                    xpBalance: Number(lcb),
                  },
                });
              }
            }
          } catch (e) {
            // console.log(e);
          }
        });

        this.socketUser?.on("user:level-update", (data: string) => {
          try {
            typeof data === "string" && (data = JSON.parse(data.trim()));

            if (typeof data === "object") {
              let _data: {
                currentLevel: number;
                currentXP: number;
                xpToLevelUp: number;
              } = data;

              let state = store.getState();
              let userdata = state.mainReducer.user;
              let ingamestate = state.gameReducer.ingame;

              if (_data && userdata) {
                if (ingamestate) {
                  waiterhandler.push({
                    xpBalance: _data.currentXP,
                    xpExtraInfo: {
                      ...userdata.xpExtraInfo,
                      level: _data.currentLevel,
                      xpToLevelUp: _data.xpToLevelUp,
                    },
                  });
                } else {
                  updateMainState({
                    user: {
                      ...userdata,
                      xpBalance: _data.currentXP,
                      xpExtraInfo: {
                        ...userdata.xpExtraInfo,
                        level: _data.currentLevel,
                        xpToLevelUp: _data.xpToLevelUp,
                      },
                    },
                  });
                }
              }
            }
          } catch (e) {
            // console.log(e);
          }
        });

        this.socketUser?.on("user:lootcoin-update", (data: string) => {
          try {
            let lcb = String(data);

            let state = store.getState();
            let userdata = state.mainReducer.user;
            let ingamestate = state.gameReducer.ingame;
            if (lcb && lcb.match(/^[0-9\.\,]+$/) && userdata) {
              if (ingamestate) {
                waiterhandler.push({
                  lootCoinsBalance: Number(lcb),
                });
              } else {
                updateMainState({
                  user: {
                    ...userdata,
                    lootCoinsBalance: Number(lcb),
                  },
                });
              }
            }
          } catch (e) {
            // console.log(e);
          }
        });
      }
    });

    // this.socketLivefeed = io.connect(
    //   `https://${process.env.NEXT_PUBLIC_WS_URL}/live-feed`,
    //   {
    //     transports: ["websocket"],
    //   }
    // );

    // this.socketLivefeed.on("connect", () => {
    //   this.socketLivefeed?.on("live-feed:won-item", (data: any) => {
    //     try {
    //       typeof data === "string" && (data = JSON.parse(data));

    //       if (data && data?.item && data?.user) {
    //         let state = store.getState();
    //         let drops = state.mainReducer.recentDrops;
    //         let ingamestate = state.gameReducer.ingame;

    //         if (ingamestate) {
    //           waiterhandler.push(data, "listfeed");
    //         } else {
    //           updateMainState({
    //             recentDrops: [{ newElement: true, ...data }].concat(
    //               drops?.slice(0x0, drops.length - 0x1) ?? []
    //             ),
    //           });
    //         }
    //       }
    //     } catch (e) {
    //       // console.log(e);
    //     }
    //   });
    // });

    this.socket.on("connect", () => {
      let token = localStorage.getItem("token");

      if (token) {
        this.socket?.emit("auth:authenticate", { token });
      }
    });

    this.socket.on("auth:authenticated", (message: string) => {
      if (String(message).toLowerCase() === "authenticated") {
        this.authenticated = true;
      }
    });

    this.socket.on("disconnect", () => {
      this.authenticated = false;
      console.log("Socket disconnected");
      setTimeout(() => {
        console.log("Reconnecting...");
        this.socket?.connect();
      }, 2000);
    });

    this.socket.connect();
  }

  public caseBattle() {
    console.log("call case battle websocket", process.env.NEXT_PUBLIC_WS_URL);

    // this.socketBattle?.disconnect();
    const currentPath = window.location.pathname;
    if (
      currentPath.startsWith("/case/lobby")
      // || currentPath.startsWith("/case/createBattle")
    ) {
      this.socketBattle = io.connect(
        `${process.env.NEXT_PUBLIC_WS_URL}/box-battle`,
        {
          transports: ["websocket"],
        }
      );
    } else if (currentPath.startsWith("/case/battle/")) {
      this.socketBattle = io.connect(
        `${process.env.NEXT_PUBLIC_WS_URL}/box-battle/game`,
        {
          transports: ["websocket"],
        }
      );
      let token = localStorage.getItem("token");
      this.socketBattle?.emit("auth:authenticate", { token });
    }

    this.socketBattle?.on("connect", () => {
      this.socketBattle?.on("auth:error:not-authenticated", (data: string) => {
        toast.error("You have to log in for this event");
        window.location.href = "/case/lobby";
      });
      this.socketBattle?.on("auth:error:banned", (data: string) => {
        window.location.href = "/case/lobby";
        toast.error("This account is banned, please contact to support team");
      });
      console.log("=====================");
      this.socketBattle?.on(
        "box-battles:created",
        (data: BattleWSResponseData<{ battle: Battle }>) => {
          try {
            const battles = [...store.getState().battlesReducer.battles];
            // check last battle state
            if (
              battles.length > 9 &&
              battles[battles.length - 1].state !== "WAITING_FOR_PLAYERS"
            ) {
              battles.pop();
            }
            battles.unshift(data.data.battle);
            updateBattles([...battles]);
            console.log("----------CREATED BATTLE ----------");
          } catch (error) {
            toast.error(handleErrorRequest(error));
          }
        }
      );
      this.socketBattle?.on(
        "box-battles:reimbursed",
        (data: BattleWSResponseData<{ battle: Battle }>) => {
          try {
            const battles = [...store.getState().battlesReducer.battles];
            const tempBattles = battles.filter(
              (battle) => battle.id != data.battleId
            );
            updateBattles([...tempBattles]);
            console.log("----------REIMBURSED BATTLE ----------");
          } catch (error) {
            toast.error(handleErrorRequest(error));
          }
        }
      );
      this.socketBattle?.on(
        "box-battles:player-joined",
        (data: BattleWSResponseData<{ player: Player }>) => {
          try {
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            if (currentBattle.id === data.battleId) {
              updateCurrentBattleState({
                ...currentBattle,
                players: [...currentBattle.players, data.data.player],
              });
            }
            const temp = currentBattles.map((batt) => {
              if (batt.id === data.battleId) {
                return {
                  ...batt,
                  players: [...batt.players, data.data.player],
                };
              }
              return batt;
            });
            updateBattles(temp);
            console.log("----------JOINED ONE PLAYER TO BATTLE ----------");
          } catch (error) {
            console.error(error);
          }
        }
      );
      this.socketBattle?.on(
        "box-battles:player-leaved",
        (data: BattleWSResponseData<{ playerId: string }>) => {
          try {
            console.log("player-leaved", data);
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            if (currentBattle.id === data.battleId) {
              const tempPlayers = currentBattle.players.filter(
                (player) => player.id !== data.data.playerId
              );
              updateCurrentBattleState({
                ...currentBattle,
                players: tempPlayers,
              });
            }
            const updatedBattles = currentBattles.map((battle) => {
              if (battle.id === data.battleId) {
                const tempPlayers = currentBattle.players.filter(
                  (player) => player.id !== data.data.playerId
                );
                return { ...battle, players: tempPlayers };
              }
              return battle;
            });
            updateBattles(updatedBattles);
            console.log("---------- LEFT ONE PLAYER TO BATTLE ----------");
          } catch (error) {
            console.error(error);
          }
        }
      );
      this.socketBattle?.on(
        "box-battles:deleted",
        (data: BattleWSResponseData<Battle>) => {
          try {
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            if (currentBattle.id === data.battleId) {
              updateCurrentBattleState({ ...currentBattle, state: "DELETED" });
            }
            updateBattles(
              currentBattles.filter((battle) => battle.id !== data.battleId)
            );
            toast.success("Battle has been cancelled!");
            console.log("---------- DELETE BATTLE ----------");
          } catch (error) {
            console.error(error);
          }
        }
      );
      this.socketBattle?.on(
        "box-battles:ready-to-start",
        (data: BattleWSResponseData<{ battle: Battle }>) => {
          try {
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            if (currentBattle.id === data.battleId) {
              updateCurrentBattleState({
                ...currentBattle,
                state: "READY_TO_START",
              });
            }
            const temp = currentBattles.map((batt) => {
              if (batt.id === data.battleId) {
                return { ...batt, state: "READY_TO_START" };
              }
              return batt;
            });
            updateBattles(temp);
            console.log("------READY_TO_START---------");
          } catch (error) {
            console.error(error);
          }
        }
      );
      // this.socketBattle?.on(
      //   "box-battles:started",
      //   (data: { battle: Battle }) => {
      //     try {
      //       let battles = [...store.getState().battlesReducer.battles];
      //       let battle = { ...store.getState().battleReducer.battle };
      //       const updatedBattles = battles.map((battle) => {
      //         if (battle.id === data.battle.id) {
      //           return { ...data.battle };
      //         }
      //         return battle;
      //       });
      //       updateBattles(updatedBattles);
      //       if (battle.id === data.battle.id) {
      //         updateCurrentBattleState(data.battle);
      //       }
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
      // );
      this.socketBattle?.on(
        "box-battles:committed-eos-block",
        (data: BattleWSResponseData<{ blockNum: number }>) => {
          try {
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            if (currentBattle.id === data.battleId) {
              updateCurrentBattleState({
                ...currentBattle,
                state: "COMMITTED_EOS_BLOCK",
                eosSeed: { blockNum: data.data.blockNum, hash: "" },
              });
            }
            const temp = currentBattles.map((batt) => {
              if (batt.id === data.battleId) {
                return { ...batt, state: "COMMITTED_EOS_BLOCK" };
              }
              return batt;
            });
            updateBattles(temp);
            console.log("------COMMITTED_EOS_BLOCK---------");
          } catch (error) {
            console.error(error);
          }
        }
      );
      // this.socketBattle?.on(
      //   "box-battles:eos-block-hash-updated",
      //   (data: { battle: Battle }) => {
      //     try {
      //       console.log("waiting for user seed", data.battle);
      //       let battles = [...store.getState().battlesReducer.battles];
      //       let battle = { ...store.getState().battleReducer.battle };
      //       const updatedBattles = battles.map((battle) => {
      //         if (battle.id === data.battle.id) {
      //           return { ...data.battle };
      //         }
      //         return battle;
      //       });
      //       updateBattles(updatedBattles);
      //       if (battle.id === data.battle.id) {
      //         updateCurrentBattleState(data.battle);
      //       }
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
      // );
      // this.socketBattle?.on(
      //   "box-battles:start-round",
      //   (data: { battle: Battle }) => {
      //     try {
      //       let battles = [...store.getState().battlesReducer.battles];
      //       let battle = { ...store.getState().battleReducer.battle };
      //       const updatedBattles = battles.map((battle) => {
      //         if (battle.id === data.battle.id) {
      //           return data.battle;
      //         }
      //         return battle;
      //       });
      //       if (battle.id === data.battle.id) {
      //         updateCurrentBattleState({
      //           ...data.battle,
      //         });
      //       }
      //       updateBattles(updatedBattles);
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
      // );

      this.socketBattle?.on(
        "box-battles:round-completed",
        (data: BattleWSResponseData<BattleRound>) => {
          try {
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            if (currentBattle.id === data.battleId && data.data.round.info) {
              const updatedPlayers = currentBattle.players.map((player) => {
                const playerIds = Object.keys(data.data.round.info);
                if (playerIds.includes(player.id)) {
                  const updatePlayer: Player = {
                    ...player,
                    wonItems: [
                      ...player.wonItems,
                      {
                        box: getBoxFromBoxId(
                          currentBattle,
                          data.data.round.info[player.id].boxId
                        ),
                        item: getItemFromItemId(
                          currentBattle,
                          data.data.round.info[player.id].itemId
                        ),
                        boxId: data.data.round.info[player.id].boxId,
                        itemId: data.data.round.info[player.id].itemId,
                      },
                    ],
                  };

                  return updatePlayer;
                }
                return player;
              });
              updateIsWaitingRound(false);
              updateCurrentBattleState({
                ...currentBattle,
                lastProcessedRound: data.data.round.id,
                players: [...updatedPlayers],
                state: "IN_PROGRESS",
              });
            }
            console.log("===========ROUND-COMPLETED==========");
            const tempBattles = currentBattles.map((batt) => {
              if (batt.id === data.battleId) {
                return {
                  ...batt,
                  lastProcessedRound: data.data.round.id,
                  state: "IN_PROGRESS",
                };
              }
              return batt;
            });
            updateBattles(tempBattles);
          } catch (error) {
            console.error(error);
          }
        }
      );
      // this.socketBattle?.on(
      //   "box-battles:rounds-finished",
      //   (data: { battle: Battle }) => {
      //     try {
      //       console.log(
      //         "box-battles:rounds-finished",
      //         new Date().getTime() - date
      //       );
      //       date = new Date().getTime();
      //       let battles = store.getState().battlesReducer.battles;
      //       let battle = store.getState().battleReducer.battle;
      //       if (battle.id === data.battle.id) {
      //         updateCurrentBattleState(data.battle);
      //       }
      //       const updatedBattles = battles.map((battle: Battle) => {
      //         if (battle.id === data.battle.id) {
      //           return data.battle;
      //         }
      //         return battle;
      //       });
      //       updateBattles(updatedBattles);
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
      // );
      // this.socketBattle?.on(
      //   "box-battles:calculating-rewards",
      //   (data: { battle: Battle }) => {
      //     try {
      //       console.log("calculating-rewards", data);
      //       date = new Date().getTime();
      //       let battles = [...store.getState().battlesReducer.battles];
      //       let battle = { ...store.getState().battleReducer.battle };
      //       if (battle.id === data.battle.id) {
      //         updateCurrentBattleState(data.battle);
      //       }
      //       const updatedBattles = battles.map((battle) => {
      //         if (battle.id === data.battle.id) {
      //           return data.battle;
      //         }
      //         return battle;
      //       });
      //       updateBattles(updatedBattles);
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
      // );

      this.socketBattle?.on(
        "box-battles:rewarding-players",
        (data: BattleWSResponseData<BattleWinner>) => {
          try {
            const currentBattles = store
              .getState()
              .battlesReducer.battles.map((battle) => ({ ...battle }));
            const currentBattle = Object.assign(
              {},
              store.getState().battleReducer.battle
            );
            const tempBattles = currentBattles.map((batt) => {
              if (batt.id === data.battleId) {
                return {
                  ...batt,
                  winnerTeam: data.data.winnerTeam,
                  state: "REWARDING",
                  chooseWinnerMethod: {
                    methodName: data.data.chooseWinner.method,
                    round: 0,
                  },
                };
              } else return batt;
            });
            const teams: Team[] = [];
            console.log(currentBattle);
            currentBattle.players.forEach((player) => {
              const teamIndex = teams.findIndex(
                (team) => team.id === player.team
              );
              if (teamIndex === -1) {
                teams.push({
                  id: player.team,
                  players: [player],
                  totalPrice: player.wonItems.reduce(
                    (acc, item) =>
                      acc + getItemFromItemId(currentBattle, item.itemId).price,
                    0
                  ),
                });
              } else {
                teams[teamIndex].players.push(player);
                teams[teamIndex].totalPrice += player.wonItems.reduce(
                  (acc, item) =>
                    acc + getItemFromItemId(currentBattle, item.itemId).price,
                  0
                );
              }
            });
            const standardTeam = teams.reduce(
              (standard, obj) =>
                obj.totalPrice > standard.totalPrice ? obj : standard,
              teams[0]
            );
            const temp = teams.filter(
              (team) => team.totalPrice === standardTeam.totalPrice
            );
            store.dispatch({
              type: "UPDATE_WINNER_BATTLE_STATE",
              payload: { winners: temp },
            });
            setTimeout(
              () => {
                if (currentBattle.id === data.battleId) {
                  updateCurrentBattleState({
                    ...currentBattle,
                    winnerTeam: data.data.winnerTeam,
                    state: "REWARDING",
                  });
                }
                updateBattles(tempBattles);
              },
              currentBattle.fastOpenings ? 3000 : 9000
            );
            console.log("--------- REWARDING BATTLE -----------");
          } catch (error) {
            console.error(error);
          }
        }
      );

      this.socketBattle?.on(
        "box-battles:completed",
        (data: BattleWSResponseData<{ battle: Battle }>) => {
          (async () => {
            // Define an async IIFE (Immediately Invoked Function Expression)
            try {
              const currentLobbyBattles = store
                .getState()
                .battlesReducer.battles.map((battle) => ({ ...battle }));
              const currentRunningBattle = {
                ...store.getState().battleReducer.battle,
              };
              const updateBattle = await getBattleById(data.battleId);
              // Use Promise.all to wait for all battles to be potentially updated
              const updatedLobbyBattles = await Promise.all(
                currentLobbyBattles.map(async (battle) => {
                  if (battle.id === data.battleId) {
                    // Assuming getBattleById is an async function that fetches battle details
                    return updateBattle;
                  }
                  return battle;
                })
              );

              // Use the updated battles array after the asynchronous operations are completed
              let winners = { ...store.getState().winnerBattleReducer };
              setTimeout(
                () => {
                  updateBattles(updatedLobbyBattles);
                  if (currentRunningBattle.id === data.battleId) {
                    updateCurrentBattleState(updateBattle);
                  }
                },
                currentRunningBattle.fastOpenings
                  ? winners.winners.length > 1
                    ? 9000
                    : 3000
                  : winners.winners.length > 1
                    ? 16000
                    : 10000
              );

              console.log("------------- FINISHED BATTLE -------------");
            } catch (error) {
              toast.error(handleErrorRequest(error));
            }
          })(); // Immediately invoke the async function
        }
      );

      this.socketBattle?.on(
        "box-battles:spectator-joined",
        (data: { battle: Battle }) => {
          try {
            let battles = [...store.getState().battlesReducer.battles];
            const updatedBattles = battles.map((battle) => {
              if (battle.id === data.battle.id) {
                return data.battle;
              }
              return battle;
            });
            updateBattles(updatedBattles);
          } catch (error) {
            console.error(error);
          }
        }
      );

      this.socketBattle?.on(
        "box-battles:error",
        (data: { battleId: string }) => {
          try {
            let battles = [...store.getState().battlesReducer.battles];
            const updatedBattles = battles.filter(
              (battle) => battle.id != data.battleId
            );
            updateBattles(updatedBattles);
            toast.error(`Error occured for ${data.battleId}`);
          } catch (error) {
            console.error(error);
          }
        }
      );
    });

    this.socketBattle?.on("disconnect", () => {
      console.log("Socket Battle disconnected");
    });
  }

  public closeBattleWS() {
    this.socketBattle?.disconnect();
    this.socketBattle = null;
  }
}

export const wsHandler = new WsHandler();
