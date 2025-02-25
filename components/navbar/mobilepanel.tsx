import React, { FC } from "react";
import styles from "./navbar.module.scss";
import CrossIcon from "@/svgs/cross.svg";
import LogoImage from "@/svgs/logo.svg";
import AlarmIcon from "@/svgs/alarm.svg";
import ArchieveIcon from "@/svgs/archievebox.svg";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import classNames from "classnames";

export const MobilePanel: FC = () => {
  const { mobileMenu } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const updateMainState = (payload: Partial<MainReducer>) => {
    store.dispatch({
      type: "UPDATE_MAIN_STATE",
      payload,
    });
  };

  return (
    <div
      className={classNames(styles.mobilePanel, mobileMenu && styles.active)}
    >
      <div className={styles.headerpart}>
        <LogoImage className={styles.logomk} />
        <button
          className={styles.closebtn}
          onClick={() => updateMainState({ mobileMenu: false })}
        >
          <CrossIcon />
        </button>
      </div>

      <div className={styles.profilesection}>
        <div className={styles.circleAvatar}></div>

        <div className={styles.details}>
          <h3>StromaeMulnae</h3>
          <div className={styles.progressline}>
            <span className={styles.line}>19</span>
            <div className={styles.progressLevel}>
              <span>515 / 2,500</span>
              <div className={styles.bar}>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.staticLarms}>
        <button className={styles.archievebox}>
          <ArchieveIcon />
          <span>Inventory</span>
        </button>
        <button className={styles.notibutton}>
          <AlarmIcon />
          <span>Notifications</span>
        </button>
      </div>

      <div className={styles.routes}>
        <button className={styles.routebutton}>
          <ArchieveIcon />
          <span>Boxes</span>
        </button>
        <button className={styles.routebutton}>
          <ArchieveIcon />
          <span>Leaderboard</span>
        </button>
        <button className={styles.routebutton}>
          <ArchieveIcon />
          <span>Affiliates</span>
        </button>
        <button className={styles.routebutton}>
          <ArchieveIcon />
          <span>Free case</span>
        </button>
        <button className={styles.routebutton}>
          <ArchieveIcon />
          <span>Chat</span>
        </button>
      </div>
    </div>
  );
};
