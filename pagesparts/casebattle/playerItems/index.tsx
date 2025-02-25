import React, { useEffect, useMemo, useState } from "react";
import styles from "./case.playerItem.module.scss";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import {
  formatFrequency,
  formatPrice,
  handleAvatar,
  handleErrorRequest,
  shortIt,
} from "@/utils/handler";
import classNames from "classnames";
import { addBotToBattle } from "@/utils/api.service";
import Swards from "@/svgs/sward.svg";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { IN_PROGRESS } from "@/utils/constants";
import { useWindowSize } from "@/hooks/windowSize";
import { CustomCSSProperties } from "@/pages/_app";
import { colorByVariant } from "@/utils/colordetector";
import { uniqueId } from "lodash";
import { getItemFromItemId } from "@/utils/battleUtils";

interface propsType {
  player?: Player;
  sward: boolean;
  winner?: boolean;
  team?: number;
  teamPosition?: number;
}

const PlayerItems: React.FC<propsType> = ({
  player,
  sward,
  winner,
  team,
  teamPosition,
}) => {
  const [wonPrice, setWonPrice] = useState<number>(0);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [wonItems, setWonItems] = useState<ItemType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );

  useEffect(() => {
    const temp = player?.wonItems.map((item) => {
      let tempItem = {
        ...getItemFromItemId(battle, item.itemId),
        uid: uniqueId(),
      };
      return tempItem;
    });
    battle.state === IN_PROGRESS
      ? setTimeout(
          () => {
            setWonItems(temp ? temp.reverse() : []);
          },
          battle.fastOpenings ? 3000 : 9000
        )
      : setWonItems(temp ? temp.reverse() : []);
  }, [player]);

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );
  const { winners } = useSelector<StateInterface, WinnerBattleReducer>(
    (state) => state.winnerBattleReducer
  );
  useEffect(() => {
    setStartPrice(wonPrice);
    setWonPrice(wonItems.reduce((price, b) => price + b.price, 0.0));
  }, [wonItems]);

  const addBot = async (
    battleId: string,
    team: number = 0,
    teamPosition: number = 0
  ) => {
    if (loading) return;
    if (battle.owner?.id !== user?.id) {
      toast.error("You are not the owner of this battle");
      return;
    } else {
      try {
        setLoading(true);
        const loadingToast = toast.loading("Adding a bot!");
        const res = await addBotToBattle(battleId, team + 1, teamPosition + 1);
        if (res) {
          toast.dismiss(loadingToast);
        } else {
          toast.error("Error with playing with Bot!");
        }
      } catch (error) {
        toast.error("Error with playing with Bot!");
        handleErrorRequest(error);
      }
    }
  };

  const { width } = useWindowSize();

  const itemWidth = () => {
    const members = battle.teams * battle.teamsSize;
    if (members === 4) {
      return 60;
    } else if (members === 3) {
      return 100;
    } else {
      return 120;
    }
  };
  const itemWidthPercent = () => {
    const members = battle.teams * battle.teamsSize;
    const boxesCount = battle.boxes.length;
    if (boxesCount === 1) {
      return 100;
    }
    if (width <= 768 && members === 2) {
      return (100 / (5 - members) - (4 - members) * 2) * 3;
    }
    if (width > 1024) {
      let maxCardsPerRow;

      if (members === 2) {
        maxCardsPerRow = 3;
      } else if (members === 3) {
        maxCardsPerRow = 2;
      } else {
        maxCardsPerRow = 1;
      }

      const cardsPerRow = Math.min(maxCardsPerRow, boxesCount);

      const gapTotalWidth = (cardsPerRow - 1) * 12;
      return (100 - gapTotalWidth) / cardsPerRow;
    } else {
      return (100 / (5 - members) - (4 - members) * 2) * 2;
    }
  };

  const itemMembers = () => {
    const members = battle.teams * battle.teamsSize;
    return members;
  };

  const [caseItemsFrequencyMap, setCaseItemsFrequencyMap] = useState<{
    [key: string]: number;
  } | null>(null);

  useEffect(() => {
    if (battle.boxes.length > 0) {
      const items = battle.boxes.map((box) => box.items.map((item) => item));
      const itemsFrequency = items.flat().reduce(
        (acc, item) => {
          acc[item.item.id] = item.frequency;
          return acc;
        },
        {} as { [key: string]: number }
      );
      setCaseItemsFrequencyMap(itemsFrequency);
    }
  }, [battle]);

  return (
    <div
      className={styles.wonItems}
      style={{
        borderColor: winner ? "#FDB022" : "",
      }}
    >
      {player ? (
        <div className={styles.player}>
          {/* {player.bot ? (
            <div className={styles.avatarHolder}>
            <div className={styles.circleAvatar}>
              <img
                src="/imgs/bot.png"
                alt="bot"
                width={"100%"}
                style={{ borderRadius: "50%" }}
              />
            </div>
              <span className={styles.level}>80</span>
            </div>
          ) : (
            <div
              className={styles.circleAvatar}
              style={{
                backgroundImage: `url(${handleAvatar(
                  null,
                  player?.user.username
                )})`,
              }}
            >
              <span className={styles.level}>
                {player?.user.xpExtraInfo?.level}
              </span>
            </div>
          )} */}
          <div className={styles.avatarHolder}>
            <div
              className={`${styles.circleAvatar} 
                        ${!player ? styles.avatar : ""}
                        ${!player ? styles.notBot : ""}
                        ${player && player.bot ? styles.botbg : ""}
                        `}
              style={
                !(player && player.bot)
                  ? {
                      backgroundImage: `url(${
                        player
                          ? handleAvatar(null, player?.user?.username)
                          : "/svgs/joinPerson.svg"
                      })`,
                    }
                  : {}
              }
            >
              {player && player.bot && (
                <img src="/imgs/bot.png" alt="bot" width="100%" />
              )}
            </div>
            {player && (
              <span
                className={styles.level}
                style={
                  {
                    "--bgImg": `${
                      player.bot
                        ? "url(/svgs/gold-polygon.svg)"
                        : `url("/svgs/polygon.svg")`
                    }`,
                    "--bgClr": `${player.bot ? "black" : `white`}`,
                    "--textSize": `${
                      player.bot
                        ? "10px"
                        : player.user.xpExtraInfo?.level ?? 0 > 99
                          ? "10px"
                          : "12px"
                    }`,
                  } as CustomCSSProperties
                }
              >
                {player.bot ? 100 : player.user.xpExtraInfo?.level ?? 0}
              </span>
            )}
          </div>

          <div className={styles.user}>
            {width > 768 ? <p>{player && shortIt(player.name, 15)} </p> : ""}
            <p
              className={styles.totalWon}
              style={{ color: winner ? "#3CCB7F" : "" }}
            >
              {`$ ${formatPrice(wonPrice)}`}
              {/* <CountUp
                start={startPrice}
                end={wonPrice}
                duration={2.5}
                separator=","
                prefix="$ "
                decimal="."
                decimals={2}
              /> */}
            </p>
          </div>
        </div>
      ) : (
        <button
          className={styles.botMode}
          onClick={() => addBot(battle.id, team, teamPosition)}
          disabled={user?.id != battle.owner?.id}
        >
          <div className={classNames(styles.btn, styles.purple)}>
            <Swards />
            {loading ? <Loader /> : <p>Play with Bot</p>}
          </div>
        </button>
      )}
      {sward ? (
        <div
          className={classNames(styles.swardBattle, styles.size_8)}
          style={{
            borderTopColor: winner ? "#FDB022" : "",
            borderRightColor: winner ? "#FDB022" : "",
          }}
        >
          <span>
            <Swards />
          </span>
        </div>
      ) : null}
      <div
        className={styles.wonItemList}
        style={
          {
            "--itemMembers": `${itemMembers()}`,
            // "--variant": colorByVariant(item?.frequency ?? 0x0).color,
          } as CustomCSSProperties
        }
      >
        {battle.boxes.map((box, index) => {
          const isNewItem = index === 0;
          const uuid = wonItems[index]?.uid ? wonItems[index]?.uid : "";
          return wonItems[index] ? (
            <div
              className={classNames(styles.item, {
                [styles.animate]: isNewItem,
              })}
              key={wonItems[index].id + index + uuid}
              style={
                {
                  "--itemWidth": `${itemWidth()}px`,
                  "--itemWidthPercent": `${itemWidthPercent()}%`,
                  "--variant":
                    caseItemsFrequencyMap &&
                    colorByVariant(
                      caseItemsFrequencyMap[wonItems[index]?.id] ?? 0x0
                    ).color,
                  // '--animation-delay': delay,
                } as CustomCSSProperties
              }
            >
              <span className={styles.parcent}>
                {caseItemsFrequencyMap &&
                  formatFrequency(
                    caseItemsFrequencyMap[wonItems[index]?.id] ?? 0x0
                  )}
                %
              </span>
              <div
                className={classNames(
                  styles.itemImage,
                  styles.shadow,
                  index === 0 && battle.state === IN_PROGRESS && styles.selected
                )}
              >
                <img
                  src={
                    wonItems[index].images.length > 0
                      ? wonItems[index].images[0].url
                      : ""
                  }
                  alt=""
                />
              </div>
              <div
                className={styles.boxDetail}
                style={
                  { "--itemWidth": `${itemWidth()}px` } as CustomCSSProperties
                }
              >
                <h4>{shortIt(wonItems[index].name, 10)}</h4>
                <p>{shortIt(box.name ?? "--", 10)}</p>
                <span>$ {formatPrice(wonItems[index].price)}</span>
              </div>
            </div>
          ) : (
            <div
              className={styles.item}
              style={
                {
                  "--itemWidth": `${itemWidth()}px`,
                  "--itemWidthPercent": `${itemWidthPercent()}%`,
                } as CustomCSSProperties
              }
              key={box.id + index}
            >
              <div className={styles.roundNo}>Round {index + 1} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerItems;
