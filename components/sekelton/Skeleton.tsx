import { FC } from "react";
import styles from "./skel.module.scss";
import classNames from "classnames";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
  opacity?: number;
}

export const Skeleton: FC<SkeletonProps> = ({
  className,
  width,
  height,
  borderRadius,
  margin,
  opacity,
}) => {
  return (
    <div
      className={classNames(styles.skeleton, className)}
      style={Object.assign(
        {
          animationDelay: `${Math.random() * 2}s`,
        },
        width ? { width } : {},
        height ? { height } : {},
        borderRadius ? { borderRadius } : {},
        margin ? { margin } : {},
        opacity ? { opacity } : {}
      )}
    ></div>
  );
};
