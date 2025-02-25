import { FC, Fragment, useEffect, useRef, useState } from "react";
import styles from "./battles.module.scss";
import ArrowSolo from "@/svgs/arrowsolo-down.svg";
import ArrowIconLeft from "@/svgs/arrow-left.svg";
// import { ItemBoxType } from "@/utils/api.service";
import { CustomCSSProperties } from "@/pages/_app";
import { colorByVariant, imageURI } from "@/utils/colordetector";
import { ShadowByColor } from "@/components/shadow/Shadow";
import { shortIt } from "@/utils/handler";
import classNames from "classnames";
import { StateInterface, store } from "mredux";
import { GameReducer } from "mredux/reducers/game.reducer";
import { useSelector } from "react-redux";
import {
  updateGameState,
  updateMainState,
  updateModalsState,
} from "@/utils/updateState";
import { set, shuffle } from "lodash";
import { useWindowSize } from "@/hooks/windowSize";

interface SlotSpinnerProps {
  selectedIndex: number;
  items: ItemBoxType[] | null;
  redirected?: boolean;
}

const repeatItemsToLength = (items: ItemBoxType[], totalLength: number) => {
  let result: ItemBoxType[] = [];

  if (items && items.length > 0) {
    // while (result.length < totalLength) {
    //   result = result.concat(
    //     items.slice(0, Math.min(items.length, totalLength - result.length))
    //   );
    // }

    for (let i = 0; i < Math.max(15, 90 / items.length); i++) {
      result.push(items[i % items.length]);
    }
  }

  return result;
};

export const SlotSpinner: FC<SlotSpinnerProps> = ({
  items,
  redirected,
  selectedIndex,
}) => {
  const itemsParentRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const parentOffsetRef = useRef<HTMLDivElement>(null);
  const [transitionDelay, setTransitionDelay] = useState<number>(0.5);
  const [parentX, setParentX] = useState<number>(-100);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [itemsForSpin, setItemsForSpin] = useState<
    (ItemBoxType & { index: number })[] | null
  >(null);
  const { boxDetails, itemWons, gameStarted, fastSpin } = useSelector<
    StateInterface,
    GameReducer
  >((state) => state.gameReducer);

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((l) => [...l, index]);
    }
  };

  useEffect(() => {
    !itemsForSpin &&
      items &&
      setItemsForSpin(shuffle(items.map((l, i) => ({ ...l, index: i }))));
  }, [items]);

  useEffect(() => {
    let intervals: NodeJS.Timeout[] = [];
    if (
      itemWons &&
      gameStarted &&
      itemsParentRef.current &&
      selectedItemRef.current &&
      selectedIndex !== null
    ) {
      let elementOffset = selectedItemRef.current.getBoundingClientRect().left;
      const parentOffset =
        itemsParentRef.current.getBoundingClientRect().left - 100;
      const elementWidth = selectedItemRef.current.offsetWidth;
      const parentWidth = itemsParentRef.current.offsetWidth;

      completed && setCompleted(false);

      elementOffset = elementOffset - parentOffset - parentWidth / 0x2;

      const randomOffset = Math.floor(
        Math.random() * (elementWidth / 0x3 + elementWidth * 0.1)
      );

      let target = 0x0;

      if (Math.random() > 0.5) {
        target = elementOffset + randomOffset;
      } else {
        target = elementOffset - randomOffset;
      }

      let passed =
        store.getState().gameReducer.itemWons?.length === 1 &&
        store.getState().gameReducer.itemWons?.[0x0]?.state === "SUCCESSFUL";

      if (!redirected && passed) {
        setParentX(-100);
        setTransitionDelay(0.1);
        setParentX(-(elementOffset + elementWidth / 0x2));
        setCompleted(true);
      } else {
        setParentX(-100);
        setTransitionDelay(fastSpin ? 0x1 : 0x8);
        setParentX(-(target + elementWidth / 0x2));

        intervals[0x0] = setTimeout(
          () => {
            target = elementOffset;
            setTransitionDelay(0x1);
            setParentX(-(target + elementWidth / 0x2));

            intervals[0x1] = setTimeout(() => {
              setCompleted(true);
              updateGameState({
                ingame: false,
              });
              intervals[0x2] = setTimeout(() => {
                itemWons &&
                  updateModalsState({
                    itemsUserWon: itemWons,
                  });

                const mainState = store.getState().mainReducer;

                updateMainState({
                  refreshInventory: !mainState.refreshInventory,
                });
                // setSelectedIndex(null);
              }, 1200);
            }, 1000);
          },
          (fastSpin ? 0x1 : 0x8) * 1000 + 100
        );
      }
    }

    return () => {
      intervals.forEach((_, i) => clearInterval(intervals[i]));
    };
  }, [
    itemWons,
    gameStarted,
    selectedIndex,
    selectedItemRef.current,
    itemsParentRef.current,
  ]);

  useEffect(() => {
    return () => {
      // setSelectedIndex(null);
      setCompleted(false);
      setParentX(0x0);
      // setAnimate(false);
      updateGameState({
        gameStarted: false,
      });
      updateModalsState({
        itemsUserWon: null,
      });
    };
  }, []);

  return (
    <div className={styles.gameparent} ref={itemsParentRef}>
      {(!completed && (
        <div className={styles.arrows}>
          <ArrowSolo />
          <ArrowSolo />
        </div>
      )) ||
        null}

      <div
        className={styles.gamecontainer}
        ref={parentOffsetRef}
        style={{
          transition: `transform ${transitionDelay}s ease`,
          transform: `translateX(${parentX}px)`,
        }}
      >
        {itemsForSpin &&
          Array(repeatItemsToLength(itemsForSpin, 15).length)
            .fill(null)
            .map((_rep, j) => (
              <Fragment key={j}>
                {itemsForSpin.map(({ item, frequency, index }, i) => (
                  <div
                    className={classNames(
                      styles.gameItem,
                      completed &&
                        j ===
                          repeatItemsToLength(itemsForSpin, 15).length - 2 &&
                        index === selectedIndex
                        ? styles.selected
                        : ""
                    )}
                    style={
                      {
                        "--variant": colorByVariant(frequency).color,
                      } as CustomCSSProperties
                    }
                    key={j + (i + 1)}
                    ref={
                      j === repeatItemsToLength(itemsForSpin, 15).length - 2 &&
                      index === selectedIndex
                        ? selectedItemRef
                        : null
                    }
                  >
                    <div className={styles.itemPreview}>
                      {(j ===
                        repeatItemsToLength(itemsForSpin, 15).length - 2 &&
                        index === selectedIndex && (
                          <ShadowByColor
                            className={styles.shadow}
                            color={"lk" + j + i}
                            customColor={{
                              ["lk" + j + i]: [
                                colorByVariant(frequency).color,
                                colorByVariant(frequency).color,
                              ],
                            }}
                            disableOuterShadow
                            animation
                          />
                        )) ||
                        null}
                      <div className={styles.itemImage}>
                        <img
                          src={
                            failedImages.includes(i)
                              ? "/imgs/placeholder.png"
                              : item.images.length
                                ? item.images[0x0].url
                                : imageURI(item.id, "item")
                          }
                          alt=""
                          onError={() => handleImageFailed(i)}
                        />
                      </div>
                    </div>

                    <h2>{shortIt(item.name, 25)}</h2>
                    <p title={boxDetails?.categories?.[0x0].name ?? ""}>
                      {shortIt(
                        (!!boxDetails?.categories.length &&
                          boxDetails?.categories?.[0x0].name) ||
                          "Unknown",
                        20
                      )}
                    </p>
                  </div>
                ))}
              </Fragment>
            ))}
      </div>
    </div>
  );
};
