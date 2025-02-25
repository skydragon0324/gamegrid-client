import { FC } from "react";
import styles from "./index.module.scss";
import { updateModalsState } from "@/utils/updateState";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { useRouter } from "next/router";

export const IntroduceCard: FC = () => {
  const router = useRouter();
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  return (
    <div className={styles.introducecard}>
      <div className={styles.decorations}>
        <div className={styles.leftsection}>
          <img className={styles.item} src="/imgs/preview-item-1.png" alt="" />
          <img className={styles.welcomers} src="/imgs/welcomers.png" alt="" />
          <img
            className={styles.itemsecond}
            src="/imgs/preview-item-3.png"
            alt=""
          />
        </div>
        <div className={styles.rightsection}>
          <img
            className={styles.itemsecond}
            src="/imgs/preview-item-2.png"
            alt=""
          />
          <img className={styles.boxes} src="/imgs/preview-boxes.png" alt="" />
        </div>
      </div>

      <div className={styles.texts}>
        <h2>Start opening cases right now!</h2>
        <p>
          Unbox luxury products from Supreme, Off-white, BAPE, Apple and more
          for up to 95% off
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.buttonMain}
            onClick={() => {
              user
                ? updateModalsState({
                    walletModal: true,
                  })
                : updateModalsState({
                    authModal: true,
                  });
            }}
          >
            Get started
          </button>
          <button
            // disabled
            className={styles.buttonSecond}
            onClick={() => {
              updateModalsState({
                howItWorksModal: true,
              });
              // router.push("/how-it-works");
            }}
          >
            How it works?
          </button>
        </div>
      </div>
    </div>
  );
};
