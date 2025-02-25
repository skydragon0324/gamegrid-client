import PassportIcon from "@/svgs/passport.svg";
import MasterCard from "@/svgs/mastercard.svg";
import ChevronUp from "@/svgs/chevron-up.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import ProfilePage, { ExternalPage } from ".";
import { ReactNode, useEffect, useState } from "react";
import styles from "@/parts/profile/profile.module.scss";
import { Layout } from "@/components/layout/Layout";
import classNames from "classnames";
import { Pagination } from "@/components/pagination";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import {
  BalanceTransaction,
  DepositTransaction,
  GameTransaction,
  MainReducer,
} from "mredux/reducers/main.reducer";
import {
  fetchBalancesTransactions,
  fetchDepositsTransactions,
  fetchGamesTransactions,
  fetchWithdrawsTransactions,
} from "@/utils/api.service";
import { UPDATE_MAIN_STATE } from "mredux/types";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { DepositsTable } from "@/parts/profile/DepositsTable";
import { GamesTable } from "@/parts/profile/GamesTable";
import Loader from "@/components/loader/Loader";
import { WithdrawTable } from "@/parts/profile/WithdrawTable";
import { AllTransTable } from "@/parts/profile/AllTable";
import { useWindowSize } from "@/hooks/windowSize";
import { Tabs } from "@/components/tabs/Tabs";
import { useFeatureIsOn } from "@growthbook/growthbook-react";

export const pages = ["Deposits", "Withdraws", "Game history", "Transactions"];

const sorters = [
  [
    {
      label: "Date",
      value: "createdAt",
      active: true,
    },
    "ID",
    "Method",
    {
      label: "Sum",
      value: "totals.total",
      active: true,
    },
    ,
    "Status",
  ],
  [
    {
      label: "Date",
      value: "createdAt",
      active: true,
    },
    "ID",
    "Method",
    "Details (Txid)",
    "Sum",
    "Status",
  ],
  [
    {
      label: "Date",
      value: "createdAt",
      active: true,
    },
    "ID",
    "Game type",
    "Amount spent",
    "Value Won",
    "XP Won",
    "Lootcoin Won",
    "Fairness",
  ],

  [
    {
      label: "Date",
      value: "createdAt",
      active: true,
    },
    "ID",
    "Type",
    "Balance Adjustment",
    "Final Balance",
  ],
];

const AllTypes = [
  "All",
  "ADMIN_ADJUSTMENT",
  "REFILL",
  "BUY_LOOT_COINS",
  "OPEN_LOOT_BOX",
  "SELL_ITEM",
  "GIFT_CARD",
  "PROMO_CODE",
  "REVERSE",
  "CARD",
  "CRYPTO",
  "BOX_BATTLE",
];

const GameTypes = ["BOX_OPEN", "BOX_BATTLE"];

export const TransactionsPage: ExternalPage = () => {
  const { width } = useWindowSize();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0x0);
  const [selectedTypeI, setSelectedTypeI] = useState<number>(0x0);
  const [selectedGameTypeI, setSelectedGameTypeI] = useState<number>(0x0);
  const [quries, setQueries] = useState<Record<string, any>>(
    Object.assign(
      {},
      ...pages.map((key) => ({
        [key.toLowerCase().replace(/\s/g, "_")]: {
          page: 0x0,
          size: 0x10,
          total: null,
        },
      }))
    )
  );

  const [sorter, setSorter] = useState<
    (
      | string
      | {
          label: string;
          value: string;
          active: boolean;
        }
      | undefined
    )[][]
  >(sorters);

  const { transactions } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const boxBattlesFF = useFeatureIsOn("box-battles");

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: UPDATE_MAIN_STATE,
      payload, ///
    });
  };

  const fetchDeposits = async () => {
    try {
      setLoading(true);

      const uI = sorter[selectedIndex].filter(
        (item) => typeof item === "object" && item.active
      ) as {
        label: string;
        value: string;
        active: boolean;
      }[];

      const res = await fetchDepositsTransactions(
        Object.assign(
          { sortDescending: false },
          {
            type: "DEPOSIT",
          },
          quries.deposits ?? {},
          uI && uI.length > 0x0
            ? { sortBy: uI[0x0].value, sortDescending: true }
            : {}
        )
      );

      setLoading(false);

      if (
        res &&
        ((res.content && Array.isArray(res.content)) || res.content === null)
      ) {
        quries.game_history.total !== res.totalPages &&
          setQueries({
            ...quries,
            game_history: {
              ...quries.game_history,
              total: res.totalPages,
            },
          });
        updateMainState({
          transactions: { ...transactions, deposits: res.content ?? [] },
        });
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  const fetchWithdraws = async () => {
    try {
      setLoading(true);

      const uI = sorter[selectedIndex].filter(
        (item) => typeof item === "object" && item.active
      ) as {
        label: string;
        value: string;
        active: boolean;
      }[];

      const res = await fetchWithdrawsTransactions(
        Object.assign(
          { sortDescending: false },
          quries.withdraws ?? {},
          uI.length > 0x0 ? { sortBy: uI[0x0].value, sortDescending: true } : {}
        )
      );

      setLoading(false);

      if (
        res &&
        ((res.content && Array.isArray(res.content)) || res.content === null)
      ) {
        quries.withdraws.total !== res.totalPages &&
          setQueries({
            ...quries,
            withdraws: {
              ...quries.withdraws,
              total: res.totalPages,
            },
          });
        updateMainState({
          transactions: { ...transactions, withdraws: res.content ?? [] },
        });
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);

      const uI = sorter[selectedIndex].filter(
        (item) => typeof item === "object" && item.active
      ) as {
        label: string;
        value: string;
        active: boolean;
      }[];

      const res = await fetchGamesTransactions(
        Object.assign(
          { sortDescending: false },
          // { type: "BOX_OPEN" },
          { type: GameTypes[selectedGameTypeI], sortDescending: true },
          quries.game_history ?? {},
          uI.length > 0x0 ? { sortBy: uI[0x0].value, sortDescending: true } : {}
        )
      );

      console.log({ res });

      setLoading(false);

      if (
        res &&
        ((res.content && Array.isArray(res.content)) || res.content === null)
      ) {
        console.log("here");
        quries.game_history.total !== res.totalPages &&
          setQueries({
            ...quries,
            game_history: {
              ...quries.game_history,
              total: res.totalPages,
            },
          });
        updateMainState({
          transactions: {
            ...transactions,
            game_history: res.content ?? [],
          },
        });
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  const fetchBalance = async () => {
    try {
      setLoading(true);

      const uI = sorter[selectedIndex].filter(
        (item) => typeof item === "object" && item.active
      ) as {
        label: string;
        value: string;
        active: boolean;
      }[];

      const res = await fetchBalancesTransactions(
        Object.assign(
          { sortDescending: false },
          quries.transactions ?? {},
          uI.length > 0x0
            ? { sortBy: uI[0x0].value, sortDescending: true }
            : {},
          selectedTypeI > 0x0
            ? AllTypes[selectedTypeI] !== "BOX_BATTLE"
              ? { subTypes: [AllTypes[selectedTypeI]], sortDescending: true }
              : {
                  subTypes: [
                    "BOX_BATTLE_REWARD",
                    "BOX_BATTLE_LEAVE",
                    "BOX_BATTLE_REIMBURSEMENT",
                    "BOX_BATTLE_DELETED",
                    "BOX_BATTLE_CREATE",
                    "BOX_BATTLE_KICK",
                    "BOX_BATTLE_JOIN",
                  ],
                  sortDescending: true,
                }
            : {}
        )
      );

      setLoading(false);

      if (
        res &&
        ((res.content && Array.isArray(res.content)) || res.content === null)
      ) {
        quries.transactions.total !== res.totalPages &&
          setQueries({
            ...quries,
            transactions: {
              ...quries.transactions,
              total: res.totalPages,
            },
          });
        updateMainState({
          transactions: {
            ...transactions,
            transactions: res.content ?? [],
          },
        });
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  const transactionsData = () => {
    let result = null;
    const key = pages[selectedIndex]?.toLowerCase().replace(/\s/g, "_");
    if (
      transactions &&
      transactions[key as keyof MainReducer["transactions"]] !== null
      // transactions?.[key as keyof MainReducer["transactions"]]
    ) {
      // result = transactions[key as keyof MainReducer["transactions"]];

      if (selectedIndex != 0x0) {
        result = transactions[key as keyof MainReducer["transactions"]];
      } else {
        result = transactions.deposits?.filter((i) => i.paymentNetwork != null);
      }
    }
    return result;
  };

  const GetTableByIndex = () => {
    let tableAvL = [
      <DepositsTable />,
      <WithdrawTable />,
      <GamesTable />,
      <AllTransTable />,
    ];
    return tableAvL?.[selectedIndex] ?? null;
  };

  useEffect(() => {
    if (selectedIndex === 0x0) {
      fetchDeposits();
    } else if (selectedIndex === 0x1) {
      fetchWithdraws();
    } else if (selectedIndex === 0x2) {
      fetchGames();
    } else if (selectedIndex === 0x3) {
      fetchBalance();
    }
  }, [quries, selectedIndex, sorter, selectedTypeI, selectedGameTypeI]);

  console.log({ transactions, quries });

  return (
    <>
      <div className={classNames(styles.wrapper, styles.transactions)}>
        {/* <div
          className={styles.tabs}
          style={{
            gridTemplateColumns: `repeat(${pages.length}, 1fr)`,
          }}
        >
          {pages.map((item, i) => (
            <button
              className={classNames(
                styles.tab,
                i === selectedIndex && styles.active
              )}
              key={i}
              onClick={() => setSelectedIndex(i)}
            >
              <h3>{item}</h3>
            </button>
          ))}
        </div> */}
        <Tabs
          tabs={pages}
          activeTab={pages.find((_, i) => i === selectedIndex) ?? ""}
          setActiveTab={(l, i) => setSelectedIndex(i ?? 0x0)}
        />
        {(selectedIndex === 0x2 && (
          <div className={styles.types}>
            {GameTypes.filter((item) =>
              boxBattlesFF ? true : item !== "BOX_BATTLE"
            ).map((item, i) => (
              <button
                className={classNames(
                  styles.typetab,
                  i === selectedGameTypeI && styles.active
                )}
                key={i}
                onClick={() => setSelectedGameTypeI(i)}
              >
                {item.toLowerCase().replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )) ||
          null}
        {(selectedIndex === 0x3 && (
          <div className={styles.types}>
            {AllTypes.filter((item) =>
              boxBattlesFF ? true : item !== "BOX_BATTLE"
            ).map((item, i) => (
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
        )) ||
          null}

        {!loading ? (
          transactionsData() !== null && transactionsData()?.length ? (
            width > 840 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      {sorter?.[selectedIndex].map(
                        (item, i) =>
                          item && (
                            <th key={i}>
                              <span
                                className={classNames(
                                  typeof item === "object" && styles.sorterc
                                )}
                                onClick={() => {
                                  setSorter(
                                    sorter.map((items, index) =>
                                      index === selectedIndex
                                        ? items.map((item, ii) =>
                                            typeof item === "object"
                                              ? {
                                                  ...item,
                                                  active: !!(
                                                    !item.active && i === ii
                                                  ),
                                                }
                                              : item
                                          )
                                        : items
                                    )
                                  );
                                }}
                              >
                                {typeof item === "object"
                                  ? item.label
                                  : item ?? ""}
                                {typeof item === "object" && (
                                  <div className={styles.sorter}>
                                    <ChevronUp
                                      className={classNames(
                                        item.active && styles.active
                                      )}
                                    />
                                    <ChevronDown
                                      className={classNames(
                                        !item.active && styles.active
                                      )}
                                    />
                                  </div>
                                )}
                              </span>
                            </th>
                          )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(transactionsData()) ? (
                      <GetTableByIndex />
                    ) : null}
                  </tbody>
                </table>

                {(quries?.[pages[selectedIndex].toLowerCase()]?.total && (
                  <Pagination
                    page={
                      quries?.[pages[selectedIndex].toLowerCase()]?.page ?? 0x0
                    }
                    totalPages={
                      quries?.[pages[selectedIndex].toLowerCase()]?.total
                    }
                    onChange={(index: number) => {
                      const key = pages[selectedIndex]
                        .toLowerCase()
                        .replace(/\s/g, "_");
                      setQueries({
                        ...quries,
                        [key]: {
                          ...(quries?.[key] ?? {}),
                          page: index,
                          size: 0x10,
                        },
                      });
                    }}
                  />
                )) ||
                  null}
              </>
            ) : (
              <>
                <br />

                {Array.isArray(transactionsData()) ? <GetTableByIndex /> : null}

                {(quries?.[
                  pages[selectedIndex].toLowerCase().replace(/\s/g, "_")
                ]?.total && (
                  <Pagination
                    page={
                      quries?.[
                        pages[selectedIndex].toLowerCase().replace(/\s/g, "_")
                      ]?.page ?? 0x0
                    }
                    totalPages={
                      quries?.[
                        pages[selectedIndex].toLowerCase().replace(/\s/g, "_")
                      ]?.total
                    }
                    onChange={(index: number) => {
                      const key = pages[selectedIndex]
                        .toLowerCase()
                        .replace(/\s/g, "_");
                      setQueries({
                        ...quries,
                        [key]: {
                          ...(quries?.[key] ?? {}),
                          page: index,
                          size: 0x10,
                        },
                      });
                    }}
                  />
                )) ||
                  null}
              </>
            )
          ) : (
            <>
              <p
                style={{
                  textAlign: "center",
                  margin: "20px auto",
                }}
              >
                No transactions as the moment
              </p>
            </>
          )
        ) : (
          <>
            <Loader radius={25} centered className={styles.loader} />
          </>
        )}
      </div>
    </>
  );
};

TransactionsPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <ProfilePage>{page}</ProfilePage>
    </Layout>
  );
};

export default TransactionsPage;
