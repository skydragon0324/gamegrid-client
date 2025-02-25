import Image from "next/image";
import styles from "./box.module.scss";
import { formatPrice, shortIt } from "@/utils/handler";
import Minus from "@/svgs/minus.svg";
import Plus from "@/svgs/plus.svg";
import React, { useEffect, useState } from "react";
import PlusIcon from "@/svgs/plus.svg";

interface BoxPropsType {
  b_count: number;
  box: BoxType;
  increase?: (boxId: string, cnt: number) => void;
  decrease?: (boxId: string, cnt: number) => void;
}

const AddedBox: React.FC<BoxPropsType> = ({
  b_count,
  box,
  increase,
  decrease,
}) => {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    setCount(b_count);
  }, [b_count]);

  const handleIncrease = (id: string) => {
    increase && increase(id, count + 1);
    setCount(count + 1);
  };
  const handleDecrease = (id: string) => {
    decrease && decrease(id, count - 1);
    setCount(count - 1);
  };

  return (
    <div className={styles.item}>
      {count > 0 && increase && (
        <div
          className={styles.delete}
          onClick={() => {
            decrease && decrease(box.id, 0);
            decrease && setCount(0);
          }}
        ></div>
      )}
      <div className={styles.image}>
        <Image src={box.imageUrl} alt="" layout="fill" quality={100} />
      </div>
      <div className={styles.boxDetail}>
        <div className={styles.name}>{shortIt(box.name ?? "--", 15)}</div>
        <div className={styles.category}>
          {(box &&
            box.categories &&
            !!box?.categories.length &&
            box?.categories?.[0x0].name) ||
            "Unknown"}
        </div>
        <div className={styles.price}>$ {formatPrice(box.price)}</div>
      </div>
      {count === 0 ? (
        <div
          className={styles.createBtn}
          onClick={() => handleIncrease(box.id)}
        >
          <PlusIcon />
          <p>Add to Battle</p>
        </div>
      ) : (
        <div className={styles.boxCount}>
          {increase && (
            <button
              className={styles.plusMinus}
              disabled={count < 1}
              onClick={() => handleDecrease(box.id)}
            >
              <Minus />
            </button>
          )}
          <div className={styles.countBox}>{count}</div>
          {decrease && (
            <button
              className={styles.plusMinus}
              onClick={() => handleIncrease(box.id)}
            >
              <Plus />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddedBox;
