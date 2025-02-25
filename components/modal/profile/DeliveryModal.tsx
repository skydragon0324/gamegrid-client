import { ModalOverlay } from "../ModalOverlay";
import styles from "./mprofile.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import CopyIcon from "@/svgs/copy.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { API_URL, sellItems } from "@/utils/api.service";
import { imageURI } from "@/utils/colordetector";
import { formatPrice, handleErrorRequest } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Tabs } from "@/components/tabs/Tabs";
import classNames from "classnames";
import { MainReducer } from "mredux/reducers/main.reducer";

const tabs = ["Sell for Balance", "Sell for Crypto"];

export const DeliveryModal = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0x0);
  const [bsl, setBsl] = useState<boolean>(false);

  const { inventory } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { sellItemModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: "UPDATE_MAIN_STATE",
      payload,
    });
  };

  const handleSellItems = async () => {
    try {
      if (!sellItemModal || sellItemModal.length <= 0) {
        throw new Error("No items selected");
      }

      setBsl(true);

      const ids = sellItemModal.map((l) => l.id);

      const res = sellItems(ids);

      // console.log(res);

      updateMainState({
        inventory: (inventory ?? []).filter((l) => !ids.includes(l.id)),
      });

      setBsl(false);

      updateModalsState({
        sellItemModal: null,
      });

      toast.success("Items sold successfully");
    } catch (error) {
      setBsl(false);
      toast.error(handleErrorRequest(error));
    }
  };

  return (
    <ModalOverlay
      isOpened={false}
      className={styles.deliveryModal}
      onClose={() =>
        updateModalsState({
          fairnessData: null,
        })
      }
    >
      <div className={styles.header}>
        <h1>SELL ITEMS</h1>
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
      <p>Are you sure you want this item?</p>

      <div className={styles.item}>
        <div className={styles.left}>
          <div className={styles.image}>
            <Image
              // src={imageURI(item.item.id, "item")}
              src={
                "https://media.discordapp.net/attachments/803320462267514940/1184812655391805530/image.png?ex=658d55c5&is=657ae0c5&hm=5752a853feb2eb726cb162ea96250cd813b315009b97648cf03b3b9e094174d4&=&format=webp&quality=lossless&width=140&height=140"
              }
              alt="item"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={styles.info}>
            <h2>cairbyte71</h2>
            <p>Razer</p>
          </div>
        </div>

        <div className={styles.right}>
          <span>${formatPrice(22.56)}</span>
        </div>
      </div>
      <h2>Shipping Details</h2>

      <form className={styles.form}>
        <div className={styles.input}>
          <div className={styles.label}>First Name</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="First Name"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.input}>
          <div className={styles.label}>Last Name</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Last Name"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.input}>
          <div className={styles.label}>Street Address</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Street Address"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.input}>
          <div className={styles.label}>Street Address 2</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Street Address 2"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.input}>
          <div className={styles.label}>First Name</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter your wallet address"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.input}>
          <div className={styles.label}>First Name</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter your wallet address"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.input}>
          <div className={styles.label}>First Name</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter your wallet address"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.input}>
          <div className={styles.label}>First Name</div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter your wallet address"
              // value={walletAddress}
              // onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>
      </form>
    </ModalOverlay>
  );
};
