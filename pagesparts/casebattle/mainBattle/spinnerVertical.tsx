import { FC, Fragment, useEffect, useRef, useState } from "react";
import styles from "./case.main.module.scss";
import { StateInterface, store } from "mredux";
import { useSelector } from "react-redux";
import { shuffle } from "lodash";
import classNames from "classnames";
import { CustomCSSProperties } from "@/pages/_app";
import { colorByVariant, imageURI } from "@/utils/colordetector";
import { ShadowByColor } from "@/components/shadow/Shadow";
import { useWindowSize } from "@/hooks/windowSize";
import ArrowSP from "@/svgs/spinner-arrow.svg";
import { formatPrice, shortIt } from "@/utils/handler";
interface SlotSpinnerProps {
  player?: Player;
  box: BoxType;
  isDone?: boolean;
}

const repeatItemsToLength = (items: ItemBoxType[], totalLength: number) => {
  let result: ItemBoxType[] = [];
  if (items && items.length > 0) {
    for (let i = 0; i < Math.max(10, 90 / items.length); i++) {
      result.push(items[i % items.length]);
    }
  }
  return result;
};

export const SpinnerVertical: FC<SlotSpinnerProps> = ({
  player,
  box,
  isDone = false,
}) => {
  const itemsParentRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [itemsForSpin, setItemsForSpin] = useState<
    (ItemBoxType & { index: number })[] | null
  >(null);
  const [parentY, setParentY] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [transitionDelay, setTransitionDelay] = useState<number>(0.5);
  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );
  const width = useWindowSize();
  useEffect(() => {
    if (box.items.length > 0) {
      setItemsForSpin(shuffle(box.items.map((l, i) => ({ ...l, index: i }))));
      if (player && player.wonItems.length > 0) {
        try {
          let selectedItemIndex = battle.boxes[
            battle.lastProcessedRound
          ].items.findIndex(
            (item) =>
              item.item.id === player.wonItems[battle.lastProcessedRound].itemId
          );
          setSelectedIndex(selectedItemIndex);
        } catch (error) {
          console.log("Error in getting selected item index", error);
          location.reload();
        }
      }
    }
  }, [box, battle]);

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((failedImages) => [...failedImages, index]);
    }
  };

  useEffect(() => {
    return () => {
      if (!isDone) {
        setParentY(0);
        setCompleted(false);
      } else {
        setCompleted(true);
      }
    };
  }, [
    itemsForSpin,
    selectedIndex,
    player,
    itemsParentRef,
    selectedItemRef,
    isDone,
  ]);

  useEffect(() => {
    let intervals: NodeJS.Timeout[] = [];
    if (
      itemsParentRef.current &&
      selectedItemRef.current &&
      itemsForSpin &&
      selectedIndex !== -1
    ) {
      let elementOffset = selectedItemRef.current.getBoundingClientRect().top;
      const parentOffset = itemsParentRef.current.getBoundingClientRect().top;
      const elementHeight = selectedItemRef.current.offsetHeight;
      const parentHeight = itemsParentRef.current.offsetHeight;

      elementOffset = elementOffset - parentOffset - parentHeight / 0x2;

      if (isDone) {
        setParentY(-elementOffset - elementHeight / 0x2);
      } else {
        const randomOffset = Math.floor(
          Math.random() * (elementHeight / 0x3 + elementHeight * 0.1)
        );
        let target = 0;

        if (Math.random() > 0.5) {
          target = elementOffset + randomOffset;
        } else {
          target = elementOffset - randomOffset;
        }
        setParentY(-150);
        setTransitionDelay(battle.fastOpenings ? 0x1 : 0x8);
        setParentY(-(target + elementHeight / 0x2));
        intervals[0x0] = setTimeout(
          () => {
            target = elementOffset;
            setTransitionDelay(0x1);
            setParentY(-(target + elementHeight / 0x2));
            intervals[0x1] = setTimeout(() => {
              setCompleted(true);
            }, 1000);
          },
          (battle.fastOpenings ? 0x1 : 0x8) * 1000 + 100
        );
      }
    }
    return () => {
      intervals.forEach((_, i) => clearInterval(intervals[i]));
    };
  }, [
    selectedIndex,
    selectedItemRef.current,
    itemsParentRef.current,
    itemsForSpin,
  ]);

  return (
    <div className={styles.gameparent} ref={itemsParentRef}>
      {(width.width > 560 || battle.teams * battle.teamsSize < 3) && (
        <div className={styles.arrows}>
          <ArrowSP />
          <ArrowSP />
        </div>
      )}
      <div
        className={styles.gamecontainer}
        style={{
          transition: `transform ${transitionDelay}s ease`,
          transform: `translateY(${parentY}px)`,
        }}
      >
        {itemsForSpin &&
          Array(repeatItemsToLength(itemsForSpin, 15).length)
            .fill(0)
            .map((_, j) => (
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
                      {j === repeatItemsToLength(itemsForSpin, 15).length - 2 &&
                        index === selectedIndex && (
                          <ShadowByColor
                            className={styles.shadow}
                            color={`lk${j}${i}`}
                            customColor={{
                              [`lk${j}${i}`]: [
                                colorByVariant(frequency).color,
                                colorByVariant(frequency).color,
                              ],
                            }}
                            disableOuterShadow
                            animation
                          />
                        )}
                      <div className={styles.itemImage}>
                        <img
                          src={
                            failedImages.includes(i)
                              ? "/imgs/placeholder.png"
                              : item.images.length
                                ? item.images[0].url
                                : imageURI(item.id, "item")
                          }
                          alt=""
                          onError={() => handleImageFailed(i)}
                        />
                      </div>
                      <div className={styles.itemInfo}>
                        <h4>{shortIt(item.name, 10)}</h4>
                        <span>$ {formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
      </div>
    </div>
  );
};
