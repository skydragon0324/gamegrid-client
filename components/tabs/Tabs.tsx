import React, { useEffect } from "react";
import styles from "./tabs.module.scss";
import classNames from "classnames";
import { useWindowSize } from "@/hooks/windowSize";

export interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string, index?: number) => void;
  className?: string;
  fillerClass?: string;
  stylesV2?: boolean;
  disabledIndexes?: number[];
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  className,
  setActiveTab,
  fillerClass,
  stylesV2,
  disabledIndexes,
}) => {
  const { width } = useWindowSize();
  const parentsRef = React.useRef<HTMLDivElement>(null);
  const ref = React.useRef<HTMLButtonElement>(null);
  const [filler, setFiller] = React.useState<{
    x: number;
    width: number;
  } | null>(null);

  const fontsizeCalc = () => {
    const parentRect = parentsRef.current?.getBoundingClientRect() ?? null;

    if (!parentRect) {
      return null;
    }

    let knJ = Math.min(Math.max(parentRect.width / tabs.length / 10, 9), 14);

    return knJ;
  };

  useEffect(() => {
    if (ref.current && parentsRef.current) {
      const parentRect = parentsRef.current.getBoundingClientRect();
      const buttonWidth = parentRect.width / tabs.length;
      const buttonX = ref.current.getBoundingClientRect().x - parentRect.x;
      const isLast = tabs.indexOf(activeTab) === tabs.length - 1;
      const isFirst = tabs.indexOf(activeTab) === 0x0;

      parentRect.width &&
        setFiller({
          x: buttonX - ((stylesV2 && (isFirst ? -4 : isLast ? 4 : 0x0)) || 0x0),
          width: buttonWidth,
        });
    }
  }, [width, ref.current, parentsRef.current, activeTab, className]);

  return (
    <div className={styles.tabs} ref={parentsRef}>
      {(filler && (
        <div
          className={classNames(styles.tabsfill, fillerClass)}
          style={{
            width: `${filler?.width ?? 0x0}px`,
            transform: `translateX(${filler?.x ?? 0x0}px)`,
          }}
        ></div>
      )) ||
        null}
      <div
        className={classNames(styles.tabscontent, className)}
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <button
              ref={activeTab === tab ? ref : null}
              key={index}
              disabled={(disabledIndexes ?? []).includes(index)}
              className={classNames(
                styles.tab,
                activeTab === tab && styles.active
              )}
              onClick={() => setActiveTab(tab, index)}
              style={fontsizeCalc() ? { fontSize: `${fontsizeCalc()}px` } : {}}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};
