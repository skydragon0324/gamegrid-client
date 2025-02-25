declare module "colorthief";

interface BattleWSResponseData<T> {
  battleId: string;
  data: T;
}

interface BattleRound {
  round: {
    id: number;
    info: {
      [key: string]: {
        boxId: string;
        itemId: string;
      };
    };
  };
}
interface BattleWinner {
  chooseWinner: {
    method: string;
    round: 0;
  };
  winnerTeam: number;
  winnings: number;
  winningsPerPlayer: number;
}
interface Battle {
  id: string;
  owner: UserType | null;
  name: string;
  price: number;
  boxes: BoxType[];
  players: Player[];
  eosSeed: {
    blockNum: number;
    hash: string;
  } | null;
  lastProcessedRound: number;
  nextRoundToProcess: number;
  teams: number;
  teamsSize: number;
  winnerTeam: number;
  winnings: number;
  winningsPerPlayer: number;
  chooseWinnerMethod: {
    methodName: string;
    round: number;
  } | null;
  state: string;
  publicSeed: string;
  privateSeed: string;
  clientSeed: string;
  fastOpenings: boolean;
  privateGame: boolean;
  spectatorsCount: number;
  nonce: number;
}
interface Player {
  bot: boolean;
  id: string;
  name: string;
  user: UserType;
  prizeItems: ItemType[];
  team: number;
  teamPosition: number;
  wonItems: {
    box: BoxType;
    item: ItemType;
    itemId: string;
    boxId: string;
  }[];
}
interface UserType {
  id: string | undefined;
  username: string | undefined;
  profilePrictureUrl: string | undefined;
  xpBalance: number;
  privacyEnabled: boolean;
  xpExtraInfo: {
    level: number;
    lootCoinsToLevelUp: number;
    maxXPInThisLevel: number;
    minXPInThisLevel: number;
    xpToLevelUp: number;
  } | null;
}

interface BoxType {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  categories: {
    id: string;
    name: string;
  }[];
  items: ItemBoxType[];
  price: number;
  houseEdge: number;
  imageUrl: string;
  active: boolean;
}

// Create Battle Reducer
interface CreateBattleReducer {
  userId: string;
  privateMode: boolean;
  crazyMode: boolean;
  fastMode: boolean;
  teams: number;
  teamsSize: number;
  boxes: {
    box: BoxType;
    BCount: number;
  }[];
}

interface BattleReducer {
  battle: Battle;
  isWaitingRound?: boolean;
}

interface WinnerBattleReducer {
  winners: Team[];
}

interface BattlesReducer {
  battles: Battle[];
}
interface ItemBoxType {
  item: ItemType;
  frequency: number;
}

interface ItemType {
  uid: string;
  id: string;
  description: string;
  images: {
    id: string;
    url: string;
  }[];
  isDeleted: boolean;
  isInStock: boolean;
  name: string;
  price: number;
  slug: string;
  type: "PHYSICAL" | "VIRTUAL";
  variantOf: string;
  variants: [];
}

interface CryptoOption {
  label: string;
  value: string;
}

interface FilterType {
  sortBy?: string | null;
  searchText?: string | null;
  sortDescending?: boolean | null;
  totalPages?: number;
  page: number;
}

interface FilterLobbyType {
  page: number;
  totalPages?: number;
  teamTypes: {
    teams: number;
    teamsSize: number;
  }[];
  status?: string;
}

interface Team {
  id: number;
  players: Player[];
  totalPrice: number;
}

interface SelectOptionType {
  value: string;
  Label: string;
}
