import React, { useEffect, useState } from "react";
import styles from "./case.module.scss";
import { store } from "mredux";
import { useRouter } from "next/router";
import ArrowLeft from "@/svgs/arrow-left.svg";
import FairnessIcon from "@/svgs/fairness.svg";
import Swards from "@/svgs/sward.svg";
import LargeSwards from "@/svgs/large-sword.svg";
import Prize from "@/svgs/prize.svg";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { SpinnerVertical } from "./spinnerVertical";
import { formatPrice, handleAvatar, shortIt } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { Players } from "@/components/numofplayers/Players";
import CountUp from "react-countup";
import {
  CALCULATING_REWARDS,
  COMPLETED,
  READY_TO_START,
  REWARDING,
  START_PENDING,
  WAITING_EOS_HASH,
  IN_PROGRESS,
} from "@/utils/constants";

interface playerType {
  player?: Player;
  winner?: boolean;
  wonPrice: number;
}

const Player: React.FC<playerType> = (props) => {
  const { player, winner, wonPrice } = props;
  return (
    <div className={styles.player}>
      {player?.bot ? (
        <div
          className={styles.circleAvatar}
          style={{
            backgroundImage: "url(/imgs/bot.png)",
          }}
        ></div>
      ) : (
        <div
          className={styles.circleAvatar}
          style={{
            backgroundImage: `url(${handleAvatar(
              null,
              player?.user.username
            )})`,
          }}
        >
          <span className={styles.level}>
            {player?.user.xpExtraInfo?.level}
          </span>
        </div>
      )}
      {/* <div className={styles.userName}>
        <div className={styles.name}>{player && shortIt(player.name, 10)}</div>
        <div className={styles.holder}>
          <div className={`${styles.value} ${winner ? styles.winner : ""}`}> ${" "}</div>
          {winner ? <div className={`${styles.value} ${winner ? styles.winner : ""}`}>
            <CountUp
              start={0}
              end={wonPrice}
              duration={2.5}
              separator=","
              decimal="."
              decimals={2}
            />
          </div> : 
            "$ 0.00"
          }
        </div>
      </div> */}
      <div className={styles.userName}>
        <p>{player && shortIt(player.name, 15)}</p>
        <p
          className={styles.totalWon}
          style={{ color: winner ? "#3CCB7F" : "#F04438" }}
        >
          {winner ? (
            <div className={styles.val}>
              ${" "}
              <CountUp
                start={0}
                end={wonPrice}
                duration={2.5}
                separator=","
                decimal="."
                decimals={2}
              />{" "}
            </div>
          ) : (
            <div className={`${styles.value} ${styles.looser}`}>$ 0.00</div>
          )}
        </p>
      </div>
    </div>
  );
};

const RunningBattle: React.FC<{ battle: Battle }> = ({ battle }) => {
  const router = useRouter();
  const [currentOpenBox, setCurrentOpenBox] = useState<BoxType>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    setTotalPrice(battle.boxes.reduce((a, b) => a + b.price, 0));
  }, [battle]);

  useEffect(() => {
    setCurrentOpenBox(battle.boxes[battle.lastProcessedRound]);
  }, [battle]);

  const handleRematch = () => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload: {
        rematchBattleModal: true,
        roomId: battle.id,
      },
    });
  };
  return (
    <div className={styles.running}>
      <div className={styles.divider}>
        <button
          className={styles.backcases}
          onClick={() => {
            router.push("/case");
          }}
        >
          <ArrowLeft />
          <span>Back to cases</span>
        </button>
        <div className={styles.boxes}>
          <div className={styles.content}>
            <div className={styles.text}>
              Box {battle.lastProcessedRound + 1} of {battle.boxes.length}
            </div>
            <div className={styles.price_players}>
              <div className={styles.price}>
                <p>Total value</p>
                <span>$ {formatPrice(totalPrice)}</span>
              </div>
              <Players
                teams={battle.teams}
                teamSize={battle.teamsSize}
                selection={true}
                swardWidth={16}
              />
            </div>
          </div>
          <div className={styles.openingBoxList}>
            <div className={styles.box_name_price}>
              <p className={styles.boxName}>
                {currentOpenBox && currentOpenBox.name}
              </p>
              <p className={styles.boxPrice}>
                $ {currentOpenBox && formatPrice(currentOpenBox.price)}
              </p>
            </div>
            <div className={styles.boxArray}>
              {battle.state === IN_PROGRESS
                ? battle.boxes
                    .slice(battle.lastProcessedRound)
                    .map((box, index) => (
                      <img src={box.imageUrl} key={box.id + index} />
                    ))
                : battle.boxes.map((box, ii) => (
                    <img src={box.imageUrl} key={box.id + ii} />
                  ))}
            </div>
          </div>
        </div>

        <button className={styles.fairness}>
          <FairnessIcon />
          <span>Fairness Guaranteed</span>
        </button>
      </div>
      {battle.state === IN_PROGRESS ? (
        <div className={styles.runningPart}>
          <div className={styles.decoration}>
            <div></div>
            <div></div>
          </div>
          {battle.players.map((player, ii) =>
            battle.boxes.map(
              (box, jj) =>
                battle.lastProcessedRound === jj && (
                  <SpinnerVertical
                    player={player}
                    box={box}
                    key={jj.toString() + player.id + ii}
                  />
                )
            )
          )}
        </div>
      ) : battle.state === WAITING_EOS_HASH ? (
        <div className={styles.startingPart}>
          <div className={styles.decoration}>
            <div></div>
            <div></div>
          </div>
          <label>Battles Starts in...</label>
          <CountdownCircleTimer
            isPlaying
            duration={5}
            colors="#8962F8"
            strokeWidth={3}
          >
            {({ remainingTime }) => (
              <p>{remainingTime == 0 ? "GO !" : remainingTime}</p>
            )}
          </CountdownCircleTimer>
        </div>
      ) : battle.state === READY_TO_START || battle.state === START_PENDING ? (
        <div className={styles.startingPart}>
          <div className={styles.decoration}>
            <div></div>
            <div></div>
          </div>
          <label>READY TO START!!!</label>
        </div>
      ) : battle.state === CALCULATING_REWARDS ||
        battle.state === COMPLETED ||
        battle.state === REWARDING ? (
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
                    <div style={{ marginBottom: "5px" }}>
                      <LargeSwards />
                    </div>
                  )}
                  <div className={styles.winplayers} key={index}>
                    {battle.winnerTeam === index + 1 && (
                      <div className={styles.prize}>
                        <Prize />
                        <div className={styles.winnerTitle}>Winner</div>
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
              onClick={() => router.push("/case")}
            >
              Back to Battles
            </button>
            <button className={styles.rematch} onClick={handleRematch}>
              <Swards />
              <span>Challenge for a rematch</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RunningBattle;
