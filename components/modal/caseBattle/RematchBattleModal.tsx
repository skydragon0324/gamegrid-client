import { ModalOverlay } from "../ModalOverlay";
import styles from "./mcaseBattle.module.scss";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { MainReducer } from "mredux/reducers/main.reducer";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { formatPrice, handleAvatar } from "@/utils/handler";
import React, { useEffect, useState } from "react";
import CrossIcon from "@/svgs/cross.svg";
import BoxModel from "@/svgs/boxmodel.svg";
import Coins from "@/svgs/coins.svg";
import { Players } from "@/components/numofplayers/Players";
import Swards from "@/svgs/sward.svg";
import JoinPersonIcon from "@/svgs/joinPerson.svg";
import JoinPersonActiveIcon from "@/svgs/joinPersonActive.svg";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import CountDown from "@/components/counterdown/counterdown";

export const RematchBattleModal = () => {
  // data from redux
  const { rematchBattleModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );

  useEffect(() => {
    setTotalPrice(battle.boxes.reduce((a, b) => a + b.price, 0));
  }, [battle]);
  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };
  const handleCloseModal = () => {
    updateModalsState({
      rematchBattleModal: false,
    });
  };

  return (
    <ModalOverlay
      isOpened={rematchBattleModal}
      className={styles.rejoinBattle}
      onClose={handleCloseModal}
    >
      <div className={styles.header}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerTitle}>Rejoin modal</div>
        </div>
        {/* <CountdownCircleTimer
          isPlaying
          duration={20}
          strokeLinecap="round"
          colors="#8962F8"
          strokeWidth={2}
          size={50}
          trailColor="#535255"
        >
          {({ remainingTime }: { remainingTime: number }) => (
            <p>{remainingTime}</p>
          )}
        </CountdownCircleTimer> */}
        <CountDown />
      </div>

      {(rematchBattleModal && (
        <div className={styles.content}>
          <div className={styles.subTitle}>Would you be interested?</div>
          <div className={styles.players}>
            {new Array(battle.teams).fill(0).map((el, index) => (
              <>
                {index !== 0 && <span className={styles.swards}></span>}
                {new Array(battle.teamsSize).fill(0).map((dl, j) => {
                  const _player = battle.players.find(
                    (player) =>
                      player.team === index + 1 && player.teamPosition === j + 1
                  );
                  {
                    return (
                      <div
                        key={index.toString() + j.toString()}
                        className={styles.circleAvatar}
                        style={
                          _player && !_player?.bot
                            ? {
                                backgroundImage: `url(${handleAvatar(
                                  null,
                                  _player?.user?.username
                                )})`,
                              }
                            : {}
                        }
                      >
                        <div className={styles.rematchImg}>
                          {_player && _player.bot && (
                            <img src="/imgs/bot.png" alt="avatar" />
                          )}
                        </div>
                        {_player && !_player.bot && (
                          <span className={styles.level}>
                            {_player?.user.xpExtraInfo?.level}
                          </span>
                        )}
                      </div>
                    );
                  }
                })}
              </>
            ))}
          </div>

          <div className={styles.rejoinFooter}>
            <div className={styles.count_price}>
              <div className={styles.count}>
                <BoxModel />
                <p>{battle.boxes.length} Boxes</p>
              </div>
              <div className={styles.count}>
                <Coins />
                <p>$ {formatPrice(totalPrice)}</p>
              </div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.border}>I'll pass</button>
              <button>Let's go</button>
            </div>
          </div>
        </div>
      )) ||
        null}
    </ModalOverlay>
  );
};
