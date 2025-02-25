import { useSelector } from "react-redux";
import styles from "./case.main.module.scss";
import { StateInterface, store } from "mredux";
import Swards from "@/svgs/swards.svg";
import LargeSwards from "@/svgs/large-sword.svg";
import Prize from "@/svgs/prize.svg";
import CountUp from "react-countup";
import {
  formatPrice,
  handleAvatar,
  handleErrorRequest,
  shortIt,
} from "@/utils/handler";
import { useRouter } from "next/router";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { useWindowSize } from "@/hooks/windowSize";
import { createRoom } from "@/utils/api.service";
import toast from "react-hot-toast";
import { updateCurrentBattleState } from "mredux/reducers/casebattle.reducer";
import { MainReducer } from "mredux/reducers/main.reducer";
import { updateModalsState } from "@/utils/updateState";
import { useEffect, useState } from "react";
import { CustomCSSProperties } from "@/pages/_app";

interface playerType {
  player?: Player;
  winner?: boolean;
  wonPrice: number;
}

const Player: React.FC<playerType> = (props) => {
  const { player, winner, wonPrice } = props;
  const { width } = useWindowSize();
  return (
    <div className={styles.player}>
      <div className={styles.avatarHolder}>
        <div
          className={`${styles.circleAvatar} 
                        ${!player ? styles.avatar : ""}
                        ${!player ? styles.notBot : ""}
                        ${player && player.bot ? styles.botbg : ""}
                        `}
          style={
            !(player && player.bot)
              ? {
                  backgroundImage: `url(${
                    player
                      ? handleAvatar(null, player?.user?.username)
                      : "/svgs/joinPerson.svg"
                  })`,
                }
              : {}
          }
        >
          {player && player.bot && (
            <img src="/imgs/bot.png" alt="bot" width="100%" />
          )}
        </div>
        {player && (
          <span
            className={styles.level}
            style={
              {
                "--bgImg": `${
                  player.bot
                    ? "url(/svgs/gold-polygon.svg)"
                    : `url("/svgs/polygon.svg")`
                }`,
                "--bgClr": `${player.bot ? "black" : `white`}`,
                "--textSize": `${
                  player.bot
                    ? "10px"
                    : player.user.xpExtraInfo?.level ?? 0 > 99
                      ? "10px"
                      : "12px"
                }`,
              } as CustomCSSProperties
            }
          >
            {player.bot ? 100 : player.user.xpExtraInfo?.level ?? 0}
          </span>
        )}
      </div>
      <div className={styles.user}>
        {width > 768 ? <p>{player && shortIt(player.name, 15)} </p> : ""}
        <p
          className={styles.totalWon}
          style={{ color: winner ? "#3CCB7F" : "#F04438" }}
        >
          {winner ? (
            <div className={styles.val}>
              {width < 768 ? (
                `$ ${formatPrice(wonPrice)}`
              ) : (
                <CountUp
                  start={0}
                  end={wonPrice}
                  duration={2.5}
                  separator=","
                  prefix="$ "
                  decimal="."
                  decimals={2}
                />
              )}
            </div>
          ) : (
            <div className={`${styles.value} ${styles.looser}`}>$ 0.00</div>
          )}
        </p>
      </div>
    </div>
  );
};

const ResultBattle = () => {
  const router = useRouter();

  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const createBattle = async () => {
    try {
      if (!user) {
        toast.error("Please Log in");
        store.dispatch({
          type: UPDATE_MODALS_STATE,
          payload: { authModal: true },
        });
        return;
      }

      const createBoxes: Array<{ box: BoxType; BCount: number }> =
        battle.boxes.reduce(
          (acc: Array<{ box: BoxType; BCount: number }>, box: BoxType) => {
            const existingBox = acc.find((item) => item.box.id === box.id);
            if (existingBox) {
              existingBox.BCount++;
            } else {
              acc.push({ box: box, BCount: 1 });
            }
            return acc;
          },
          []
        );
      store.dispatch({
        type: "UPDATE_CREATE_BATTLE_STATE",
        payload: {
          userId: "",
          privateMode: battle.privateGame,
          crazyMode: false,
          fastMode: battle.fastOpenings,
          teams: battle.teams,
          teamsSize: battle.teamsSize,
          boxes: createBoxes,
        },
      });
      router.push("/case/createBattle");
    } catch (error) {
      toast.error(handleErrorRequest(error));
    }
  };

  const width = useWindowSize();
  return (
    <div className={styles.finishedPart}>
      <div className={styles.decoration}>
        <div></div>
        <div></div>
      </div>
      <div className={styles.ended}>
        <label>The battle has ended</label>
        <div className={styles.endplayers}>
          {new Array(battle.teams).fill(0).map((el, index) => (
            <>
              {index !== 0 && (
                <div className={styles.battleImg}>
                  <LargeSwards />
                </div>
              )}
              <div className={styles.winplayers} key={index}>
                {battle.winnerTeam === index + 1 && (
                  <div className={styles.prize}>
                    <Prize />
                    {width.width > 768 ? (
                      <div className={styles.winnerTitle}>Winner</div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                <div className={styles.playerlist}>
                  {new Array(battle.teamsSize).fill(0).map((dl, j) => {
                    const _player = battle.players.find(
                      (player) =>
                        player.team === index + 1 &&
                        player.teamPosition === j + 1
                    );
                    {
                      return (
                        <Player
                          player={_player}
                          winner={battle.winnerTeam === _player?.team}
                          wonPrice={battle.winningsPerPlayer}
                          key={index.toString() + j}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className={styles.btn_group}>
        <button
          className={styles.border}
          onClick={() => router.push("/case/lobby")}
        >
          Back to Battles
        </button>
        <button className={styles.rematch} onClick={createBattle}>
          <Swards />
          <span>Create same battle</span>
        </button>
      </div>
    </div>
  );
};

export default ResultBattle;
