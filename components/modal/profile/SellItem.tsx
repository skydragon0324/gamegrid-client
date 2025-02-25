import { ModalOverlay } from "../ModalOverlay";
import styles from "./mprofile.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import ExchangeIcon from "@/svgs/exchange.svg";
import DollarIcon from "@/svgs/dollar.svg";
import ArrowRightIcon from "@/svgs/arrow-right.svg";
import CrossIcon from "@/svgs/cross.svg";
import CopyIcon from "@/svgs/copy.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import {
  API_URL,
  depositCryptoEstimate,
  fetchAvailableCryptoWithdrawMethods,
  fetchInventory,
  sellItems,
  sellItemsCrypto,
  sellItemsCryptoEstimate,
  withdrawCryptoEstimate,
} from "@/utils/api.service";
import { imageURI } from "@/utils/colordetector";
import { formatPrice, handleErrorRequest } from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Tabs } from "@/components/tabs/Tabs";
import AsyncSelect from "react-select/async";
import classNames from "classnames";
import { AvailableCrypto, MainReducer } from "mredux/reducers/main.reducer";
import { reactSelectStyles } from "../wallet/selectstyles";
import {
  BasicNotification,
  WithDrawSuccessNotification,
} from "../notification/BasicNotification";
import Loader from "@/components/loader/Loader";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { renderCoinIcons } from "@/utils/renderCoin";

const tabs = ["Sell for Balance", "Sell for Crypto"];

interface IForm {
  cardNumber: string;
  validity: {
    month: string;
    year: string;
  };
  cvc: string;
  sum: number;
  amount: string;
  withdrawToken: string;
  withdrawAmount: string;
  withdrawAmountCrypto: string;
  withdrawAddress: string;
  depositToken: string;
}

interface CryptoOption {
  label: string;
  value: string;
}

export const SellItemModal = () => {
  // const [sellItemModalTab, setSelectedTab] = useState<number>(0x0);
  const [bsl, setBsl] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [withdrawAmountLoading, setWithdrawAmountLoading] =
    useState<boolean>(false);
  const [withdrawAssetId, setWithdrawAssetId] = useState<string>("");
  const [withdrawCurrencyRate, setWithdrawCurrencyRate] = useState<number>(0);
  const [withdrawCryptoAmount, setWithdrawCryptoAmount] = useState<number>(0);

  const withdrawAddressRef = useRef<HTMLInputElement>(null);

  const [errorInput, setErrorInput] = useState<{ type: string; msg: string }>({
    type: "",
    msg: "",
  });
  const [form, setForm] = useState<IForm>({
    cardNumber: "",
    validity: {
      month: "",
      year: "",
    },
    cvc: "",
    sum: 0,
    amount: "",
    withdrawToken: "",
    withdrawAmount: "",
    withdrawAmountCrypto: "",
    withdrawAddress: "",

    depositToken: "",
  });

  const lootgg_crypto_withdraw_enabled = useFeatureIsOn(
    "lootgg_crypto_withdraw_enabled"
  );

  const { inventory, cryptoPaymentsAvailable, user } = useSelector<
    StateInterface,
    MainReducer
  >((state) => state.mainReducer);

  const { sellItemModal, sellItemModalTab } = useSelector<
    StateInterface,
    ModalsReducer
  >((state) => state.modalsReducer);

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

  const [queries, setQueries] = useState({
    page: 0x0,
  });

  const fetchUserInventory = async () => {
    try {
      if (user) {
        const allInventoryItems = await fetchInventory(user.id, {
          size: 99999,
          page: String(queries.page),
        });

        updateMainState({
          inventory: allInventoryItems?.content,
          navbarInventory: allInventoryItems?.content,
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const promiseCryptoWithdrawOptions = async (inputValue: string) =>
    new Promise<CryptoOption[]>(async (resolve) => {
      try {
        const data = await fetchAvailableCryptoWithdrawMethods();
        console.log({ data });
        updateMainState({
          cryptoPaymentsAvailable: {
            ...cryptoPaymentsAvailable,
            withdraw: data,
          },
        });
        const filteredData = data.filter((crypto: AvailableCrypto) =>
          crypto.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const transformedData = filteredData.map((crypto: AvailableCrypto) => ({
          value: crypto.cryptoCode,
          label: crypto.name,
        }));
        resolve(transformedData);
      } catch (error) {
        // console.error("Error fetching data:", error);
        resolve([]);
      }
    });

  const convertAmountToBitcoin = (totalPrice: number) => {
    return parseFloat((totalPrice * 0.000023).toFixed(8));
  };

  const handleWithdrawCryptoChange = async (e: CryptoOption) => {
    try {
      setForm({
        ...form,
        withdrawToken: e.value,
      });
      setWithdrawAssetId(e.value);
      setErrorInput({ type: "", msg: "" });
      setWithdrawAmountLoading(true);

      const depositCryptoPayment = await withdrawCryptoEstimate({
        withdrawAmountInUSD:
          sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ?? 0x0,
        assetId: e.value,
      });

      if (depositCryptoPayment && depositCryptoPayment.amountReceivedInToken)
        setWithdrawCryptoAmount(depositCryptoPayment.amountReceivedInToken);
      // setWithdrawCurrencyRate(1 / depositCryptoPayment.amountReceivedInToken);

      setWithdrawAmountLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setWithdrawAmountLoading(false);
      toast.error(handleErrorRequest(error));
    }
  };

  const handlePriceChange = async () => {
    try {
      if (
        !form.withdrawToken ||
        sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) === 0
      )
        return;
      setWithdrawAmountLoading(true);

      const depositCryptoPayment = await withdrawCryptoEstimate({
        withdrawAmountInUSD:
          sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ?? 0x0,
        assetId: form.withdrawToken,
      });

      if (depositCryptoPayment && depositCryptoPayment.amountReceivedInToken)
        setWithdrawCryptoAmount(depositCryptoPayment.amountReceivedInToken);
      // setWithdrawCurrencyRate(1 / depositCryptoPayment.amountReceivedInToken);

      setWithdrawAmountLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setWithdrawAmountLoading(false);
    }
  };

  useEffect(() => {
    handlePriceChange();
  }, [sellItemModal]);

  const handleSellItems = async () => {
    try {
      if (!sellItemModal || sellItemModal.length <= 0) {
        throw new Error("No items selected");
      }

      setBsl(true);

      const ids = sellItemModal.map((l) => l.id);
      const totalBalance = sellItemModal.reduce(
        (a, b) => a + b.item.price,
        0x0
      );

      const res = await sellItems(ids);

      // console.log(res);

      if (user) {
        updateMainState({
          user: {
            ...user,
            usdBalance:
              user.usdBalance +
                // calculate total price of items
                sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ?? 0x0,
          },
        });
      }
      // setTimeout(() => {
      fetchUserInventory()
        .then(() => setBsl(false))
        .catch(() => setBsl(false));
      // }, 1000);

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

  const handleCryptoSellItems = async () => {
    try {
      if (!sellItemModal || sellItemModal.length <= 0) {
        throw new Error("No items selected");
      }

      const { withdrawToken, withdrawAddress } = form;
      if (!withdrawToken) {
        setErrorInput({
          type: "withdrawToken",
          msg: "Please select a token",
        });
        return;
      }

      if (!withdrawAddress) {
        setErrorInput({
          type: "withdrawAddress",
          msg: "Please enter a valid address",
        });
        return;
      }

      setLoading(true);

      const ids = sellItemModal.map((l) => l.id);

      const soldItemsEstimate = await sellItemsCryptoEstimate({
        userItemIds: ids,
        assetId: withdrawToken,
        oneTimeAddress: withdrawAddress,
      });

      console.log({ soldItemsEstimate });

      const soldItems = await sellItemsCrypto({
        userItemIds: ids,
        assetId: withdrawToken,
        oneTimeAddress: withdrawAddress,
      });

      // console.log({ soldItemsEstimate, soldItems });

      updateMainState({
        inventory: (inventory ?? []).filter((l) => !ids.includes(l.id)),
        navbarInventory: (inventory ?? []).filter((l) => !ids.includes(l.id)),
      });

      if (soldItems === "PENDING") {
        updateModalsState({
          notificationModal: {
            type: "success",
            children: (
              <WithDrawSuccessNotification
                amountInUSD={soldItemsEstimate.amountInUSD}
                amountInToken={soldItemsEstimate.estimatedTotalInToken}
                estimatedFeeInToken={soldItemsEstimate.estimatedFeeInToken}
                currencyIcon={withdrawToken}
              />
            ),
          },
        });
      } else if (soldItems !== "PENDING") {
        updateModalsState({
          notificationModal: {
            type: "error",
            children: (
              <BasicNotification
                title="Withdraw failed"
                message="Seems like something went wrong with your withdraw. Please try again or contact support."
                leftbutton={{ text: "View History", callback: () => {} }}
                rightButton={{ text: "Try Again", callback: () => {} }}
              />
            ),
          },
        });
      } else {
        updateModalsState({
          notificationModal: {
            type: "warning",
            children: (
              <BasicNotification
                title="Complete Your Verification"
                message="To continue, we need a bit more information about you. Completing your Know Your Customer (KYC) verification helps us ensure the security of your account and comply with regulatory requirements. This is a one-time process and typically takes just a few minutes."
                leftbutton={{ text: "Cancel", callback: () => {} }}
                rightButton={{ text: "Verify Account", callback: () => {} }}
              />
            ),
          },
        });
      }
      setLoading(false);
      closeModal();
    } catch (error) {
      setLoading(false);
      toast.error(handleErrorRequest(error));
    }
  };

  const closeModal = () => {
    if (!loading) {
      setForm({
        cardNumber: "",
        validity: {
          month: "",
          year: "",
        },
        cvc: "",
        sum: 0,
        amount: "",
        withdrawToken: "",
        withdrawAmount: "",
        withdrawAmountCrypto: "",
        withdrawAddress: "",

        depositToken: "",
      });
      setErrorInput({ type: "", msg: "" });
      setWithdrawAssetId("");
      setWithdrawCurrencyRate(0);
      setWithdrawCryptoAmount(0);

      updateModalsState({
        sellItemModal: null,
      });

      setTimeout(() => {
        // setSelectedTab(0x0);
        updateModalsState({
          sellItemModalTab: 0x0,
        });
      }, 500);
    } else {
      toast.error("Please wait until the transaction is complete");
    }
  };

  return (
    <ModalOverlay
      isOpened={!!(sellItemModal && sellItemModal.length > 0)}
      className={styles.sellItemModal}
      onClose={closeModal}
    >
      <div className={styles.header}>
        <h1>SELL ITEMS</h1>
        <button
          className={styles.closebutton}
          onClick={closeModal}
          // disabled={loading}
        >
          <CrossIcon />
        </button>
      </div>

      <br />

      <Tabs
        tabs={tabs}
        activeTab={tabs[sellItemModalTab]}
        setActiveTab={(_: string, index?: number) => {
          if (index === 0x1 && !lootgg_crypto_withdraw_enabled) {
            toast.error("This feature is not available yet");
            return;
          }
          updateModalsState({
            sellItemModalTab: index ?? 0x0,
          });
        }}
      />
      <br />

      <div className={styles.contentItems}>
        {sellItemModal?.map((item, i) => (
          <div className={styles.item} key={i}>
            <div className={styles.left}>
              <div className={styles.image}>
                <Image
                  src={
                    item.item.images.length
                      ? item.item.images[0]?.url
                      : imageURI(item.item.id, "item") ?? ""
                  }
                  alt="item"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.info}>
                <h2>{item.item.name}</h2>
                <p>Razer</p>
              </div>
            </div>

            <div className={styles.right}>
              <span>${formatPrice(item.item.price)}</span>
            </div>
          </div>
        ))}
      </div>
      <br />
      {sellItemModalTab === 0x1 && (
        <form>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>Select token</span>
              {(errorInput.type === "withdrawToken" && (
                <>
                  -<span className={styles.error}>{errorInput.msg}</span>
                </>
              )) ||
                null}
            </div>
            <AsyncSelect
              onChange={(e) => handleWithdrawCryptoChange(e as CryptoOption)}
              //   {
              //   setForm({
              //     ...form,
              //     withdrawToken: (e as { value: string })?.value || "",
              //   });
              //   setErrorInput({ type: "", msg: "" });
              // }}
              cacheOptions
              defaultOptions
              loadOptions={promiseCryptoWithdrawOptions}
              loadingMessage={() => "Loading..."}
              className={styles.cryptoSelect}
              formatOptionLabel={(option) => (
                <div className={styles.cryptoOption}>
                  <div className={styles.cryptoIcon}>
                    {renderCoinIcons(
                      (option as { value: string }).value,
                      (cryptoPaymentsAvailable.withdraw ?? []).find(
                        (crypto) =>
                          crypto.cryptoCode ===
                          (option as { value: string }).value
                      )?.currencyIconUrl
                    )}
                  </div>
                  <span>{(option as { label: string }).label}</span>
                </div>
              )}
              components={{
                IndicatorSeparator: () => null,
              }}
              styles={reactSelectStyles}
            />
          </div>
          <div className={styles.withdrawalAmountContainer}>
            <div className={styles.formWrapper}>
              <div className={styles.formInput}>
                <div className={styles.label}>
                  <span>Withdrawal amount</span>
                  {(errorInput.type === "cardname" && (
                    <>
                      -<span className={styles.error}>{errorInput.msg}</span>
                    </>
                  )) ||
                    null}
                </div>
                <div className={styles.amountWrapper}>
                  <DollarIcon />
                  <span className={styles.amountText}>
                    {sellItemModal
                      ?.reduce((a, b) => a + b.item.price, 0x0)
                      .toFixed(2) ?? 0x0}
                  </span>
                  {/* <span className={styles.amountIconDollar}>$</span> */}
                </div>
              </div>
            </div>
            {withdrawCurrencyRate !== 0 && (
              <div className={styles.equalsContainer}>
                <ArrowRightIcon />
                {/* <span className={styles.equalsText}>=</span> */}
              </div>
            )}
            <div className={styles.formWrapper}>
              <div className={styles.formInput}>
                <div className={`${styles.label} ${styles.hiddenLabel}`}>
                  <span style={{ visibility: "hidden" }}>-</span>
                  {(errorInput.type === "cardname" && (
                    <>
                      -<span className={styles.error}>{errorInput.msg}</span>
                    </>
                  )) ||
                    null}
                </div>
                <div className={styles.amountWrapper}>
                  {withdrawAmountLoading ? (
                    <Loader radius={15} />
                  ) : (
                    <span className={styles.amountIcon}>
                      {cryptoPaymentsAvailable.withdraw &&
                        renderCoinIcons(
                          cryptoPaymentsAvailable.withdraw.find(
                            (crypto) => crypto.cryptoCode === form.withdrawToken
                          )?.cryptoCode ?? "",
                          cryptoPaymentsAvailable.withdraw.find(
                            (crypto) => crypto.cryptoCode === form.withdrawToken
                          )?.currencyIconUrl
                        )}
                    </span>
                  )}
                  <span className={styles.amountText}>
                    {!withdrawAmountLoading &&
                      withdrawCryptoAmount !== 0 &&
                      withdrawCryptoAmount}
                    {/* withdrawCurrencyRate !== 0 &&
                      (sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ??
                        0x0) * withdrawCurrencyRate} */}
                  </span>
                  {/* <span className={styles.amountIcon}>
                    <BitcoinIcon />
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contentSell}>
            <p>
              {/* Minimum withdrawal amount is 2.55$. Your deposit will have 1.5$
              remaining <br /> balance to cover the fee required to process the
              transaction. The deposit time takes about 15 minutes */}
              {/* Minimum withdrawal amount is 2.55$. Your will have a remaining
              balance of{" "}
              {user?.usdBalance &&
                (
                  user?.usdBalance -
                  (sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ??
                    0x0)
                ).toFixed(2)}
              . The withdraw time takes about 15 minutes. */}
              Minimum withdrawal amount is $10.00. You'll be charged a network
              fee. The withdraw time takes about 15 minutes.
            </p>
          </div>

          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>Your address</span>
              {(errorInput.type === "withdrawAddress" && (
                <>
                  -<span className={styles.error}>{errorInput.msg}</span>
                </>
              )) ||
                null}
            </div>
            <input
              type="text"
              ref={withdrawAddressRef}
              className={styles.input}
              onChange={(e) => {
                setForm({
                  ...form,
                  withdrawAddress: e.target.value,
                });
                setErrorInput({ type: "", msg: "" });
              }}
              placeholder="Enter your address"
            />
          </div>
        </form>
      )}
      <div className={styles.contentSell}>
        <div className={styles.divider}>
          <span>You'll get</span>
          {sellItemModalTab === 0x0 ? (
            <span className={styles.green}>
              ${" "}
              {formatPrice(
                sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ?? 0x0
              )}
            </span>
          ) : (
            <span className={styles.green}>
              {/* {(sellItemModal?.reduce((a, b) => a + b.item.price, 0x0) ?? 0x0) *
                withdrawCurrencyRate}{" "} */}
              {withdrawCryptoAmount}{" "}
              {cryptoPaymentsAvailable.withdraw &&
                cryptoPaymentsAvailable.withdraw
                  .find((crypto) => crypto.cryptoCode === form.withdrawToken)
                  ?.cryptoCode.split("_")[0]}{" "}
            </span>
          )}
        </div>
        <button
          className={styles.submitButton}
          disabled={bsl || loading}
          onClick={
            sellItemModalTab === 0x0 ? handleSellItems : handleCryptoSellItems
          }
        >
          {loading || bsl ? (
            <Loader radius={18} centered />
          ) : (
            <div>Sell {sellItemModal?.length ?? "--"} Item</div>
          )}
        </button>
      </div>
    </ModalOverlay>
  );
};
