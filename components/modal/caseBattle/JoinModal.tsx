import { ModalOverlay } from "../ModalOverlay";
import styles from "./mcaseBattle.module.scss";
import CrossIcon from "@/svgs/cross.svg";
import JoinPersonIcon from "@/svgs/joinPerson.svg";
import JoinPersonActiveIcon from "@/svgs/joinPersonActive.svg";
import Swards from "@/svgs/sward.svg";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { useEffect, useState } from "react";
import { updateModalsState } from "@/utils/updateState";
import { formatPrice, handleAvatar } from "@/utils/handler";
import { joinRoomById } from "@/utils/api.service";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { MainReducer } from "mredux/reducers/main.reducer";
import Loader from "@/components/loader/Loader";

export const JoinModal = () => {
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { joinModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const { battles } = useSelector<StateInterface, BattlesReducer>(
    (state) => state.battlesReducer
  );

  const battle = battles.find((item) => item.id === joinModal?.id) || null;

  const router = useRouter();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [teamParam, setTeamParam] = useState<number | null>(null);
  const [teamPositionParam, setTeamPositionParam] = useState<number | null>(
    null
  );
  const [room, setRoom] = useState<Battle | null>(joinModal);

  useEffect(() => {
    setRoom(battle);
  }, [battle]);

  useEffect(() => {
    if (!joinModal) return;
    setTotalPrice(joinModal.boxes.reduce((a, b) => a + b.price, 0));
  }, [joinModal]);

  const closeModal = () => {
    updateModalsState({
      joinModal: null,
    });
    setTeamParam(null);
    setTeamPositionParam(null);
  };

  const joinRoom = async (roomId: string) => {
    try {
      if (!user) {
        updateModalsState({ authModal: true, authTab: 0x0 });
        return;
      }
      if (user.usdBalance <= totalPrice) {
        toast.error("Your balance is not enough");
        updateModalsState({ walletModal: true, walletTab: 0x0 });
        return;
      }
      setLoading(true);
      const res = await joinRoomById(roomId, teamParam, teamPositionParam);
      if (res) {
        closeModal();
        router.push(`/case/battle/${roomId}`);
      } else {
        toast.error("you can't join this battle");
      }
      setLoading(false);
    } catch (error) {
      console.error("join error", error);
      setLoading(false);
      if (room) {
        if (room?.players.length < room?.teams * room?.teamsSize - 1) {
          toast.error("This seat has been filled, please choose another seat");
        } else {
          toast.error("Sorry, this battle has been filled");
        }
      }
    }
  };

  return (
    <ModalOverlay
      isOpened={!!joinModal}
      className={styles.joinModal}
      onClose={() => closeModal()}
    >
      {(room && (
        <>
          <div className={styles.header}>
            <div className={styles.left}>
              <h1>
                Play{" "}
                {room &&
                  room.players.map((player) => {
                    return <span key={player.id}>vs {player.name} </span>;
                  })}
              </h1>
              <p></p>
            </div>
            <button
              className={styles.closebutton}
              onClick={() => closeModal()}
              // disabled={loading}
            >
              <CrossIcon />
            </button>
          </div>

          <div className={styles.players}>
            <>
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
                          onClick={() => {
                            if (_player) return;
                            setTeamParam(index + 1);
                            setTeamPositionParam(j + 1);
                          }}
                          key={index.toString() + j.toString()}
                          className={`${styles.circleAvatar} ${
                            teamParam === index + 1 &&
                            teamPositionParam === j + 1
                              ? styles.active
                              : ""
                          }
                          ${
                            !_player &&
                            !(
                              teamParam === index + 1 &&
                              teamPositionParam === j + 1
                            )
                              ? styles.notUser
                              : ""
                          }`}
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
                          {_player ? (
                            !_player.bot ? (
                              <></>
                            ) : (
                              <div className={styles.rematchImg}>
                                <img src="/imgs/bot.png" alt="avatar" />
                              </div>
                            )
                          ) : (
                            <div className={styles.joinImg}>
                              {teamParam === index + 1 &&
                              teamPositionParam === j + 1 ? (
                                <JoinPersonActiveIcon />
                              ) : (
                                <JoinPersonIcon />
                              )}
                            </div>
                          )}

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
            </>
          </div>

          <div className={styles.footer}>
            <button className={styles.cancel} onClick={() => closeModal()}>
              Cancel
            </button>
            <button className={styles.join} onClick={() => joinRoom(room.id)}>
              {!loading && <Swards />}
              {loading ? (
                <Loader />
              ) : (
                <p>Join for $ {formatPrice(totalPrice)}</p>
              )}
              {/* Join for $ {formatPrice(totalPrice)} */}
            </button>
          </div>
        </>
      )) ||
        null}
    </ModalOverlay>
  );
};
