import React from "react";
import styles from "./players.module.scss";
import classNames from "classnames";
import Person from "@/svgs/person.svg";
import { LootUser } from "mredux/reducers/main.reducer";

interface playerPropsType {
  teams: number | undefined;
  teamSize?: number;
  selection?: boolean;
  click?: (l: number, i: number) => void;
  personWidth?: number;
  swardWidth?: number;
  user?: LootUser;
}

export const Players: React.FC<playerPropsType> = ({
  teams,
  teamSize,
  selection,
  click,
  personWidth,
  swardWidth,
  user,
}) => {
  return (
    <div
      className={styles.playerType}
      onClick={() =>
        click ? click(teams ? teams : 2, teamSize ? teamSize : 1) : null
      }
    >
      {new Array(teams).fill(0).map((el, index) => (
        <div key={index.toString()} className={styles.playerType}>
          {index !== 0 && (
            <span
              className={styles.swards}
              style={{
                width: swardWidth ? `${swardWidth}px` : "8px",
                height: swardWidth ? `${swardWidth}px` : "8px",
              }}
            ></span>
          )}
          {new Array(teamSize).fill(0).map((dl, j) => (
            <div
              className={classNames(styles.person, selection && styles.border)}
              key={index.toString() + j}
            >
              <div
                className={styles.personImg}
                style={{
                  width: personWidth ? `${personWidth}px` : "15px",
                  height: personWidth ? `${personWidth}px` : "15px",
                }}
              ></div>
              {user && <span className={styles.level}>22</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
