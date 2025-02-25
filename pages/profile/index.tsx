import React, { FC, ReactNode, use, useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import classNames from "classnames";
import { IntroduceCard } from "pagesparts/home/introducecard";
import styles from "@/parts/profile/profile.module.scss";
import VerifyIcon from "@/svgs/verification-icon.svg";
import SettingsIcon from "@/svgs/settings.svg";
import CupIcon from "@/svgs/cup.svg";
import FairnessIcon from "@/svgs/fairness.svg";
import StatementsIcon from "@/svgs/statments.svg";
import ReclamationIcon from "@/svgs/reclamation.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import LootCoin from "@/svgs/lootcoin.svg";
import StatisIcon from "@/svgs/statisicon.svg";
import InventoryIcon from "@/svgs/inventory.svg";
import Swiper from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface, store } from "mredux";
import { ItemsBox, MainReducer } from "mredux/reducers/main.reducer";
import {
  calcDiscount,
  formatNumber,
  formatPrice,
  handleAvatar,
} from "utils/handler";
import { ShadowByColor } from "@/components/shadow/Shadow";
import Select from "react-select";
import { Dropdown } from "@/components/dropdown/dropdown";
import { useWindowSize } from "@/hooks/windowSize";
import { DropsItems } from "@/components/drops/drops";
import { InfoBoxes } from "@/components/infoboxes/infoboxes";
import { fetchBoxes, getUserStats } from "@/utils/api.service";
import { GameReducer } from "mredux/reducers/game.reducer";
import { UPDATE_GAME_STATE } from "mredux/types";
import { dominateColorFromUrls } from "@/utils/colordetector";
import Image from "next/image";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { updateMainState } from "@/utils/updateState";

export type ExternalPage<M = {}, L = {}> = FC<L> &
  M & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

export const profileTabs = [
  {
    name: "Verification",
    Icon: VerifyIcon,
    url: "/profile/verification",
    verified: () => {
      const { user } = store.getState().mainReducer;
      return user?.kycVerified ?? false;
    },
  },
  {
    name: "Transactions",
    Icon: StatementsIcon,
    url: "/profile/transactions",
  },
  {
    name: "Inventory",
    Icon: InventoryIcon,
    url: "/profile/inventory",
  },
  // {
  //   name: "Throphy Wall",
  //   Icon: CupIcon,
  //   url: "/profile/throphy",
  // },
  {
    name: "Settings",
    Icon: SettingsIcon,
    url: "/profile/settings",
  },
  {
    name: "Provably Fair",
    Icon: FairnessIcon,
    url: "/profile/fairness",
  },
];

export const ProfilePage: ExternalPage<{}, { children?: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const lootgg_login_enabled = useFeatureIsOn("lootgg_login_enabled");

  const { width } = useWindowSize();
  const dispatch = useDispatch<Dispatch<GameReducer>>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0x0);
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { boxes } = useSelector<StateInterface, GameReducer>(
    (state) => state.gameReducer
  );

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: "UPDATE_MODALS_STATE",
      payload,
    });
  };

  const handleChangePage = (url: string, index: number) => {
    setSelectedIndex(index);
    router.push(url);
  };

  const handleStats = async () => {
    try {
      const req = await getUserStats();
      if (req) {
        let userL = store.getState().mainReducer.user;
        userL &&
          updateMainState({
            user: {
              ...userL,
              ...req,
            },
          });
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (!children) {
      setSelectedIndex(0x0);
      // router.push("/profile/verification");
      router.push("/profile/transactions");
    }
  }, [children]);

  useEffect(() => {
    if (user === null) {
      router.push("/");
      lootgg_login_enabled &&
        updateModalsState({
          authModal: true,
          authTab: 0x0,
        });
    }
  }, [user]);

  useEffect(() => {
    for (let i = 0; i < profileTabs.length; i++) {
      if (profileTabs[i].url.includes(router.pathname)) {
        setSelectedIndex(i);
        break;
      }
    }
  }, [router.pathname]);

  useEffect(() => {
    handleStats();
  }, []);

  return (
    (user && (
      <div className={classNames(styles.profile, "contentinsider")}>
        <div className={styles.content}>
          <div className={styles.leftsection}>
            <div className={styles.profilesection}>
              <div
                className={styles.circleAvatar}
                style={{
                  backgroundImage: `url(${handleAvatar(
                    user.avatar ?? null,
                    user.username
                  )})`,
                }}
              ></div>

              <div className={styles.details}>
                <h3>{user.username ?? "--"}</h3>
                <div className={styles.progressline}>
                  <span className={styles.line}>
                    {formatNumber(user.xpExtraInfo.level)}
                  </span>

                  <div className={styles.divider}>
                    <div className={styles.progressLevel}>
                      <span>
                        {formatPrice(
                          user.xpBalance - user.xpExtraInfo.minXPInThisLevel
                        )}{" "}
                        /{" "}
                        {formatPrice(
                          user.xpExtraInfo.maxXPInThisLevel -
                            user.xpExtraInfo.minXPInThisLevel
                        )}
                      </span>
                      <div className={styles.bar}>
                        <div
                          style={{
                            width: `${Math.max(
                              ((user.xpBalance -
                                user.xpExtraInfo.minXPInThisLevel) /
                                (user.xpExtraInfo.maxXPInThisLevel -
                                  user.xpExtraInfo.minXPInThisLevel)) *
                                100,
                              0x2
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <button
                      className={styles.buyButton}
                      onClick={() =>
                        updateModalsState({
                          buyxpModal: 0x0,
                        })
                      }
                    >
                      Buy
                    </button>
                  </div>
                </div>
                <div className={styles.coin}>
                  <div className={styles.left}>
                    <LootCoin />
                    <span>{formatPrice(user.lootCoinsBalance)}</span>
                  </div>
                  <button
                    className={styles.buyButton}
                    onClick={() =>
                      updateModalsState({
                        buyxpModal: 0x1,
                      })
                    }
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
            <button
              className={classNames("primarybutton", styles.statisbtn)}
              onClick={() =>
                updateModalsState({
                  statisModal: true,
                })
              }
            >
              <StatisIcon />
              <span>Profile Statistics</span>
            </button>

            <div className={styles.tabs}>
              {profileTabs.map((tab, index) => (
                <button
                  className={classNames(
                    styles.tabbutton,
                    index === selectedIndex && styles.active
                  )}
                  onClick={() => handleChangePage(tab.url, index)}
                  key={index}
                >
                  <div className={styles.left}>
                    <span className={styles.iconCircle}>
                      <tab.Icon />
                    </span>
                    <span className={styles.text}>{tab.name ?? ""}</span>
                  </div>
                  {/* <div className={styles.right}>
                    {tab?.verified && !tab.verified() && <ReclamationIcon />}
                  </div> */}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rightsection}>
            <div className={styles.devider}>
              <h1 key={profileTabs[selectedIndex].name ?? "--"}>
                {profileTabs[selectedIndex].name ?? "--"}
              </h1>
              {(width < 1065 && (
                <Dropdown
                  classNameButton={styles.dropdownbutton}
                  classNameList={styles.dropdownlist}
                  currentIndex={selectedIndex}
                  options={profileTabs.map((item) => {
                    return {
                      Label: <>{item.name.toLowerCase()}</>,
                      value: item.url,
                      onClick: () => {
                        handleChangePage(item.url, selectedIndex);
                      },
                    };
                  })}
                  onChange={(index) =>
                    handleChangePage(profileTabs[index].url, index)
                  }
                >
                  <span>{profileTabs[selectedIndex].name.toLowerCase()}</span>
                  <ChevronDown />
                </Dropdown>
              )) ||
                null}
            </div>

            {children ?? null}
          </div>
        </div>
        <InfoBoxes />
      </div>
    )) ||
    null
  );
};

ProfilePage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default ProfilePage;
