import React, { useEffect, useMemo, useState } from "react";
import styles from "./case.module.scss";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import {
  formatFrequency,
  formatPrice,
  handleAvatar,
  handleErrorRequest,
  shortIt,
} from "@/utils/handler";
import Swards from "@/svgs/sward.svg";
import classNames from "classnames";
import { colorByVariant, imageURI } from "@/utils/colordetector";
import { CustomCSSProperties } from "@/pages/_app";
import { addBotToBattle } from "@/utils/api.service";
import { UPDATE_CURRENT_BATTLE_STATE } from "mredux/types";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { IN_PROGRESS } from "@/utils/constants";
// import { Player } from "./mainBattle/resultBattle";

interface propsType {
  player?: Player;
  sward: boolean;
  winner?: boolean;
  team?: number;
  teamPosition?: number;
}

const WonItems: React.FC<propsType> = ({
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
    const temp = player?.wonItems.map((item) => item.item);
    battle.state === IN_PROGRESS
      ? setTimeout(() => {
          setWonItems(temp ? temp.reverse() : []);
        }, 9000)
      : setWonItems(temp ? temp.reverse() : []);
  }, [player]);

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  useEffect(() => {
    if (battle.state === IN_PROGRESS) {
      setStartPrice(wonPrice);
      setWonPrice(wonItems.reduce((price, b) => price + b.price, 0.0));
    } else {
      if (battle.winnerTeam === player?.team)
        setWonPrice(battle.winningsPerPlayer);
      else setWonPrice(0.0);
    }
  }, [wonItems]);

  const addBot = async (
    battleId: string,
    team: number = 0,
    teamPosition: number = 0
  ) => {
    if (battle.owner?.id !== user?.id) {
      toast.error("You are not the owner of this battle");
      return;
    } else {
      try {
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

  const PlayerComponent = useMemo(() => {
    return (
      <>
        {player ? (
          <div className={styles.player}>
            {player.bot ? (
              <div
                className={styles.circleAvatar}
                style={{
                  backgroundImage: "url(/imgs/bot.png)",
                }}
              ></div>
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
            )}
            <div className={styles.userName}>
              <div className={styles.name}>{shortIt(player.name, 10)}</div>
              <div className={styles.holder}>
                <div
                  className={`${styles.value} ${winner ? styles.winner : ""}`}
                >
                  {" "}
                  ${" "}
                </div>
                <div
                  className={`${styles.value} ${winner ? styles.winner : ""}`}
                >
                  <CountUp
                    start={startPrice}
                    end={wonPrice}
                    duration={2.5}
                    separator=","
                    decimal="."
                    decimals={2}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // <Player player={player} wonPrice={wonPrice} />
          <div
            className={styles.botMode}
            onClick={() => addBot(battle.id, team, teamPosition)}
          >
            <div
              className={`${styles.btn} ${styles.purple}`}
              // style={{ background: "#8962F8" }}
            >
              <Swards />
              {loading ? <Loader /> : "Play with Bot"}
            </div>
          </div>
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
      </>
    );
  }, [player, startPrice, wonPrice, sward]);

  return (
    <div
      className={styles.wonItems}
      style={{
        borderColor: battle.winnerTeam == player?.team ? "#FDB022" : "",
      }}
    >
      {PlayerComponent}
      <div className={styles.wonItemList}>
        {battle.boxes.map((box, index) => {
          console.log("a", box, wonItems[index]);
          const item = box.items.find(
            (item) => item.item.id === wonItems[index]?.id
          );
          return wonItems[index] ? (
            <div
              className={classNames(
                styles.item,
                battle.state === IN_PROGRESS && index === 0 && styles.selected
              )}
              key={wonItems[index].id + index}
              style={
                {
                  "--variant": colorByVariant(item?.frequency ?? 0x0).color,
                } as CustomCSSProperties
              }
            >
              <span className={styles.parcent}>
                {formatFrequency(item?.frequency ?? 0x0)}%
              </span>
              <div className={classNames(styles.itemImage, styles.shadow)}>
                <img
                  src={
                    wonItems[index].images.length > 0
                      ? wonItems[index].images[0].url
                      : ""
                  }
                  alt=""
                />
              </div>
              <div className={styles.boxDetail}>
                <h4>{shortIt(wonItems[index].name, 15)}</h4>
                <p>{shortIt(box.name ?? "--", 15)}</p>
                <span>$ {formatPrice(wonItems[index].price)}</span>
              </div>
            </div>
          ) : (
            <div className={styles.item}>Round {index + 1}</div>
          );
        })}
      </div>
    </div>
  );
};

export default WonItems;
