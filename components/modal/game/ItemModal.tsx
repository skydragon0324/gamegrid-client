import { ModalOverlay } from "../ModalOverlay";
import styles from "./mgame.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { API_URL } from "@/utils/api.service";
import { imageURI } from "@/utils/colordetector";
import { formatFrequency, formatPrice, shortIt } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { GameReducer } from "mredux/reducers/game.reducer";
import { useEffect, useState } from "react";

export const ItemModal = () => {
  const { boxDetails } = useSelector<StateInterface, GameReducer>(
    (state) => state.gameReducer
  );
  const { itemOpened } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((l) => [...l, index]);
    }
  };

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  useEffect(() => {
    return () => {
      setFailedImages([]);
    };
  }, []);

  return (
    <ModalOverlay
      isOpened={!!itemOpened}
      className={styles.itemModal}
      onClose={() =>
        updateModalsState({
          itemOpened: null,
        })
      }
    >
      <div className={styles.header}>
        <div className={styles.left}>
          <h1>
            {shortIt(itemOpened?.item.name ?? "--", 30)} <span></span>
          </h1>
          <p>
            {(!!boxDetails?.categories.length &&
              boxDetails?.categories?.[0x0].name) ||
              "--"}
          </p>
        </div>
        <button
          className={styles.closebutton}
          onClick={() =>
            updateModalsState({
              itemOpened: null,
            })
          }
          // disabled={loading}
        >
          <CrossIcon />
        </button>
      </div>

      {(itemOpened && (
        <>
          <div className={styles.itemPreview}>
            <div className={styles.itemImagePreview}>
              <img
                onError={() => handleImageFailed(0x0)}
                src={
                  failedImages.includes(0x0)
                    ? "/imgs/placeholder.png"
                    : itemOpened?.item?.images &&
                        itemOpened?.item?.images.length
                      ? itemOpened.item.images[0x0].url
                      : imageURI(itemOpened?.item?.id ?? "", "item")
                }
                alt=""
              />
            </div>
            <div className={styles.itemDetails}>
              <h2 className={styles.label}>DESCRIPTION</h2>
              <p>
                {itemOpened.item?.description ?? "No description available yet"}
              </p>
              <div className={styles.def}>
                {/* <span>Released At: --</span> */}
                <span>
                  <strong>Chance</strong>
                </span>
                <span className={styles.answer}>
                  ~{formatFrequency(itemOpened.frequency)}%
                </span>
              </div>
            </div>
          </div>
        </>
      )) ||
        null}
    </ModalOverlay>
  );
};
