import { useEffect, useRef, useState } from "react";
import styles from "./countdown.module.scss";

const CountDown = () => {
  const [time, setTime] = useState(30);
  const progressRef = useRef<SVGRectElement>(null);
  const progressRestRef = useRef<SVGRectElement>(null);
  useEffect(() => {
    const duration = 30;
    let timer = duration;
    const progressRect = progressRef.current;
    const progressRestRect = progressRestRef.current;
    if (progressRect && progressRestRect) {
      const circumference = 80 + 40 * Math.PI;
      progressRect.style.strokeDasharray = `${circumference}`;
      progressRect.style.strokeDashoffset = `${circumference}`;
      progressRestRect.style.strokeDasharray = `${circumference}`;
      progressRestRect.style.strokeDashoffset = `${circumference - 10}`;
      const setProgress = (percent: number) => {
        const offset = (percent / 100.0) * circumference - circumference - 10;
        console.log(circumference, percent, offset);
        progressRect.style.strokeDashoffset = `${offset}`;
        if (offset + circumference <= 0) {
          progressRect.style.stroke = "#221F28";
        } else {
          progressRect.style.stroke = "#8962F8";
        }
      };
      setProgress(100); // Start with full progress to show the initial color
      const interval = setInterval(() => {
        timer--;
        setTime(timer);
        let progress = ((duration - timer) / duration) * 100;
        setProgress(100 - progress); // Subtract from 100 to fill the progress
        if (timer <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            timer = duration;
            setTime(timer);
            setProgress(100);
          }, 1000);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={styles.main}>
      <svg className={styles.progressRing} width="80" height="80">
        <rect
          className={styles.backgroundRect}
          stroke="#221F28"
          strokeWidth="4"
          fill="transparent"
          width="60"
          height="60"
          x="8"
          y="8"
          rx="20"
          ry="20"
        />
        <rect
          ref={progressRestRef}
          className={styles.progressRect}
          stroke="#8962F8"
          strokeWidth="4"
          fill="transparent"
          width="60"
          height="60"
          x="8"
          y="8"
          rx="20"
          ry="20"
        />
        <rect
          ref={progressRef}
          className={styles.progressRect}
          stroke="#8962F8"
          strokeWidth="4"
          fill="transparent"
          width="60"
          height="60"
          x="8"
          y="8"
          rx="20"
          ry="20"
        />
      </svg>
      <div className={styles.timer}>{time}</div>
    </div>
  );
};

export default CountDown;
