import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExternalPage } from "@/pages/index";
import {
  fetchBoxId,
  fetchBoxes,
  fetchOpened,
  openBoxReal,
  openBoxTest,
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
import { BetSection } from "@/parts/boxgame/betsection";
import { GameSection } from "@/parts/boxgame/gamesection";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { toast } from "react-hot-toast";
import { formatPrice, handleErrorRequest, shortIt } from "@/utils/handler";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { UPDATE_GAME_STATE, UPDATE_MODALS_STATE } from "mredux/types";
import { GameReducer } from "mredux/reducers/game.reducer";
import {
  dominateColorFromUrl,
  dominateColorFromUrls,
  imageURI,
} from "@/utils/colordetector";
import { Skeleton } from "@/components/sekelton/Skeleton";

export const CasePage: ExternalPage = () => {
  // get params from url
  const router = useRouter();
  const { boxId, gameId } = router.query;
  const { width } = useWindowSize();
  const [loading, setLoading] = useState<boolean>(false);
  const [testLoading, setLoadingTest] = useState<boolean>(false);
  const dispatch =
    useDispatch<Dispatch<ModalsReducer & MainReducer & GameReducer>>();
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { action, itemWon, boxDetails } = useSelector<
    StateInterface,
    GameReducer
  >((state) => state.gameReducer);

  const updateGameState = (payload: Partial<GameReducer>) => {
    dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  const updateModalsState = (
    payload: Partial<ModalsReducer & { frequency: number }>
  ) => {
    dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const fetchCase = async (id: string) => {
    try {
      const boxres = await fetchBoxId(id);
      // console.log(boxres);

      const imgs = boxres.items.map(({ item }) => ({
        id: item.id,
        url: imageURI(item.id, "item", true),
      }));

      // let dominatedColors = await dominateColorFromUrls(imgs);
      // let dominatedColorBox = await dominateColorFromUrl(boxres.id);

      updateGameState({
        boxDetails: {
          ...boxres,
          imageUrl: imageURI(boxres.id, "box", true),
        },
      });
      // updateGameState({
      //   boxDetails: {
      //     ...boxres,
      //     color: dominatedColorBox,
      //     items: boxres.items.map((itemL) =>
      //       itemL.item.id in dominatedColors
      //         ? {
      //             ...itemL,
      //             item: {
      //               ...itemL.item,
      //               color: dominatedColors[itemL.item.id] ?? undefined,
      //             },
      //           }
      //         : itemL
      //     ),
      //   },
      // });
    } catch (error) {
      // console.log(error);
      toast.error(handleErrorRequest(error));
      // router.push("/");
    }
  };

  const opentestbox = async (_bxId?: string | null) => {
    try {
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      let bxId: string | null = null;

      if (boxId) {
        bxId = boxId as string;
      }

      if (_bxId) {
        bxId = _bxId;
      }

      if (!bxId) {
        toast.error("Invalid box id");
        return;
      }

      setLoadingTest(true);

      const bxres = await openBoxTest(bxId);

      setLoadingTest(false);

      if (bxres) {
        updateGameState({
          itemWon: {
            id: "",
            itemWon: bxres,
            boxId: bxId,
            publicSeed: "",
            clientSeed: "",
            gameId: null,
            state: "SUCCESSFUL",
            demo: true,
          },
          action: 0x1,
        });
      }
    } catch (e) {
      setLoadingTest(false);
      // console.log(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const openrealbox = async (_bxId?: string | null) => {
    try {
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      let bxId: string | null = null;

      if (boxId) {
        bxId = boxId as string;
      }

      if (_bxId) {
        bxId = _bxId;
      }

      if (!bxId) {
        toast.error("Invalid box id");
        return;
      }

      setLoading(true);

      const bxres = await openBoxReal(bxId);

      setLoading(false);

      if (bxres) {
        updateGameState({
          itemWon: Object.assign(bxres, {
            boxId: bxId,
            gameId: bxres.id,
            demo: false,
          }),
          action: 0x1,
        });

        router.push(`/boxes/${bxId}/${bxres.id}`);
      }
    } catch (e) {
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

      if (!boxId || !gameId) {
        toast.error("Invalid game id");
        return;
      }

      let _bxId: string;
      let _gameId: string;

      Array.isArray(boxId) ? (_bxId = boxId[0x0]) : (_bxId = boxId);
      Array.isArray(gameId) ? (_gameId = gameId[0x0]) : (_gameId = gameId);

      const bxres = await fetchOpened(_bxId, _gameId);

      if (
        bxres &&
        (bxres.state === "RUNNING" || bxres.state === "SUCCESSFUL")
      ) {
        updateGameState({
          itemWon: Object.assign(bxres, {
            boxId: _bxId,
            gameId: bxres.id,
            demo: false,
            woModal: true,
          }),
          action: 0x1,
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  useEffect(() => {
    // if (!user) {
    //   router.push("/");
    //   toast.error("You must be logged in");
    //   return;
    // }

    if (boxId && typeof boxId === "string") {
      updateGameState({
        currentBoxId: boxId,
      });
      fetchCase(boxId);
    }
  }, [boxId]);

  useEffect(() => {
    if (user && gameId && typeof gameId === "string" && !itemWon) {
      fetchOpenedGame();
    }
  }, [gameId, user]);

  return (
    <div className={classNames(styles.boxes, "contentinsider")}>
      {(width > 768 && <DropsItems />) || null}
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
      {(action === 0x1 && <GameSection />) || null}
      <div className={styles.casesRelated}>
        <div className={styles.labelDots}>
          <div />
          <span>CASE CONTENTS</span>
          <div />
        </div>

        <div className={styles.items}>
          {boxDetails
            ? boxDetails?.items.map(({ item, frequency }, i) => (
                <div
                  className={styles.item}
                  style={{ animationDuration: `${i * 0.2}s` }}
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
                  <span className={styles.parcent}>12.4%</span>
                  <div className={styles.itemPreview}>
                    <Image
                      width={120}
                      height={120}
                      className={styles.itemImage}
                      src={imageURI(item.id, "item", true)}
                      alt=""
                    />
                  </div>
                  <h3>{shortIt(item.name ?? "--", 30)}</h3>
                  <p>Intel</p>
                  <h3>{formatPrice(item.price)}$</h3>
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
