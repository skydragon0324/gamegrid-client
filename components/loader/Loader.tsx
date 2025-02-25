import classNames from "classnames";
import { FC } from "react";
import styles from "./loader.module.scss";

interface LoaderProps {
  radius?: number;
  isBlue?: boolean;
  className?: string;
  centered?: boolean;
}

export const Loader: FC<LoaderProps> = ({
  radius,
  isBlue,
  className,
  centered,
}) => {
  return (
    <div className={classNames(className ?? "", centered && styles.centered)}>
      <div
        className={classNames(styles.loaderContent, isBlue && styles.blueOne)}
        style={{
          width: radius ?? 0xf,
          height: radius ?? 0xf,
        }}
      ></div>
    </div>
  );
};

export default Loader;
