import { FC, Fragment, useEffect, useRef, useState } from "react";
import styles from "./case.main.module.scss";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import classNames from "classnames";
import { shuffle } from "lodash";

import { colorByVariant, imageURI } from "@/utils/colordetector";
import { ShadowByColor } from "@/components/shadow/Shadow";
import { useWindowSize } from "@/hooks/windowSize";
import { handleAvatar } from "@/utils/handler";
import ArrowSP from "@/svgs/spinner-arrow.svg";

const repeatItemsToLength = (
  items: { teams: Player[] }[],
  totalLength: number
) => {
  let result: Array<Player[]> = [];
  if (items && items.length > 0) {
    for (let i = 0; i < Math.max(20, 90 / items.length); i++) {
      result.push(items[i % items.length].teams);
    }
  }
  return result;
};

export const WinnerSpinner = () => {
  const itemsParentRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [itemsForSpin, setItemsForSpin] = useState<
    ({ teams: Player[] } & { index: number })[] | null
  >(null);
  const [parentX, setParentX] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [transitionDelay, setTransitionDelay] = useState<number>(0.5);
  const [members, setMembers] = useState<Team[]>([]);
  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );

  const { winners } = useSelector<StateInterface, WinnerBattleReducer>(
    (state) => state.winnerBattleReducer
  );
  useEffect(() => {
    setMembers(winners);
    setSelectedIndex(battle.winnerTeam);
  }, [winners, battle]);

  const width = useWindowSize();

  useEffect(() => {
    (async () => {
      setItemsForSpin(
        shuffle(members.map((l, i) => ({ teams: [...l.players], index: l.id })))
      );
    })();
  }, [members]);
  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((failedImages) => [...failedImages, index]);
    }
  };

  useEffect(() => {
    return () => {
      setParentX(0);
      setCompleted(false);
    };
  }, [itemsForSpin, selectedIndex, itemsParentRef, selectedItemRef]);

  useEffect(() => {
    let intervals: NodeJS.Timeout[] = [];
    if (
      itemsParentRef.current &&
      selectedItemRef.current &&
      itemsForSpin &&
      selectedIndex !== -1
    ) {
      let elementOffset = selectedItemRef.current.getBoundingClientRect().left;
      const parentOffset = itemsParentRef.current.getBoundingClientRect().left;
      const elementWidth = selectedItemRef.current.offsetWidth;
      const parentWidth = itemsParentRef.current.offsetWidth;

      completed && setCompleted(false);

      elementOffset = elementOffset - parentOffset - parentWidth / 0x2;

      const randomOffset = Math.floor(
        Math.random() * (elementWidth / 0x2 + elementWidth * 0.1)
      );

      let target = 0x0;

      if (Math.random() > 0.5) {
        target = elementOffset + randomOffset;
      } else {
        target = elementOffset - randomOffset;
      }

      setParentX(-100);
      setTransitionDelay(0x5);
      setParentX(-(target + elementWidth / 0x2));
      intervals[0x0] = setTimeout(
        () => {
          target = elementOffset;
          setTransitionDelay(0x1);
          setParentX(-(target + elementWidth / 0x2));

          intervals[0x1] = setTimeout(() => {
            setCompleted(true);
          }, 1000);
        },
        0x5 * 1000 + 100
      );
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
    <div className={styles.winnerParent} ref={itemsParentRef}>
      <div className={styles.winnerArrow}>
        <ArrowSP />
        <ArrowSP />
      </div>
      <div
        className={styles.winnerContainer}
        style={{
          transition: `transform ${transitionDelay}s ease`,
          transform: `translateX(${parentX}px)`,
        }}
      >
        {itemsForSpin &&
          Array(repeatItemsToLength(itemsForSpin, 25).length)
            .fill(0)
            .map((_, j) => (
              <Fragment key={j}>
                {itemsForSpin.map(({ teams, index }, i) => (
                  <div
                    className={classNames(
                      styles.gameItem,
                      completed &&
                        j ===
                          repeatItemsToLength(itemsForSpin, 25).length - 10 &&
                        index === selectedIndex
                        ? styles.selected
                        : ""
                    )}
                    key={j + (i + 1)}
                    ref={
                      j === repeatItemsToLength(itemsForSpin, 15).length - 10 &&
                      index === selectedIndex
                        ? selectedItemRef
                        : null
                    }
                  >
                    <div className={styles.itemPreview}>
                      {j ===
                        repeatItemsToLength(itemsForSpin, 15).length - 10 &&
                        index === selectedIndex && (
                          <ShadowByColor
                            className={styles.shadow}
                            color={`lk${j}${i}`}
                            customColor={{
                              [`lk${j}${i}`]: [
                                colorByVariant(20).color,
                                colorByVariant(20).color,
                              ],
                            }}
                            disableOuterShadow
                            animation
                          />
                        )}
                      <div className={styles.itemImage}>
                        {teams.map((teamMember) =>
                          teamMember.bot ? (
                            <div className={styles.circleAvatar}>
                              <img src="/imgs/bot.png" alt="bot" width="100%" />
                              <span className={styles.level}>100</span>
                            </div>
                          ) : (
                            <div
                              className={styles.circleAvatar}
                              style={{
                                backgroundImage: `url(${handleAvatar(
                                  null,
                                  teamMember?.user.username
                                )})`,
                              }}
                            >
                              <span className={styles.level}>
                                {teamMember?.user.xpExtraInfo?.level}
                              </span>
                            </div>
                          )
                        )}
                        <div></div>
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
