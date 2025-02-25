import { ModalOverlay } from "../ModalOverlay";
import styles from "./mgame.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import CopyIcon from "@/svgs/copy.svg";
import ShieldIcon from "@/svgs/shield.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { API_URL } from "@/utils/api.service";
import { imageURI } from "@/utils/colordetector";
import { formatPrice } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export const FairnessModal = () => {
  const refSeed = useRef<HTMLInputElement>(null);
  const refGameId = useRef<HTMLInputElement>(null);
  const refBoxId = useRef<HTMLInputElement>(null);

  const { fairnessData } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const copyInputContent = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.select();
      document.execCommand("copy");
      toast.success("Copied to clipboard");
    }
  };

  return (
    <ModalOverlay
      isOpened={!!fairnessData}
      className={styles.fairModal}
      onClose={() =>
        updateModalsState({
          fairnessData: null,
        })
      }
    >
      <div className={styles.header}>
        <h1>Provably Fair</h1>
        <button
          className={styles.closebutton}
          onClick={() =>
            updateModalsState({
              fairnessData: null,
            })
          }
          // disabled={loading}
        >
          <CrossIcon />
        </button>
      </div>

      <br />

      {(fairnessData && (
        <div className={styles.content}>
          <div className={styles.label}>Box Id</div>
          <div className={styles.inputForm}>
            <input
              ref={refBoxId}
              type="text"
              defaultValue={fairnessData.boxId ?? "--"}
              readOnly
            />
            <button
              className={styles.copyButton}
              onClick={() => copyInputContent(refBoxId)}
            >
              <CopyIcon />
            </button>
          </div>
          <br />
          <div className={styles.label}>Game Id</div>
          <div className={styles.inputForm}>
            <input
              ref={refGameId}
              type="text"
              defaultValue={fairnessData.gameId ?? "--"}
              readOnly
            />
            <button
              className={styles.copyButton}
              onClick={() => copyInputContent(refGameId)}
            >
              <CopyIcon />
            </button>
          </div>
          <br />
          <div className={styles.label}>Public Seed</div>
          <div className={styles.inputForm}>
            <input
              ref={refSeed}
              type="text"
              defaultValue={fairnessData.publicSeed ?? "--"}
              readOnly
            />
            <button
              className={styles.copyButton}
              onClick={() => copyInputContent(refSeed)}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      )) ||
        null}
    </ModalOverlay>
  );
};
