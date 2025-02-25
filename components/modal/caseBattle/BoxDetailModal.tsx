import { ModalOverlay } from "../ModalOverlay";
import styles from "./mcaseBattle.module.scss";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { formatPrice, handleErrorRequest } from "@/utils/handler";
import React, { useEffect, useState } from "react";
import AddedBox from "@/components/box/AddedBox";
import { getBattleById } from "@/utils/api.service";
import Loader from "@/components/loader/Loader";
import classNames from "classnames";
import CrossIcon from "@/svgs/cross.svg";

export const DetailBattleModal = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [boxes, setBoxes] = useState<{ box: BoxType; count: number }[]>([]);

  // data from redux
  const { detailBattleModal, roomId } = useSelector<
    StateInterface,
    ModalsReducer
  >((state) => state.modalsReducer);

  const { battles } = useSelector<StateInterface, BattlesReducer>(
    (state) => state.battlesReducer
  );

  const fetchBattleById = async (battleId: string) => {
    try {
      setLoading(true);
      const res = await getBattleById(battleId);
      if (res) {
        setBoxList(res);
      }
      setLoading(false);
    } catch (error: any) {
      handleErrorRequest(error);
    }
  };
  const setBoxList = (battle: Battle) => {
    const temp: Array<{ box: BoxType; count: number }> = battle.boxes.reduce(
      (acc: Array<{ box: BoxType; count: number }>, box: BoxType) => {
        const existingBox = acc.find((item) => item.box.id === box.id);
        if (existingBox) {
          existingBox.count++;
        } else {
          acc.push({ box: box, count: 1 });
        }
        return acc;
      },
      []
    );
    setBoxes(temp);
  };
  useEffect(() => {
    if (roomId) {
      if (battles.length > 0) {
        const tempBattlebox = battles.find((battle) => battle.id === roomId);
        setBoxList(tempBattlebox as Battle);
      } else {
        fetchBattleById(roomId as string);
      }
    }
  }, [roomId]);

  useEffect(() => {
    let sumCnt = 0,
      sumPrice = 0;
    boxes.forEach((l) => {
      sumCnt += l.count;
      sumPrice += l.box.price * l.count;
    });

    setTotalCount(sumCnt);
    setTotalPrice(sumPrice);
  }, [boxes]);

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const handleCloseModal = () => {
    updateModalsState({
      detailBattleModal: false,
      roomId: "",
    });
  };

  return (
    <ModalOverlay
      isOpened={detailBattleModal}
      className={classNames(styles.createBattle, styles.detail)}
      onClose={handleCloseModal}
    >
      <div className={styles.header}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerTitle}>Case In Room</div>
        </div>
        <button className={styles.closebutton} onClick={handleCloseModal}>
          <CrossIcon />
        </button>
      </div>

      {detailBattleModal && !loading ? (
        <div className={styles.content}>
          <div className={styles.boxes}>
            {boxes.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <AddedBox box={item.box} b_count={item.count} />
                </React.Fragment>
              );
            })}
          </div>
          <div className={styles.footer}>
            <div className={styles.total}>
              <p>
                Cases : <span>{totalCount}</span>
              </p>
              <p>
                Total Value: <span>$ {formatPrice(totalPrice)}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          <p>Loading .... </p>
          <div>
            <Loader />
          </div>
        </div>
      )}
    </ModalOverlay>
  );
};
