import { FC, ReactNode } from "react";
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
import USDT from "@/svgs/usdt.svg";
import LtcIcon from "@/svgs/ltc.svg";
import classNames from "classnames";
import CloseCircle from "@/svgs/circle-close.svg";
import ClockCircle from "@/svgs/clock.svg";
import CircleMark from "@/svgs/circlecheckmark.svg";
import { formatPrice } from "@/utils/handler";
import { useWindowSize } from "@/hooks/windowSize";
import toast from "react-hot-toast";

export const getMethod = (method?: string, non?: string) => {
  let obj = {
    Icon: () => <></>,
    text: non,
  };

  if (method) {
    switch (method.toLowerCase()) {
      case "visa":
        obj = {
          Icon: () => <VisaCard />,
          text: "Visa",
        };
        break;
      case "mastercard":
        obj = {
          Icon: () => <MasterCard />,
          text: "Mastercard",
        };
        break;
      case "btc":
        obj = {
          Icon: () => <BtcIcon />,
          text: "BTC",
        };
        break;
      case "eth":
        obj = {
          Icon: () => <EthIcon />,
          text: "ETH",
        };
        break;
      case "usdt":
      case "usdt_erc20":
        obj = {
          Icon: () => <USDT />,
          text: "USDT",
        };
        break;

      case "ltc":
        obj = {
          Icon: () => <LtcIcon />,
          text: "LTC",
        };
        break;
      case "usdc":
        obj = {
          Icon: () => <USDC />,
          text: "USDC",
        };
        break;
    }
  }

  return obj;
};

export const statusObj = (
  status: DepositTransaction["status"] | WithdrawTransaction["status"]
) => {
  let obj = {
    color: "yellow",
    text: status.includes("HOLD") ? "On Hold" : "Waiting",
    Icon: () => <ClockCircle />,
  };

  switch (status) {
    case "SUCCESSFUL":
    case "APPROVAL":
      obj = {
        color: "green",
        text: "Approved",
        Icon: () => <CircleMark />,
      };
      break;
    case "FAILED":
    case "REJECTED":
    case "REFUNDED":
    case "CANCELLED":
      obj = {
        color: "red",
        text: status.includes("REFUNDED")
          ? "Refunded"
          : status.includes("REJECTED")
            ? "Rejected"
            : status.includes("CANCELLED")
              ? "Cancelled"
              : "Error",
        Icon: () => <CloseCircle />,
      };
      break;
  }

  return obj;
};

export const DepositsTable: FC = () => {
  const { width } = useWindowSize();
  const { transactions } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

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

  return width > 840 ? (
    <>
      {transactions.deposits
        ?.filter((i) => i.paymentNetwork != null)
        .map((deposit, i) => (
          <tr key={i}>
            <td>
              {new Date(deposit.createdAt)
                .toLocaleString()
                .replace(/\//g, ".")
                .replace(/\:[0-9]+\s/g, " ")
                .toLowerCase() ?? "--"}
            </td>
            <td>{deposit.depositTransactionId}</td>

            <td>
              <div className={styles.payment}>
                {getMethod(
                  (deposit?.additionalData?.subMethod ?? "").replace(
                    "_TEST",
                    ""
                  ),
                  deposit.paymentNetwork
                ).Icon() ?? null}
                <span>
                  {getMethod(
                    (deposit?.additionalData?.subMethod ?? "").replace(
                      "_TEST",
                      ""
                    ),
                    deposit.paymentNetwork
                  ).text ?? "--"}{" "}
                  (
                  {deposit.additionalData?.endsWith
                    ? ".." + deposit.additionalData.endsWith
                    : "--"}
                  )
                </span>
              </div>
            </td>
            {/* <td>
              <div className={styles.payment}>
                {getMethod(
                  deposit.additionalData.subMethod,
                  deposit.paymentNetwork
                ).Icon() ?? null}
                <span>
                  {getMethod(
                    deposit.additionalData.subMethod,
                    deposit.paymentNetwork
                  ).text ?? "--"}
                </span>
              </div>
            </td> */}
            <td>
              <span>$ {formatPrice(deposit.depositAmount)}</span>
            </td>
            <td>
              <div
                className={classNames(
                  styles.status,
                  statusObj(deposit.status).color
                )}
              >
                {statusObj(deposit.status).Icon() ?? null}
                <span>{statusObj(deposit.status).text}</span>
              </div>
            </td>
          </tr>
        )) ?? null}
    </>
  ) : (
    <>
      {transactions.deposits?.map((deposit, i) => (
        <div
          className={styles.mobile}
          key={i}
          onClick={() => copyId(deposit.depositTransactionId)}
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
              {getMethod(
                (deposit?.additionalData?.subMethod ?? "").replace("_TEST", ""),
                deposit.paymentNetwork
              ).Icon() ?? null}
              <span>
                {getMethod(
                  (deposit?.additionalData?.subMethod ?? "").replace(
                    "_TEST",
                    ""
                  ),
                  deposit.paymentNetwork
                ).text ?? "--"}{" "}
                {deposit.additionalData?.network &&
                deposit.additionalData?.network === "FIREBLOCKS" ? (
                  <>
                    (
                    {deposit.additionalData?.endsWith
                      ? ".." + deposit.additionalData?.endsWith
                      : "--"}
                    )
                  </>
                ) : null}
              </span>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.amount}>
              <span>$ {formatPrice(deposit.depositAmount ?? 0)}</span>
            </div>
            <div
              className={classNames(
                styles.status,
                statusObj(deposit.status).color
              )}
            >
              {statusObj(deposit.status).Icon() ?? null}
              <span>{statusObj(deposit.status).text}</span>
            </div>
          </div>
        </div>
      )) ?? null}
    </>
  );
};
