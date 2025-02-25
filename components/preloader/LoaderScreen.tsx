import React, { FC } from "react";
import LogoImage from "@/svgs/logo.svg";
import classNames from "classnames";
import styles from "./loader.module.scss";

export const LoaderScreen: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={classNames(styles.loaderScreen, className ?? "")}>
      <div className={styles.centerPanel}>
        <LogoImage />
      </div>
    </div>
  );
};
