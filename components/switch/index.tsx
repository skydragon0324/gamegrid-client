import React from "react";
import styles from "./switch.module.scss";

export interface SwitchProp {
  id: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

export const Switch = (props: SwitchProp) => {
  const { id, disabled, onChange, checked } = props;

  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>Toggle</label>
    </div>
  );
};
