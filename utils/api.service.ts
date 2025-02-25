import axios, { AxiosResponse } from "axios";
import {
  AvailableCrypto,
  BalanceTransaction,
  BoxInventory,
  DepositTransaction,
  GameTransaction,
  LootUser,
  MainReducer,
  StripePayment,
  StripePaymentConfirm,
  WithdrawTransaction,
} from "mredux/reducers/main.reducer";
import { ItemWon } from "mredux/reducers/modals.reducer";
import toast from "react-hot-toast";
import { handleErrorRequest } from "./handler";

export let API_URL = "https://dev-casebattle-api.loot.gg";

export let API = axios.create({
  baseURL: API_URL,
  headers: axios.defaults.headers.common,
});

// const Battle_API = "https://dev-casebattle-api.loot.gg";

export const setAuthToken = (token: string) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export const initializeAPI = (url?: string | null, token?: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      API_URL = process.env.NEXT_PUBLIC_REST || url || API_URL || "";

      token && localStorage.setItem("token", token ?? "");

      const headers = API.defaults.headers.common;

      API = axios.create({
        baseURL: API_URL,
        headers: axios.defaults.headers.common,
      });

      if (token || headers["Authorization"]) {
        setAuthToken(token || (headers["Authorization"] as string));
      }

      resolve();
    } catch (e) {
      // console.log(e);
      resolve();
    }
  });
};

export interface ResponseDataType<T = {}> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export const registerUser = async (data: {
  username: string;
  password: string;
  email: string;
  dateOfBirth: string;
}) => {
  return new Promise<LootUser>(async (resolve, reject) => {
    try {
      const user = await axios.request({
        url: API_URL + "/v1/api/auth/register",
        method: "POST",
        data,
      });

      resolve(user.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  return new Promise<LootUser>(async (resolve, reject) => {
    try {
      const user = await axios.request({
        url: API_URL + "/v1/api/auth/login",
        method: "POST",
        data,
      });

      resolve(user.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchUser = async (token?: string) => {
  return new Promise<LootUser>(async (resolve, reject) => {
    try {
      const user = await API.request({
        url: API_URL + "/v1/api/users/me",
      });

      resolve(user.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const confirmCode = async (type: "EMAIL", code: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const user = await API.request({
        url: API_URL + "/v1/api/otp/verify",
        method: "POST",
        data: {
          code: code,
          type: type,
        },
      });

      resolve(user.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const requestCode = async (type: "EMAIL") => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const user = await API.request({
        url: API_URL + "/v1/api/otp/create?type=" + type,
        method: "POST",
      });

      resolve(user.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchBoxId = async (boxId: string, isSlug: boolean = true) => {
  return new Promise<BoxType>(async (resolve, reject) => {
    try {
      const box = await API.request({
        // Change it to axios
        url:
          API_URL +
          (isSlug
            ? "/v1/api/boxes/public/slug/" + boxId
            : "/v1/api/boxes/public/" + boxId),
        method: "GET",
      });

      resolve(box.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchBoxes = async (queries?: Record<string, string | number>) => {
  return new Promise<ResponseDataType<BoxType>>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        // Change it to axios
        url:
          API_URL +
          "/v1/api/boxes/public/simple/query" +
          (queries
            ? "?" +
              new URLSearchParams(
                Object.assign(
                  {},
                  ...Object.keys(queries).map((l) => ({
                    [l]: String(queries[l]),
                  }))
                )
              ).toString()
            : "") +
          "&sortBy=price",
        method: "GET",
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export interface OpenTestBoxType {
  id: string;
  publicSeed: string;
  description: null | string;
  images: string[];
  isDeleted: boolean;
  isInStock: boolean;
  isSellable: boolean;
  name: string;
  price: number;
  slug: string;
  type: "PHYSICAL" | "VIRTUAL";
  demo: boolean;
}

export interface OpenRealBoxType {
  id: string;
  itemWon: ItemWon;
  publicSeed: string;
  clientSeed: string;
  adjustedLootCoins?: number | null;
  adjustedXP?: number | null;
  state: "SUCCESSFUL" | "CREATED" | "RUNNING" | "FAILED";
  userItemWon?: UserItem;
}

export const openBoxTest = async (id: string) => {
  return new Promise<OpenTestBoxType>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/boxes/public/test/" + id,
        method: "POST",
      });

      resolve({ ...boxes.data });
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const openBoxReal = async (id: string, isTest?: boolean) => {
  return new Promise<OpenRealBoxType>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/boxes/" + id + "/open-and-claim",
        method: "POST",
      });

      resolve({ ...boxes.data, demo: !!isTest });
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const setStatusBox = async (id: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/boxes/" + (id + "/activation-status"),
        method: "PUT",
        data: {
          active: true,
        },
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const sellItems = async (ids: string[]) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/user-items/sell/balance",
        method: "POST",
        data: {
          userItemIds: ids,
        },
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface SellItemsWithdrawCryptoPayload {
  userItemIds: string[];
  oneTimeAddress: string;
  assetId: string;
}

export const sellItemsCrypto = async (rest: SellItemsWithdrawCryptoPayload) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/user-items/sell/crypto",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface SellItemsCryptoEstimateResponse {
  amountInUSD: number;
  assetId: string;
  estimatedFeeInToken: number;
  estimatedTotalInToken: number;
}

export const sellItemsCryptoEstimate = async (
  rest: SellItemsWithdrawCryptoPayload
) => {
  return new Promise<SellItemsCryptoEstimateResponse>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url: API_URL + "/v1/api/user-items/sell/crypto/estimate",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const fetchOpened = async (id: string, gameId: string) => {
  return new Promise<OpenRealBoxType>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/boxes/" + id + "/games/" + gameId,
        method: "GET",
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchFinance = async () => {
  return new Promise<MainReducer["finance"]>(async (resolve, reject) => {
    try {
      const finance = await API.request({
        url: API_URL + "/v1/api/users/stats/finance",
        method: "GET",
      });

      resolve(finance.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const coastalPayRequest = async ({
  returnUrl,
  amount,
}: {
  returnUrl: string;
  amount: number;
}) => {
  return new Promise<{ success: boolean; url: string; code: string }>(
    async (resolve, reject) => {
      try {
        const finance = await API.request({
          url: API_URL + "/v1/api/payment/coastalpay/hosted-form",
          method: "POST",
          data: {
            returnUrl,
            returnUrlNavigation: "top",
            amount,
          },
        });

        resolve(finance.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const coastalPayConfirm = async ({
  paymentId,
  externalId,
}: {
  paymentId: number;
  externalId: string;
}) => {
  return new Promise<{ success: boolean; paymentId: number }>(
    async (resolve, reject) => {
      try {
        const finance = await API.request({
          url: API_URL + "/v1/api/payment/coastalpay/payment",
          method: "POST",
          data: {
            paymentId,
            externalId,
          },
        });

        resolve(finance.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const fetchEngagement = async () => {
  return new Promise<MainReducer["engagement"]>(async (resolve, reject) => {
    try {
      const engagement = await API.request({
        url: API_URL + "/v1/api/users/stats/engagement",
        method: "GET",
      });

      resolve(engagement.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchPerformance = async () => {
  return new Promise<MainReducer["performance"]>(async (resolve, reject) => {
    try {
      const performance = await API.request({
        url: API_URL + "/v1/api/users/stats/performance",
        method: "GET",
      });

      resolve(performance.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchInventory = async (
  userid: string,
  queries?: Record<string, number | string>
) => {
  return new Promise<ResponseDataType<BoxInventory>>(
    async (resolve, reject) => {
      try {
        for (const key in queries) {
          if (queries.hasOwnProperty(key)) {
            const element = queries[key];
            if (typeof element === "number") {
              queries[key] = element.toString();
            }
          }
        }

        const boxes = await API.request({
          url:
            API_URL +
            `/v1/api/user-items/${userid}/inventory${
              queries
                ? "?" +
                  new URLSearchParams(
                    queries as Record<string, string>
                  ).toString()
                : ""
            }`,
          method: "GET",
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const fetchAvailableCryptoDepositMethods = async () => {
  return new Promise<AvailableCrypto[]>(async (resolve, reject) => {
    try {
      const cryptos = await API.request({
        url: API_URL + "/v1/api/payment/crypto/deposit/available",
        method: "GET",
      });

      resolve(cryptos.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchAvailableCryptoWithdrawMethods = async () => {
  return new Promise<AvailableCrypto[]>(async (resolve, reject) => {
    try {
      const cryptos = await API.request({
        url: API_URL + "/v1/api/payment/crypto/withdraw/available",
        method: "GET",
      });

      resolve(cryptos.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface WithdrawCryptoPayload {
  oneTimeAddress: string;
  assetId: string;
  amount: number;
}

export const withdrawCrypto = async (rest: WithdrawCryptoPayload) => {
  return new Promise<StripePaymentConfirm>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/payment/crypto/withdraw",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface DepositCryptoEstimatePayload {
  assetId: string;
  depositAmount: number;
}

interface WithdrawCryptoEstimatePayload {
  assetId: string;
  withdrawAmountInUSD: number;
}

interface WithdrawCryptoEstimateResponse {
  assetId: string;
  amountReceivedInToken: number;
}

interface DepositCryptoResponse {
  assetId: string;
  amountReceivedInUSD: number;
  vaultAsset: {
    address: string;
    legacyAddress: string;
    enterpriseAddress: string;
    tag: string;
    eosAccountName: string;
    status: string;
    vaultId: string;
    assetId: string;
  } | null;
}

export const depositCryptoEstimate = async (
  rest: DepositCryptoEstimatePayload
) => {
  return new Promise<DepositCryptoResponse>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/payment/crypto/deposit/estimate",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const withdrawCryptoEstimate = async (
  rest: WithdrawCryptoEstimatePayload
) => {
  return new Promise<WithdrawCryptoEstimateResponse>(
    async (resolve, reject) => {
      try {
        const res = await API.request({
          url: API_URL + "/v1/api/payment/crypto/withdraw/estimate",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(res.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const sendCodeForPass = async (email: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const boxes = await axios.request({
        url: API_URL + "/v1/api/auth/password/reset",
        method: "POST",
        data: {
          email,
        },
      });

      resolve(boxes.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const getUserStats = async () => {
  return new Promise<{
    amountSpent: number;
    lootBoxesOpened: number;
    userId: string;
  }>(async (resolve, reject) => {
    try {
      const userdata = await API.request({
        url: API_URL + "/v1/api/users/stats",
        method: "GET",
      });

      resolve(userdata.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const validateCodePass = async (
  code: string,
  email: string,
  newPassword: string
) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const boxes = await axios.request({
        url: API_URL + "/v1/api/auth/password/update",
        method: "POST",
        data: {
          newPassword,
          email,
          code,
        },
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface GameTransactionPayload {
  page: number;
  size: number;
  sortBy: string;
  sortDescending: boolean;
  type: "BOX_OPEN";
  state: string;
  xpWon: number;
  lootCoinWon: number;
  usernames: string[];
  createdAfter: string;
  createdBefore: string;
}

export const fetchGamesTransactions = async (
  rest: Partial<GameTransactionPayload>
) => {
  return new Promise<ResponseDataType<GameTransaction>>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url: API_URL + "/v1/api/users/transactions/games",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const fetchDepositsTransactions = async (
  rest: Partial<{
    page: number;
    size: number;
    sortBy: string;
    sortDescending: boolean;
    status: "OPEN";
    type: DepositTransaction["type"];
    network: DepositTransaction["paymentNetwork"];
    minDeposit: number;
    maxDeposit: number;
    createdAfter: string;
    createdBefore: string;
    usernames: string[];
  }>
) => {
  return new Promise<ResponseDataType<DepositTransaction>>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url: API_URL + "/v1/api/users/transactions/deposits",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const fetchBalancesTransactions = async (
  rest: Partial<GameTransactionPayload>
) => {
  return new Promise<ResponseDataType<BalanceTransaction>>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url: API_URL + "/v1/api/users/transactions/balances",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const fetchWithdrawsTransactions = async (
  rest: Partial<GameTransactionPayload>
) => {
  return new Promise<ResponseDataType<WithdrawTransaction>>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url: API_URL + "/v1/api/users/transactions/withdrawals",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

interface PhysicalItemsPayload {
  page: number;
  size: number;
  status: "PENDING";
  userId: string;
  createdAfter: string;
  createdBefore: string;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
  };
}

export interface UserItem {
  id: string;
  item: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    isSellable: boolean;
    isDeleted: boolean;
    isInStock: boolean;
    type: "PHYSICAL" | "VIRTUAL";
    images: {
      id: string;
      url: string;
    }[];
    variantOf: string;
    variants: string[];
  };
  state: "AVAILABLE" | "SOLD" | "IN_ORDER" | "ORDER_COMPLETED";
  price: number;
  orderLocked: boolean;
  categories: {
    id: string;
    name: string;
  }[];
}

export interface PhysicalData {
  id: string;
  status: "PENDING" | "PROCESSED" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  statusChangeReason: string;
  itemsOrdered: {
    id: string;
    userItem: UserItem;
    status: "PENDING" | "PROCESSED" | "SHIPPED" | "COMPLETED" | "CANCELLED";
    statusChangeReason: string;
    price: number;
  }[];
  createdAt: string;
  lastModifiedAt: string;
  trackingInfo: {
    referenceNumber: string;
    link: string;
    shippingProvider: string;
  } | null;
  shippingAddress: {
    id: string;
    userId: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalOrderValue: number;
}

export const fetchPhysicalItems = async (
  rest: Partial<PhysicalItemsPayload>
) => {
  return new Promise<ResponseDataType<PhysicalData>>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url:
            API_URL +
            "/v1/api/orders/physical" +
            (rest ? "?" + new URLSearchParams(rest as any).toString() : ""),
          method: "GET",
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export interface VirtualData {
  id: string;
  status: "PENDING" | "PROCESSED" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  statusChangeReason: string;
  itemsOrdered: {
    id: string;
    userItem: {
      id: string;
      item: {
        id: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        isSellable: boolean;
        isDeleted: boolean;
        isInStock: boolean;
        type: "PHYSICAL" | "VIRTUAL";
        images: {
          id: string;
          url: string;
        }[];
        variantOf: string;
        variants: string[];
      };
      state: "AVAILABLE" | "SOLD" | "IN_ORDER" | "ORDER_COMPLETED";

      price: number;
      orderLocked: boolean;
    };
    code: string;
    status: "PENDING" | "PROCESSED" | "SHIPPED" | "COMPLETED" | "CANCELLED";
    statusChangeReason: string;
    price: number;
  }[];
  createdAt: string;
  lastModifiedAt: string;
  totalOrderValue: number;
}

export const fetchVirtualItems = async (
  rest: Partial<PhysicalItemsPayload>
) => {
  return new Promise<ResponseDataType<VirtualData>>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url:
          API_URL +
          "/v1/api/orders/virtual" +
          (rest ? "?" + new URLSearchParams(rest as any).toString() : ""),
        method: "GET",
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchShippingAddresses = async () => {
  return new Promise<
    {
      id: string;
      userId: string;
      streetAddress: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }[]
  >(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/shipping-addresses",
        method: "GET",
      });

      resolve(boxes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface ShippingAddress {
  id: string;
  userId: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const addShippingAddress = async (rest: Partial<ShippingAddress>) => {
  return new Promise<ResponseDataType<ShippingAddress>>(
    async (resolve, reject) => {
      try {
        const boxes = await API.request({
          url: API_URL + "/v1/api/shipping-addresses",
          method: "POST",
          data: {
            ...rest,
          },
        });

        resolve(boxes.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const convertLootCoinstoXP = async (rest: number) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/users/loot-coins/balance/spend/xp/" + rest,
        method: "POST",
      });

      resolve(boxes.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const convertUsdtoLootcoins = async (rest: number) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        url: API_URL + "/v1/api/users/loot-coins/balance/add/" + rest,
        method: "POST",
      });

      resolve(boxes.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface StartStripePaymentPayload {
  amount: number;
  currency: string;
  stripeAccountId: number;
  promotionCode?: string;
}
interface ConfirmStripePaymentPayload {
  paymentIntentId: string;
  referenceId: string;
}

interface CreateStripePaymentPayload {
  id: string;
  clientSecret: string;
}

export const createStripePaymentIntent = async (
  rest: CreateStripePaymentPayload
) => {
  return new Promise<ResponseDataType>(async (resolve, reject) => {
    try {
      const stripeRes = await API.request({
        url: API_URL + "/v1/api/payment/stripe/setup-intent",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(stripeRes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const startStripePayment = async (rest: StartStripePaymentPayload) => {
  return new Promise<StripePayment>(async (resolve, reject) => {
    try {
      const stripeRes = await API.request({
        url: API_URL + "/v1/api/payment/stripe/start",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(stripeRes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const confirmStripePayment = async (
  rest: ConfirmStripePaymentPayload
) => {
  return new Promise<StripePaymentConfirm>(async (resolve, reject) => {
    try {
      const stripeRes = await API.request({
        url: API_URL + "/v1/api/payment/stripe/confirm",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(stripeRes.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};
interface CheckPromoCodeResponse {
  id: string;
  description: string;
  isActive: boolean;
  isPublic: boolean;
  isSingleUse: boolean;
  code: string;
  promotionCodeType: string;
  value: number;
  minimumRequiredAmount: string | number | null;
  appliesToProducts: string[];
  expiresAt: string;
}

export const checkPromoCode = async (code: string) => {
  return new Promise<CheckPromoCodeResponse>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/promotion-codes/check/" + code,
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const redeemPromoCode = async (code: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/promotion-codes/redeem",
        method: "POST",
        data: { code },
      });

      resolve(res.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface PromoCodeResponse {
  id: string;
  description: string;
  isActive: boolean;
  isPublic: boolean;
  isSingleUse: boolean;
  code: string;
  promotionCodeType: string;
  value: number;
  minimumRequiredAmount: null;
  appliesToProducts: string[];
  promotionCodeConditions: {
    promotionCodeConditionType: string;
    maxTotalRedemptions: number;
    maxTotalRedemptionsDaily: number;
    maxRedemptionsPerCustomer: number;
    maxTotalRedemptionsPerCustomerDaily: number;
  }[];
  created: string;
  expiresAt: string;
  maxNumberOfRedemptions: number;
  numberOfRedeemed: number;
  totalRedeemed: number;
}

export const fetchAvailablePromoCodes = async () => {
  return new Promise<PromoCodeResponse[]>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/promotion-codes/available",
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export interface Livefeed {
  boxId: string;
  gameId: string;
  newElement?: boolean;
  frequency: number | null;
  boxSlug: string;
  item: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    isSellable: boolean;
    isDeleted: boolean;
    isInStock: boolean;
    type: "PHYSICAL" | "VIRTUAL";
    images: [
      {
        id: string;
        url: string;
      },
    ];
    variantOf: string;
    variants: string[];
  };
  user: {
    id: string;
    username: string;
    profilePictureUrl: string;
    xpBalance: number;
    xpExtraInfo: {
      level: number;
      xpToLevelUp: number;
      lootCoinsToLevelUp: number;
      minXPInThisLevel: number;
      maxXPInThisLevel: number;
    };
    privacyEnabled: boolean;
  };
}

export const fetchLiveFeed = async ({ size }: { size: number }) => {
  return new Promise<{ event: Livefeed }[]>(async (resolve, reject) => {
    try {
      const context = await API.request({
        url: API_URL + "/v1/api/live-feed",
        method: "GET",
      });

      resolve(context.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchLiveFeedBox = async (boxId: string) => {
  return new Promise<{
    recentWinnings: Livefeed[];
    highestWinnings: Livefeed[];
    id: string;
  }>(async (resolve, reject) => {
    try {
      const context = await API.request({
        url: API_URL + "/v1/api/boxes/public/" + boxId + "/winning/stats",
        method: "GET",
      });

      resolve(context.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface GrowthBookFeatureFlags {
  status: number;
  features: {
    [key: string]: {
      defaultValue: boolean;
    };
  };
  dateUpdated: string;
}

export const fetchGrowthBookFeatureFlags = async () => {
  return new Promise<GrowthBookFeatureFlags>(async (resolve, reject) => {
    try {
      console.log(
        process && process.env?.NEXT_PUBLIC_MODE,
        process && process.env?.NEXT_PUBLIC_MODE?.includes("dev")
      );
      const res = await axios.request({
        url:
          "https://cdn.growthbook.io/api/features/" +
          ((process && process.env?.NEXT_PUBLIC_SDK_GROWTHBOOK) ||
            "sdk-qSCLXlEvBcHQAi1"),
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchWaitCount = async () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await axios.request({
        url: API_URL + "/v1/api/users/wait-list/count",
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const fetchWaitList = async () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/wait-list",
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const joinWaitList = async () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/wait-list/join",
        method: "POST",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const openMultiCase = async (boxid: string, spins: number) => {
  return new Promise<OpenRealBoxType[]>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url:
          API_URL + `/v1/api/boxes/${boxid}/open-multiple-and-claim/${spins}`,
        method: "POST",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const checkIfUserJoined = async () => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/wait-list/check",
        method: "GET",
      });

      resolve(res.data as unknown as boolean);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const updateCurrentClientSeed = async (newClientSeed: string) => {
  return new Promise<LootUser>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/client-seed",
        method: "PUT",
        data: {
          newClientSeed,
        },
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const startKYC = async (firstName: string, lastName: string) => {
  return new Promise<{ token: string; clientId: string }>(
    async (resolve, reject) => {
      try {
        const res = await API.request({
          url: API_URL + "/v1/api/kyc/start",
          method: "POST",
          data: {
            firstName,
            lastName,
          },
        });

        resolve(res.data);
      } catch (e) {
        // console.log(e);
        reject(e);
      }
    }
  );
};

export const checkKYC = async (documentId: string, livePhotoId: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/kyc/check",
        method: "POST",
        data: {
          documentId,
          livePhotoId,
        },
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

interface KYCStatusResponse {
  clientId: string;
  isKYCVerified: boolean;
  status: string;
  outcome: string;
}

export const userKycStatus = async () => {
  return new Promise<KYCStatusResponse>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/kyc/status",
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const checkComplyCube = async (rest: any) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/client/webhook/complycube/local",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const changePassowrd = async (rest: {
  password: string;
  newPassword: string;
}) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/change-password",
        method: "POST",
        data: {
          ...rest,
        },
      });

      resolve(res.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const changeDOB = async (rest: { dateOfBirth: string }) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/date-of-birth",
        method: "PUT",
        data: {
          ...rest,
        },
      });

      resolve(res.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const changeEmail = async (rest: { newEmail: string }) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users/email",
        method: "PUT",
        data: {
          ...rest,
        },
      });

      resolve(res.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const changeFirstLastName = async (rest: {
  firstName?: string;
  lastName?: string;
}) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/users",
        method: "PUT",
        data: {
          ...rest,
        },
      });

      resolve(res.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export interface AvailableStripeKey {
  stripePublishableKey: string;
  stripePaymentAccountId: string;
}

export const getAvailableStripeKeys = async () => {
  return new Promise<AvailableStripeKey[]>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/payment/stripe/available",
        method: "GET",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const cancelWithdraw = async (withdrawRequestId: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url:
          API_URL +
          `/v1/api/users/transactions/withdrawals/${withdrawRequestId}/cancel`,
        method: "POST",
      });

      resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

// Case Battle
export const getRooms = async (query: FilterLobbyType) => {
  return new Promise<ResponseDataType<Battle>>(async (resolve, reject) => {
    try {
      const res = await API.request({
        method: "POST",
        url: API_URL + "/v1/api/box-battles/query",
        data: {
          page: query.page,
          size: 10,
          sortBy: "createdAt",
          sortDescending: true,
          teams: query.teamTypes,
          state: query.status,
        },
      });
      if (res.status === 200) {
        resolve(res.data);
      } else toast.error("Error happened");
    } catch (error) {
      reject(error);
    }
  });
};

// Create room
export const createRoom = async (
  boxIds: string[],
  teams: number,
  teamsSize: number,
  fastMode: boolean,
  privateMode: boolean
  // crazyMode: boolean,
) => {
  return new Promise<Battle>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: API_URL + "/v1/api/box-battles",
        method: "POST",
        data: {
          name: "Test",
          teams: teams,
          teamsSize: teamsSize,
          boxIds: boxIds,
          autoStart: true,
          fastOpenings: fastMode,
          privateGame: privateMode,
        },
      });
      if (res.status === 200) resolve(res.data);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const getBattleById = async (id: string) => {
  return new Promise<Battle>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: `${API_URL}/v1/api/box-battles/${id}`,
        method: "GET",
      });
      if (res.status === 200) {
        resolve(res.data);
      } else {
        toast.error("Error fetching data");
      }
    } catch (e: any) {
      reject(e);
    }
  });
};

// Join Room with Id
export const joinRoomById = async (
  id: string,
  teamParam: number | null,
  teamPositionParam: number | null
) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const rq = `${API_URL}/v1/api/box-battles/${id}/join${
        teamParam ? `?team=${teamParam}` : ""
      }${
        teamPositionParam
          ? teamParam
            ? `&teamPosition=${teamPositionParam}`
            : `team=${teamPositionParam}`
          : ""
      }`;
      const res = await API.request({
        url: `${API_URL}/v1/api/box-battles/${id}/join${
          teamParam ? `?team=${teamParam}` : ""
        }${
          teamPositionParam
            ? teamParam
              ? `&teamPosition=${teamPositionParam}`
              : `teamPosition=${teamPositionParam}`
            : ""
        }`,
        method: "POST",
      });

      resolve(res.status === 200);
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
};

export const addBotToBattle = async (
  id: string,
  team: number,
  teamPosition: number
) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: `${API_URL}/v1/api/box-battles/${id}/bot?team=${team}&teamPosition=${teamPosition}`,
        method: "POST",
      });

      resolve(res.status === 200);
    } catch (e) {
      reject(e);
    }
  });
};

export const deleteBattleWithId = (id: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: `${API_URL}/v1/api/box-battles/${id}`,
        method: "DELETE",
      });
      resolve(res.status === 200);
    } catch (error) {
      handleErrorRequest(error);
    }
  });
};

export const leaveBattleWithId = (id: string) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const res = await API.request({
        url: `${API_URL}/v1/api/box-battles/${id}/leave`,
        method: "POST",
      });
      resolve(res.status === 200);
    } catch (error) {
      handleErrorRequest(error);
    }
  });
};

export const fetchBoxList = async (queries: FilterType) => {
  return new Promise<ResponseDataType<BoxType>>(async (resolve, reject) => {
    try {
      const boxes = await API.request({
        // Change it to axios
        url: API_URL + "/v1/api/boxes/public/simple/query",
        params: {
          ...queries,
        },
        method: "GET",
      });
      resolve(boxes.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const watchRoomById = async (id: string) => {
  try {
    const res = await API.request({
      url: `${API_URL}/v1/api/box-battles/${id}/spectate`,
      method: "POST",
    });
  } catch (e) {
    console.log(e);
  }
};
