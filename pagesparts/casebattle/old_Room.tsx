import React, { useEffect, useState } from "react";
import styles from "./case.module.scss";
import { formatPrice, handleAvatar, handleErrorRequest } from "@/utils/handler";
import Image from "next/image";
import Swiper from "swiper";
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
import ArrowSolo from "@/svgs/arrowsolo-down.svg";
import Swards from "@/svgs/sward.svg";
import Fast from "@/svgs/fast.svg";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { updateModalsState } from "@/utils/updateState";
import Watcher from "@/svgs/watcher.svg";
import {
  COMPLETED,
  IN_PROGRESS,
  READY_TO_START,
  WAITING_FOR_PLAYERS,
} from "@/utils/constants";

interface roomPropsType {
  room: Battle;
}

const Room: React.FC<roomPropsType> = ({ room }) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const { joinModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  useEffect(() => {
    const swiper = new Swiper(".swiper-container", {
      spaceBetween: 0,
      slidesPerView: "auto",
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
    });
  }, []);

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

  const joinRoom = async (roomId: string) => {
    if (!user) {
      updateModalsState({ authModal: true, authTab: 0x0 });
      return;
    }
    if (user.usdBalance <= totalPrice) {
      toast.error("Your balance is not enough");
      updateModalsState({ walletModal: true, walletTab: 0x0 });
      return;
    }
    updateModalsState({ joinModal: room });
    // setLoading(true);
    // const res = await joinRoomById(roomId);
    // if (res) {
    //   router.push(`/case/battle/${roomId}`);
    // } else {
    //   toast.error("you can't join this battle");
    // }
    // setLoading(false);
  };

  const watchBattle = (roomId: string) => {
    try {
      watchRoomById(roomId);
      router.push(`/case/battle/${roomId}`);
    } catch (error: any) {
      toast.error(error.message);
      handleErrorRequest(error);
    }
  };

  const { width } = useWindowSize();

  return (
    <>
      {width > 768 ? (
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
                {index !== 0 && <span className={styles.swards}></span>}
                {new Array(room.teamsSize).fill(0).map((dl, j) => {
                  const _player = room.players.find(
                    (player) =>
                      player.team === index + 1 && player.teamPosition === j + 1
                  );
                  {
                    return (
                      <div
                        key={index.toString() + j.toString()}
                        className={styles.circleAvatar}
                        style={{
                          backgroundImage: `url(${
                            _player
                              ? !_player.bot
                                ? _player.user.profilePrictureUrl
                                : "/imgs/bot.png"
                              : "/svgs/person.svg"
                          })`,
                        }}
                      >
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
            {room.spectatorsCount > 0 && room.state === IN_PROGRESS && (
              <div className={styles.watcher}>
                <Watcher />
                <span>{room.spectatorsCount}</span>
              </div>
            )}
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
                    width={80}
                    height={80}
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
                  // style={{ background: "black" }}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  Go to Battle (You are in){" "}
                </div>
              ) : (
                <div
                  className={`${styles.btn} ${styles.purple}`}
                  // style={{ background: "#8962F8" }}
                  onClick={() => joinRoom(room.id)}
                >
                  {/* <span className={styles.swards}></span> */}
                  <Swards />
                  {loading ? (
                    <Loader />
                  ) : (
                    <p>Join for ${formatPrice(totalPrice)}</p>
                  )}
                </div>
              )
            ) : room.state === IN_PROGRESS || room.state === READY_TO_START ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={`${styles.btn} ${styles.blackBtn}`}
                  // style={{ background: "black" }}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  Go to Battle (You are in){" "}
                </div>
              ) : (
                <>
                  <div
                    className={`${styles.btn} ${styles.gray}`}
                    style={{
                      // background: "#1D1924",
                      border: "1px solid #BDB7C7",
                    }}
                    onClick={() => watchBattle(room.id)}
                  >
                    <p className={styles.joinText}>Watch Battle</p>
                  </div>
                  <p className={styles.watchText}>
                    Unboxed: <span>$303.25</span>{" "}
                  </p>
                </>
              )
            ) : room.state === COMPLETED ? (
              <>
                <div
                  className={`${styles.btn} ${styles.gray}`}
                  // style={{ background: "#1D1924" }}
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
                        <div
                          key={index.toString() + j.toString()}
                          className={styles.circleAvatar}
                          style={{
                            backgroundImage: `url(${
                              _player
                                ? !_player.bot
                                  ? _player.user.profilePrictureUrl
                                  : "/imgs/bot.png"
                                : "/svgs/person.svg"
                            })`,
                          }}
                        >
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
              {room.spectatorsCount > 0 && room.state == IN_PROGRESS && (
                <div className={styles.watcher}>
                  <Watcher />
                  <span>{room.spectatorsCount}</span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.boxStatus}>
            {room.state === WAITING_FOR_PLAYERS ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={`${styles.btn} ${styles.black}`}
                  // style={{ background: "black" }}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  Go to Battle (You are in){" "}
                </div>
              ) : (
                <div
                  className={`${styles.btn} ${styles.purple}`}
                  // style={{ background: "#8962F8" }}
                  onClick={() => joinRoom(room.id)}
                >
                  <Swards />
                  {loading ? (
                    <Loader />
                  ) : (
                    <p>Join for ${formatPrice(totalPrice)}</p>
                  )}
                </div>
              )
            ) : room.state === IN_PROGRESS || room.state === READY_TO_START ? (
              room.players.find((player) => player.id === user?.id) ? (
                <div
                  className={`${styles.btn} ${styles.black}`}
                  // style={{ background: "black" }}
                  onClick={() => router.push(`/case/battle/${room.id}`)}
                >
                  Go to Battle (You are in){" "}
                </div>
              ) : (
                <>
                  <div
                    className={`${styles.btn} ${styles.gray}`}
                    style={{
                      // background: "#1D1924",
                      border: "1px solid #BDB7C7",
                    }}
                    onClick={() => watchBattle(room.id)}
                  >
                    <p className={styles.joinText}>Watch Battle</p>
                  </div>
                  <p className={styles.watchText}>
                    Unboxed: <span>$303.25</span>{" "}
                  </p>
                </>
              )
            ) : room.state === COMPLETED ? (
              <>
                <div
                  className={`${styles.btn} ${styles.gray}`}
                  // style={{ background: "#1D1924" }}
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
      )}
    </>
  );
};

export default Room;
