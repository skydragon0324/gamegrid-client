import { ModalOverlay } from "../ModalOverlay";
import styles from "./mprofile.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import CopyIcon from "@/svgs/copy.svg";
import Image from "next/image";

import StatisIcon from "@/svgs/statisicon.svg";
import DollarCircle from "@/svgs/dollars.svg";
import CoinsIcon from "@/svgs/coins.svg";
import PiggyIcon from "@/svgs/piggy-bank.svg";
import FlashIcon from "@/svgs/flash.svg";
import CupIcon from "@/svgs/cup.svg";
import OpenedBox from "@/svgs/opened-box.svg";
import TicketBox from "@/svgs/ticket.svg";
import RatioCircle from "@/svgs/ratio-circle.svg";
import MoneyHandIcon from "@/svgs/money-hand.svg";
import BillIcon from "@/svgs/bill.svg";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import {
  API_URL,
  fetchEngagement,
  fetchFinance,
  fetchPerformance,
  sellItems,
} from "@/utils/api.service";
import { imageURI } from "@/utils/colordetector";
import {
  formatNumber,
  formatPrice,
  handleAvatar,
  handleErrorRequest,
} from "@/utils/handler";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Tabs } from "@/components/tabs/Tabs";
import classNames from "classnames";
import { updateMainState, updateModalsState } from "@/utils/updateState";
import { MainReducer } from "mredux/reducers/main.reducer";
import Moment from "react-moment";
import CountUp, { useCountUp } from "react-countup";
import Loader from "@/components/loader/Loader";

const tabs = ["Finance", "Engagement", "Performance"];

const apis = {
  finance: fetchFinance,
  engagement: fetchEngagement,
  performance: fetchPerformance,
};

const frT = (l: number) => formatPrice(l, false, false, true);

const FinancePart: FC = () => {
  const { finance } = useSelector<StateInterface, MainReducer>(
    (s) => s.mainReducer
  );
  return (
    <div
      className={classNames(
        styles.detailsContainer,
        !finance && styles.loading
      )}
    >
      {finance ? (
        <>
          <div className={styles.leftSide}>
            <div className={styles.itemText}>
              <h4>Wagered</h4>
              <span>
                <DollarCircle /> ${formatPrice(finance.wagered)}
              </span>
            </div>
            <div className={styles.itemText}>
              <h4>Total Deposited</h4>
              <span>
                <BillIcon /> ${formatPrice(finance.totalDeposited)}
              </span>
            </div>
            <div className={styles.itemText}>
              <h4>Rakeback Available</h4>
              <span>
                <CoinsIcon />
                {finance.rakeBackAvailable ? (
                  <> ${formatPrice(finance.rakeBackAvailable)}</>
                ) : (
                  "Not Available"
                )}
              </span>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.itemText}>
              <h4>Rakeback Earned</h4>
              <span>
                <MoneyHandIcon />{" "}
                {finance.rakeBackEarned ? (
                  <>${formatPrice(finance.rakeBackEarned)}</>
                ) : (
                  "Not Available"
                )}
              </span>
            </div>
            <div className={styles.itemText}>
              <h4>Total Withdrawn</h4>
              <span>
                <PiggyIcon /> ${formatPrice(finance.totalWithdrawn)}
              </span>
            </div>
          </div>
        </>
      ) : (
        <Loader radius={20} isBlue />
      )}
    </div>
  );
};

const EngagementPart: FC = () => {
  const { engagement } = useSelector<StateInterface, MainReducer>(
    (s) => s.mainReducer
  );
  return (
    <div
      className={classNames(
        styles.detailsContainer,
        !engagement && styles.loading
      )}
    >
      {engagement ? (
        <>
          <div className={styles.leftSide}>
            <div className={styles.itemText}>
              <h4>Lootboxes Opened</h4>
              <span>
                <OpenedBox /> {frT(engagement.lootBoxesOpened)}
              </span>
            </div>
            <div className={styles.itemText}>
              <h4>Weekly Raffle Tickets</h4>
              <span>
                <TicketBox /> {frT(engagement.numberOfWeeklyRaffleTickets)}
              </span>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.itemText}>
              <h4>Battles Fought</h4>
              <span>
                <FlashIcon /> {frT(engagement.battleFought)}
              </span>
            </div>
          </div>
        </>
      ) : (
        <Loader radius={20} isBlue />
      )}
    </div>
  );
};

const PerformancePart: FC = () => {
  const { performance } = useSelector<StateInterface, MainReducer>(
    (s) => s.mainReducer
  );
  return (
    <div
      className={classNames(
        styles.detailsContainer,
        !performance && styles.loading
      )}
    >
      {performance ? (
        <>
          <div className={styles.leftSide}>
            <div className={styles.itemText}>
              <h4>Number of Wins</h4>
              <span>
                <CupIcon /> {frT(performance.numberOfWins)}
              </span>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.itemText}>
              <h4>Win/Loss Ratio</h4>
              <span>
                <RatioCircle /> {frT(performance.numberOfWins)}/
                {frT(performance.numberOfLosses)} (
                {performance.winLossRatio * 1e2}%)
              </span>
            </div>
          </div>
        </>
      ) : (
        <Loader radius={20} isBlue />
      )}
    </div>
  );
};

export const StatisticsModal: FC = () => {
  const { user } = useSelector<StateInterface, MainReducer>(
    (s) => s.mainReducer
  );
  const { statisModal } = useSelector<StateInterface, ModalsReducer>(
    (s) => s.modalsReducer
  );

  const [parAnim, setPartAnim] = useState(0x0);
  const [currentTab, setCurrentTab] = useState(tabs[0x0]);

  const parcent = user
    ? Math.max(
        ((user.xpBalance - user.xpExtraInfo.minXPInThisLevel) /
          (user.xpExtraInfo.maxXPInThisLevel -
            user.xpExtraInfo.minXPInThisLevel)) *
          100,
        0x2
      )
    : 0;

  useEffect(() => {
    (async () => {
      try {
        let state = store.getState().mainReducer;
        let tab = currentTab.toLowerCase() as keyof typeof state;
        if (tab in state && !state[tab] && apis?.[tab as keyof typeof apis]) {
          let fetcher = await apis[tab as keyof typeof apis]();
          if (fetcher) {
            updateMainState({
              [tab]: fetcher,
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [currentTab]);

  useEffect(() => {
    if (statisModal && parcent !== parAnim) {
      let intrv = setTimeout(() => {
        setPartAnim(parcent);
      }, 500);

      return () => clearTimeout(intrv);
    }
  }, [parcent, statisModal]);

  useEffect(() => {
    return () => {
      setPartAnim(0x0);
    };
  }, []);

  return (
    <ModalOverlay
      isOpened={!!statisModal}
      className={styles.statisModal}
      onClose={() => {
        setPartAnim(0x0);
        updateModalsState({
          statisModal: false,
        });
      }}
    >
      <div className={styles.header}>
        <div className={styles.titleheader}>
          <StatisIcon />
          <span>STATISTICS</span>
        </div>
        <button
          className={styles.closebutton}
          onClick={() => {
            setPartAnim(0x0);
            updateModalsState({
              statisModal: false,
            });
          }}
        >
          <CrossIcon />
        </button>
      </div>

      <div className={styles.profilesection}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url(${handleAvatar(
              user?.avatar,
              user?.username
            )})`,
          }}
        ></div>
        <div className={styles.textpart}>
          <h2>{user?.username ?? "--"}</h2>
          <p>
            Joined on{" "}
            <span>
              {user && user?.createdAt ? (
                <Moment format="MMMM DD, YYYY">{user?.createdAt}</Moment>
              ) : (
                "--"
              )}
            </span>
          </p>
        </div>
      </div>

      <div className={styles.levelscontainer}>
        <div className={styles.level}>
          <div className={styles.divLine}>
            <h4>Your Level Progress</h4>
            <h4>{<CountUp start={0} end={parcent} duration={1.4} />}%</h4>
          </div>

          <div className={styles.linebar}>
            <div
              style={{
                width: parAnim + "%",
              }}
            ></div>
          </div>

          <div className={styles.divLine}>
            <div className={styles.flexy}>
              <span className={styles.line}>
                {user ? formatNumber(user.xpExtraInfo.level) : "--"}
              </span>
              <span>
                {user
                  ? formatPrice(
                      user.xpBalance - user.xpExtraInfo.minXPInThisLevel
                    )
                  : "--"}{" "}
                /{" "}
                {user
                  ? formatPrice(
                      user.xpExtraInfo.maxXPInThisLevel -
                        user.xpExtraInfo.minXPInThisLevel
                    )
                  : "--"}
              </span>
            </div>

            <span className={styles.linel}>
              {user ? formatNumber(user.xpExtraInfo.level + 1) : "--"}
            </span>
          </div>
        </div>
        <div
          className={styles.buy}
          onClick={() => {
            setPartAnim(0x0);
            updateModalsState({
              statisModal: false,
            });
            updateModalsState({
              buyxpModal: 0x0,
            });
          }}
        >
          Buy
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={currentTab}
        setActiveTab={(tab: string) => {
          setCurrentTab(tab);
        }}
        className={styles.tabsLo}
        fillerClass={styles.filler}
        stylesV2
      ></Tabs>

      {
        [<FinancePart />, <EngagementPart />, <PerformancePart />][
          tabs.indexOf(currentTab)
        ]
      }
    </ModalOverlay>
  );
};
