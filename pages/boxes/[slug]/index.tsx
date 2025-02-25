import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ExternalPage } from "@/pages/index";
import {
  OpenRealBoxType,
  fetchBoxId,
  fetchBoxes,
  fetchOpened,
  openBoxReal,
  openBoxTest,
  openMultiCase,
  setStatusBox,
} from "@/utils/api.service";
import { DropsItems } from "@/components/drops/drops";
import classNames from "classnames";
import styles from "@/parts/boxgame/battles.module.scss";
import { InfoBoxes } from "@/components/infoboxes/infoboxes";
import ArrowIconLeft from "@/svgs/arrow-left.svg";
import Image from "next/image";
import FairnessIcon from "@/svgs/fairness.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import StarsIcon from "@/svgs/stars.svg";
import { Dropdown } from "@/components/dropdown/dropdown";
import { useWindowSize } from "@/hooks/windowSize";
// import { BetSection } from "@/parts/boxgame/betsection";
// import { GameSection } from "@/parts/boxgame/gamesection";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { toast } from "react-hot-toast";
import {
  formatPrice,
  handleErrorRequest,
  shortIt,
  formatFrequency,
} from "@/utils/handler";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { UPDATE_GAME_STATE, UPDATE_MODALS_STATE } from "mredux/types";
import { GameReducer } from "mredux/reducers/game.reducer";
import {
  colorByVariant,
  dominateColorFromUrl,
  dominateColorFromUrls,
  imageURI,
} from "@/utils/colordetector";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { BetSection } from "@/parts/boxgame2/betsection";
import { GameSection } from "@/parts/boxgame/gamesection";
import { CustomCSSProperties } from "@/pages/_app";
import useRudderStackAnalytics from "@/utils/rudderstack";
import { waiterhandler } from "@/utils/waiter";

export const CasePage: ExternalPage = () => {
  // get params from url
  const router = useRouter();
  const { slug, gameId } = router.query;
  const { width } = useWindowSize();
  const [loading, setLoading] = useState<boolean>(false);
  const [redirectedLK, setRLK] = useState<boolean>(false);
  const [testLoading, setLoadingTest] = useState<boolean>(false);
  const analytics = useRudderStackAnalytics();
  const dispatch =
    useDispatch<Dispatch<ModalsReducer & MainReducer & GameReducer>>();
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const [failedImages, setFailedImages] = useState<number[]>([]);

  const { action, itemWons, boxDetails, ingame, spins } = useSelector<
    StateInterface,
    GameReducer
  >((state) => state.gameReducer);

  const updateGameState = (payload: Partial<GameReducer>) => {
    dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((l) => [...l, index]);
    }
  };

  const fetchCase = async (id: string, slug?: boolean) => {
    try {
      const boxres = await fetchBoxId(id, !!slug);

      if (!boxres) {
        toast.error("Invalid box id");
        router.push("/");
        return;
      }

      updateGameState({
        currentBoxId: boxres.id,
        boxDetails: Object.assign({}, boxres, {
          items: boxres.items?.filter((l) => !!l?.item),
        }),
      });
    } catch (error) {
      console.log(error);
      toast.error(handleErrorRequest(error));
      router.push("/");
    }
  };
  console.log("boxdetails", boxDetails);

  const opentestbox = async (_bxId?: string | null) => {
    try {
      let bxId: string | null = null;

      if (slug) {
        bxId = boxDetails?.id ?? null;
      }

      if (_bxId) {
        bxId = _bxId;
      }

      if (!bxId) {
        toast.error("Invalid box id");
        return;
      }

      setLoadingTest(true);

      let spinsIn = spins ?? 0x1;
      let boxesToOpen = [];

      updateGameState({
        spinsCompleted: false,
      });

      for await (let _ of new Array(spinsIn).fill(null)) {
        try {
          let bxres = await openBoxTest(bxId);

          if (bxres) {
            analytics &&
              analytics.track("GAME_PLAY", {
                action: "Open Test Box",
                boxId: bxId,
                caseName: boxDetails?.name ?? "",
                itemName: bxres.name ?? "",
                itemId: bxres?.id ?? "",
                frequency:
                  boxDetails?.items.find((l) => l.item.id === bxres?.id)
                    ?.frequency ?? -1,
              });
            boxesToOpen.push(bxres);
          }
        } catch (e) {
          toast.error(handleErrorRequest(e));
        }
      }

      setLoadingTest(false);

      if (!boxesToOpen.length) {
        return;
      }

      setRLK(true);

      updateGameState({
        itemWons: boxesToOpen.map((bx) => ({
          id: "",
          itemWon: bx,
          boxId: bxId,
          publicSeed: "",
          clientSeed: "",
          gameId: null,
          state: "SUCCESSFUL",
          demo: true,
          frequency:
            boxDetails?.items?.find((p) => p.item.id === bx.id)?.frequency ??
            0x0,
        })),
        action: 0x1,
      });
    } catch (e) {
      setLoadingTest(false);
      // console.log(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const openrealbox = async (_bxId?: string | null) => {
    try {
      if (!user) {
        updateModalsState({ authModal: true, authTab: 0x0 });
        return;
      }

      let bxId: string | null = null;

      if (slug) {
        bxId = boxDetails?.id ?? null;
      }

      if (_bxId) {
        bxId = _bxId;
      }

      if (!bxId) {
        toast.error("Invalid box id");
        return;
      }

      if (boxDetails && user.usdBalance < boxDetails?.price) {
        toast.error(
          `Not enough balance to open case. Current balance is ${user.usdBalance}, case cost is ${boxDetails.price}`
        );
        return;
      }

      setLoading(true);

      updateGameState({
        ingame: true,
        spinsCompleted: false,
      });

      let spinsIn = spins ?? 0x1;
      let boxesToOpen: any[] = [];

      // await new Promise((resolve) => {
      //   for (let _ of new Array(spinsIn).fill(null)) {
      //     bxId &&
      //       openBoxReal(bxId)
      //         .then((bxres) => {
      //           if (bxres && bxres.state !== "FAILED") {
      //             analytics &&
      //               analytics.track("GAME_PLAY", {
      //                 action: "Open Real Box",
      //                 boxId: bxId,
      //                 caseName: boxDetails?.name ?? "",
      //                 itemName: bxres.itemWon.name ?? "",
      //                 itemId: bxres.userItemWon?.id ?? "",
      //                 frequency:
      //                   boxDetails?.items.find(
      //                     (l) => l.item.id === bxres.userItemWon?.id
      //                   )?.frequency ?? -1,
      //               });
      //             boxesToOpen.push(bxres);
      //           } else {
      //             boxesToOpen.push(null);
      //           }
      //         })
      //         .catch((e) => {
      //           boxesToOpen.push(null);
      //           toast.error(handleErrorRequest(e));
      //         });
      //   }

      //   setInterval(() => {
      //     if (boxesToOpen.length === spinsIn) {
      //       boxesToOpen = boxesToOpen.filter((l) => l !== null);
      //       resolve(true);
      //     }
      //   }, 1000);
      // });

      // let spinsIn = spins ?? 0x1;
      // let boxesToOpen = [];
      // for (let _ of new Array(spinsIn).fill(null)) {
      //   try {
      //     let bxres = await openBoxReal(bxId);

      //     if (bxres && bxres.state !== "FAILED") {
      //       analytics &&
      //         analytics.track("Open Box", {
      //           boxId: bxId,
      //           caseName: boxDetails?.name ?? "",
      //           itemName: bxres.itemWon.name ?? "",
      //           itemId: bxres.userItemWon?.id ?? "",
      //           frequency:
      //             boxDetails?.items.find(
      //               (l) => l.item.id === bxres.userItemWon?.id
      //             )?.frequency ?? -1,
      //         });
      //       boxesToOpen.push(bxres);
      //     }
      //   } catch (e) {
      //     toast.error(handleErrorRequest(e));
      //   }
      // }

      const itemsFetched = await openMultiCase(bxId, spinsIn);

      if (itemsFetched && Array.isArray(itemsFetched)) {
        for (let bxres of itemsFetched) {
          if (bxres && bxres.state !== "FAILED") {
            analytics &&
              analytics.track("GAME_PLAY", {
                action: "Open Real Box",
                boxId: bxId,
                caseName: boxDetails?.name ?? "",
                itemName: bxres.itemWon.name ?? "",
                itemId: bxres.userItemWon?.id ?? "",
                frequency:
                  boxDetails?.items.find(
                    (l) => l.item.id === bxres.userItemWon?.id
                  )?.frequency ?? -1,
              });
            boxesToOpen.push(bxres);
          }
        }
      }

      setLoading(false);
      setRLK(true);

      if (!boxesToOpen.length) {
        updateGameState({
          ingame: false,
        });
        return;
      }

      updateGameState({
        itemWons: boxesToOpen.map((bx) =>
          Object.assign(bx, {
            boxId: bxId,
            gameId: bx.id,
            demo: false,
            woModal: false,
            frequency:
              boxDetails?.items?.find((p) => p.item.id === bx.itemWon.id)
                ?.frequency ?? 0x0,
          })
        ),
        action: 0x1,
      });

      router.push(`/boxes/${boxDetails?.slug}/${boxesToOpen[0x0].id}`);
    } catch (e) {
      updateGameState({
        ingame: false,
      });
      setLoading(false);
      // console.log(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const fetchOpenedGame = async () => {
    try {
      if (!user) {
        return;
      }

      if (!slug || !gameId) {
        toast.error("Invalid game id");
        return;
      }

      let _bxId: string | null = boxDetails?.id ?? null;
      let _gameId: string;

      Array.isArray(gameId) ? (_gameId = gameId[0x0]) : (_gameId = gameId);

      if (!_bxId) {
        return toast.error("invald box id");
      }

      const bxres = await fetchOpened(_bxId, _gameId);

      if (
        bxres &&
        (bxres.state === "RUNNING" || bxres.state === "SUCCESSFUL")
      ) {
        updateGameState({
          itemWons: [
            Object.assign(bxres, {
              boxId: _bxId,
              gameId: bxres.id,
              demo: false,
              woModal: true,
            }),
          ],
          action: 0x1,
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  useEffect(() => {
    if (slug && typeof slug === "string") {
      fetchCase(slug, true);
    }
  }, [slug]);

  useEffect(() => {
    if (
      user &&
      gameId &&
      typeof gameId === "string" &&
      boxDetails &&
      !itemWons
    ) {
      fetchOpenedGame();
    }
  }, [gameId, user, boxDetails]);

  useEffect(() => {
    waiterhandler.handleTicker();
  }, [ingame]);

  useEffect(() => {
    return () => {
      updateGameState({
        action: 0x0,
        itemWons: null,
        gameStarted: false,
        boxDetails: null,
        currentBoxId: null,
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      updateGameState({
        action: 0x0,
        itemWons: null,
        gameStarted: false,
        boxDetails: null,
        currentBoxId: null,
      });
    };
  }, []);

  return (
    <div className={classNames(styles.boxes, "contentinsider")}>
      {/* {(width > 768 && <DropsItems />) || null}
      {(action === 0x0 && (
        <BetSection
          openCase={(isTest) =>
            isTest ? opentestbox(null) : openrealbox(null)
          }
          btnLoading={[loading, testLoading]}
          boxDetails={boxDetails}
        />
      )) ||
        null}
      {(action === 0x1 && <GameSection />) || null} */}
      <div className={styles.newcontainer}>
        <div className={styles.decorations}>
          <div></div>
          <div></div>
        </div>
        <div className={styles.content}>
          {(action === 0x0 && (
            <BetSection
              openCase={(isTest) =>
                isTest ? opentestbox(null) : openrealbox(null)
              }
              btnLoading={[loading, testLoading]}
              boxDetails={boxDetails}
            />
          )) ||
            null}

          {(action === 0x1 && <GameSection redirected={redirectedLK} />) ||
            null}
        </div>
      </div>

      <div className={styles.casesRelated}>
        <div className={styles.labelDots}>
          <div />
          <span>Recently unboxed</span>
          <div />
        </div>
        <br />
        <DropsItems boxId={boxDetails?.id ?? null} />

        <div className={styles.labelDots}>
          <div />
          <span>CASE CONTENTS</span>
          <div />
        </div>
        <div className={styles.items}>
          {boxDetails?.items
            ? structuredClone(boxDetails?.items)
                .sort((a, b) => b.item.price - a.item.price)
                .map(({ item, frequency }, i) => (
                  <div
                    className={styles.item}
                    style={
                      {
                        animationDuration: `${i * 0.2}s`,
                        "--variant": colorByVariant(frequency ?? 0x0).color,
                      } as CustomCSSProperties
                    }
                    key={i}
                    onClick={() =>
                      updateModalsState({
                        itemOpened: {
                          item,
                          frequency,
                        },
                      })
                    }
                  >
                    <span className={styles.parcent}>{frequency ?? 0x0}%</span>
                    <div className={styles.itemPreview}>
                      <img
                        src={
                          failedImages.includes(i)
                            ? "/imgs/placeholder.png"
                            : item.images.length
                              ? item.images[0x0].url
                              : imageURI(item.id, "item", true)
                        }
                        onError={() => handleImageFailed(i)}
                        alt=""
                      />
                    </div>
                    <div className={styles.desc}>
                      <h3>{shortIt(item.name ?? "--", 30)}</h3>
                      <p>
                        {(!!boxDetails?.categories.length &&
                          boxDetails?.categories?.[0x0].name) ||
                          "--"}
                      </p>
                      <h3>{formatPrice(item.price)}$</h3>
                    </div>
                  </div>
                ))
            : new Array(20)
                .fill(null)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    borderRadius="20px"
                    width="200px"
                    height="270px"
                  />
                ))}
        </div>
      </div>
      <InfoBoxes />
    </div>
  );
};

CasePage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default CasePage;
