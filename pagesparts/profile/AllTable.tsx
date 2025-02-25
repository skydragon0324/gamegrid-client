import { FC } from "react";
import styles from "./profile.module.scss";
import { useSelector } from "react-redux";
import {
  DepositTransaction,
  MainReducer,
  WithdrawTransaction,
} from "mredux/reducers/main.reducer";
import { StateInterface } from "mredux";
import MasterCard from "@/svgs/mastercard.svg";
import VisaCard from "@/svgs/visa.svg";
import BtcIcon from "@/svgs/btc.svg";
import EthIcon from "@/svgs/eth.svg";
import USDC from "@/svgs/usdc.svg";
import LtcIcon from "@/svgs/ltc.svg";
import classNames from "classnames";
import CloseCircle from "@/svgs/circle-close.svg";
import ClockCircle from "@/svgs/clock.svg";
import CircleMark from "@/svgs/circlecheckmark.svg";
import { formatPrice } from "@/utils/handler";
import { useWindowSize } from "@/hooks/windowSize";
import { toast } from "react-hot-toast";

export const AllTransTable: FC = () => {
  const { width } = useWindowSize();
  const { transactions } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const getColorByBalance = (balance: string | number) => {
    if (String(balance).includes("-")) {
      return "red";
    } else {
      return "green";
    }
  };

  const copyId = (id: string) => {
    const element = document.createElement("textarea");
    element.value = id;
    element.style.position = "absolute";
    element.style.left = "-9999px";
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
    toast.success("Transaction ID copied to clipboard successfully!");
  };

  return (
    <>
      {width > 840 ? (
        <>
          {transactions.transactions?.map((deposit, i) => (
            <tr key={i}>
              <td>
                {new Date(deposit.createdAt)
                  .toLocaleString()
                  .replace(/\//g, ".")
                  .replace(/\:[0-9]+\s/g, " ")
                  .toLowerCase() ?? "--"}
              </td>
              <td>{deposit.transactionId}</td>
              <td>
                <span>{deposit.type.toLowerCase()}</span>
              </td>
              <td>
                <span
                  className={classNames(
                    styles.status,
                    styles[getColorByBalance(deposit.balanceAdjustment)]
                  )}
                >
                  <span>$ {formatPrice(deposit.balanceAdjustment)}</span>
                </span>
              </td>
              <td>
                <span>$ {formatPrice(deposit.finalBalance)}</span>
              </td>
            </tr>
          )) ?? null}
        </>
      ) : (
        <>
          {transactions.transactions?.map((deposit, i) => (
            <div
              className={styles.mobile}
              key={i}
              onClick={() => copyId(deposit.transactionId)}
            >
              <div className={styles.left}>
                <div className={styles.date}>
                  {new Date(deposit.createdAt)
                    .toLocaleString()
                    .replace(/\//g, ".")
                    .replace(/\:[0-9]+\s/g, " ")
                    .toLowerCase() ?? "--"}
                </div>
                <div className={styles.id}>#{i + 0x1}</div>
                <div className={styles.payment}>
                  <span>{deposit.type.toLowerCase()}</span>
                </div>
              </div>

              <div className={styles.right}>
                <span
                  className={classNames(
                    styles.status,
                    styles[getColorByBalance(deposit.balanceAdjustment ?? 0)]
                  )}
                >
                  <span>$ {formatPrice(deposit.balanceAdjustment ?? 0)}</span>
                </span>
                <span>$ {formatPrice(deposit.finalBalance ?? 0)}</span>
              </div>
            </div>
          )) ?? null}
        </>
      )}
    </>
  );
};
