import React, { FC, useEffect } from "react";
import styles from "./drop.module.scss";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { UPDATE_MODALS_STATE } from "mredux/types";

interface DropdownProps {
  options?: {
    value: string;
    Label: string | React.ReactNode;
    className?: string;
    onClick?: () => void;
  }[];
  classNameButton?: string;
  classNameList?: string;
  onChange: (index: number, value: string) => void;
  onClose?: () => void;
  children: React.ReactNode;
  currentIndex?: number;
  normalList?: boolean;
  disabled?: boolean;
  panelContent?: React.ReactNode;
  onChangePanel?: (index: boolean) => void;
}

export const Dropdown: FC<DropdownProps> = ({
  children,
  options,
  panelContent,
  classNameButton,
  classNameList,
  disabled,
  normalList,
  onChangePanel,
  onChange,
  onClose,
  currentIndex = 0x0,
}) => {
  const { closeRequestDropDowns } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const onSelect = (index: number) => {
    if (!normalList && (index === currentIndex || !options?.[index])) {
      return;
    }

    if (options && normalList && onChange) {
      onChange(index, options[index].value);
    }

    setIsOpen(false);
  };

  useEffect(() => {
    onChangePanel && onChangePanel(isOpen);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      onClose && onClose();
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && closeRequestDropDowns) {
      setIsOpen(false);

      store.dispatch({
        type: UPDATE_MODALS_STATE,
        payload: {
          closeRequestDropDowns: false,
        },
      });
    }
  }, [closeRequestDropDowns, isOpen]);

  return (
    <div className={styles.container}>
      <button
        className={classNames(styles.button, classNameButton)}
        onClick={() => !disabled && setIsOpen(true)}
        disabled={isOpen || disabled}
      >
        {children}
      </button>
      <div
        className={classNames(styles.overlay, isOpen && styles.opened)}
        onClick={() => isOpen && setIsOpen(false)}
      />
      <div
        className={classNames(
          styles.list,
          !isOpen && styles.ndsp,
          classNameList
        )}
      >
        {panelContent
          ? panelContent
          : (options &&
              options.map(
                (option, i) =>
                  ((normalList || i !== currentIndex) && (
                    <button
                      key={i}
                      onClick={() => {
                        onSelect(i);
                        option.onClick && option.onClick();
                      }}
                      className={classNames(
                        styles.listItem,
                        option.className ?? ""
                      )}
                    >
                      {option.Label}
                    </button>
                  )) ||
                  null
              )) ||
            null}
      </div>
    </div>
  );
};
