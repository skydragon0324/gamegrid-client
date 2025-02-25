import React, { useEffect, useState } from "react";
import styles from "./case.room.module.scss";
import { formatPrice, handleAvatar, handleErrorRequest } from "@/utils/handler";
import Image from "next/image";
import "swiper/scss";
import { Swiper as SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { joinRoomById, watchRoomById } from "@/utils/api.service";
import { MainReducer } from "mredux/reducers/main.reducer";
import { useRouter } from "next/router";
import Loader from "@/components/loader/Loader";
import toast from "react-hot-toast";
import { useWindowSize } from "@/hooks/windowSize";
import ArrowSolo from "@/svgs/room-spinner.svg";
import Fast from "@/svgs/fast.svg";
import Watcher from "@/svgs/watcher.svg";
import Swards from "@/svgs/sward.svg";
import GoToBattle from "@/svgs/go-to-battle.svg";

import {
  COMMITTED_EOS_BLOCK,
  COMPLETED,
  IN_PROGRESS,
  READY_TO_START,
  REWARDING,
  WAITING_EOS_HASH,
  WAITING_FOR_PLAYERS,
} from "@/utils/constants";
import { CustomCSSProperties } from "@/pages/_app";

interface roomPropsType {
  room: Battle;
}

const Room: React.FC<roomPropsType> = ({ room }) => {
  const router = useRouter();
  const { width } = useWindowSize();

  const [loading, setLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );
  useEffect(() => {
    setTotalPrice(room.boxes.reduce((a, b) => a + b.price, 0));
  }, [room]);

  const roomClickHandle = (roomId: string) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload: {
        detailBattleModal: true,
        roomId: roomId,
      },
    });
  };

  const joinRoom = async (battle: Battle) => {
    if (!user) {
      store.dispatch({
        type: UPDATE_MODALS_STATE,
        payload: { authModal: true, authTab: 0x0 },
      });
      return;
    }
    if (user.usdBalance <= totalPrice) {
      toast.error("Your balance is not enough");
      store.dispatch({
        type: UPDATE_MODALS_STATE,
        payload: { authModal: true, authTab: 0x4 },
      });
      return;
    }
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload: { joinModal: battle },
    });
  };

  const watchBattle = async (roomId: string) => {
    const res: any = await watchRoomById(roomId);
    router.push(`/case/battle/${roomId}`);
  };

  return (
    <>
      {width <= 768 && width > 0 ? (
        <div className={styles.room}>
          <div className={styles.boxes}>
            <SwiperRef
              spaceBetween={10}
              slidesPerView={"auto"}
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {room?.boxes.map((box, i) => (
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
                        room.state === IN_PROGRESS ||
                        room.state === WAITING_FOR_PLAYERS ||
                        room.state === WAITING_EOS_HASH ||
                        room.state === READY_TO_START ||
                        room.state === COMMITTED_EOS_BLOCK
                          ? i >= room.lastProcessedRound
                            ? 1
                            : 0.3
                          : i <= room.lastProcessedRound
                            ? 0.3
                            : 1,
                    }}
                  />
                  {room.state === IN_PROGRESS &&
                    room.lastProcessedRound === i && (
                      <div className={styles.arrows}>
                        <ArrowSolo />
                        <ArrowSolo />
                      </div>
                    )}
                </SwiperSlide>
              ))}
            </SwiperRef>
          </div>
          <div className={styles.roomrow}>
            <div
              onClick={() => roomClickHandle(room.id)}
              className={styles.roundWrapper}
            >
              <span className={styles.round}>{room?.boxes.length}</span>
              {room.fastOpenings && (
                <span className={styles.fast}>
                  <Fast />
                </span>
              )}
            </div>
            <div className={styles.players}>
              {new Array(room.teams).fill(0).map((el, index) => (
                <>
                  {index !== 0 && <Swards />}
                  {new Array(room.teamsSize).fill(0).map((dl, j) => {
                    const _player = room.players.find(
                      (player) =>
                        player.team === index + 1 &&
                        player.teamPosition === j + 1
                    );
                    {
                      return (
                        <div className={styles.avatarHolder}>
                          <div
                            key={index.toString() + j.toString()}
                            className={`${styles.circleAvatar} 
                        ${!_player ? styles.avatar : ""}
                        ${!_player ? styles.notBot : ""}
                        ${_player && _player.bot ? styles.botbg : ""}
                        `}
                            style={
                              !(_player && _player.bot)
                                ? {
                                    backgroundImage: `url(${
                                      _player
                                        ? handleAvatar(
                                            null,
                                            _player?.user?.username
                                          )
                                        : "/svgs/joinPerson.svg"
                                    })`,
                                  }
                                : {}
                            }
                          >
                            {_player && _player.bot && (
                              <img src="/imgs/bot.png" alt="bot" width="100%" />
                            )}
                          </div>
                          {_player && (
                            <span
                              className={styles.level}
                              style={
                                {
                                  "--bgImg": `${
                                    _player.bot
                                      ? "url(/svgs/gold-polygon.svg)"
                                      : `url("/svgs/polygon.svg")`
                                  }`,
                                  "--bgClr": `${
                                    _player.bot ? "black" : `white`
                                  }`,
                                  "--textSize": `${
                                    _player.bot
                                      ? "10px"
                                      : _player.user.xpExtraInfo?.level ??
                                          0 > 99
                                        ? "10px"
                                        : "12px"
                                  }`,
                                } as CustomCSSProperties
                              }
                            >
                              {_player.bot
                                ? 100
                                : _player.user.xpExtraInfo?.level ?? 0}
                            </span>
                          )}
                        </div>
                      );
                    }
                  })}
                </>
              ))}
              {/* {room.spectatorsCount > 0 && room.state === IN_PROGRESS && (
                <div className={styles.watcher}>
                  <Watcher />
                  <span>{room.spectatorsCount}</span>
                </div>
              )} */}
            </div>
          </div>
          <div className={styles.boxStatus}>
            {room.state === WAITING_FOR_PLAYERS ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={`${styles.btn} ${styles.black}`}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  <div className={styles.holder}>
                    <GoToBattle />
                    <div className={styles.text}>Go to Battle (Joined) </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.btn} ${styles.purple}`}
                  onClick={() => joinRoom(room)}
                >
                  <Swards />
                  {loading ? (
                    <Loader />
                  ) : (
                    <p>Join for $ {formatPrice(totalPrice)}</p>
                  )}
                </div>
              )
            ) : room.state === IN_PROGRESS ||
              room.state === READY_TO_START ||
              room.state === WAITING_EOS_HASH ||
              room.state === REWARDING ||
              room.state === COMMITTED_EOS_BLOCK ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={styles.btn}
                  style={{ background: "black" }}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  <div className={styles.holder}>
                    <GoToBattle />
                    <div className={styles.text}>Go to Battle (Joined) </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`${styles.btn} ${styles.gray}`}
                    style={{
                      border: "1px solid #BDB7C7",
                    }}
                    onClick={() => watchBattle(room.id)}
                  >
                    <p className={styles.joinText}>Watch Battle</p>
                  </div>
                  <p className={styles.watchText}>
                    Unboxed: <span>$ {formatPrice(totalPrice)}</span>{" "}
                  </p>
                </>
              )
            ) : room.state === COMPLETED ? (
              <>
                <div
                  className={`${styles.btn} ${styles.gray}`}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  <p className={styles.joinText}>Result</p>
                </div>
                <p className={styles.watchText}>
                  Unboxed: <span>$ {formatPrice(totalPrice)}</span>{" "}
                </p>
              </>
            ) : (
              room.state
            )}
          </div>
        </div>
      ) : (
        <div className={styles.room}>
          <div
            onClick={() => roomClickHandle(room.id)}
            className={styles.roundWrapper}
          >
            <span className={styles.round}>{room?.boxes.length}</span>
            {room.fastOpenings && (
              <span className={styles.fast}>
                <Fast />
              </span>
            )}
          </div>
          <div className={styles.players}>
            {new Array(room.teams).fill(0).map((el, index) => (
              <>
                {index !== 0 && <Swards />}
                {new Array(room.teamsSize).fill(0).map((dl, j) => {
                  const _player = room.players.find(
                    (player) =>
                      player.team === index + 1 && player.teamPosition === j + 1
                  );
                  {
                    return (
                      <div className={styles.avatarHolder}>
                        <div
                          key={index.toString() + j.toString()}
                          className={`${styles.circleAvatar} 
                        ${!_player ? styles.avatar : ""}
                        ${!_player ? styles.notBot : ""}
                        ${_player && _player.bot ? styles.botbg : ""}
                        `}
                          style={
                            !(_player && _player.bot)
                              ? {
                                  backgroundImage: `url(${
                                    _player
                                      ? handleAvatar(
                                          null,
                                          _player?.user?.username
                                        )
                                      : "/svgs/joinPerson.svg"
                                  })`,
                                }
                              : {}
                          }
                        >
                          {_player && _player.bot && (
                            <img src="/imgs/bot.png" alt="bot" width="100%" />
                          )}
                        </div>
                        {_player && (
                          <span
                            className={styles.level}
                            style={
                              {
                                "--bgImg": `${
                                  _player.bot
                                    ? "url(/svgs/gold-polygon.svg)"
                                    : `url("/svgs/polygon.svg")`
                                }`,
                                "--bgClr": `${_player.bot ? "black" : `white`}`,
                                "--textSize": `${
                                  _player.bot
                                    ? "10px"
                                    : _player.user.xpExtraInfo?.level ?? 0 > 99
                                      ? "10px"
                                      : "12px"
                                }`,
                              } as CustomCSSProperties
                            }
                          >
                            {_player.bot
                              ? 100
                              : _player.user.xpExtraInfo?.level ?? 0}
                          </span>
                        )}
                      </div>
                    );
                  }
                })}
              </>
            ))}
            {/* {room.spectatorsCount > 0 && room.state === IN_PROGRESS && (
              <div className={styles.watcher}>
                <Watcher />
                <span>{room.spectatorsCount}</span>
              </div>
            )} */}
          </div>
          <div className={styles.boxes}>
            <SwiperRef
              spaceBetween={10}
              slidesPerView={"auto"}
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {room?.boxes.map((box, i) => (
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
                        room.state === IN_PROGRESS ||
                        room.state === WAITING_FOR_PLAYERS ||
                        room.state === WAITING_EOS_HASH ||
                        room.state === READY_TO_START ||
                        room.state === COMMITTED_EOS_BLOCK
                          ? i >= room.lastProcessedRound
                            ? 1
                            : 0.3
                          : i <= room.lastProcessedRound
                            ? 0.3
                            : 1,
                    }}
                  />
                  {room.state === IN_PROGRESS &&
                    room.lastProcessedRound === i && (
                      <div className={styles.arrows}>
                        <ArrowSolo />
                        <ArrowSolo />
                      </div>
                    )}
                </SwiperSlide>
              ))}
            </SwiperRef>
          </div>
          <div className={styles.boxStatus}>
            {room.state === WAITING_FOR_PLAYERS ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={`${styles.btn} ${styles.black}`}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  <div className={styles.holder}>
                    <GoToBattle />
                    <div className={styles.text}>Go to Battle (Joined) </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.btn} ${styles.purple}`}
                  onClick={() => joinRoom(room)}
                >
                  <Swards />
                  {loading ? (
                    <Loader />
                  ) : (
                    <p>Join for $ {formatPrice(totalPrice)}</p>
                  )}
                </div>
              )
            ) : room.state === IN_PROGRESS ||
              room.state === READY_TO_START ||
              room.state === WAITING_EOS_HASH ||
              room.state === COMMITTED_EOS_BLOCK ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={`${styles.btn} ${styles.black}`}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  <div className={styles.holder}>
                    <GoToBattle />
                    <div className={styles.text}>Go to Battle (Joined) </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`${styles.btn} ${styles.gray}`}
                    style={{
                      border: "1px solid #BDB7C7",
                    }}
                    onClick={() => watchBattle(room.id)}
                  >
                    <p className={styles.joinText}>Watch Battle</p>
                  </div>
                  <p className={styles.watchText}>
                    Unboxed: <span>$ {formatPrice(totalPrice)}</span>{" "}
                  </p>
                </>
              )
            ) : room.state === COMPLETED ? (
              <>
                <div
                  className={`${styles.btn} ${styles.gray}`}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  <p className={styles.joinText}>Result</p>
                </div>
                <p className={styles.watchText}>
                  Unboxed: <span>$ {formatPrice(totalPrice)}</span>{" "}
                </p>
              </>
            ) : (
              // room.state
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
