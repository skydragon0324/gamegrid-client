export interface ModalProps {
  isOpened: boolean;
  onClose?: () => void;
  className?: string;
  title?: string;
  outsideClose?: boolean;
  modalRef?: LegacyRef<HTMLDivElement> | undefined;
  icon?: string;
  children: React.ReactNode;
}
