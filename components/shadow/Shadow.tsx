import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import styles from "./shadow.module.scss";

export const ShadowByColor: FC<{
  color: string;
  className?: string;
  animation?: boolean;
  customColor?: { [name: string]: string[] } | null;
  disableOuterShadow?: boolean;
}> = ({ color, className, animation, disableOuterShadow, customColor }) => {
  const [keyColor, setKeyColor] = useState<string | null>(null);

  useEffect(() => {
    if (color && customColor && !keyColor) {
      setKeyColor(Object.keys(customColor)[0]);
    }
  }, [color, customColor, keyColor]);

  const fillColors: { [key: string]: string } = Object.assign(
    {},
    {
      yellow: "#paint0_radial_422_227605",
      red: "#paint1_radial_422_227605",
      blue: "#paint2_radial_422_227605",
      purple: "#paint3_radial_422_227605",
      blueForced: "#paint4_radial_422_227605",
      blueOpened: "#paint5_radial_422_227605",
    },
    keyColor
      ? {
          [keyColor]: `#${keyColor}`,
        }
      : {}
  );

  if (!color) {
    return null;
  }

  return (
    <div className={classNames(styles.circleHoverAnimation, className)}>
      <svg
        width="231"
        height="238"
        viewBox="0 0 231 238"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animation === false ? styles.noAnimation : ""}
      >
        <path
          opacity="0.3"
          fill={
            color === "transparent"
              ? "transparent"
              : `url(${fillColors[keyColor ?? color]})`
          }
          d="M135.318 236.602L115.121 118.999L154.514 231.283L135.318 236.602ZM105.183 238L135.318 236.602L115.121 119.002L105.183 238ZM94.9217 236.602L115.118 118.999L75.725 231.287L94.9217 236.602ZM75.725 231.287L115.121 118.999L48.9555 216.921L75.725 231.287ZM40.7424 210.41L115.118 119.002L26.6911 195.881L40.7424 210.41ZM26.6911 195.881L115.121 118.999L10.4543 169.604L26.6911 195.881ZM6.49473 159.719L115.118 118.999L0 129.272L6.49473 159.719ZM0 129.272L115.118 119.002L0 108.729V129.272ZM1.35252 98.1213L115.121 118.999L9.73728 67.861L1.35252 98.1213ZM10.4543 68.3962L115.118 119.002L20.3924 50.6057L10.4543 68.3962ZM26.6911 42.1157L115.118 118.999L40.7424 27.5908L26.6911 42.1157ZM40.7424 27.5908L115.121 119.002L66.1659 10.8067L40.7424 27.5908ZM75.725 6.71366L115.118 118.999L94.9217 1.39812L75.725 6.71366ZM94.9217 1.39812L115.118 118.999L125.056 0L94.9217 1.39812ZM135.318 1.39474L115.121 118.999L154.511 6.71366L135.318 1.39474ZM154.511 6.71366L115.118 118.999L181.284 21.0798L154.511 6.71366ZM189.494 27.5908L115.118 118.999L203.545 42.1157L189.494 27.5908ZM203.545 42.1157L115.118 118.999L219.782 68.3928L203.545 42.1157ZM223.745 78.2776L115.118 118.999L228.887 98.1213L223.745 78.2776ZM228.887 98.1213L115.121 118.999L230.24 129.268L228.887 98.1213ZM228.887 139.879L115.118 119.002L223.742 159.723L228.887 139.879ZM223.742 159.723L115.118 118.999L209.847 187.395L223.742 159.723ZM203.548 195.881L115.118 118.999L189.494 210.406L203.548 195.881ZM189.494 210.406L115.118 118.999L164.074 227.19L189.494 210.406Z"
        />
        <defs>
          <radialGradient
            id="paint0_radial_422_227605"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
          >
            <stop stopColor="#FC9114" />
            <stop offset="0.46875" stopColor="#694B39" />
            <stop offset="0.734375" stopColor="#322B42" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_422_227605"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
          >
            <stop stopColor="#ec3f86" />
            <stop offset="0.46875" stopColor="#783953" />
            <stop offset="0.734375" stopColor="#322B42" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_422_227605"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
          >
            <stop stopColor="#5720ea" />
            <stop offset="0.46875" stopColor="#4a328d" />
            <stop offset="0.734375" stopColor="#322B42" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <radialGradient
            id="paint3_radial_422_227605"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
          >
            <stop stopColor="#9634da" />
            <stop offset="0.46875" stopColor="#5b3674" />
            <stop offset="0.734375" stopColor="#322B42" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
          <radialGradient
            id="paint4_radial_422_227605"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
          >
            <stop stopColor="#4B51F5" />
            <stop offset="0.46875" stopColor="#284DCF" />
            <stop offset="0.734375" stopColor="#353B67" />
            <stop offset="1" stopColor="#252A4F" />
          </radialGradient>
          <radialGradient
            id="paint5_radial_422_227605"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
          >
            <stop stopColor="#54ADFF" />
            <stop offset="0.46875" stopColor="#3171AB" />
            <stop offset="0.734375" stopColor="#353B67" />
            <stop offset="1" stopColor="#252A4F" />
          </radialGradient>

          {keyColor && customColor && customColor[keyColor] ? (
            <radialGradient
              id={keyColor}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(115.329 118.783) scale(100.022 103.394)"
            >
              <stop stopColor={customColor[keyColor][0x0] ?? ""} />
              <stop
                offset="0.46875"
                stopColor={customColor[keyColor][0x1] ?? ""}
              />
              <stop
                offset="0.734375"
                stopColor={
                  0x2 in customColor[keyColor]
                    ? customColor[keyColor][0x2]
                    : !disableOuterShadow
                      ? "#353B67"
                      : "transparent"
                }
              />
              <stop
                offset="1"
                stopColor={!disableOuterShadow ? "#252A4F" : "transparent"}
              />
            </radialGradient>
          ) : null}
        </defs>
      </svg>
    </div>
  );
};
