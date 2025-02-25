import { ModalOverlay } from "../ModalOverlay";
import styles from "./mprofile.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import LootCoin from "@/svgs/lootcoin.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import ExpandArrow from "@/svgs/expanarrow.svg";
import CrossIcon from "@/svgs/cross.svg";
import EXPIcon from "@/svgs/exp.svg";
import XPCoin from "@/svgs/xp-icon.svg";
import CopyIcon from "@/svgs/copy.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import {
  API_URL,
  convertLootCoinstoXP,
  convertUsdtoLootcoins,
  sellItems,
} from "@/utils/api.service";
import { imageURI } from "@/utils/colordetector";
import { formatPrice, handleErrorRequest } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Tabs } from "@/components/tabs/Tabs";
import classNames from "classnames";
import { MainReducer } from "mredux/reducers/main.reducer";
import Loader from "@/components/loader/Loader";
import useRudderStackAnalytics from "@/utils/rudderstack";
import { updateMainState } from "@/utils/updateState";

const tabs = ["Buy XP", "Buy LC"];

export const BuyXPModal = () => {
  const ltcRef = useRef<HTMLInputElement & { focused?: boolean }>(null);
  const ltcRef2 = useRef<HTMLInputElement & { focused?: boolean }>(null);
  const usdRef = useRef<HTMLInputElement & { focused?: boolean }>(null);
  const xpRef = useRef<HTMLInputElement & { focused?: boolean }>(null);
  const [focus, setFocus] = useState<boolean[]>([false, false]);
  const [loading, setLoading] = useState<boolean>(false);
  const { buyxpModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const analytics = useRudderStackAnalytics();

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const LCtoXP = (lc: number) => {
    return lc * 0xa;
  };

  const XPtoLC = (xp: number) => {
    return xp / 0xa;
  };

  const USDtoLC = (usd: number) => {
    return usd * 100;
  };

  const LCtoUSD = (lc: number) => {
    return lc / 100;
  };

  const handleConvert = async () => {
    try {
      let _amount = String(
        buyxpModal === 0x0 ? ltcRef.current?.value : usdRef.current?.value
      )
        .trim()
        .replace(/,/g, "");

      if (!_amount || !_amount.match(/^[0-9\,\.]+$/)) {
        toast.error("Please enter valid amount");
        return;
      }

      if (buyxpModal === 0x0 && !_amount.match(/^[0-9,]+$/)) {
        toast.error("Please enter a whole number.");
        return;
      }

      let amount = Number(_amount);

      if (amount <= 0) {
        // Minimum amount is 1
        toast.error("Please enter valid amount");
        return;
      }

      setLoading(true);

      const response =
        buyxpModal === 0x0
          ? await convertLootCoinstoXP(amount)
          : await convertUsdtoLootcoins(amount);

      setLoading(false);

      analytics &&
        analytics.track("BUY_XP", {
          amount,
          type: buyxpModal === 0x0 ? "EXP" : "LC",
        });

      if (response) {
        toast.success(
          "Successfully converted to" + (buyxpModal === 0x0 ? " EXP" : " LC")
        );
        user &&
          buyxpModal === 0x1 &&
          updateMainState({
            user: {
              ...user,
              usdBalance: user.usdBalance - (amount ?? 0),
              lootCoinsBalance: user.lootCoinsBalance + (amount * 100 ?? 0),
            },
          });
        user &&
          buyxpModal === 0x0 &&
          updateMainState({
            user: {
              ...user,
              lootCoinsBalance: user.lootCoinsBalance - (amount ?? 0),
              xpBalance: user.xpBalance + (amount * 10 ?? 0),
            },
          });
      }

      ltcRef.current && (ltcRef.current.value = "");
      xpRef.current && (xpRef.current.value = "");
      usdRef.current && (usdRef.current.value = "");
      ltcRef2.current && (ltcRef2.current.value = "");
    } catch (e) {
      setLoading(false);

      toast.error(handleErrorRequest(e));
    }
  };

  const handleLTCDecrementOrIncrement = (type: "increment" | "decrement") => {
    if (ltcRef.current) {
      let value = Number(ltcRef.current.value);
      if (type === "increment") {
        value += 1;
      } else {
        if (value >= 1) {
          value -= 1;
        }
      }
      ltcRef.current.value = value.toString();
      if (xpRef.current) {
        xpRef.current.value = String(LCtoXP(value));
      }
    }
  };

  const handleXPDecrementOrIncrement = (type: "increment" | "decrement") => {
    if (xpRef.current) {
      let value = Number(xpRef.current.value);
      if (type === "increment") {
        value += 1;
      } else {
        if (value >= 1) {
          value -= 1;
        }
      }
      xpRef.current.value = value.toString();
      if (ltcRef.current) {
        ltcRef.current.value = String(XPtoLC(value));
      }
    }
  };

  const handleUSDDecrementOrIncrement = (type: "increment" | "decrement") => {
    if (usdRef.current) {
      let value = Number(usdRef.current.value);
      if (type === "increment") {
        value += 1;
      } else {
        if (value >= 1) {
          value -= 1;
        }
      }
      usdRef.current.value = value.toString();
      if (ltcRef2.current) {
        ltcRef2.current.value = String(USDtoLC(value));
      }
    }
  };

  const handleLCDecrementOrIncrement = (type: "increment" | "decrement") => {
    if (ltcRef2.current) {
      let value = Number(ltcRef2.current.value);
      if (type === "increment") {
        value += 1;
      } else {
        if (value >= 1) {
          value -= 1;
        }
      }
      ltcRef2.current.value = value.toString();
      if (usdRef.current) {
        usdRef.current.value = String(LCtoUSD(value));
      }
    }
  };

  return (
    <ModalOverlay
      isOpened={buyxpModal >= 0x0}
      className={styles.buyxpmodal}
      onClose={() =>
        updateModalsState({
          buyxpModal: -1,
        })
      }
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>BUY XP</h1>
          <button
            className={styles.closebutton}
            onClick={() =>
              updateModalsState({
                buyxpModal: -1,
              })
            }
            // disabled={loading}
          >
            <CrossIcon />
          </button>
        </div>
        <br />
        <Tabs
          tabs={tabs}
          activeTab={tabs[buyxpModal]}
          className={styles.tabs}
          setActiveTab={(_: string, index?: number | undefined): void => {
            updateModalsState({
              buyxpModal: index ?? 0x0,
            });
          }}
        />
        <div className={styles.content}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>
              {/* {buyxpModal === 0x0 ? "From" : "USD Amount"} */}
              {"From"}
            </div>
            <div className={styles.label}>
              {buyxpModal === 0x0 && "1 Lootcoin = 10 XP"}
              {buyxpModal === 0x1 && "1 USD = 100 Lootcoin"}
            </div>
          </div>

          {buyxpModal === 0x0 ? (
            <div
              className={classNames(
                styles.formInput,
                focus[0x0] ? styles.focused : ""
              )}
            >
              <div className={styles.left}>
                <input
                  type="number"
                  placeholder="1"
                  ref={ltcRef}
                  onFocus={() => {
                    setFocus([true, false]);
                  }}
                  onChange={(e) => {
                    const inputVal = e.target.value.trim().replace(/,/g, "");
                    if (inputVal === "") {
                      xpRef.current && (xpRef.current.value = ""); // Clear XP field if LC field is empty
                    } else if (inputVal.match(/^[0-9\.]+$/)) {
                      const amount = Number(inputVal);
                      if (amount > 0) {
                        xpRef.current &&
                          (xpRef.current.value = String(LCtoXP(amount)));
                      }
                    } else {
                      // Show error if input is not empty and is invalid
                      toast.error("Invalid amount");
                    }
                  }}
                  onBlur={(e) => {
                    setFocus((p) => [false, p[0x1]]);
                    if (e.target.value) {
                      if (
                        String(e.target.value)
                          .trim()
                          .match(/^[0-9\,\.]+$/)
                      ) {
                        let amount = Number(
                          String(e.target.value).trim().replace(/,/g, "")
                        );

                        if (amount > 0) {
                          xpRef.current &&
                            (xpRef.current.value = String(LCtoXP(amount)));
                        }
                      } else {
                        toast.error("Invalid amount");
                      }
                    }
                  }}
                />
                <div className={styles.buttons}>
                  <button
                    className={styles.minusButton}
                    onClick={() => handleLTCDecrementOrIncrement("decrement")}
                  >
                    <span className={styles.text}>-</span>
                  </button>
                  <button
                    className={styles.plusButton}
                    onClick={() => handleLTCDecrementOrIncrement("increment")}
                  >
                    <span className={styles.text}>+</span>
                  </button>
                </div>
              </div>
              <div className={styles.right}>
                <LootCoin />
              </div>
            </div>
          ) : (
            // <div
            //   className={classNames(
            //     styles.formInput,
            //     focus[0x0] ? styles.focused : ""
            //   )}
            // >
            //   <div className={styles.left}>
            //     <input
            //       type="number"
            //       placeholder="10"
            //       ref={usdRef}
            //       onFocus={() => {
            //         setFocus([true, false]);
            //       }}
            //       onBlur={(e) => {
            //         setFocus((p) => [false, p[0x1]]);
            //         if (e.target.value) {
            //           if (
            //             String(e.target.value)
            //               .trim()
            //               .match(/^[0-9\,\.]+$/)
            //           ) {
            //             let amount = Number(
            //               String(e.target.value).trim().replace(/,/g, "")
            //             );

            //             if (amount > 0) {
            //               usdRef.current &&
            //                 (usdRef.current.value = amount.toString());
            //             }
            //           } else {
            //             toast.error("Invalid amount");
            //           }
            //         }
            //       }}
            //     />
            //   </div>
            //   <div className={styles.right}>
            //     <span>$</span>
            //   </div>
            // </div>

            <div
              className={classNames(
                styles.formInput,
                focus[0x0] ? styles.focused : ""
              )}
            >
              <div className={styles.left}>
                <input
                  type="number"
                  placeholder="1"
                  ref={usdRef}
                  onFocus={() => {
                    setFocus([true, false]);
                  }}
                  onChange={(e) => {
                    const inputVal = e.target.value.trim().replace(/,/g, "");
                    if (inputVal === "") {
                      ltcRef2.current && (ltcRef2.current.value = "");
                    } else if (inputVal.match(/^[0-9\.]+$/)) {
                      const amount = Number(inputVal);
                      if (amount > 0) {
                        ltcRef2.current &&
                          (ltcRef2.current.value = String(USDtoLC(amount)));
                      }
                    } else {
                      toast.error("Invalid amount");
                    }
                  }}
                  onBlur={(e) => {
                    setFocus((p) => [false, p[0x1]]);
                    if (e.target.value) {
                      if (
                        String(e.target.value)
                          .trim()
                          .match(/^[0-9\,\.]+$/)
                      ) {
                        let amount = Number(
                          String(e.target.value).trim().replace(/,/g, "")
                        );

                        if (amount > 0) {
                          ltcRef2.current &&
                            (ltcRef2.current.value = String(USDtoLC(amount)));
                        }
                      } else {
                        toast.error("Invalid amount");
                      }
                    }
                  }}
                />
                <div className={styles.buttons}>
                  <button
                    className={styles.minusButton}
                    onClick={() => handleUSDDecrementOrIncrement("decrement")}
                  >
                    <span className={styles.text}>-</span>
                  </button>
                  <button
                    className={styles.plusButton}
                    onClick={() => handleUSDDecrementOrIncrement("increment")}
                  >
                    <span className={styles.text}>+</span>
                  </button>
                </div>
              </div>
              <div className={styles.right}>
                <span>$</span>
              </div>
            </div>
          )}

          {buyxpModal === 0x0 ? (
            <>
              {/* <br /> */}
              <div className={styles.label}>To</div>{" "}
              <div
                className={classNames(
                  styles.formInput,
                  focus[0x1] ? styles.focused : ""
                )}
              >
                <div className={styles.left}>
                  <input
                    type="number"
                    placeholder="10"
                    ref={xpRef}
                    onFocus={() => {
                      setFocus([false, true]);
                    }}
                    onChange={(e) => {
                      const inputVal = e.target.value.trim().replace(/,/g, "");
                      if (inputVal === "") {
                        ltcRef.current && (ltcRef.current.value = "");
                      } else if (inputVal.match(/^[0-9\.]+$/)) {
                        const amount = Number(inputVal);
                        if (amount > 0) {
                          ltcRef.current &&
                            (ltcRef.current.value = String(XPtoLC(amount)));
                        }
                      } else {
                        // Show error if input is not empty and is invalid
                        toast.error("Invalid amount");
                      }
                    }}
                    onBlur={(e) => {
                      console.log("blur");
                      setFocus((p) => [p[0x0], false]);
                      if (e.target.value) {
                        if (
                          String(e.target.value)
                            .trim()
                            .match(/^[0-9\,\.]+$/)
                        ) {
                          let amount = Number(
                            String(e.target.value).trim().replace(/,/g, "")
                          );

                          if (amount > 0) {
                            ltcRef.current &&
                              (ltcRef.current.value = String(XPtoLC(amount)));
                          }
                        } else {
                          toast.error("Invalid amount");
                        }
                      }
                    }}
                  />
                  <div className={styles.buttons}>
                    <button
                      className={styles.minusButton}
                      onClick={() => handleXPDecrementOrIncrement("decrement")}
                    >
                      <span className={styles.text}>-</span>
                    </button>
                    <button
                      className={styles.plusButton}
                      onClick={() => handleXPDecrementOrIncrement("increment")}
                    >
                      <span className={styles.text}>+</span>
                    </button>
                  </div>
                </div>
                <div className={styles.right}>
                  <EXPIcon />
                  {/* <XPCoin /> */}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* <br /> */}
              <div className={styles.label}>To</div>{" "}
              <div
                className={classNames(
                  styles.formInput,
                  focus[0x1] ? styles.focused : ""
                )}
              >
                <div className={styles.left}>
                  <input
                    type="number"
                    placeholder="10"
                    ref={ltcRef2}
                    onFocus={() => {
                      setFocus([false, true]);
                    }}
                    onChange={(e) => {
                      const inputVal = e.target.value.trim().replace(/,/g, "");
                      if (inputVal === "") {
                        usdRef.current && (usdRef.current.value = "");
                      } else if (inputVal.match(/^[0-9\.]+$/)) {
                        const amount = Number(inputVal);
                        if (amount > 0) {
                          usdRef.current &&
                            (usdRef.current.value = String(LCtoUSD(amount)));
                        }
                      } else {
                        // Show error if input is not empty and is invalid
                        toast.error("Invalid amount");
                      }
                    }}
                    onBlur={(e) => {
                      console.log("blur");
                      setFocus((p) => [p[0x0], false]);
                      if (e.target.value) {
                        if (
                          String(e.target.value)
                            .trim()
                            .match(/^[0-9\,\.]+$/)
                        ) {
                          let amount = Number(
                            String(e.target.value).trim().replace(/,/g, "")
                          );

                          if (amount > 0) {
                            usdRef.current &&
                              (usdRef.current.value = String(LCtoUSD(amount)));
                          }
                        } else {
                          toast.error("Invalid amount");
                        }
                      }
                    }}
                  />
                  <div className={styles.buttons}>
                    <button
                      className={styles.minusButton}
                      onClick={() => handleLCDecrementOrIncrement("decrement")}
                    >
                      <span className={styles.text}>-</span>
                    </button>
                    <button
                      className={styles.plusButton}
                      onClick={() => handleLCDecrementOrIncrement("increment")}
                    >
                      <span className={styles.text}>+</span>
                    </button>
                  </div>
                </div>
                <div className={styles.right}>
                  <LootCoin />
                  {/* <XPCoin /> */}
                </div>
              </div>
            </>
          )}
          {/* <br /> */}
          <div className={`${styles.labelWrapper} ${styles.divider}`}>
            <div className={styles.label}>
              {/* {buyxpModal === 0x0 && "Available"} */}
              {"Available"}
            </div>
            <div className={styles.label}>
              {buyxpModal === 0x0 &&
                user &&
                `${formatPrice(user.lootCoinsBalance)} Lootcoin`}
              {buyxpModal === 0x1 &&
                user &&
                `${formatPrice(user.usdBalance)} USD`}
            </div>
          </div>
          <button
            className={classNames("primarybutton", styles.button)}
            onClick={() => handleConvert()}
          >
            {loading ? (
              <Loader radius={15} />
            ) : buyxpModal === 0x0 ? (
              "Buy EXP"
            ) : (
              "Buy LC"
            )}
          </button>
          <p>Deposit time takes about 15 minutes</p>
        </div>
      </div>
    </ModalOverlay>
  );
};
