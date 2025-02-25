import styles from "./notification.module.scss";
import CopyIcon from "@/svgs/copy.svg";
import ExchangeIcon from "@/svgs/exchange.svg";
import DollarIcon from "@/svgs/dollar.svg";
import { StateInterface, store } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { renderCoinIcons } from "@/utils/renderCoin";

interface BasicNotificationProps {
  title: string;
  message: string;
  leftbutton: {
    text: string;
    callback: () => void;
  };
  rightButton: {
    text: string;
    callback: () => void;
  };
}

export const BasicNotification = (
  props: BasicNotificationProps
): JSX.Element => {
  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notificationInfoContainer}>
        <span className={styles.notificationInfoTitle}>{props.title}</span>
        <span className={styles.notificationInfoMessage}>{props.message}</span>
      </div>
      <div className={styles.notificationButtonContainer}>
        <button
          className={styles.leftButton}
          onClick={() => props.leftbutton.callback()}
        >
          {props.leftbutton.text}
        </button>
        <button
          className={styles.rightButton}
          onClick={() => props.rightButton.callback()}
        >
          {props.rightButton.text}
        </button>
      </div>
    </div>
  );
};

interface SoldItemsEstimate {
  amountInUSD: number;
  amountInToken: number;
  estimatedFeeInToken: number;
  currencyIcon: string;
}

export const WithDrawSuccessNotification = (
  props: SoldItemsEstimate
): JSX.Element => {
  const router = useRouter();
  const { cryptoPaymentsAvailable } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );
  const updateModalState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: "UPDATE_MODALS_STATE",
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
    <>
      <div className={styles.notificationContainer}>
        <div className={styles.notificationInfoContainer}>
          <span className={styles.notificationInfoTitle}>
            Withdraw Submitted
          </span>
          <span className={styles.notificationInfoMessage}>
            {" "}
            Withdraw request submitted. Visit history to view your order status.
          </span>
        </div>
        <div className={styles.notificationBody}>
          <div className={styles.notificationBodyTitle}>
            <span className={styles.bodyTitle}>Recipient amount</span>
            <div className={styles.bodyWrapper}>
              <div className={styles.bodyAmount}>
                <span className={styles.amountIcon}>
                  {renderCoinIcons(props.currencyIcon)}
                </span>
                <span className={styles.amountText}>{props.amountInToken}</span>
              </div>
              <div className={styles.exchange}>
                <span className={styles.exchangeIcon}>
                  <ExchangeIcon />
                </span>
              </div>
              <div className={styles.bodyAmount}>
                <span className={styles.amountIcon}>
                  <DollarIcon />
                </span>
                <span className={styles.amountText}>{props.amountInUSD}</span>
              </div>
            </div>
          </div>
          <div className={styles.notificationDetailWrapper}>
            <div className={styles.notificationDetail}>
              <div className={styles.detailInfo}>
                <span className={styles.detailInfoTitle}>Transaction fee</span>
                <div className={styles.detailInfoDesc}>
                  <span className={styles.addressTitle}>
                    {props.estimatedFeeInToken}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.notificationButtonContainer}>
          <button
            className={styles.rightButton}
            onClick={() => {
              router.push("/profile");
              updateModalState({
                notificationModal: null,
              });
            }}
          >
            View Site Balance
          </button>
          {/* <button
            className={styles.rightButton}
            onClick={() => {
              router.push("/");
              updateModalState({
                notificationModal: null,
              });
            }}
          >
            Try Again
          </button> */}
        </div>
      </div>
    </>
  );
};
