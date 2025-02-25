import React, { useEffect, useRef, useState } from "react";
import styles from "./case.main.module.scss";
import { StateInterface, store } from "mredux";
import { useRouter } from "next/router";
import ArrowLeft from "@/svgs/arrow-left.svg";
import FairnessIcon from "@/svgs/fairness.svg";
import Prize from "@/svgs/prize.svg";
import "swiper/css";
import { formatPrice } from "@/utils/handler";
import { Players } from "@/components/numofplayers/Players";
import {
  COMMITTED_EOS_BLOCK,
  COMPLETED,
  IN_PROGRESS,
  READY_TO_START,
  REWARDING,
  WAITING_EOS_HASH,
  WAITING_FOR_PLAYERS,
} from "@/utils/constants";
import { useSelector } from "react-redux";
import RunningBattle from "./runningBattle";
import StartingBattle from "./startingBattle";
import ResultBattle from "./resultBattle";
import { useWindowSize } from "@/hooks/windowSize";
import WinnerBattle from "./winnerBattle";
import { SwiperRef, Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";
import ArrowSolo from "@/svgs/room-spinner.svg";

const MainBattle = () => {
  const router = useRouter();
  const [currentOpenBox, setCurrentOpenBox] = useState<BoxType>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const swiperRef = useRef<SwiperRef>(null);
  const { battle, isWaitingRound } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );
  useEffect(() => {
    setTotalPrice(battle.boxes.reduce((a, b) => a + b.price, 0));
    setCurrentOpenBox(battle.boxes[battle.lastProcessedRound]);
  }, [battle]);

  const { winners } = useSelector<StateInterface, WinnerBattleReducer>(
    (state) => state.winnerBattleReducer
  );
  const width = useWindowSize();

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(battle.lastProcessedRound || 0);
    }
  }, [battle.lastProcessedRound]);

  const fairness = () => {
    window.open(
      `https://fairness.loot.gg/game?clientSeed=${battle.clientSeed}&serverSeed=${battle.privateSeed}&nonce=${battle.nonce}&boxId=${battle.id}&eosSeed=${battle.eosSeed?.hash}`
    );
  };

  return (
    <div className={styles.running}>
      {width.width > 768 ? (
        <div className={styles.divider}>
          <button
            className={styles.backcases}
            onClick={() => {
              router.push("/case/lobby");
            }}
          >
            <ArrowLeft />
            <span>Back to cases</span>
          </button>
          {battle.state === REWARDING && winners.length > 1 ? (
            <div className={styles.winnerRoundDiv}>
              <div className={styles.winnerPrize}>
                <span></span>
                <div className={styles.winnerTitle}>Winner Round</div>
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
          ) : (
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
              {battle.state != REWARDING && (
                <div className={styles.openingBoxList}>
                  <div className={styles.box_name_price}>
                    <p className={styles.boxName}>
                      {currentOpenBox && currentOpenBox.name}
                    </p>
                    <p className={styles.boxPrice}>
                      $ {currentOpenBox && formatPrice(currentOpenBox.price)}
                    </p>
                  </div>
                  {/* <div className={styles.boxArray}>
                    {battle.state === IN_PROGRESS
                      ? battle.boxes
                          .slice(battle.lastProcessedRound)
                          .map((box, index) => (
                            <img src={box.imageUrl} key={box.id + index} />
                          ))
                      : battle.boxes.map((box, ii) => (
                          <img src={box.imageUrl} key={box.id + ii} />
                        ))}
                  </div> */}
                  <div className={styles.boxes}>
                    <Swiper
                      ref={swiperRef}
                      spaceBetween={0}
                      slidesPerView={"auto"}
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      navigation
                      pagination={{ clickable: true }}
                      scrollbar={{ draggable: true }}
                    >
                      {battle.boxes.map((box, i) => (
                        <SwiperSlide
                          className={styles.drop}
                          key={box.id + i.toString()}
                        >
                          <Image
                            src={box.imageUrl || "/imgs/bot.png"}
                            alt=""
                            width={100}
                            height={100}
                            style={{
                              opacity:
                                battle.state === IN_PROGRESS ||
                                battle.state === WAITING_FOR_PLAYERS ||
                                battle.state === WAITING_EOS_HASH ||
                                battle.state === READY_TO_START ||
                                battle.state === COMMITTED_EOS_BLOCK
                                  ? i >= battle.lastProcessedRound
                                    ? 1
                                    : 0.3
                                  : i <= battle.lastProcessedRound
                                    ? 0.3
                                    : 1,
                            }}
                          />
                          {battle.state === IN_PROGRESS &&
                            i === battle.lastProcessedRound && (
                              <div className={styles.arrows}>
                                <ArrowSolo />
                                <ArrowSolo />
                              </div>
                            )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className={styles.fairness}
            onClick={() => battle.state === COMPLETED && fairness()}
          >
            <FairnessIcon />
            <span>Fairness Guaranteed</span>
          </button>
        </div>
      ) : (
        <div className={styles.mobileDiv}>
          <button
            className={styles.backcases}
            onClick={() => {
              router.push("/case/lobby");
            }}
          >
            <ArrowLeft />
            <span>Back to cases</span>
          </button>
          {battle.state === REWARDING && winners.length > 1 ? (
            <div className={styles.winnerRoundDiv}>
              <div className={styles.price_players}>
                <div className={styles.price}>
                  <p>Total value</p>
                  <span>$ {formatPrice(totalPrice)}</span>
                </div>
                <div className={styles.fairness_player}>
                  <button className={styles.fairness}>
                    <FairnessIcon />
                    <span>Fairness Guaranteed</span>
                  </button>
                  <div className={styles.players_right}>
                    <Players
                      teams={battle.teams}
                      teamSize={battle.teamsSize}
                      selection={true}
                      swardWidth={16}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.winnerPrize}>
                <span></span>
                <div className={styles.winnerTitle}>Winner Round</div>
              </div>
            </div>
          ) : (
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
                </div>
              </div>
              <div className={styles.content}>
                <button
                  className={styles.fairness}
                  onClick={() => battle.state === COMPLETED && fairness()}
                >
                  <FairnessIcon />
                  <span>Fairness Guaranteed</span>
                </button>
                <div className={styles.players_right}>
                  <Players
                    teams={battle.teams}
                    teamSize={battle.teamsSize}
                    selection={true}
                    swardWidth={16}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles.openingBoxList}>
            <div className={styles.box_name_price}>
              <p className={styles.boxName}>
                {currentOpenBox && currentOpenBox.name}
              </p>
              <p className={styles.boxPrice}>
                $ {currentOpenBox && formatPrice(currentOpenBox.price)}
              </p>
            </div>
            <div className={styles.boxes}>
              <Swiper
                ref={swiperRef}
                spaceBetween={10}
                slidesPerView={"auto"}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {battle.boxes.map((box, i) => (
                  <SwiperSlide
                    className={styles.drop}
                    key={box.id + i.toString()}
                  >
                    <Image
                      src={box.imageUrl || "/imgs/bot.png"}
                      alt=""
                      width={100}
                      height={100}
                      style={{
                        opacity:
                          battle.state === IN_PROGRESS ||
                          battle.state === WAITING_FOR_PLAYERS ||
                          battle.state === WAITING_EOS_HASH ||
                          battle.state === READY_TO_START ||
                          battle.state === COMMITTED_EOS_BLOCK
                            ? i >= battle.lastProcessedRound
                              ? 1
                              : 0.3
                            : i <= battle.lastProcessedRound
                              ? 0.3
                              : 1,
                      }}
                    />
                    {battle.state === IN_PROGRESS &&
                      i === battle.lastProcessedRound && (
                        <div className={styles.arrows}>
                          <ArrowSolo />
                          <ArrowSolo />
                        </div>
                      )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
      {(battle.state === IN_PROGRESS || battle.state === "STARTED") && (
        <RunningBattle />
      )}
      {(battle.state === READY_TO_START ||
        battle.state === WAITING_EOS_HASH ||
        battle.state === COMMITTED_EOS_BLOCK) && <StartingBattle />}
      {(battle.state === COMPLETED ||
        (battle.state === REWARDING && winners.length < 2)) && <ResultBattle />}
      {battle.state === REWARDING && winners.length > 1 && <WinnerBattle />}
    </div>
  );
};

export default MainBattle;
