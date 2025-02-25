import React, { FC } from "react";
import { AuthModal } from "./auth";
import { WonItemModal } from "./game/WonItemModal";
import { ItemModal } from "./game/ItemModal";
import { FairnessModal } from "./game/FairnessModal";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { WalletModal } from "./wallet/WalletModal";
import { NotificationModal } from "./notification";
import { SellItemModal } from "./profile/SellItem";
import { DeliveryModal } from "./profile/DeliveryModal";
import { BuyXPModal } from "./profile/BuyXpModal";
import { FairnessModal2 } from "./game/FairnessModal2";
import { HowItWorksModal } from "./howItWorks";
import { CreateBattleModal } from "./caseBattle/CreateBattleModal";
import { DetailBattleModal } from "./caseBattle/BoxDetailModal";
import { RematchBattleModal } from "./caseBattle/RematchBattleModal";
import { JoinModal } from "./caseBattle/JoinModal";
import { StatisticsModal } from "./profile/StatisticsModal";

export const ModalsContainer: FC = () => {
  return (
    <>
      <AuthModal />
      <WonItemModal />
      <ItemModal />
      <FairnessModal />
      <FairnessModal2 />
      <WalletModal />
      <NotificationModal />
      <SellItemModal />
      <DeliveryModal />
      <BuyXPModal />
      <HowItWorksModal />
      <CreateBattleModal />
      <DetailBattleModal />
      <RematchBattleModal />
      <JoinModal />
      <StatisticsModal />
    </>
  );
};
