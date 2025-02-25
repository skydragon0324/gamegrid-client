import React, { FC } from "react";
import styles from "./modal.module.scss";
import classNames from "classnames";
import CrossImage from "@/svgs/cross.svg";
import { ModalProps } from "./types";
import Modal from "react-modal";

Modal.setAppElement("#__next");

export const ModalOverlay: FC<ModalProps> = ({
  className,
  title,
  isOpened,
  onClose,
  modalRef,
  outsideClose = true,
  icon,
  children,
}) => {
  const handleClose = () => {
    // Request to close the modal
    // console.log("close");
    onClose && onClose();
  };

  return (
    <Modal
      isOpen={isOpened}
      shouldCloseOnOverlayClick
      onRequestClose={() => onClose && onClose()}
      className={classNames(styles.defaultModal, className)}
      contentLabel={title ?? "Default Modal"}
      closeTimeoutMS={200}
    >
      {children}
    </Modal>
  );
};
