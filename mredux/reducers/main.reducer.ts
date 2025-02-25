import { AvailableStripeKey, Livefeed } from "@/utils/api.service";
import { Action } from "..";

export interface DepositTransaction {
  depositTransactionId: string;
  userId: string;
  username: string;
  type:
    | "ADMIN_ADJUSTMENT"
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "CASHBACK_CLAIM"
    | "BUY_BONUS_XP"
    | "PURCHASE"
    | "GIFT_CARD"
    | "PROMO_CODE"
    | "REFUND";
  subType: "CARD" | "CRYPTO";
  paymentNetwork: "STRIPE" | "COASTAL" | "FIREBLOCKS";
  depositAmount: number;
  status:
    | "OPEN"
    | "PROCESSING"
    | "HOLD"
    | "HOLD_REVERSED"
    | "SUCCESSFUL"
    | "FAILED"
    | "REFUNDED";
  createdAt: string;
  additionalData: {
    status: "SUCCEEDED" | "FAILED" | "PENDING";
    network: "STRIPE" | "COASTAL" | "FIREBLOCKS";
    referenceId: string;
    amount: string;
    txUrl: string;
    paymentId: string;
    txHash: string;
    endsWith: string;
    subMethod: string;
    relId: string;
  } & Record<string, string>;
}

export interface BalanceTransaction {
  transactionId: string;
  userId: string;
  username: string;
  type: DepositTransaction["type"];
  balanceAdjustment: number;
  finalBalance: number;
  createdAt: string;
}

export interface WithdrawTransaction {
  withdrawalTransactionId: string;
  userId: string;
  type:
    | "ADMIN_ADJUSTMENT"
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "CASHBACK_CLAIM"
    | "BUY_BONUS_XP"
    | "PURCHASE"
    | "GIFT_CARD"
    | "PROMO_CODE"
    | "REFUND";
  failureReason: null;
  subType: "CARD" | "CRYPTO";
  status: "PENDING" | "APPROVAL" | "REJECTED" | "FAILED" | "CANCELLED";
  adminUpdatedDate: null;
  adminId: null;
  noted: null;
  amount: number;
  oneTimeAddress: string;
  assetId: "USDC";
  createdAt: string;
  additionalData: {
    status: "SUCCEEDED" | "FAILED" | "PENDING";
    network: "STRIPE" | "COASTAL" | "FIREBLOCKS";
    referenceId: string;
    amount: string;
    txUrl: string;
    paymentId: string;
    txHash: string;
    endsWith: string;
    subMethod: string;
    relId: string;
  } & Record<string, string>;
}

export interface GameTransaction {
  gameId: string;
  userId: string;
  username: string;
  type: "BOX_OPEN";
  amountSpent: number;
  xpWon: number;
  lootCoinWon: number;
  valueWon: number;
  profit: number;
  publicSeed?: string;
  additionalData?: Record<string, string>;
  createdAt: string;
  clientSeed?: string;
  privateSeed?: string;
  boxId: string;
  nonce: string;
}

export interface LootUser {
  id: string;
  firstName: string;
  createdAt: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  usdBalance: number;
  ssoLogin?: boolean;
  authorities: ["ROLE_USER"];
  dateOfBirth: string | null;
  emailVerified: boolean;
  kycVerified: boolean;
  privacyEnabled: boolean;
  xpBalance: number;
  bonusXp: number;
  lootCoinsBalance: number;
  amountSpent?: number;
  lootBoxesOpened?: number;
  userId?: string;
  xpExtraInfo: {
    level: number;
    xpToLevelUp: number;
    usdToLevelUp: number;
    minXPInThisLevel: number;
    maxXPInThisLevel: number;
    accumulatedXP: number;
  };
  avatar?: string | null;
  seeds?: {
    currentClientSeed: string;
    currentPrivateSeedHashed: string;
    currentNonce: number;
    futurePrivateSeedHashed: string;
    previousClientSeed: string;
    previousPrivateSeed: string;
    previousPrivateSeedHashed: string;
    previousNonce: number;
  } | null;
}

export interface ItemsBox {
  boxId: string;
  boxName: string;
  boxCategory: string;
  boxPrice: number;
  discount: number;
  image: string;
  uniqueId: number;
}

export interface ItemObject {
  itemId: string;
  itemName: string;
  itemPrice: number;
  user: Partial<LootUser>;
  itemImage: string;
  color: string;
  newElement?: boolean; // This needs to be enabled when the item is coming from websocket
}

export interface BoxInventory {
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
  state: "AVAILABLE" | "SOLD" | "SHIPPED" | "DELIVERED";
}

export interface StripePayment {
  success: boolean;
  message: string | null;
  nextStripeAccountId: string | null;
  stripePublishableKey: string | null;
  referenceId: string | null;
  paymentIntent: any;
}
export interface StripePaymentConfirm {
  message: "string" | null;
  success: boolean;
  requireActtion: boolean;
}

export interface AvailableCrypto {
  id: string;
  name: string;
  cryptoCode: string;
  enabledForWithdraw: boolean;
  enabledForDeposit: boolean;
  description: string;
  currencyIconUrl: string;
}

export interface MainReducer {
  refreshInventory: boolean;
  fflags: Record<string, { defaultValue: boolean }> | null;
  currentPage: string;
  user?: LootUser | null;
  loaded: boolean;
  engagement: {
    lootBoxesOpened: number;
    battleFought: number;
    numberOfWeeklyRaffleTickets: number;
  } | null;

  finance: {
    wagered: number;
    rakeBackEarned: number;
    totalDeposited: number;
    totalWithdrawn: number;
    rakeBackAvailable: number;
  } | null;

  performance: {
    numberOfWins: number;
    numberOfLosses: number;
    winLossRatio: number;
  } | null;
  token: string | null;
  mobileMenu: boolean;
  waitpage: boolean | null;
  inventory: BoxInventory[] | null;
  navbarInventory: BoxInventory[] | null;
  soundsenabled: boolean;
  cryptoPaymentsAvailable: {
    withdraw: AvailableCrypto[] | null;
    deposit: AvailableCrypto[] | null;
  };
  recentDrops: Livefeed[] | null;
  recentDropsBox: Livefeed[] | null;
  transactions: {
    deposits: DepositTransaction[] | null;
    transactions: BalanceTransaction[] | null;
    game_history: GameTransaction[] | null;
    withdraws: WithdrawTransaction[] | null;
  };
  kycStatus?: {
    clientId: string | null;
    isKYCVerified: boolean | null;
    status: string | null;
    outcome: string | null;
  };
  stripeDepositDisabled: boolean;
  availableStripeKeys: AvailableStripeKey[];
  currentStripeKey: {
    stripePublishableKey: string;
    stripePaymentAccountId: string;
  } | null;
  paymentsSentIds: string[];
  startNV: number;
  startLevelNV: number;
  lineprogressNV: boolean;
}

export const mainReducer = (
  state: MainReducer = {
    startNV: 0x0,
    startLevelNV: 0x0,
    lineprogressNV: false,
    paymentsSentIds: [],
    fflags: null,
    refreshInventory: false,
    currentPage: "/",
    engagement: null,
    finance: null,
    performance: null,
    soundsenabled: true,
    waitpage: null,
    transactions: {
      deposits: null,
      transactions: null,
      withdraws: null,
      game_history: null,
    },
    loaded: false,
    token: null,
    mobileMenu: false,
    inventory: null,
    navbarInventory: null,
    cryptoPaymentsAvailable: {
      withdraw: null,
      deposit: null,
    },
    recentDrops: [],
    recentDropsBox: [],
    currentStripeKey: null,
    availableStripeKeys: [],
    stripeDepositDisabled: false,
  },
  action: Action<MainReducer>
): MainReducer => {
  switch (action.type) {
    case "UPDATE_MAIN_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
