import { FC, useEffect, useRef, useState } from "react";
import styles from "./navbar.module.scss";
import classNames from "classnames";
import Image from "next/image";
import LogoImage from "@/svgs/logo.svg";
import BoxIcon from "@/svgs/box.svg";
import PlusIcon from "@/svgs/pluscircle.svg";
import FreeBoxIcon from "@/svgs/freebox.svg";
import AlarmIcon from "@/svgs/alarm.svg";
import ArchieveIcon from "@/svgs/archievebox.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import StarsIcon from "@/svgs/stars.svg";
import AffiliatesIcon from "@/svgs/users.svg";
import CupIcon from "@/svgs/cup.svg";
import HamburgerIcon from "@/svgs/hamburger.svg";
import CloseIcon from "@/svgs/close.svg";
import Statements from "@/svgs/statments.svg";
import LeaderboardIcon from "@/svgs/cup.svg";
import LogoutIcon from "@/svgs/logout.svg";
import WalletIcon from "@/svgs/wallet.svg";
import LightWalletIcon from "@/svgs/wallet2.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import SettingsIcon from "@/svgs/settings.svg";
import VerificationIcon from "@/svgs/verification-icon.svg";
import StatementsIcon from "@/svgs/statments.svg";
import GreyBitcoin from "@/svgs/bitcoin.svg";
import { useWindowSize } from "@/hooks/windowSize";
import { StateInterface, store } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { useSelector } from "react-redux";
import {
  formatNumber,
  formatPrice,
  handleAvatar,
  handleErrorRequest,
  shortIt,
} from "@/utils/handler";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { Dropdown } from "../dropdown/dropdown";
import { useRouter } from "next/router";
import { fetchInventory, sellItems } from "@/utils/api.service";
import { Skeleton } from "../sekelton/Skeleton";
import { imageURI } from "@/utils/colordetector";
import { toast } from "react-hot-toast";
import Loader from "../loader/Loader";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import CountUp from "react-countup";
import BattleIcon from "@/svgs/sward.svg";
import { parseNumberToCommas } from "react-letshook";

export const taskRoutes = [
  {
    title: "Cases",
    path: "/",
    Icon: BoxIcon,
  },
  {
    title: "Battles",
    path: "/case/lobby",
    Icon: BattleIcon,
  },
  // {
  //   title: "Free Case",
  //   path: "/",
  //   Icon: FreeBoxIcon,
  // },
  // {
  //   title: "Rewards",
  //   path: "/",
  //   Icon: StarsIcon,
  // },
  // {
  //   title: "Affiliates",
  //   path: "/",
  //   Icon: AffiliatesIcon,
  // },
  // {
  //   title: "Leaderboard",
  //   path: "/",
  //   Icon: LeaderboardIcon,
  // },
];

export const Navbar: FC = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const {
    user,
    currentPage,
    navbarInventory,
    refreshInventory,
    inventory,
    startNV,
    lineprogressNV,
  } = useSelector<StateInterface, MainReducer>((state) => state.mainReducer);
  const [curPage, setCurPage] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const lootgg_login_enabled = useFeatureIsOn("lootgg_login_enabled");
  const lootgg_registration_enabled = useFeatureIsOn(
    "lootgg_registration_enabled"
  );
  const lootgg_withdraw_enabled = useFeatureIsOn("lootgg_withdraw_enabled");
  const lootgg_deposit_enabled = useFeatureIsOn("lootgg_deposit_enabled");
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const [queries, setQueries] = useState({
    page: 0x0,
  });

  const [inventoryCheckBoxes, setInCb] = useState<Record<string, boolean>>({});
  const [selectAll, setSellectAll] = useState<boolean>(false);
  const [buttonSellLoading, setBsl] = useState<boolean>(false);
  const [inventoryPanel, setInventoryPanel] = useState<boolean>(false);

  // const [start, setStart] = useState(0);
  // const [startLevel, setStartLVL] = useState(0);
  // const [lineprogress, setProgLine] = useState(false);

  const boxBattlesFF = useFeatureIsOn("box-battles");
  const [routes, setRoutes] = useState(taskRoutes);

  useEffect(() => {
    let filteredRoutes: typeof taskRoutes = taskRoutes;
    if (!boxBattlesFF) {
      filteredRoutes = taskRoutes.filter(
        (route) => route.path !== "/case/lobby"
      );
    }

    setRoutes(filteredRoutes);
  }, [boxBattlesFF]);

  useEffect(() => {
    if (router.pathname === "/" || router.pathname.startsWith("/boxes")) {
      setCurPage("/");
    } else if (router.pathname.startsWith("/case")) {
      !boxBattlesFF ? router.replace("/") : setCurPage("/case/lobby");
    } else {
      setCurPage("/");
    }
  }, [router.pathname, boxBattlesFF]);

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: "UPDATE_MAIN_STATE",
      payload,
    });
  };

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((l) => [...l, index]);
    }
  };

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: "UPDATE_MODALS_STATE",
      payload,
    });
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");

      if ("keycloakLK" in (window as any)) {
        (window as any).keycloakLK?.logout();
      } else {
        router.push("/");
        // location.reload();
      }
    } catch (e) {
      toast.error(handleErrorRequest(e));
    }
  };

  const handleSelectAll = () => {
    setSellectAll((m) => {
      const u = !m;

      !u && setInCb({});
      u &&
        navbarInventory &&
        setInCb(
          Object.assign(
            {},
            ...navbarInventory.map((item) => ({
              [item.id]: !!item.item.isSellable,
            }))
          )
        );
      return u;
    });
  };

  const handleCashOut = () => {
    try {
      const selectedItems = Object.keys(inventoryCheckBoxes).filter(
        (key) => inventoryCheckBoxes[key]
      );

      if (!selectedItems.length) return;

      updateModalsState({
        sellItemModal: inventory?.filter((l) => selectedItems.includes(l.id)),
        sellItemModalTab: 0x1,
      });
    } catch (error) {}
  };

  const handleSell = (tab: number) => {
    try {
      const selectedItems = Object.keys(inventoryCheckBoxes).filter(
        (key) => inventoryCheckBoxes[key]
      );

      if (!selectedItems.length) return;

      updateModalsState({
        sellItemModal: inventory?.filter((l) => selectedItems.includes(l.id)),
        sellItemModalTab: tab,
      });

      // setSellectAll(false);
      // setInCb({});
    } catch (error) {}
  };

  const handleSellItems = async () => {
    try {
      const selectedItems = Object.keys(inventoryCheckBoxes).filter(
        (key) => inventoryCheckBoxes[key]
      );

      if (!selectedItems.length) return;

      setBsl(true);

      const res = await sellItems(selectedItems);

      const totalSold = navbarInventory?.reduce(
        (a, b) =>
          b.id in inventoryCheckBoxes && inventoryCheckBoxes[b.id]
            ? a + b.item.price
            : a,
        0x0
      );

      if (user) {
        updateMainState({
          user: {
            ...user,
            usdBalance: user.usdBalance + (totalSold ?? 0),
          },
        });
      }

      // remove the selectedItems from inventoryCheckBoxes
      setInCb((inputs) =>
        Object.assign(
          {},
          ...Object.keys(inputs)
            .filter((key) => !selectedItems.includes(key))
            .map((key) => ({
              [key]: inputs[key],
            }))
        )
      );

      setTimeout(() => {
        fetchUserInventory()
          .then(() => setBsl(false))
          .catch(() => setBsl(false));
      }, 1000);

      setSellectAll(false);
      toast.success("Items sold successfully");
    } catch (e) {
      setBsl(false);
      // console.log(e);
      toast.error(handleErrorRequest(e));
    }
  };

  // const updateNVA = (obj: Partial<MainReducer["navbarAnimation"]>) => {
  //   let state = store.getState().mainReducer.navbarAnimation;

  //   state[Object.keys(obj)[0x0] as keyof typeof state] !==
  //     obj[Object.keys(obj)[0x0] as keyof typeof state] &&
  //     updateMainState({
  //       navbarAnimation: {
  //         ...state,
  //         ...obj,
  //       },
  //     });
  // };

  const fetchUserInventory = async () => {
    try {
      if (user) {
        const ingame = store.getState().gameReducer.ingame;

        if (ingame) {
          return;
        }

        // const fetchToGetTotalItems = await fetchInventory(user.id, {
        //   size: "10",
        //   page: String(queries.page),
        // });

        // const totalInventoryItems = fetchToGetTotalItems?.totalElements ?? "10";

        const allInventoryItems = await fetchInventory(user.id, {
          // size:
          //   String(totalInventoryItems) === "0" ? "10" : totalInventoryItems,
          // size: 10,
          size: 99999,
          page: queries.page,
        });

        (allInventoryItems?.content ?? []).length &&
          setInCb((inputs) =>
            Object.assign(
              {},
              ...allInventoryItems?.content.map((item) => ({
                [item.id]: false,
              })),
              inputs
            )
          );

        updateMainState({
          navbarInventory: allInventoryItems?.content,
          inventory: allInventoryItems?.content,
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const closeDropDowns = () => {
    setSellectAll(false);
    setInCb({});
  };

  useEffect(() => {
    user && fetchUserInventory();
  }, [queries, inventoryPanel, refreshInventory]);

  // console.log({ navbarInventory });
  useEffect(() => {
    let j = setTimeout(() => {
      updateMainState({
        lineprogressNV: true,
      });
    }, 500);

    return () => clearTimeout(j);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sideTabs = [
    {
      name: "Verification",
      Icon: VerificationIcon,
      url: "/profile/verification",
    },
    {
      name: "Transactions",
      Icon: StatementsIcon,
      url: "/profile/transactions",
    },
    {
      name: "Settings",
      Icon: SettingsIcon,
      url: "/profile/settings",
    },
  ];

  return (
    (width && (
      <header
        className={`${styles.navbar} ${
          isSidebarOpen ? styles.sidebarActive : ""
        }`}
      >
        <div className={classNames("contentinsider", styles.container)}>
          <div className={styles.leftsection}>
            {width < 426 ? (
              <div
                className={`${styles.hamburger} ${
                  isSidebarOpen ? styles.hide : ""
                }`}
                onClick={toggleSidebar}
              >
                <HamburgerIcon />
              </div>
            ) : (
              <LogoImage
                className={styles.logo}
                onClick={() => {
                  router.push("/");
                  updateMainState({
                    currentPage: "/",
                  });
                }}
              />
            )}
            {width < 426 && (
              <div
                className={`${styles.sidebar} ${
                  isSidebarOpen ? styles.open : ""
                }`}
              >
                <div className={styles.sideNavBar}>
                  <LogoImage
                    className={styles.logo}
                    onClick={() => {
                      toggleSidebar();
                      router.push("/");
                    }}
                  />
                  <button className={styles.closeBtn} onClick={toggleSidebar}>
                    <CloseIcon />
                  </button>
                </div>
                <div>
                  <div className={styles.profilesection}>
                    <div
                      className={styles.circleAvatar}
                      style={{
                        backgroundImage: `url(${handleAvatar(
                          null,
                          user?.username
                        )})`,
                      }}
                      onClick={() => {
                        // if (width <= 1080) {
                        //   updateMainState({
                        //     mobileMenu: true,
                        //   });
                        // } else {
                        router.push("/profile");
                        // }
                      }}
                    ></div>

                    <>
                      <div className={styles.details}>
                        <h3>{user ? user?.username : "--"}</h3>
                        <div className={styles.progressline}>
                          <span className={styles.line}>
                            {user ? formatNumber(user.xpExtraInfo.level) : "--"}
                          </span>
                          <div className={styles.progressLevel}>
                            <span>
                              {user
                                ? formatPrice(
                                    user.xpBalance -
                                      user.xpExtraInfo.minXPInThisLevel
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
                            <div className={styles.bar}>
                              <div
                                style={{
                                  width: `${
                                    user
                                      ? Math.max(
                                          ((user.xpBalance -
                                            user.xpExtraInfo.minXPInThisLevel) /
                                            (user.xpExtraInfo.maxXPInThisLevel -
                                              user.xpExtraInfo
                                                .minXPInThisLevel)) *
                                            100,
                                          0x2
                                        )
                                      : 0x0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                </div>

                {user && (
                  <div className={styles.buttonHolder}>
                    <button
                      className={styles.notibutton}
                      onClick={() => {
                        toggleSidebar();
                        router.push("/profile/inventory");
                      }}
                    >
                      <ArchieveIcon />
                      <span>Inventory</span>
                    </button>
                    <button className={styles.notibutton}>
                      <AlarmIcon />
                      <span>Notification</span>
                    </button>
                  </div>
                )}

                {user && (
                  <div className={styles.sideBarHolder}>
                    {sideTabs.map((tab, index) => (
                      <button
                        className={styles.tabbutton}
                        onClick={() => {
                          toggleSidebar();
                          router.push(tab.url);
                        }}
                        key={index}
                      >
                        <div className={styles.left}>
                          <span className={styles.iconCircle}>
                            <tab.Icon />
                          </span>
                          <span className={styles.text}>{tab.name ?? ""}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* {(width > 777 && ( */}
            <div className={styles.buttons}>
              {routes.map(
                (route, i) =>
                  (width > 1344 ? true : width > 768 ? i <= 1 : false) && (
                    <button
                      className={classNames(
                        styles.routeButton,
                        curPage === route.path && styles.active
                      )}
                      onClick={() => {
                        route.path && router.push(route.path);
                        updateMainState({
                          currentPage: route.path,
                        });
                      }}
                      key={i}
                    >
                      <span className={styles.circleIcon}>
                        <route.Icon />
                      </span>
                      <span className={styles.text}>{route.title}</span>
                    </button>
                  )
              )}
              {width < 768 && (
                <Dropdown
                  normalList
                  classNameButton={classNames(
                    styles.dropdownbuttonMore
                    // currentPage === route.path && styles.active
                  )}
                  classNameList={styles.dropdownMorelist}
                  options={routes.map((route, i) => ({
                    Label: (
                      <>
                        <span className={styles.circleIcon}>
                          <route.Icon />
                        </span>
                        <span className={styles.text}>{route.title}</span>
                      </>
                    ),
                    value: "route",
                    onClick: () => {
                      route.path && router.push(route.path);
                      updateMainState({
                        currentPage: route.path,
                      });
                    },
                    className: classNames(
                      styles.routeButton,
                      curPage === route.path && styles.active
                    ),
                  }))}
                  onChange={() => void 0x0}
                >
                  <span>More</span>
                  <ChevronDown />
                </Dropdown>
              )}
            </div>
            {/* // )) ||
          //   null} */}
          </div>
          <div className={styles.rightsection}>
            {user ? (
              <>
                <div className={styles.balanceLk}>
                  <span className={styles.text}>
                    ${" "}
                    <CountUp
                      duration={0.4}
                      decimals={2}
                      decimal={","}
                      formattingFn={(number: number) => {
                        return parseNumberToCommas(number);
                      }}
                      onEnd={() => {
                        startNV !== user.usdBalance &&
                          updateMainState({
                            startNV: user.usdBalance ?? 0x0,
                          });
                      }}
                      start={startNV}
                      end={user.usdBalance ?? 0x0}
                    />
                  </span>
                  <button
                    className={styles.depoIcon}
                    onClick={() => {
                      (lootgg_deposit_enabled || lootgg_withdraw_enabled) &&
                        updateModalsState({
                          walletModal: true,
                          walletTab: lootgg_deposit_enabled ? 0x0 : 0x1,
                        });
                    }}
                  >
                    <PlusIcon />
                  </button>
                </div>
                {(width > 1080 && (
                  <div className={styles.staticLarms} ref={dropdownRef}>
                    <Dropdown
                      normalList
                      classNameButton={styles.archievebox}
                      classNameList={styles.inventory}
                      panelContent={
                        <div className={styles.inventoryPanel}>
                          <div className={styles.content}>
                            <button
                              className={styles.inredibtton}
                              onClick={() => {
                                router.push("/profile/inventory");
                                updateModalsState({
                                  closeRequestDropDowns: true,
                                });
                              }}
                            >
                              <ArchieveIcon />
                              <div className={styles.details}>
                                <p>
                                  {Array.isArray(navbarInventory) &&
                                  navbarInventory.length
                                    ? `${navbarInventory.length}`
                                    : "0"}{" "}
                                  items
                                </p>
                                <h3>View full inventory</h3>
                              </div>
                            </button>

                            <div
                              className={classNames(
                                styles.selector,
                                (!navbarInventory || !navbarInventory.length) &&
                                  styles.disabled
                              )}
                              onClick={() => handleSelectAll()}
                            >
                              <label className="checkbox">
                                <input
                                  type="checkbox"
                                  checked={
                                    !navbarInventory || !navbarInventory.length
                                      ? false
                                      : selectAll
                                  }
                                  onClick={() => handleSelectAll()}
                                  onChange={() => void 0x0}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <span className={styles.text}>Select all</span>
                            </div>
                            <div className={styles.hrline}></div>

                            {Array.isArray(navbarInventory) ? (
                              navbarInventory.length ? (
                                navbarInventory
                                  // .slice(0, 0xa)
                                  .map(
                                    (item, i) =>
                                      (item && (
                                        <div className={styles.item} key={i}>
                                          <label
                                            className="checkbox"
                                            aria-disabled={
                                              !item.item.isSellable
                                            }
                                          >
                                            <input
                                              type="checkbox"
                                              onChange={(l) =>
                                                item.item.isSellable &&
                                                setInCb((p) =>
                                                  Object.assign({}, p, {
                                                    [item.id]: l.target.checked,
                                                  })
                                                )
                                              }
                                              checked={
                                                !!(
                                                  item.id in
                                                    inventoryCheckBoxes &&
                                                  inventoryCheckBoxes[item.id]
                                                )
                                              }
                                            />
                                            <span className="checkmark"></span>
                                          </label>

                                          <div
                                            className={styles.itemImagePreview}
                                          >
                                            <img
                                              src={
                                                failedImages.includes(i)
                                                  ? "/imgs/placeholder.png"
                                                  : item?.item?.images &&
                                                      item?.item?.images.length
                                                    ? item.item.images[0x0].url
                                                    : imageURI(
                                                        item?.item?.id ?? "",
                                                        "item"
                                                      )
                                              }
                                              alt=""
                                              onError={() =>
                                                handleImageFailed(i)
                                              }
                                            />
                                          </div>
                                          <div className={styles.details}>
                                            <h2 title={item.item.name}>
                                              {shortIt(item.item.name, 30)}
                                            </h2>
                                            <p>Electronic</p>
                                            <p className={styles.amount}>
                                              $ {formatPrice(item.item.price)}
                                            </p>
                                          </div>
                                        </div>
                                      )) ||
                                      null
                                  )
                              ) : (
                                <>
                                  <span>
                                    No items on inventory at the moment
                                  </span>
                                </>
                              )
                            ) : (
                              new Array(10)
                                .fill(0x0)
                                .map((_, i) => (
                                  <Skeleton
                                    key={i}
                                    className={styles.skeleton}
                                  />
                                ))
                            )}
                          </div>

                          {inventoryCheckBoxes &&
                            navbarInventory &&
                            !!Object.keys(inventoryCheckBoxes).filter(
                              (key) => inventoryCheckBoxes[key]
                            ).length &&
                            !!navbarInventory.length && (
                              <div className={styles.buttonsSide}>
                                <button
                                  className={styles.primbutton}
                                  disabled={
                                    !navbarInventory ||
                                    buttonSellLoading ||
                                    !Object.keys(inventoryCheckBoxes).filter(
                                      (key) => inventoryCheckBoxes[key]
                                    ).length
                                  }
                                  // onClick={() => handleSellItems()}
                                  onClick={() => handleSell(0x0)}
                                >
                                  {buttonSellLoading ? (
                                    <Loader radius={17} />
                                  ) : (
                                    <>
                                      <LightWalletIcon />
                                      <span className={styles.buttonText}>
                                        Sell for $
                                        {formatPrice(
                                          navbarInventory?.reduce(
                                            (a, b) =>
                                              b.id in inventoryCheckBoxes &&
                                              inventoryCheckBoxes[b.id]
                                                ? a + b.item.price
                                                : a,
                                            0x0
                                          ) ?? 0x0
                                        )}
                                      </span>
                                    </>
                                  )}
                                </button>
                                <button
                                  className={styles.secondbutton}
                                  disabled={
                                    !navbarInventory ||
                                    buttonSellLoading ||
                                    !Object.keys(inventoryCheckBoxes).filter(
                                      (key) => inventoryCheckBoxes[key]
                                    ).length
                                  }
                                  onClick={handleCashOut}
                                >
                                  {/* <ExpandIcon /> */}
                                  <GreyBitcoin />
                                  <span>Cash Out</span>
                                </button>
                              </div>
                            )}
                        </div>
                      }
                      onChangePanel={(l) => setInventoryPanel(l)}
                      onChange={() => void 0x0}
                      onClose={closeDropDowns}
                    >
                      <ArchieveIcon />
                    </Dropdown>
                    <button className={styles.notibutton}>
                      <AlarmIcon />
                    </button>
                  </div>
                )) ||
                  null}

                <div className={styles.profilesection}>
                  <div
                    className={styles.circleAvatar}
                    style={{
                      backgroundImage: `url(${handleAvatar(
                        null,
                        user?.username
                      )})`,
                    }}
                    onClick={() => {
                      // if (width <= 1080) {
                      //   updateMainState({
                      //     mobileMenu: true,
                      //   });
                      // } else {
                      router.push("/profile");
                      // }
                    }}
                  ></div>
                  {(width > 1080 && (
                    <>
                      <div className={styles.details}>
                        <h3>{user?.username}</h3>
                        <div className={styles.progressline}>
                          <span className={styles.line}>
                            {formatNumber(user.xpExtraInfo.level ?? 0x0)}
                          </span>
                          <div className={classNames(styles.progressLevel)}>
                            <span
                              className={classNames(
                                lineprogressNV && styles.appear
                              )}
                            >
                              {formatPrice(
                                user.xpBalance -
                                  user.xpExtraInfo.minXPInThisLevel ?? 0x0
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
                                  width: `${
                                    lineprogressNV
                                      ? Math.max(
                                          ((user.xpBalance -
                                            user.xpExtraInfo.minXPInThisLevel) /
                                            (user.xpExtraInfo.maxXPInThisLevel -
                                              user.xpExtraInfo
                                                .minXPInThisLevel)) *
                                            100,
                                          0x2
                                        )
                                      : 0x0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Dropdown
                        normalList
                        classNameButton={styles.dropdownbutton}
                        classNameList={styles.dropdownlist}
                        options={[
                          {
                            Label: (
                              <>
                                <VerificationIcon />
                                <span>Verification</span>
                              </>
                            ),
                            value: "verification",
                            className: styles.regular,
                            onClick: () => router.push("/profile/verification"),
                          },
                          {
                            Label: (
                              <>
                                <Statements />
                                <span>Transactions</span>
                              </>
                            ),
                            className: styles.regular,

                            value: "transactions",
                            onClick: () => router.push("/profile/transactions"),
                          },
                          // {
                          //   Label: (
                          //     <>
                          //       <CupIcon />
                          //       <span>Throphy wall</span>
                          //     </>
                          //   ),
                          //   value: "trophy",
                          //   onClick: () => router.push("/profile/trophy"),
                          //   className: styles.regular,
                          // },
                          // {
                          //   Label: (
                          //     <>
                          //       <InventoryIcon />
                          //       <span></span>
                          //     </>
                          //   ),
                          //   value: "logout2",
                          //   onClick: logout,
                          // },
                          {
                            Label: (
                              <>
                                <SettingsIcon />
                                <span>Settings</span>
                              </>
                            ),
                            value: "settings",
                            className: styles.regular,

                            onClick: () => router.push("/profile/settings"),
                          },
                          {
                            Label: (
                              <>
                                <LogoutIcon />
                                <span>Logout</span>
                              </>
                            ),
                            className: styles.logout,
                            value: "logout",

                            onClick: logout,
                          },
                        ]}
                        onChange={() => void 0x0}
                      >
                        <ChevronDown />
                      </Dropdown>
                    </>
                  )) ||
                    null}
                </div>
              </>
            ) : (
              <div className={styles.buttons}>
                {lootgg_login_enabled && (
                  <button
                    className={styles.routeButton}
                    onClick={() =>
                      updateModalsState({ authModal: true, authTab: 0x0 })
                    }
                  >
                    <span className={styles.text}>Login</span>
                  </button>
                )}
                {lootgg_registration_enabled && (
                  <button
                    className={styles.routeButtonSecond}
                    onClick={() =>
                      updateModalsState({ authModal: true, authTab: 0x1 })
                    }
                  >
                    <span className={styles.text}>Register</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    )) ||
    null
  );
};
