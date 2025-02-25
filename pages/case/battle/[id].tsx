import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/parts/casebattle/case.module.scss";
import { Layout } from "@/components/layout/Layout";
import { ExternalPage } from "@/pages/profile";
import Case from "..";
import { DropsItems } from "@/components/drops/drops";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { getBattleById } from "@/utils/api.service";
import { handleErrorRequest } from "@/utils/handler";
import { updateCurrentBattleState } from "mredux/reducers/casebattle.reducer";
import Loader from "@/components/loader/Loader";
import toast from "react-hot-toast";
import {
  COMPLETED,
  DELETED,
  IN_PROGRESS,
  WAITING_FOR_PLAYERS,
} from "@/utils/constants";
import MainBattle from "@/parts/casebattle/mainBattle";
import WaitingBattle from "@/parts/casebattle/waitingBattles";
import PlayerItems from "@/parts/casebattle/playerItems";
import { useWindowSize } from "@/hooks/windowSize";
import { UPDATE_MODALS_STATE, UPDATE_IS_WAITING_ROUND } from "mredux/types";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { wsHandler } from "@/utils/ws.service";

const Battle: ExternalPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [round, setRound] = useState<number>(-1);

  const { battles } = useSelector<StateInterface, BattlesReducer>(
    (state) => state.battlesReducer
  );
  const { battle, isWaitingRound } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );

  const fetchBattleById = async (battleId: string) => {
    try {
      setLoading(true);
      const res = await getBattleById(battleId);
      if (res) {
        updateCurrentBattleState(res);
        if (res.state === IN_PROGRESS) {
          setRound(res.nextRoundToProcess);
          store.dispatch({
            type: UPDATE_IS_WAITING_ROUND,
            payload: true,
          });
        }
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        toast.error("You have to log in!");
        store.dispatch({
          type: UPDATE_MODALS_STATE,
          payload: { authModal: true, authTab: 0x0 },
        });
        router.push("/case/lobby");
      }
    }
  };

  useEffect(() => {
    wsHandler.caseBattle();
    return () => {
      wsHandler.closeBattleWS();
    };
  }, []);

  useEffect(() => {
    if (round > 0) {
      if (battle.lastProcessedRound === round) {
        store.dispatch({
          type: UPDATE_IS_WAITING_ROUND,
          payload: false,
        });
      }
    }
  }, [battle]);

  useEffect(() => {
    if (id) {
      fetchBattleById(id as string);
    }
  }, [id]);

  useEffect(() => {
    if (battle.id === id && battle.state === DELETED) {
      toast.success("The owner deleted this battle!");
      router.push("/case/lobby");
    }
  }, [battle, id]);
  const { width } = useWindowSize();

  return (
    <div className={styles.battle}>
      {loading || battle.id !== (id as string) ? (
        <>
          <div className={styles.recentItems}></div>
          <div className={styles.mainPage}>
            <Skeleton
              width={width > 1500 ? "1500px" : `${width - 50}px`}
              height="130px"
            />
            <Skeleton
              width={width > 1500 ? "1500px" : `${width - 50}px`}
              height="800px"
            />

            <div className={styles.playersContainter}>
              {new Array(battle.teams).fill(0).map((el, index) => (
                <Skeleton
                  width={`${width / battle.teams - 20}px`}
                  height="600px"
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.recentItems}>
            {/* {battle.boxes.length > 0 && width > 560 && (
              <DropsItems boxId={battle.boxes[battle.lastProcessedRound].id} />
            )} */}
          </div>
          <div className={styles.mainPage}>
            {battle.state === WAITING_FOR_PLAYERS ? (
              <WaitingBattle />
            ) : (
              <MainBattle />
            )}

            <div className={styles.playersContainter}>
              {new Array(battle.teams).fill(0).map((el, index) => (
                <div key={index.toString()} className={styles.oneTeam}>
                  {new Array(battle.teamsSize).fill(0).map((dl, j) => {
                    const _player = battle.players.find(
                      (player) =>
                        player.team === index + 1 &&
                        player.teamPosition === j + 1
                    );
                    {
                      return _player ? (
                        <PlayerItems
                          player={_player}
                          key={index.toString() + j}
                          sward={
                            battle.teams === 2
                              ? j === 0 && index != 0
                              : index != 0
                          }
                          winner={
                            battle.winnerTeam === index + 1 &&
                            battle.state === COMPLETED
                          }
                        />
                      ) : (
                        <PlayerItems
                          key={index.toString() + j}
                          sward={
                            battle.teams === 2
                              ? j === 0 && index != 0
                              : index != 0
                          }
                          team={index}
                          teamPosition={j}
                        />
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Battle.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Case>{page}</Case>
    </Layout>
  );
};

export default Battle;
