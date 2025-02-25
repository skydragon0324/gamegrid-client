import { FC } from "react";
import styles from "./error.module.scss";
export const ErrorContent: FC<{ message?: string; title?: string }> = ({
  message,
  title,
}) => {
  return (
    <div className={styles.errorPage}>
      <h1>{title ?? "Site under maintenance"}</h1>
      <p>
        {message ??
          "We're sorry! Site under maintenance. We'll be back soon! Thank you for your patience."}
      </p>
      <br />
      <br />
    </div>
  );
};
