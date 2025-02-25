export const BATTLE_TYPE_LIST: SelectOptionType[] = [
  { value: "WAITING_FOR_PLAYERS", Label: "WAITING" },
  { value: "in_progress", Label: "IN_PROGRESS" },
  { value: "completed", Label: "COMPLETED" },
];

export const BOX_SORT_LIST: SelectOptionType[] = [
  { value: "latest", Label: "Latest" },
  { value: "cheapest", Label: "Cheapest" },
  { value: "expensice", Label: "Expensive" },
];

export const WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS";
export const READY_TO_START = "READY_TO_START";
export const IN_PROGRESS = "IN_PROGRESS";
export const ROUND_FINISHED = "ROUND_FINISHED";
export const COMPLETED = "COMPLETED";
export const WAITING_EOS_HASH = "WAITING_EOS_HASH";
export const CALCULATING_REWARDS = "CALCULATING_REWARDS";
export const REWARDING = "REWARDING";
export const START_PENDING = "START_PENDING";
export const WAITING_USER_SEEDS = "WAITING_USER_SEEDS";
export const DELETED = "DELETED";
export const COMMITTED_EOS_BLOCK = "COMMITTED_EOS_BLOCK";
