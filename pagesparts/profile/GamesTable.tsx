import { FC } from "react";
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
import { formatPrice } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import toast from "react-hot-toast";
import { useWindowSize } from "@/hooks/windowSize";

export const GamesTable: FC = () => {
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

  return (
    <>
      {width > 840 ? (
        <>
          {transactions.game_history?.map((game, i) => (
            <tr key={i}>
              <td>
                {new Date(game.createdAt)
                  .toLocaleString()
                  .replace(/\//g, ".")
                  .replace(/\:[0-9]+\s/g, " ")
                  .toLowerCase() ?? "--"}
              </td>
              <td>{game.gameId}</td>
              <td>{game.type.replace(/\s/g, " ")}</td>
              <td>
                <span>$ {formatPrice(game.amountSpent)}</span>
              </td>
              <td>
                <span
                  className={classNames(
                    game.valueWon > 0 ? styles.green : styles.red
                  )}
                >
                  $ {formatPrice(game.valueWon, true)}
                </span>
              </td>{" "}
              <td>
                <span className={styles.xp}>+{formatPrice(game.xpWon)} XP</span>
              </td>{" "}
              <td>
                <span className={styles.lc}>
                  {formatPrice(game.lootCoinWon, true)} LC
                </span>
              </td>
              <td>
                <button
                  className={styles.fairnessButton}
                  onClick={() => {
                    window.open(
                      `https://fairness.loot.gg/game?clientSeed=${game.clientSeed}&serverSeed=${game.privateSeed}&nonce=${game.nonce}&boxId=${game.boxId}`
                    );
                  }}
                >
                  <FairnessIcon />
                  <span>Fairness</span>
                </button>
              </td>
            </tr>
          )) ?? null}
        </>
      ) : (
        <>
          {transactions.game_history?.map((deposit, i) => (
            <div
              className={styles.mobile}
              key={i}
              onClick={() => copyId(deposit.gameId)}
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
                  <span>{deposit.type.replace(/\s/g, " ")}</span>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.amount}>
                  <span>${formatPrice(deposit.amountSpent)}</span>
                </div>
                <div>
                  <span
                    className={classNames(
                      deposit.valueWon > 0 ? styles.green : styles.red
                    )}
                  >
                    ${formatPrice(deposit.valueWon ?? 0)}
                  </span>
                </div>

                <div>
                  <span className={styles.xp}>
                    {formatPrice(deposit.xpWon ?? 0, true)} XP
                  </span>
                </div>

                <div>
                  <span className={styles.lc}>
                    {formatPrice(deposit.lootCoinWon ?? 0, true)} LC
                  </span>
                </div>

                <button
                  className={styles.fairnessButton}
                  onClick={() => {
                    window.open(
                      `https://fairness.loot.gg/game?clientSeed=${deposit.clientSeed}&serverSeed=${deposit.privateSeed}&nonce=${deposit.nonce}&boxId=${deposit.boxId}`
                    );
                  }}
                >
                  <FairnessIcon />
                  <span>Fairness</span>
                </button>
              </div>
            </div>
          )) ?? null}
        </>
      )}
    </>
  );
};
