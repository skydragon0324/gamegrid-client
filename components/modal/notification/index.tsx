import { ModalOverlay } from "../ModalOverlay";
import styles from "./notification.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import CopyIcon from "@/svgs/copy.svg";
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
import CheckMarkIcon from "@/svgs/checkmark.svg";
import CircleClose from "@/svgs/close-circle.svg";
import WarningNotification from "@/svgs/warning-notification.svg";

export const NotificationModal = () => {
  const refSeed = useRef<HTMLInputElement>(null);
  const refGameId = useRef<HTMLInputElement>(null);
  const refBoxId = useRef<HTMLInputElement>(null);

  const { notificationModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  return (
    <ModalOverlay
      isOpened={!!notificationModal}
      className={styles.notificationModalContainer}
      onClose={() =>
        updateModalsState({
          notificationModal: null,
        })
      }
    >
      <div className={styles.header}>
        <button
          className={styles.closebutton}
          onClick={() =>
            updateModalsState({
              notificationModal: null,
            })
          }
          // disabled={loading}
        >
          <CrossIcon />
        </button>
      </div>

      <br />

      {(notificationModal && notificationModal?.type === "success" && (
        <div className={styles.content}>
          <div className={styles.notificationTypeContainer}>
            <div className={styles.notificationImgWrapper}>
              <div className={styles.circle_one}></div>
              <div className={styles.circle_two}></div>
              <div className={styles.circle_three}></div>
              <div className={styles.circle_four}></div>
              <div
                className={`${styles.circle_main} ${styles.circle_success_color}`}
              >
                <CheckMarkIcon />
              </div>
            </div>
          </div>
          {notificationModal.children}
        </div>
      )) ||
        null}
      {(notificationModal && notificationModal?.type === "error" && (
        <div className={styles.content}>
          <div className={styles.notificationTypeContainer}>
            <div className={styles.notificationImgWrapper}>
              <div
                className={`${styles.circle_main} ${styles.circle_error_color}`}
              >
                <CircleClose />
              </div>
            </div>
          </div>
          {notificationModal.children}
        </div>
      )) ||
        null}
      {(notificationModal && notificationModal?.type === "warning" && (
        <div className={styles.content}>
          <div className={styles.notificationTypeContainer}>
            <div className={styles.notificationImgWrapper}>
              <div
                className={`${styles.circle_main} ${styles.circle_warning_color}`}
              >
                <WarningNotification />
              </div>
            </div>
          </div>
          {notificationModal.children}
        </div>
      )) ||
        null}
    </ModalOverlay>
  );
};
