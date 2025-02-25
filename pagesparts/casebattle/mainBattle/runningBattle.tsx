import { useSelector } from "react-redux";
import styles from "./case.main.module.scss";
import { StateInterface } from "mredux";
import { SpinnerVertical } from "./spinnerVertical";
import { useWindowSize } from "@/hooks/windowSize";
import ArrowSP from "@/svgs/spinner-arrow.svg";

const RunningBattle = () => {
  const { battle, isWaitingRound } = useSelector<StateInterface, BattleReducer>(
    (state) => state.battleReducer
  );

  const width = useWindowSize();
  return (
    <div className={styles.runningPart}>
      <div className={styles.decoration}>
        <div></div>
        <div></div>
      </div>
      {width.width < 560 && battle.teams * battle.teamsSize > 2 && (
        <div className={styles.arrowP}>
          <ArrowSP />
          <ArrowSP />
        </div>
      )}
      {battle &&
        battle.players
          .slice()
          .sort((a, b) => {
            if (a.team > b.team) {
              return 1;
            } else if (a.team < b.team) {
              return -1;
            } else {
              if (a.teamPosition > b.teamPosition) return 1;
              else return -1;
            }
          })
          .map((player, ii) =>
            battle.boxes.map(
              (box, jj) =>
                battle.lastProcessedRound === jj && (
                  <SpinnerVertical
                    player={player}
                    box={box}
                    key={jj.toString() + player.id + ii}
                    isDone={isWaitingRound}
                  />
                )
            )
          )}
    </div>
  );
};

export default RunningBattle;
