import { ModalOverlay } from "../ModalOverlay";
import styles from "./howItWorks.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import CopyIcon from "@/svgs/copy.svg";
import DottedArrowIcon from "@/svgs/dotted-arrow.svg";
import WinItem1Icon from "@/svgs/win-item-1.svg";
import WinItem2Icon from "@/svgs/win-item-2.svg";
import WinItem3Icon from "@/svgs/win-item-3.svg";
import WinItem4Icon from "@/svgs/win-item-4.svg";
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

export const HowItWorksModal = () => {
  const refSeed = useRef<HTMLInputElement>(null);
  const refGameId = useRef<HTMLInputElement>(null);
  const refBoxId = useRef<HTMLInputElement>(null);

  const { howItWorksModal } = useSelector<StateInterface, ModalsReducer>(
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
      isOpened={!!howItWorksModal}
      className={styles.modalContainer}
      onClose={() =>
        updateModalsState({
          howItWorksModal: false,
        })
      }
    >
      <div className={styles.header}>
        <button
          className={styles.closebutton}
          onClick={() =>
            updateModalsState({
              howItWorksModal: false,
            })
          }
          // disabled={loading}
        >
          <CrossIcon />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>How it works?</div>
        <div className={styles.contentContainer}>
          <div className={styles.stepWrapper}>
            <div className={styles.stepHeader}>
              <div className={styles.contentTitle}>
                <h2>Step 1</h2>
                <span>Deposit Funds</span>
              </div>
              <div className={styles.stepImg}>
                <img src="/imgs/piggy-bank.png" alt="" />
              </div>
            </div>
            <div className={styles.contentText}>
              To begin, you need to add funds to your account. This can be done
              by clicking on the 'Top Up' option, found in the upper right
              corner of the interface. Here, you'll have a choice of different
              payment methods to deposit money into your account. These options
              include using credit or debit cards, redeeming gift cards, or
              employing cryptocurrencies for the transaction.
            </div>
            <div className={styles.stepFooter}>
              <div className={styles.footerText}>
                Take the first step to start
              </div>
              <button
                className={styles.stepButton}
                onClick={() => {
                  updateModalsState({
                    howItWorksModal: false,
                    walletModal: true,
                  });
                }}
              >
                <span> Deposit funds</span>
              </button>
            </div>
          </div>
          <div className={styles.divider}>
            <DottedArrowIcon />
          </div>
          <div className={styles.stepWrapper}>
            <div className={styles.stepHeader}>
              <div className={styles.contentTitle}>
                <h2>Step 2</h2>
                <span>Purchase a Box</span>
              </div>
              <div className={styles.stepImg}>
                <img src="/imgs/purchase.png" alt="" />
              </div>
            </div>
            <div className={styles.contentText}>
              Purchase a box to win a chance of winning an item inside! Before
              opening, you can click on the box to see all of the items and the
              probability of receiving an item before purchasing
            </div>
          </div>
          <div className={styles.divider}>
            <DottedArrowIcon />
          </div>
          <div className={styles.stepWrapper}>
            <div className={styles.stepHeader}>
              <div className={styles.contentTitle}>
                <h2>Step 3</h2>
                <span>Win an Item</span>
              </div>
              <div className={styles.stepImg}>
                <div className={styles.svg1}>
                  <WinItem1Icon />
                </div>
                <div className={styles.svg2}>
                  {" "}
                  <WinItem2Icon />
                </div>
                <div className={styles.svg3}>
                  {" "}
                  <WinItem3Icon />
                </div>
                <div className={styles.svg4}>
                  {" "}
                  <WinItem4Icon />
                </div>
                <img src="/imgs/won-item.png" alt="" className={styles.img1} />
              </div>
            </div>
            <div className={styles.contentText}>
              When you purchase a box, you always have an item that's won! The
              item is stored in your inventory, where you can decide to have it
              delivered, cashed out, or sold back to on-site balance.
            </div>
          </div>
          <div className={styles.divider}>
            <DottedArrowIcon />
          </div>
          <div className={styles.stepWrapper}>
            <div className={styles.stepHeader}>
              <div className={styles.contentTitle}>
                <h2>Step 4</h2>
                <span>Delivery</span>
              </div>
              <div className={styles.stepImg}>
                <img src="/imgs/purchase.png" alt="" />
              </div>
            </div>
            <div className={styles.contentText}>
              You can choose to have your item directly to your house, or cash
              out the equivalent value of the item in cryptocurrency
            </div>
          </div>
        </div>
      </div>
      <br />
    </ModalOverlay>
  );
};
