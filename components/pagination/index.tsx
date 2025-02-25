import React, { FC } from "react";
import styles from "./pagi.module.scss";
import ChevronLeft from "@/svgs/chevron-left.svg";
import ChevronRight from "@/svgs/chevron-right.svg";

interface PagiProps {
  page: number;
  totalPages: number | null;
  onChange: (index: number) => void;
}

export const Pagination: FC<PagiProps> = ({ page, totalPages, onChange }) => {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.chevronLeft}
        onClick={() => onChange(Math.max(0x0, page - 0x1))}
        disabled={page === 0x0}
      >
        <ChevronLeft />
      </button>
      <span>
        {page + 0x1 ?? "--"} / {totalPages ?? "--"}{" "}
      </span>
      <button
        className={styles.chevronRight}
        onClick={() => onChange(Math.min(totalPages ?? 0x0, page + 0x1))}
        disabled={!totalPages || page + 1 >= (totalPages ?? 0x0)}
      >
        <ChevronRight />
      </button>
    </div>
  );
};
