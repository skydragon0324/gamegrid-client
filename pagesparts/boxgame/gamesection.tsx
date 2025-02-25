import { FC, Fragment, useEffect, useRef, useState } from "react";
import styles from "./battles.module.scss";
import Image from "next/image";
import classNames from "classnames";
import { ShadowByColor } from "@/components/shadow/Shadow";
// import { BoxType, ItemBoxType } from "@/utils/api.service";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import ArrowLeft from "@/svgs/arrow-left.svg";
import { GameReducer } from "mredux/reducers/game.reducer";
import {
  UPDATE_GAME_STATE,
  UPDATE_MAIN_STATE,
  UPDATE_MODALS_STATE,
} from "mredux/types";
import { colorByVariant, imageURI } from "@/utils/colordetector";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import ArrowSolo from "@/svgs/arrowsolo-down.svg";
import ArrowIconLeft from "@/svgs/arrow-left.svg";
import { useRouter } from "next/router";
import FairnessIcon from "@/svgs/fairness.svg";
import { MainReducer } from "mredux/reducers/main.reducer";
import { shortIt } from "@/utils/handler";
import Loader from "@/components/loader/Loader";
import { CustomCSSProperties } from "@/pages/_app";
import { SlotSpinner } from "./slotspinner";
import { useWindowSize } from "@/hooks/windowSize";

interface GameSectionProps {
  redirected?: boolean;
}

export const GameSection: FC<GameSectionProps> = ({ redirected }) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number[] | null>(null);
  const { itemWons, gameStarted, boxes, ingame, boxDetails, goToSpin } =
    useSelector<StateInterface, GameReducer>((state) => state.gameReducer);

  const goToSpinRef = useRef<HTMLButtonElement>(null);

  const completeAllAnimations = () => {
    setSelectedIndex(null);
    updateGameState({ gameStarted: false });
  };

  const updateGameState = (payload: Partial<GameReducer>) => {
    store.dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: UPDATE_MAIN_STATE,
      payload,
    });
  };

  useEffect(() => {
    if (goToSpin && goToSpinRef.current) {
      goToSpinRef.current.click();
      updateGameState({ goToSpin: false });
    }
  }, [goToSpin]);

  useEffect(() => {
    if (itemWons && !gameStarted && boxDetails) {
      setSelectedIndex(
        itemWons.map((item) =>
          boxDetails.items.findIndex((ik) => ik.item.id === item.itemWon.id)
        )
      );
      updateGameState({ gameStarted: true });
    }
  }, [itemWons, boxes]);

  return itemWons && itemWons.length ? (
    <>
      <div className={styles.divider}>
        <button
          ref={goToSpinRef}
          className={styles.backcases}
          disabled={ingame}
          onClick={() => {
            router.push(`/boxes/${boxDetails?.slug}`);
            updateGameState({
              action: 0x0,
              itemWons: null,
              gameStarted: false,
            });
            completeAllAnimations();
          }}
        >
          <ArrowLeft />
          <span>Back to {shortIt(boxDetails?.name ?? "Case", 10)}</span>
        </button>

        <button
          className={styles.fairness}
          onClick={() => {
            updateModalsState({
              fairnessData: {
                gameId: itemWons?.[0x0]?.gameId ?? "--",
                publicSeed: itemWons?.[0x0]?.publicSeed ?? "--",
                boxId: boxDetails?.id ?? "--",
              },
            });
          }}
        >
          <FairnessIcon />
          <span>Fairness Guaranteed</span>
        </button>
      </div>
      <br />
      <br />
      <br />
      <div className={styles.gamesection}>
        {selectedIndex &&
          boxDetails &&
          itemWons.map((_, i) => (
            <SlotSpinner
              items={boxDetails?.items}
              selectedIndex={selectedIndex[i]}
              redirected={redirected}
              key={i}
            />
          ))}
      </div>
    </>
  ) : (
    <Loader radius={40} centered className={styles.loader} isBlue />
  );
};
