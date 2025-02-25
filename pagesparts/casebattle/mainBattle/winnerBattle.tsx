import styles from "./case.main.module.scss";
import { WinnerSpinner } from "./winnerSpinner";

const WinnerBattle = () => {
  return (
    <div className={styles.winnerRound}>
      <div className={styles.decoration}>
        <div></div>
        <div></div>
      </div>
      <WinnerSpinner />
    </div>
  );
};

export default WinnerBattle;
