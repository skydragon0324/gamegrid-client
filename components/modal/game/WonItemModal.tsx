import { ModalOverlay } from "../ModalOverlay";
import styles from "./mgame.module.scss";
import WalletIcon from "@/svgs/wallet.svg";
import ExpandIcon from "@/svgs/expanarrow.svg";
import CirckeChecked from "@/svgs/circlecheckmark.svg";
import CrossIcon from "@/svgs/cross.svg";
import LootCoin from "@/svgs/lootcoin.svg";
import XPCoin from "@/svgs/xp-icon.svg";
import RefreshIcon from "@/svgs/refresh.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { API_URL, sellItems } from "@/utils/api.service";
import { colorByVariant, imageURI } from "@/utils/colordetector";
import { formatPrice, handleErrorRequest, shortIt } from "@/utils/handler";
import { UPDATE_GAME_STATE, UPDATE_MODALS_STATE } from "mredux/types";
import FairnessIcon from "@/svgs/fairness.svg";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { GameReducer } from "mredux/reducers/game.reducer";
import { useRouter } from "next/router";
import { MainReducer } from "mredux/reducers/main.reducer";
import { useWindowSize } from "@/hooks/windowSize";
import { updateMainState } from "@/utils/updateState";
import useRudderStackAnalytics from "@/utils/rudderstack";
import { CustomCSSProperties } from "@/pages/_app";
import classNames from "classnames";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { SwiperRef } from "swiper/react";

export const WonItemModal = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [loadingsell, setLoadingsell] = useState<boolean>(false);
  const [itemSold, setitemsold] = useState<boolean>(false);
  const analytics = useRudderStackAnalytics();
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<boolean[]>([]);
  const [selectAll, setSellectAll] = useState<boolean>(true);

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((l) => [...l, index]);
    }
  };

  const { itemsUserWon } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const { boxDetails, spins } = useSelector<StateInterface, GameReducer>(
    (state) => state.gameReducer
  );

  const { user, cryptoPaymentsAvailable, inventory } = useSelector<
    StateInterface,
    MainReducer
  >((state) => state.mainReducer);

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const updateGameState = (payload: Partial<GameReducer>) => {
    store.dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  const sellItem = async () => {
    try {
      if (!itemsUserWon) return;

      let itemsTbe = itemsUserWon.filter((_, i) => !!selectedIndexes?.[i]);

      if (itemsTbe.length === 0) {
        toast.error("Please select at least one item to sell");
        return;
      }

      let idsToBeSold = itemsTbe
        .map((item) => item.userItemWon?.id ?? "")
        .filter((i) => i.length > 0);

      if (idsToBeSold.length === 0) {
        if (selectedIndexes.length !== 0) {
          toast.error(
            "Something went wrong, please try again in inventory page"
          );
        }
        return;
      }

      setLoadingsell(true);

      const sellReq = await sellItems(idsToBeSold);

      setLoadingsell(false);

      if (Array.isArray(sellReq)) {
        for (let h = 0; h < sellReq.length; h++) {
          let itemSl = itemsUserWon.find(
            (item) => item.userItemWon?.id === sellReq[h]
          );
          analytics &&
            sellReq?.[h] &&
            itemSl &&
            analytics.track("ITEM_SOLD", {
              itemName: itemSl.itemWon.name,
              boxName: boxDetails?.name,
              boxId: boxDetails?.id,
              itemPrice: itemSl.itemWon.price,
              itemId: itemSl.userItemWon?.id,
            });
        }

        setSelectedIndexes((p) => p.filter((_, i) => !selectedIndexes[i]));

        toast.success(sellReq.length + " Items sold successfully");
        setitemsold(true);
      } else {
        toast.error(
          "Something went wrong, please try again later on inventory page"
        );
      }
    } catch (error) {
      setLoadingsell(false);
      // console.log(error);
      toast.error(handleErrorRequest(error));
    }
  };

  const handleClose = () => {
    // router.push(`/boxes/${boxDetails?.slug}`);
    // updateGameState({
    //   goToSpin: true,
    // });
    updateModalsState({
      itemsUserWon: null,
    });

    // if (itemSold) {
    //   router.push("/");
    //   updateGameState({
    //     action: 0x0,
    //     itemWons: null,
    //     gameStarted: false,
    //     boxDetails: null,
    //     currentBoxId: null,
    //   });
    // }
  };

  const ItemImage = (boxId: string, itemId: string) => {
    let image = null;

    if (boxDetails) {
      let item = boxDetails.items.find((item) => item.item.id === itemId);
      if (item && item.item.images.length) {
        image = item.item.images[0].url;
      }
    }

    return image || imageURI(itemId ?? "", "item");
  };

  const lm = () => {
    let p = {
      adjustedXP: 0x0,
      adjustedLootCoins: 0x0,
    };

    itemsUserWon &&
      itemsUserWon?.forEach((item) => {
        p.adjustedXP += item.adjustedXP ?? 0x0;
        p.adjustedLootCoins += item.adjustedLootCoins ?? 0x0;
      });

    return p;
  };

  const handleSelectAll = () => {
    setSellectAll(!selectedIndexes[0x0]);
    setSelectedIndexes(
      itemsUserWon
        ? itemsUserWon.map(() => !selectedIndexes[0x0])
        : selectedIndexes
    );
  };

  useEffect(() => {
    if (itemsUserWon) {
      selectedIndexes.length === 0x0 &&
        setSelectedIndexes(itemsUserWon.map(() => true));
      setitemsold(false);
    }
  }, [itemsUserWon]);

  useEffect(() => {
    return () => {
      setFailedImages([]);
    };
  }, []);

  return (
    <ModalOverlay
      isOpened={!!itemsUserWon}
      className={styles.wonModal}
      onClose={() => handleClose()}
    >
      {(itemsUserWon && (
        <>
          {/* <div className={styles.topBorder}>
            <div
              className={styles.borderGragient}
              style={
                {
                  "--variant": colorByVariant(itemUserWon.frequency ?? 0x0)
                    .color,
                } as CustomCSSProperties
              }
            ></div>
          </div> */}
          <div className={styles.header}>
            <h1>YOU WON ITEMS!</h1>
            <button
              className={styles.closebutton}
              onClick={() => handleClose()}
              // disabled={loading}
            >
              <CrossIcon />
            </button>
          </div>

          {/* <br /> */}
          {/* <div className={styles.divider}>
            <h3>
              {selectedIndexes?.filter((l) => !!l).length ?? 0x0} Items selected
            </h3>
            <div className={styles.selector} onClick={() => handleSelectAll()}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onClick={() => handleSelectAll()}
                  onChange={() => void 0x0}
                />
                <span className="checkmark"></span>
              </label>
              <span className={styles.text}>Select all</span>
            </div>
          </div> */}

          <div className={styles.itemPreview}>
            <div className={styles.itemsOnBoard}>
              {itemsUserWon &&
                itemsUserWon.map((item, i) => (
                  <div
                    className={classNames(
                      styles.item,
                      selectedIndexes?.[i] && styles.selected
                    )}
                    key={i}
                    style={
                      {
                        "--variant": colorByVariant(item.frequency ?? 0x0)
                          .color,
                      } as CustomCSSProperties
                    }
                    onClick={() =>
                      setSelectedIndexes(
                        selectedIndexes.map((s, index) =>
                          index === i ? !s : s
                        )
                      )
                    }
                  >
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={!!selectedIndexes?.[i]}
                        onClick={() => handleSelectAll()}
                        onChange={() => void 0x0}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <div className={styles.itemImage}>
                      <img
                        src={
                          failedImages.includes(i)
                            ? "/imgs/placeholder.png"
                            : ItemImage(item.boxId ?? "", item.itemWon.id)
                        }
                        alt=""
                        onError={() => handleImageFailed(i)}
                      />
                    </div>
                    <h4>{shortIt(item.itemWon.name, 15)}</h4>
                    <p>
                      {shortIt(boxDetails?.categories?.[0x0]?.name ?? "--", 15)}
                    </p>
                    <br />
                    <span>$ {formatPrice(item.itemWon.price)}</span>
                  </div>
                ))}
            </div>
            <br />
            <div className={styles.actionButtons}>
              <button
                className={styles.spinButton}
                onClick={() => {
                  if (!itemsUserWon || !boxDetails || !user) return;
                  if (boxDetails.price * spins > user?.usdBalance) {
                    toast.error("You don't have enough balance to spin again");
                    return;
                  }
                  setitemsold(false);
                  updateGameState({
                    boxDetails: boxDetails,
                    action: 0x0,
                    spinAgain: !itemsUserWon[0x0].demo,
                    spinAgainDemo: itemsUserWon[0x0].demo,
                  });
                  setSelectedIndexes([]);
                  router.push(`/boxes/${boxDetails?.slug}`);
                }}
                disabled={
                  !user ||
                  boxDetails?.price == undefined ||
                  boxDetails?.price > user?.usdBalance
                }
              >
                <RefreshIcon />
                <span>
                  {spins} Spins Again ${" "}
                  {formatPrice((boxDetails?.price ?? 0) * spins)}
                </span>
              </button>
              <button
                className={styles.sellForBalanceButton}
                onClick={() => {
                  if (!user) return;
                  sellItem();
                  // updateModalsState({
                  //   itemsUserWon: null,
                  // });
                  // updateMainState({
                  //   user: {
                  //     ...user,
                  //     usdBalance: user.usdBalance + itemUserWon.itemWon.price,
                  //     lootCoinsBalance:
                  //       user.lootCoinsBalance +
                  //       (itemUserWon?.adjustedLootCoins ?? 0),
                  //     xpBalance:
                  //       user.xpBalance + (itemUserWon?.adjustedXP ?? 0),
                  //   },
                  // });
                }}
                disabled={
                  loadingsell ||
                  itemSold ||
                  !selectedIndexes.length ||
                  !selectedIndexes.some((s) => s) ||
                  !!itemsUserWon[0]?.demo
                }
              >
                {loadingsell ? (
                  <Loader radius={15} />
                ) : (
                  <>
                    <WalletIcon />
                    <span>
                      {itemSold
                        ? "Item Sold"
                        : "Sell for Balance $" +
                          formatPrice(
                            selectedIndexes
                              .map(
                                (s, i) =>
                                  s &&
                                  itemsUserWon?.[i] &&
                                  "itemWon" in itemsUserWon[i] &&
                                  itemsUserWon[i].itemWon.price
                              )
                              .filter((s) => !!s)
                              .reduce((a, b) => (a || 0x0) + (b || 0x0), 0) ||
                              0x0
                          )}
                    </span>
                  </>
                )}
              </button>
              {/* <button
                className={styles.sellbutton}
                onClick={() =>
                  updateModalsState({
                    fairnessData: {
                      boxId: itemUserWon?.boxId ?? "--",
                      gameId: itemUserWon?.gameId ?? "--",
                      publicSeed: itemUserWon?.publicSeed ?? "--",
                    },
                  })
                }
              >
                <FairnessIcon />
                <span>Provably Fair</span>
              </button> */}
            </div>

            {(!!lm().adjustedLootCoins || !!lm().adjustedXP) && (
              <div className={styles.additionalPrize}>
                <span>You also get</span>
                <div className={styles.cards}>
                  {itemsUserWon.map(
                    (item, i) =>
                      "adjustedLootCoins" in item &&
                      !!item.adjustedLootCoins && (
                        <div className={styles.prizeCard} key={i}>
                          <div className={styles.left}>
                            <div className={styles.svg}>
                              <LootCoin />
                            </div>
                            <div className={styles.prizeWrapper}>
                              <span className={styles.prizeTitle}>
                                Lootcoin credit
                              </span>
                              <span className={styles.prizeAmount}>
                                {formatPrice(item?.adjustedLootCoins ?? 0x0)}{" "}
                                Lootcoins
                              </span>
                            </div>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.itemImage}>
                              <img
                                src={
                                  failedImages.includes(i)
                                    ? "/imgs/placeholder.png"
                                    : ItemImage(
                                        item.boxId ?? "",
                                        item.itemWon.id
                                      )
                                }
                                alt=""
                                onError={() => handleImageFailed(i)}
                              />
                            </div>
                          </div>
                        </div>
                      )
                  )}
                  {itemsUserWon.map(
                    (item, i) =>
                      "adjustedXP" in item &&
                      !!item.adjustedXP && (
                        <div className={styles.prizeCard} key={i}>
                          <div className={styles.left}>
                            <div className={styles.svg}>
                              <XPCoin />
                            </div>
                            <div className={styles.prizeWrapper}>
                              <span className={styles.prizeTitle}>
                                XP credit
                              </span>
                              <span className={styles.prizeAmount}>
                                {formatPrice(item?.adjustedXP ?? 0x0)} XPs
                              </span>
                            </div>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.itemImage}>
                              <img
                                src={
                                  failedImages.includes(i)
                                    ? "/imgs/placeholder.png"
                                    : ItemImage(
                                        item.boxId ?? "",
                                        item.itemWon.id
                                      )
                                }
                                alt=""
                                onError={() => handleImageFailed(i)}
                              />
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )) ||
        null}
    </ModalOverlay>
  );
};
