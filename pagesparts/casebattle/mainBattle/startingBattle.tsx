import { useSelector } from "react-redux";
import styles from "./case.main.module.scss";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { StateInterface } from "mredux";
import { COMMITTED_EOS_BLOCK } from "@/utils/constants";

const StartingBattle = () => {
  const { battle } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );
  return (
    <div className={styles.startingPart}>
      <div className={styles.decoration}>
        <div></div>
        <div></div>
      </div>
      <label>
        {battle.state === COMMITTED_EOS_BLOCK ? (
          <span>
            WAITING for EOS blocks -{" "}
            <span style={{ color: "#8962F8" }}>{battle.eosSeed?.blockNum}</span>
          </span>
        ) : (
          <span>Battles Starts in...</span>
        )}
      </label>
      {/* <div className={styles.spinner}> */}
      <CountdownCircleTimer
        isPlaying
        duration={10}
        colors="#8962F8"
        strokeWidth={3}
        size={128}
      >
        {({ remainingTime }) => <p>{remainingTime}</p>}
      </CountdownCircleTimer>
      {/* </div> */}
    </div>
  );
};

export default StartingBattle;
