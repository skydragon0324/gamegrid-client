import React, { useEffect, useRef, useState } from "react";
import styles from "./case.module.scss";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { useRouter } from "next/router";
import ArrowLeft from "@/svgs/arrow-left.svg";
import FairnessIcon from "@/svgs/fairness.svg";
import CopyIcon from "@/svgs/copy.svg";
import toast from "react-hot-toast";
import { Players } from "@/components/numofplayers/Players";
import { formatPrice } from "@/utils/handler";
import { MainReducer } from "mredux/reducers/main.reducer";
import { deleteBattleWithId, leaveBattleWithId } from "@/utils/api.service";
import Loader from "@/components/loader/Loader";

const WaitingBattle = () => {
  const router = useRouter();
  const refRoomId = useRef<HTMLInputElement>(null);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );
  useEffect(() => {
    setTotalPrice(battle.boxes.reduce((a, b) => a + b.price, 0));
  }, [battle]);
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );
  const copyInputContent = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.select();
      document.execCommand("copy");
      toast.success("Copied to clipboard");
    }
  };

  const deleteBattle = async (battleId: string) => {
    setDeleteLoading(true);
    const res = await deleteBattleWithId(battleId);
    if (res) {
      toast.success(`You cancelled the Battel with ${battleId}`);
      setDeleteLoading(false);
      router.push("/case");
    } else {
      toast.error("Failed to cancel the battle");
    }
  };
  const leaveBattle = async (battleId: string) => {
    setDeleteLoading(true);
    const res = await leaveBattleWithId(battleId);
    router.push("/case");
    if (res) {
      setDeleteLoading(false);
    } else {
      toast.error("Failed to leave the battle");
    }
  };

  return (
    <div className={styles.waiting}>
      <div className={styles.divider}>
        <button
          className={styles.backcases}
          onClick={() => {
            router.push("/case");
          }}
        >
          <ArrowLeft />
          <span>Back to case battles</span>
        </button>
        <div className={styles.text}>WAITING FOR PLAYERS...</div>

        <button className={styles.fairness}>
          <FairnessIcon />
          <span>Fairness Guaranteed</span>
        </button>
      </div>
      <div className={styles.waitingPart}>
        <div className={styles.decoration}>
          <div></div>
          <div></div>
        </div>
        <div className={styles.battlePart}>
          <div className={styles.text}>battle</div>
          <Players
            teams={battle.teams}
            teamSize={battle.teamsSize}
            selection={true}
          />
          <div className={styles.totalShare}>
            <div className={styles.total}>
              <div>
                <p>Opening</p>
                <span>{battle.boxes.length} Boxes</span>
              </div>
              <div>
                <p>Total value</p>
                <span>$ {formatPrice(totalPrice)}</span>
              </div>
            </div>
            <div className={styles.share}>
              <p>Share Battle</p>
              <div className={styles.inputForm}>
                <input
                  ref={refRoomId}
                  type="text"
                  readOnly
                  defaultValue={window.location.href.toString()}
                />
                <button
                  className={styles.copyButton}
                  onClick={() => copyInputContent(refRoomId)}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
            <div className={styles.share}>
              {battle.owner?.id === user?.id ? (
                <button
                  className={styles.cancelBtn}
                  onClick={() => deleteBattle(battle.id)}
                >
                  {deleteLoading ? <Loader /> : <p>Cancel battle</p>}
                </button>
              ) : (
                battle.players.find((player) => player.id === user?.id) && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => leaveBattle(battle.id)}
                  >
                    {deleteLoading ? <Loader /> : <p>Leave battle</p>}
                  </button>
                )
              )}
            </div>
          </div>
          <div className={styles.boxesArray}>
            {battle.boxes.map((box, index) => (
              <img src={box.imageUrl} key={box.id + index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingBattle;
