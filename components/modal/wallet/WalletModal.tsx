import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./wallet.module.scss";
import CopyIcon from "@/svgs/copy.svg";
import CrossIcon from "@/svgs/cross.svg";
import BitcoinIcon from "@/svgs/btc.svg";
import EthereumIcon from "@/svgs/eth.svg";
import LiteIcon from "@/svgs/ltc.svg";
import ExchangeIcon from "@/svgs/exchange.svg";
import DollarIcon from "@/svgs/dollar.svg";
import ArrowRightIcon from "@/svgs/arrow-right.svg";
import PlusCircleIcon from "@/svgs/pluscircle.svg";
import MinusCircleIcon from "@/svgs/minus-circle.svg";
import ArrowTop from "@/svgs/arrow-top.svg";
import { ModalOverlay } from "../ModalOverlay";
import classNames from "classnames";
import SparklesIcon from "@/svgs/sparkles.svg";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { toast } from "react-hot-toast";
import { formatPrice, handleErrorRequest } from "utils/handler";
import {
  checkPromoCode,
  coastalPayRequest,
  confirmStripePayment,
  depositCryptoEstimate,
  fetchAvailableCryptoDepositMethods,
  fetchAvailableCryptoWithdrawMethods,
  fetchAvailablePromoCodes,
  fetchInventory,
  redeemPromoCode,
  sellItemsCrypto,
  sellItemsCryptoEstimate,
  startStripePayment,
  withdrawCryptoEstimate,
} from "utils/api.service";
import { AvailableCrypto, MainReducer } from "mredux/reducers/main.reducer";
import Loader from "@/components/loader/Loader";
import QRCode from "react-qr-code";
import { useWindowSize } from "@/hooks/windowSize";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeCardNumberElement } from "@stripe/stripe-js";
import { Dropdown } from "@/components/dropdown/dropdown";
import Image from "next/image";
import { imageURI } from "@/utils/colordetector";
import {
  BasicNotification,
  WithDrawSuccessNotification,
} from "../notification/BasicNotification";
import { reactSelectStyles } from "./selectstyles";
import { useRouter } from "next/router";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import useRudderStackAnalytics from "@/utils/rudderstack";
import { renderCoinIcons } from "@/utils/renderCoin";

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
  promoCode?: string;
}

interface CryptoOption {
  label: string;
  value: string;
}

export const tabs = ["Deposit", "Withdraw"];

const DepositTypes = ["BANK_CARD", "CRYPTOCURRENCY"];

export const WalletModal: FC = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const lootgg_withdraw_enabled = useFeatureIsOn("lootgg_withdraw_enabled");
  const lootgg_deposit_enabled = useFeatureIsOn("lootgg_deposit_enabled");
  const lootgg_email_verified_enabled = useFeatureIsOn(
    "lootgg_email_verified_enabled"
  );

  const { user, cryptoPaymentsAvailable, inventory, currentStripeKey } =
    useSelector<StateInterface, MainReducer>((state) => state.mainReducer);

  const { width } = useWindowSize();
  const dispatch = useDispatch<Dispatch<MainReducer>>();
  const dispatchModals = useDispatch<Dispatch<ModalsReducer>>();
  const { walletModal, walletTab, notificationModal } = useSelector<
    StateInterface,
    ModalsReducer
  >((state) => state.modalsReducer);

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: "UPDATE_MAIN_STATE",
      payload,
    });
  };

  const updateModalState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: "UPDATE_MODALS_STATE",
      payload,
    });
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTypeI, setSelectedTypeI] = useState<number>(0x0);
  const [showCouponInput, setShowCouponInput] = useState<boolean>(false);
  const [cardNumberError, setCardNumberError] = useState<string>("");
  const [cardExpiryError, setCardExpiryError] = useState<string>("");
  const [cardCvcError, setCardCvcError] = useState<string>("");
  const [sortIndex, setSortIndex] = useState(0);
  const [selectAll, setSellectAll] = useState<boolean>(false);
  const [inventoryCheckBoxes, setInCb] = useState<Record<string, boolean>>({});
  const [promoLoading, setPromoLoading] = useState<boolean>(false);
  const [assetId, setAssetId] = useState<string>("");
  const [withdrawAssetId, setWithdrawAssetId] = useState<string>("");
  const [currencyReverseRate, setCurrencyReverseRate] = useState<number>(0);

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
    promoCode: "",
  });

  const [errorInput, setErrorInput] = useState<{ type: string; msg: string }>({
    type: "",
    msg: "",
  });

  const analytics = useRudderStackAnalytics();
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const withdrawAddressRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<HTMLInputElement>(null);
  const [sum, setSum] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [promoReplenishment, setPromoReplenishment] = useState({
    type: "",
    value: 0,
  });
  const [withdrawAmountLoading, setWithdrawAmountLoading] =
    useState<boolean>(false);
  const [withdrawCurrencyRate, setWithdrawCurrencyRate] = useState<number>(0);
  const [withdrawCryptoAmount, setWithdrawCryptoAmount] = useState<number>(0);

  const usdInputRef = useRef<HTMLInputElement | null>(null);
  const cryptoDepositRef = useRef<HTMLInputElement | null>(null);
  const promoCodeRef = useRef<HTMLInputElement | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const [qrCodeAddress, setQrCodeAddress] = useState<string>("");

  const getUsdAmountFromCrypto = async (assetId: string, amount: string) => {
    try {
      console.log({ assetId, amount });
      const depositCryptoPayment = await depositCryptoEstimate({
        depositAmount: parseFloat(amount),
        assetId: assetId,
      });
      console.log({ depositCryptoPayment });

      return depositCryptoPayment.amountReceivedInUSD.toFixed(2).toString();
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const positiveNumberRegex = /^\d+(\.\d+)?$/;

  const handleUsdChange = async () => {
    if (usdInputRef.current && cryptoDepositRef.current) {
      const usdValue = usdInputRef.current.value;
      if (usdValue === "") {
        cryptoDepositRef.current.value = "";
        return;
      }

      if (positiveNumberRegex.test(usdValue) || usdValue === "") {
        const coin =
          usdValue === "" ? "" : parseFloat(usdValue) * currencyReverseRate;
        cryptoDepositRef.current.value = coin.toString();
      }
    }
  };

  function debounce(
    func: (...args: any[]) => Promise<void>,
    delay: number
  ): () => void {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const [conversionLoading, setConversionLoading] = useState<boolean>(false);
  const handleCryptoDepostiAmountChange = debounce(async () => {
    try {
      if (cryptoDepositRef.current && usdInputRef.current) {
        const cryptoDepositValue = cryptoDepositRef.current.value;
        if (cryptoDepositValue === "") {
          usdInputRef.current.value = "";
          return;
        }
        usdInputRef.current.value = "";
        setConversionLoading(true);
        if (positiveNumberRegex.test(cryptoDepositValue)) {
          const usd = await getUsdAmountFromCrypto(assetId, cryptoDepositValue);
          usdInputRef.current.value = usd || "";
        }
        setConversionLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      setConversionLoading(false);
      toast.error(handleErrorRequest(error));
    }
  }, 500);

  const convertAmountToBitcoin = (rate: number) => {
    return parseFloat((totalPrice * rate).toFixed(8));
  };

  useEffect(() => {
    const newTotalPrice = Object.keys(inventoryCheckBoxes).reduce(
      (acc, key) => {
        if (inventoryCheckBoxes[key]) {
          return (
            acc +
            parseFloat(
              inventory?.find((l) => l.id === key)?.item.price.toString() ?? ""
            )
          );
        }
        return acc;
      },
      0
    );
    setTotalPrice(newTotalPrice);
  }, [inventoryCheckBoxes]);

  const setTab = (index: number) => {
    dispatchModals({
      type: "UPDATE_MODALS_STATE",
      payload: {
        walletTab: index,
      },
    });
  };

  const promiseCryptoWithdrawOptions = async (inputValue: string) =>
    new Promise<CryptoOption[]>(async (resolve) => {
      try {
        const data = await fetchAvailableCryptoWithdrawMethods();

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

  const promiseCryptoDepositOptions = async (inputValue: string) =>
    new Promise<CryptoOption[]>(async (resolve) => {
      try {
        const data = await fetchAvailableCryptoDepositMethods();
        updateMainState({
          cryptoPaymentsAvailable: {
            ...cryptoPaymentsAvailable,
            deposit: data,
          },
        });
        console.log({ data });
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

  const cardElementStyle = {
    base: {
      fontSize: "14px",
      color: "#fff",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "normal",
      backgroundColor: "#0d0b14",
      "::placeholder": {
        color: "#5F586A",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  };

  const sumButtons = [
    { text: "$ 5.0", value: 5 },
    { text: "$ 10.0", value: 10 },
    { text: "$ 15.0", value: 15 },
    { text: "$ 25.0", value: 25 },
  ];

  const closeModal = () => {
    if (!loading) {
      setLoading(false);
      setSum("");
      setCardNumberError("");
      setCardExpiryError("");
      setCardCvcError("");
      setQrCodeAddress("");
      setShowCouponInput(false);
      setTotalPrice(0);
      setInCb({});
      setPromoReplenishment({ type: "", value: 0 });
      setAssetId("");
      setWithdrawAssetId("");
      setCurrencyReverseRate(0);
      setWithdrawCurrencyRate(0);
      setWithdrawCryptoAmount(0);
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
        promoCode: "",
      });
      setErrorInput({
        type: "",
        msg: "",
      });
      dispatchModals({
        type: "UPDATE_MODALS_STATE",
        payload: {
          walletModal: false,
        },
      });

      setTimeout(() => {
        setTab(0x0);
      }, 500);
    } else {
      toast.error("Please wait for the process to complete");
    }
  };

  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const handleDepositCryptoChange = async (e: CryptoOption) => {
    try {
      setForm({
        ...form,
        depositToken: e.value,
      });
      setAssetId(e.value);
      setErrorInput({ type: "", msg: "" });
      setQrCodeAddress("");
      // change the crypro and usd value to 0
      if (cryptoDepositRef.current && usdInputRef.current) {
        cryptoDepositRef.current.value = "";
        usdInputRef.current.value = "";
      }
      setAddressLoading(true);

      const depositCryptoPayment = await depositCryptoEstimate({
        depositAmount: 1,
        assetId: e.value,
      });

      if (depositCryptoPayment && depositCryptoPayment.amountReceivedInUSD)
        setCurrencyReverseRate(1 / depositCryptoPayment.amountReceivedInUSD);

      if (depositCryptoPayment && depositCryptoPayment.vaultAsset) {
        setQrCodeAddress(depositCryptoPayment.vaultAsset.address);
        toast.success("Address generated successfully");
      } else {
        setQrCodeAddress("");
        toast.error("Something went wrong, unable to get the address");
      }
      setAddressLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setAddressLoading(false);
      toast.error(handleErrorRequest(error));
    }
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
        withdrawAmountInUSD: totalPrice,
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
      if (!form.withdrawToken || totalPrice === 0) return;
      setWithdrawAmountLoading(true);

      const depositCryptoPayment = await withdrawCryptoEstimate({
        withdrawAmountInUSD: totalPrice,
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
  }, [totalPrice]);

  const copyInputContent = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.select();
      document.execCommand("copy");
      toast.success("Copied to clipboard");
    }
  };
  const handlePromotionCode = async () => {
    try {
      const { promoCode } = form;
      if (!promoCodeRef.current || !promoCode || promoCode === "") return;
      setPromoLoading(true);
      const res = await checkPromoCode(promoCode);

      if (res.value && res.value > 0) {
        analytics &&
          analytics.track("PROMOTION_CODE", {
            code: promoCode,
            value: res.value,
          });

        setPromoReplenishment({
          type: res.promotionCodeType,
          value: res.value,
        });
        setErrorInput({ type: "", msg: "" });
        setPromoLoading(false);
        return;
      }
    } catch (e) {
      setErrorInput({
        type: "promoCode",
        msg: "Invalid promotion code",
      });
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (walletTab === 0x0) {
        // if (selectedTypeI === 0x0) {
        // if (!stripe || !elements) {
        //   return;
        // }

        const { amount, promoCode } = form;

        if (
          !amount ||
          parseFloat(amount) < 2 ||
          isNaN(parseFloat(amount)) ||
          amount === ""
        ) {
          amountRef.current?.focus();
          setErrorInput({
            type: "amount",
            msg: "Invalid amount, please enter amount greater than 2$",
          });
          return;
        }

        setErrorInput({
          type: "",
          msg: "",
        });

        setLoading(true);

        const reqLinkCoastal = await coastalPayRequest({
          returnUrl: window.location.origin,
          amount: parseFloat(amount),
        });

        if (reqLinkCoastal && reqLinkCoastal?.success) {
          window.location.href = reqLinkCoastal.url;
        }
        // console.log("current used", { currentStripeKey });
        // const startPayment = await startStripePayment({
        //   amount: parseFloat(amount),
        //   currency: "USD",
        //   promotionCode: promoCode === "" ? undefined : promoCode,
        //   stripeAccountId: Number(currentStripeKey?.stripePaymentAccountId),
        // });

        // if (!startPayment.success || !startPayment.referenceId) {
        //   console.log("error: ", startPayment.message, startPayment);
        //   if (
        //     !startPayment.nextStripeAccountId ||
        //     !startPayment.stripePublishableKey
        //   ) {
        //     updateMainState({
        //       stripeDepositDisabled: true,
        //     });
        //     closeModal();
        //     toast.error("Unable to complete the payment");

        //     return;
        //   }
        //   console.log("here change key");
        //   const newKey = {
        //     stripePaymentAccountId: startPayment?.nextStripeAccountId,
        //     stripePublishableKey: startPayment?.stripePublishableKey,
        //   };
        //   updateMainState({
        //     currentStripeKey: newKey,
        //   });
        //   // localStorage.setItem("stripeKey", JSON.stringify(newKey));
        //   closeModal();
        //   toast.error("Please try again. We have changed the payment limit.");
        //   // router.reload()
        //   return;
        // }

        // const cardElement: StripeCardNumberElement | null =
        //   elements.getElement(CardNumberElement);

        // if (!cardElement) return;

        // const { error: stripeError, paymentIntent } =
        //   await stripe.confirmCardPayment(
        //     startPayment.paymentIntent.clientSecret,
        //     {
        //       payment_method: {
        //         card: cardElement,
        //         billing_details: {
        //           name: `${user?.firstName} ${user?.lastName}`,
        //         },
        //       },
        //     }
        //   );

        // if (stripeError) {
        //   throw new Error("Invalid card details.");
        // }

        // const confirmPayment = await confirmStripePayment({
        //   paymentIntentId: paymentIntent.id,
        //   referenceId: startPayment.referenceId,
        // });

        // if (confirmPayment.success) {
        //   // toast.success("Payment completed successfully");
        //   analytics &&
        //     analytics.track("DEPOSIT", {
        //       amount: parseFloat(amount),
        //       type: "USD",
        //     });

        //   updateModalState({
        //     notificationModal: {
        //       type: "success",
        //       children: (
        //         <BasicNotification
        //           title="Deposit Successful"
        //           message="Your request has been confirmed. You can track its progress on the transaction history page."
        //           leftbutton={{
        //             text: "Buy Cases",
        //             callback: () => {
        //               updateModalState({
        //                 notificationModal: null,
        //               });
        //               router.push("/");
        //             },
        //           }}
        //           rightButton={{
        //             text: "View History",
        //             callback: () => {
        //               updateModalState({
        //                 notificationModal: null,
        //               });
        //               router.push("/profile/transactions");
        //             },
        //           }}
        //         />
        //       ),
        //     },
        //   });
        //   if (user) {
        //     updateMainState({
        //       user: {
        //         ...user,
        //         usdBalance: user.usdBalance + parseFloat(amount),
        //       },
        //     });
        //   }
        // } else {
        //   // toast.error("Unable to complete the payment");
        //   updateModalState({
        //     notificationModal: {
        //       type: "error",
        //       children: (
        //         <BasicNotification
        //           title="Deposit failed"
        //           message="Seems like something went wrong with your deposit. Please try again or contact support."
        //           leftbutton={{
        //             text: "View History",
        //             callback: () => {
        //               updateModalState({
        //                 notificationModal: null,
        //               });
        //               router.push("/profile/transactions");
        //             },
        //           }}
        //           rightButton={{
        //             text: "Try Again",
        //             callback: () => {
        //               updateModalState({
        //                 notificationModal: null,
        //               });
        //             },
        //           }}
        //         />
        //       ),
        //     },
        //   });
        // }
        // } else if (selectedTypeI === 0x1) {
        // TODO: To be implemented after MVP
        // }
      } else {
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

        if (totalPrice <= 0) {
          toast.error("Please select at least one item");
          return;
        }

        const selectedItems = Object.keys(inventoryCheckBoxes).filter(
          (key) => inventoryCheckBoxes[key]
        );

        if (!selectedItems.length) return;

        setLoading(true);

        const soldItemsEstimate = await sellItemsCryptoEstimate({
          userItemIds: selectedItems,
          assetId: withdrawToken,
          oneTimeAddress: withdrawAddress,
        });

        const soldItems = await sellItemsCrypto({
          userItemIds: selectedItems,
          assetId: withdrawToken,
          oneTimeAddress: withdrawAddress,
        });

        if (soldItems === "PENDING") {
          analytics &&
            analytics.track("WITHDRAWAL", {
              amount: totalPrice,
              type: "USD",
              status: "PENDING",
            });

          console.log({ soldItemsEstimate });

          updateModalState({
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
          analytics &&
            analytics.track("WITHDRAWAL", {
              amount: totalPrice,
              type: "USD",
              status: "SUCCESS",
            });

          updateModalState({
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
          updateModalState({
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

        updateMainState({
          inventory: (inventory ?? []).filter(
            (l) => !selectedItems.includes(l.id)
          ),
        });
      }

      closeModal();
    } catch (error) {
      setLoading(false);
      toast.error(handleErrorRequest(error));
    }
  };

  const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    if (input !== "0") {
      input = input.replace(/^0+/, "");
    }

    if (input.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      setForm({
        ...form,
        amount: input,
      });
      setSum(input);
      setErrorInput({ type: "", msg: "" });
    }
  };

  const handleAddAmountToSum = (amount: number) => {
    const total = (parseFloat(sum) || 0) + amount;
    setSum(total.toString());
    setForm({
      ...form,
      amount: total.toString(),
    });
    setErrorInput({ type: "", msg: "" });
  };

  const options = [
    { value: "bitcoin", label: "Bitcoin", icon: BitcoinIcon },
    { value: "ethereum", label: "Ethereum", icon: EthereumIcon },
    { value: "tether", label: "Tether", icon: LiteIcon },
  ];

  const itemOptions = [
    { value: "xs", Label: "XS" },
    { value: "s", Label: "S" },
    { value: "m", Label: "M" },
    { value: "l", Label: "L" },
    { value: "xl", Label: "XL" },
  ];

  const handleSelectAll = () => {
    setSellectAll((m) => {
      const u = !m;

      !u && setInCb({});
      u &&
        inventory &&
        setInCb(
          Object.assign(
            {},
            ...inventory.map((item, i) => ({
              [item.id]: true,
            }))
          )
        );
      return u;
    });
  };

  return (
    <ModalOverlay
      isOpened={walletModal}
      onClose={() => closeModal()}
      className={styles.authmodal}
    >
      <div className={styles.header}>
        <h1>Wallet</h1>
        <button
          className={styles.closebutton}
          onClick={() => closeModal()}
          disabled={loading || addressLoading}
        >
          <CrossIcon />
        </button>
      </div>

      <div className={styles.switcher}>
        {tabs.map((item, index) => (
          <button
            onClick={() => {
              if (!loading) {
                if (index === 0x0 && !lootgg_deposit_enabled) {
                  toast.error("Deposits are disabled");
                  return;
                }
                if (index === 0x1 && !lootgg_withdraw_enabled) {
                  toast.error("Withdraws are disabled");
                  return;
                }
                // if (index === 0x1 && (!inventory || inventory?.length === 0)) {
                //   toast.error("You don't have any items to withdraw");
                //   return;
                // }
                setTab(index);
              }
            }}
            disabled={loading}
            className={classNames(
              styles.swbutton,
              index === walletTab && styles.active
            )}
            key={index}
          >
            <span>{item}</span>
          </button>
        ))}
      </div>
      {(walletTab === 0x0 && (
        <>
          <div className={styles.types}>
            {DepositTypes.map((item, i) => (
              <button
                className={classNames(
                  styles.typetab,
                  i === selectedTypeI && styles.active
                )}
                key={i}
                onClick={() => setSelectedTypeI(i)}
              >
                {item.toLowerCase().replace(/_/g, " ")}
              </button>
            ))}
          </div>
          {selectedTypeI === 0x0 && (
            <>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* <div className={styles.formInput}>
                  <div className={styles.label}>
                    <span>Card number</span>
                    {(cardNumberError !== "" && (
                      <>
                        -<span className={styles.error}>{cardNumberError}</span>
                      </>
                    )) ||
                      null}
                  </div>
                  <div className={styles.cardNumberWrapper}>
                    <CardNumberElement
                      onChange={(event) => {
                        if (event.error) {
                          setCardNumberError(event.error.message);
                        } else {
                          setCardNumberError("");
                        }
                      }}
                      options={{
                        showIcon: true,
                        style: cardElementStyle,
                      }}
                    />
                  </div>
                </div> */}

                {/* <div className={styles.validityCodeContainer}>
                  <div className={styles.formInput}>
                    <div className={styles.label}>
                      <span>Validity</span>
                      {(cardExpiryError !== "" && (
                        <>
                          -
                          <span className={styles.error}>
                            {cardExpiryError}
                          </span>
                        </>
                      )) ||
                        null}
                    </div>
                    <div className={styles.cardElementWrapper}>
                      <CardExpiryElement
                        onChange={(event) => {
                          if (event.error) {
                            setCardExpiryError(event.error.message);
                          } else {
                            setCardExpiryError("");
                          }
                        }}
                        options={{ style: cardElementStyle }}
                      />
                    </div>
                  </div>
                  <div className={styles.formInput}>
                    <div className={styles.label}>
                      <span>Code</span>
                      {(cardCvcError !== "" && (
                        <>
                          -<span className={styles.error}>{cardCvcError}</span>
                        </>
                      )) ||
                        null}
                    </div>
                    <div className={styles.cardElementWrapper}>
                      <CardCvcElement
                        onChange={(event) => {
                          if (event.error) {
                            setCardCvcError(event.error.message);
                          } else {
                            setCardCvcError("");
                          }
                        }}
                        options={{ style: cardElementStyle }}
                      />
                    </div>
                  </div>
                </div> */}

                <div className={styles.formInput}>
                  <div className={styles.label}>
                    <span>Amount</span>
                    <span className={styles.inputInfo}>
                      (Minimum deposit amount - $2.00)
                    </span>
                    {(errorInput.type === "amount" && (
                      <>
                        -<span className={styles.error}>{errorInput.msg}</span>
                      </>
                    )) ||
                      null}
                  </div>
                  <input
                    type="number"
                    ref={amountRef}
                    value={sum}
                    className={styles.input}
                    placeholder="Enter amount"
                    onChange={handleSumChange}
                  />
                </div>

                <div className={styles.sumButtons}>
                  {sumButtons.map((item, i) => (
                    <button
                      className={styles.sumButton}
                      type="button"
                      key={i}
                      onClick={() => handleAddAmountToSum(item.value)}
                    >
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
                <div className={styles.couponContainer}>
                  {!showCouponInput && (
                    <a
                      href="#"
                      className={styles.couponLink}
                      onClick={() => setShowCouponInput(true)}
                    >
                      <span className={styles.couponText}>
                        {" "}
                        Do you have promocode?{" "}
                      </span>
                    </a>
                  )}
                  {showCouponInput && (
                    <div className={styles.formInput}>
                      <div className={styles.label}>
                        <span>Coupon</span>
                        {(errorInput.type === "promoCode" && (
                          <>
                            -
                            <span className={styles.error}>
                              {errorInput.msg}
                            </span>
                          </>
                        )) ||
                          null}
                      </div>
                      <div
                        className={`${styles.promoHolder}`}
                        style={
                          promoReplenishment.value > 0
                            ? {
                                border: "1px solid #3CCB7F",
                                borderRadius: "12px",
                              }
                            : errorInput.type === "promoCode"
                              ? {
                                  border: "1px solid #F04438",
                                  borderRadius: "12px",
                                }
                              : undefined
                        }
                      >
                        <input
                          type="text"
                          ref={promoCodeRef}
                          className={styles.input}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              promoCode: e.target.value,
                            });
                            setErrorInput({ type: "", msg: "" });
                          }}
                          placeholder="Enter coupon"
                        />
                        <button
                          type="button"
                          className={styles.promoButton}
                          onClick={handlePromotionCode}
                        >
                          {promoLoading ? "Loading" : "Submit"}
                        </button>
                      </div>
                      {promoReplenishment.value > 0 && (
                        <div className={styles.couponReplenishment}>
                          <SparklesIcon />
                          <span className={styles.replenishmentText}>
                            {promoReplenishment.value}{" "}
                            {promoReplenishment.type === "PERCENTAGE" && "%"} to
                            balance replenishment
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader radius={18} centered />
                  ) : (
                    <div className={styles.submitIconButton}>
                      <div className={styles.iconContainer}>
                        <PlusCircleIcon />
                      </div>
                      <span>Deposit</span>
                    </div>
                  )}
                </button>
                <div className={styles.depositInfo}>
                  <span className={styles.depositInfoText}>
                    Deposit time takes about 15 minutes
                  </span>
                </div>
              </form>
            </>
          )}
          {selectedTypeI === 0x1 && (
            <>
              <div className={styles.form}>
                <div className={styles.formInput}>
                  <div className={styles.label}>
                    <span>Select token</span>
                    {(errorInput.type === "depositToken" && (
                      <>
                        -<span className={styles.error}>{errorInput.msg}</span>
                      </>
                    )) ||
                      null}
                  </div>
                  <AsyncSelect
                    onChange={(e: unknown) =>
                      handleDepositCryptoChange(e as CryptoOption)
                    }
                    cacheOptions
                    defaultOptions
                    loadOptions={promiseCryptoDepositOptions}
                    loadingMessage={() => "Loading..."}
                    className={styles.cryptoSelect}
                    formatOptionLabel={(option) => (
                      <div className={styles.cryptoOption}>
                        <div className={styles.cryptoIcon}>
                          {renderCoinIcons(
                            (option as { value: string }).value,
                            (cryptoPaymentsAvailable.deposit ?? []).find(
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
                        <span>Conversion calculator</span>
                        {(errorInput.type === "cardname" && (
                          <>
                            -
                            <span className={styles.error}>
                              {errorInput.msg}
                            </span>
                          </>
                        )) ||
                          null}
                      </div>
                      <div className={styles.inputHolder}>
                        <input
                          type="number"
                          ref={cryptoDepositRef}
                          onChange={handleCryptoDepostiAmountChange}
                          className={styles.cryptoInput}
                          placeholder="Enter amount"
                          disabled={assetId === ""}
                          step="any"
                        />
                        <div className={styles.inputCurrency}>
                          <span className={styles.inputCurrencyText}>
                            {cryptoPaymentsAvailable.deposit &&
                              renderCoinIcons(
                                cryptoPaymentsAvailable.deposit.find(
                                  (crypto) => crypto.cryptoCode === assetId
                                )?.cryptoCode ?? "",
                                (cryptoPaymentsAvailable.deposit ?? []).find(
                                  (crypto) => crypto.cryptoCode === assetId
                                )?.currencyIconUrl
                              )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.equalsContainer}>
                    <span className={styles.equalsText}>=</span>
                  </div>
                  <div className={styles.formWrapper}>
                    <div className={styles.formInput}>
                      <div className={`${styles.label} ${styles.hiddenLabel}`}>
                        <span>-</span>
                        {(errorInput.type === "cardname" && (
                          <>
                            -
                            <span className={styles.error}>
                              {errorInput.msg}
                            </span>
                          </>
                        )) ||
                          null}
                      </div>
                      <div className={styles.inputHolder}>
                        <input
                          type="number"
                          ref={usdInputRef}
                          onChange={handleUsdChange}
                          className={styles.cryptoInput}
                          placeholder="Enter amount"
                          disabled={assetId === ""}
                          step="any"
                        />
                        <div className={styles.inputCurrency}>
                          <span className={styles.inputCurrencyText}>
                            {conversionLoading ? <Loader radius={15} /> : "$"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.qrContainer}>
                  <div className={styles.qrCodeContainer}>
                    {addressLoading && (
                      <div className={styles.loaderOverlay}>
                        <Loader radius={25} />
                      </div>
                    )}
                    <QRCode
                      style={{
                        height: "auto",
                        maxWidth: width < 400 ? "40%" : "100%",
                        width: "100%",
                      }}
                      value={qrCodeAddress}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                  <div className={styles.cryptoAddress}>
                    <div className={styles.topupTextWrapper}>
                      <span className={styles.topupText}>
                        Use the details below to top up. Top-up network
                      </span>
                      <span className={styles.topupCoinText}>
                        {form.depositToken !== ""
                          ? `(${form.depositToken})`
                          : ""}
                      </span>
                    </div>
                    <div className={styles.formInput}>
                      <div className={styles.label}>
                        <span>Crypto-address</span>
                        {(errorInput.type === "username" && (
                          <>
                            -
                            <span className={styles.error}>
                              {errorInput.msg}
                            </span>
                          </>
                        )) ||
                          null}
                      </div>
                      <div className={styles.inputForm}>
                        <input
                          ref={qrCodeRef}
                          type="text"
                          defaultValue={qrCodeAddress}
                          readOnly
                        />
                        <button
                          className={styles.copyButton}
                          onClick={() => copyInputContent(qrCodeRef)}
                        >
                          {addressLoading ? (
                            <Loader radius={12} />
                          ) : (
                            <CopyIcon />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {selectedTypeI === 0x2 && (
            <>
              <form onSubmit={handleSubmit}>
                <div className={styles.redeemInput}>
                  <input
                    type="text"
                    ref={cardNumberRef}
                    className={styles.input}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        cardNumber: e.target.value,
                      });
                      setErrorInput({ type: "", msg: "" });
                    }}
                    placeholder="Enter redeem code"
                  />
                  <button className={styles.applyButton}>
                    <span>Apply</span>{" "}
                  </button>
                </div>

                <div className={styles.formInput}>
                  <div className={styles.titleWrapper}>
                    <h1>No gift card? Purchase one!</h1>
                  </div>
                  <div className={styles.label}>
                    <span>Select provider</span>
                    {(errorInput.type === "username" && (
                      <>
                        -<span className={styles.error}>{errorInput.msg}</span>
                      </>
                    )) ||
                      null}
                  </div>
                  <Select
                    options={options}
                    className={styles.cryptoSelect}
                    formatOptionLabel={(option) => (
                      <div className={styles.cryptoOption}>
                        <div className={styles.cryptoIcon}>
                          {renderCoinIcons(
                            (option as { value: string }).value,
                            (cryptoPaymentsAvailable.deposit ?? []).find(
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
                <div className={styles.formInput}>
                  <div className={styles.label}>
                    <span>Sum</span>
                    {(errorInput.type === "username" && (
                      <>
                        -<span className={styles.error}>{errorInput.msg}</span>
                      </>
                    )) ||
                      null}
                  </div>
                </div>

                <div className={styles.sumButtons}>
                  <button className={styles.sumButton} type="button">
                    <span>$ 5.0</span>
                  </button>
                  <button className={styles.sumButton} type="button">
                    <span>$ 10.0</span>
                  </button>
                  <button className={styles.sumButton} type="button">
                    <span>$ 15.0</span>
                  </button>
                  <button className={styles.sumButton} type="button">
                    <span>$ 25.0</span>
                  </button>
                </div>
                <div className={styles.sumButtons}>
                  <button className={styles.sumButton} type="button">
                    <span>$ 5.0</span>
                  </button>
                  <button className={styles.sumButton} type="button">
                    <span>$ 10.0</span>
                  </button>
                  <button className={styles.sumButton} type="button">
                    <span>$ 15.0</span>
                  </button>
                  <button className={styles.sumButton} type="button">
                    <span>$ 25.0</span>
                  </button>
                </div>

                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader radius={18} centered />
                  ) : (
                    <div className={styles.submitButton}>
                      <span>Continue</span>
                      <div className={styles.iconContainer}>
                        <ArrowTop />
                      </div>
                    </div>
                  )}
                </button>
                <div className={styles.depositInfo}>
                  <span className={styles.depositInfoText}>
                    Deposit time takes about 15 minutes
                  </span>
                </div>
              </form>
            </>
          )}
        </>
      )) ||
        null}
      {(walletTab === 0x1 && (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formInput}>
              <div className={styles.itemTitleWrapper}>
                <div className={styles.label}>
                  <span>Items</span>
                </div>
                <div
                  className={styles.selector}
                  onClick={() => handleSelectAll()}
                >
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onClick={() => handleSelectAll()}
                      onChange={() => void 0x0}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <span className={styles.label}>Choose all</span>
                </div>
              </div>
            </div>
            {inventory && inventory.length > 0 ? (
              <div className={styles.itemContainer}>
                {inventory &&
                  inventory.length > 0 &&
                  inventory
                    .filter(
                      (item) =>
                        item.state === "AVAILABLE" && item.item.isSellable
                    )
                    .map((item, i) => (
                      <div
                        className={styles.item}
                        key={i}
                        style={{ animationDuration: `${i * 0.2}s` }}
                        onClick={() => {
                          if (!loading) {
                            setInCb((p) =>
                              Object.assign({}, p, {
                                [item.id]: !(
                                  item.id in inventoryCheckBoxes &&
                                  inventoryCheckBoxes[item.id]
                                ),
                              })
                            );
                          }
                        }}
                      >
                        {/* <div className={styles.uniquer}>
                        <div className={styles.sorter}>
                          <Dropdown
                            options={itemOptions}
                            classNameButton={styles.buttonsort}
                            classNameList={styles.sortlist}
                            onChange={(index) => setSortIndex(index)}
                            currentIndex={sortIndex}
                          >
                            <span>{itemOptions[sortIndex].Label}</span>
                          </Dropdown>
                        </div>
                      </div> */}
                        <div></div>
                        <div className={styles.image}>
                          <Image
                            width={100}
                            height={100}
                            className={styles.itemImage}
                            src={item.item.images[0]?.url ?? ""}
                            alt=""
                          />
                        </div>
                        <div className={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={
                              !!(
                                item.id in inventoryCheckBoxes &&
                                inventoryCheckBoxes[item.id]
                              )
                            }
                            onChange={(l) =>
                              setInCb((p) =>
                                Object.assign({}, p, {
                                  [item.id]: l.target.checked,
                                })
                              )
                            }
                          />
                        </div>
                        <h2>{item.item.name}</h2>
                        <p>Intel</p>
                        <div className={styles.pricecn}>
                          <span className={styles.price}>
                            $ {formatPrice(item.item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            ) : (
              <div className={styles.emptyInventory}>
                <h2>No items found</h2>
                <span>Try one of our cases first!</span>
              </div>
            )}
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
                onChange={(e: unknown) =>
                  handleWithdrawCryptoChange(e as CryptoOption)
                }
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
                    <span className={styles.amountText}>${totalPrice}</span>
                    {/* <span className={styles.amountIconDollar}>$</span> */}
                  </div>
                </div>
              </div>
              {withdrawCurrencyRate !== 0 && (
                <div className={styles.equalsContainer}>
                  <ArrowRightIcon />
                </div>
              )}
              <div className={styles.formWrapper}>
                <div className={styles.formInput}>
                  <div className={`${styles.label} ${styles.hiddenLabel}`}>
                    <span>-</span>
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
                              (crypto) =>
                                crypto.cryptoCode === form.withdrawToken
                            )?.cryptoCode ?? "",
                            (cryptoPaymentsAvailable.withdraw ?? []).find(
                              (crypto) =>
                                crypto.cryptoCode === form.withdrawToken
                            )?.currencyIconUrl
                          )}
                      </span>
                    )}
                    <span className={styles.amountText}>
                      {!withdrawAmountLoading && withdrawCryptoAmount}
                      {/* withdrawCurrencyRate !== 0 &&
                        totalPrice * withdrawCurrencyRate} */}
                    </span>
                  </div>
                </div>
              </div>
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

            <div className={styles.formInput}>
              {/* <span className={styles.withdrawInfoText}>
                We'll send {(totalPrice * withdrawCurrencyRate).toFixed(2)}{" "}
                {cryptoPaymentsAvailable.withdraw &&
                  cryptoPaymentsAvailable.withdraw.find(
                    (crypto) => crypto.cryptoCode === form.withdrawToken
                  )?.name}{" "}
                to the entered address, 0 confirmation(s) required. Make sure
                your withdrawal address andcryptocurrency selected are correct,
                as not doing so might result in the loss of funds.
              </span> */}
              <span className={styles.withdrawInfoText}>
                {/* Minimum withdrawal amount is 10$. Your will have a remaining
                balance of{" "}
                {user?.usdBalance && (user?.usdBalance - totalPrice).toFixed(2)}
                . The withdraw time takes about 15 minutes. */}
                Minimum withdrawal amount is $10.00. You'll be charged a network
                fee. The withdraw time takes about 15 minutes.
              </span>
            </div>

            <button
              className={classNames(
                styles.submitButton,
                totalPrice < 10 ? "disabled" : ""
              )}
              type="submit"
              disabled={loading || totalPrice < 10}
            >
              {loading ? (
                <Loader radius={18} centered />
              ) : (
                <div className={styles.submitIconButton}>
                  <div className={styles.iconContainer}>
                    <MinusCircleIcon />
                  </div>
                  <span>Withdraw</span>
                </div>
              )}
            </button>
          </form>
        </>
      )) ||
        null}
    </ModalOverlay>
  );
};
