import React from "react";
import styles from "@/parts/home/index.module.scss";

export const InfoBoxes: React.FC = () => {
  return (
    <div className={styles.infocards}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2>VARIETY OF CASES</h2>
          <p>Spectrum of Surprises - Discover More with Every Unbox.</p>
        </div>
        <div className={styles.right}>
          <img src="/imgs/case.png" alt="" className={styles.img_case} />
          <img src="/imgs/bg_1.png" alt="" className={styles.bg_case} />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2>QUICK DELIVERY</h2>
          <p>Speed to Your Step - Unbox Faster, Enjoy Sooner.</p>
        </div>
        <div className={styles.right}>
          <img src="/imgs/Drones.png" alt="" />
          <img src="/imgs/bg_2.png" alt="" className={styles.bg_delivery} />
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2>EXCELLENT SUPPORT</h2>
          <p>Support That Shines - We're Here for Your Unboxing Joy.</p>
        </div>
        <div className={styles.right}>
          <img src="/imgs/Service.png" alt="" />
          <img src="/imgs/bg_3.png" alt="" className={styles.bg_service} />
        </div>
      </div>
    </div>
  );
};
