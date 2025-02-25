import { FC, useState } from "react";
import styles from "./profile.module.scss";
import { useSelector } from "react-redux";
import { DepositTransaction, MainReducer } from "mredux/reducers/main.reducer";
import { ModalsReducer } from "mredux/reducers/modals.reducer";

import { StateInterface, store } from "mredux";
import MasterCard from "@/svgs/mastercard.svg";
import VisaCard from "@/svgs/visa.svg";
import BtcIcon from "@/svgs/btc.svg";
import FairnessIcon from "@/svgs/fairness.svg";
import EthIcon from "@/svgs/eth.svg";
import classNames from "classnames";
import CloseCircle from "@/svgs/circle-close.svg";
import ClockCircle from "@/svgs/clock.svg";
import CircleMark from "@/svgs/circlecheckmark.svg";
import { formatPrice, handleErrorRequest, shortIt } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { getMethod, statusObj } from "./DepositsTable";
import { useWindowSize } from "@/hooks/windowSize";
import toast from "react-hot-toast";
import { cancelWithdraw } from "@/utils/api.service";
import Loader from "@/components/loader/Loader";
import { updateMainState } from "@/utils/updateState";

export const WithdrawTable: FC = () => {
  const { width } = useWindowSize();
  const { transactions } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
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

  console.log({ transactions });

  const [withdrawCancelLoading, setWithdrawCancelLoading] = useState({});
  const handleCancelWithdraw = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    console.log("cloi");
    event.stopPropagation();
    try {
      setWithdrawCancelLoading((prevStates) => ({ ...prevStates, [id]: true }));
      const res = await cancelWithdraw(id);

      // update the withdraw transcations, specific withdraw transaction status
      if (!transactions || !transactions.withdraws) return;
      updateMainState({
        transactions: {
          ...transactions,
          withdraws: transactions.withdraws?.map((withdraw) => {
            if (withdraw.withdrawalTransactionId === id) {
              withdraw.status = res;
            }
            return withdraw;
          }),
        },
      });
      setWithdrawCancelLoading((prevStates) => ({
        ...prevStates,
        [id]: false,
      }));
      console.log({ res });
    } catch (error) {
      console.log({ error });
      setWithdrawCancelLoading((prevStates) => ({
        ...prevStates,
        [id]: false,
      }));
      handleErrorRequest(error);
    }
  };

  return (
    <>
      {transactions.withdraws?.map((game, i) =>
        width > 840 ? (
          <tr key={i}>
            <td>
              {new Date(game.createdAt)
                .toLocaleString()
                .replace(/\//g, ".")
                .replace(/\:[0-9]+\s/g, " ")
                .toLowerCase() ?? "--"}
            </td>
            <td>{game.withdrawalTransactionId}</td>
            <td>
              <div className={styles.payment}>
                {getMethod(
                  (
                    game?.additionalData?.subMethod ||
                    game?.assetId ||
                    ""
                  ).replace("_TEST", "")
                ).Icon() ?? null}
                <span>
                  {getMethod(
                    (
                      game?.additionalData?.subMethod ||
                      game?.assetId ||
                      ""
                    ).replace("_TEST", ""),
                    "--"
                  ).text ?? "--"}
                </span>
              </div>
            </td>

            <td>
              <a
                className={styles.payment}
                href={game?.additionalData?.txUrl ?? ""}
                title={game?.additionalData?.txHash ?? ""}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(game?.additionalData?.txUrl ?? "");
                }}
              >
                <span>{shortIt(game?.additionalData?.txHash ?? "--", 20)}</span>
                {/* <span>{getMethod(game.assetId, "--").text ?? "--"}</span> */}
              </a>
            </td>
            <td>
              <span>$ {formatPrice(game.amount)}</span>
            </td>
            <td>
              <div
                className={classNames(
                  styles.status,
                  styles[statusObj(game.status).color]
                )}
              >
                {statusObj(game.status).Icon() ?? null}
                <span>{statusObj(game.status).text ?? "--"}</span>
                {game.status.includes("PENDING") && (
                  <button
                    key={game.withdrawalTransactionId}
                    className={styles.cancelBtn}
                    onClick={(e) =>
                      handleCancelWithdraw(e, game.withdrawalTransactionId)
                    }
                  >
                    {(withdrawCancelLoading as { [key: string]: boolean })[
                      game.withdrawalTransactionId
                    ] ? (
                      <Loader radius={10} />
                    ) : (
                      "Cancel"
                    )}
                  </button>
                )}
              </div>
            </td>
          </tr>
        ) : (
          <>
            {transactions.withdraws?.map((withdrawal, i) => (
              <div
                className={styles.mobile}
                key={i}
                onClick={() => copyId(withdrawal.withdrawalTransactionId)}
              >
                <div className={styles.left}>
                  <div className={styles.date}>
                    {new Date(withdrawal.createdAt)
                      .toLocaleString()
                      .replace(/\//g, ".")
                      .replace(/\:[0-9]+\s/g, " ")
                      .toLowerCase() ?? "--"}
                  </div>
                  <div className={styles.id}>#{i + 0x1}</div>
                  <div className={styles.payment}>
                    {getMethod(
                      (
                        game?.additionalData?.subMethod ||
                        game?.assetId ||
                        ""
                      ).replace("_TEST", "") ?? "",
                      (
                        game?.additionalData?.subMethod ||
                        game?.assetId ||
                        ""
                      ).replace("_TEST", "") ?? ""
                    ).Icon() ?? null}
                    <span>
                      {getMethod(
                        (
                          game?.additionalData?.subMethod ||
                          game?.assetId ||
                          ""
                        ).replace("_TEST", "") ?? "",
                        (
                          game?.additionalData?.subMethod ||
                          game?.assetId ||
                          ""
                        ).replace("_TEST", "") ?? ""
                      ).text ??
                        (withdrawal.assetId || "--")}
                    </span>
                  </div>
                </div>

                <div className={styles.right}>
                  <div className={styles.amount}>
                    <a
                      className={styles.payment}
                      href={game?.additionalData?.txUrl ?? ""}
                      title={game?.additionalData?.txHash ?? ""}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(game?.additionalData?.txUrl ?? "");
                      }}
                    >
                      <span>
                        {shortIt(game?.additionalData?.txHash ?? "--", 20)}
                      </span>
                      {/* <span>{getMethod(game.assetId, "--").text ?? "--"}</span> */}
                    </a>
                  </div>
                  <div className={styles.amount}>
                    <span>$ {formatPrice(withdrawal.amount ?? 0)}</span>
                  </div>
                  <div
                    className={classNames(
                      styles.status,
                      styles[statusObj(withdrawal.status).color]
                    )}
                  >
                    {statusObj(withdrawal.status).Icon() ?? null}
                    <span>{statusObj(withdrawal.status).text}</span>
                    {withdrawal.status.includes("PENDING") && (
                      <button
                        key={withdrawal.withdrawalTransactionId}
                        className={styles.cancelBtn}
                        onClick={(e) =>
                          handleCancelWithdraw(
                            e,
                            withdrawal.withdrawalTransactionId
                          )
                        }
                      >
                        {(withdrawCancelLoading as { [key: string]: boolean })[
                          withdrawal.withdrawalTransactionId
                        ] ? (
                          <Loader radius={10} />
                        ) : (
                          "Cancel"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) ?? null}
          </>
        )
      ) ?? null}
    </>
  );
};
