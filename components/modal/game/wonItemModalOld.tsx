// import { ModalOverlay } from "../ModalOverlay";
// import styles from "./mgame.module.scss";
// import WalletIcon from "@/svgs/wallet.svg";
// import ExpandIcon from "@/svgs/expanarrow.svg";
// import CirckeChecked from "@/svgs/circlecheckmark.svg";
// import CrossIcon from "@/svgs/cross.svg";
// import LootCoin from "@/svgs/lootcoin.svg";
// import XPCoin from "@/svgs/xp-icon.svg";
// import RefreshIcon from "@/svgs/refresh.svg";
// import Image from "next/image";
// import { useSelector } from "react-redux";
// import { StateInterface, store } from "mredux";
// import { ModalsReducer } from "mredux/reducers/modals.reducer";
// import { API_URL, sellItems } from "@/utils/api.service";
// import { colorByVariant, imageURI } from "@/utils/colordetector";
// import { formatPrice, handleErrorRequest, shortIt } from "@/utils/handler";
// import { UPDATE_GAME_STATE, UPDATE_MODALS_STATE } from "mredux/types";
// import FairnessIcon from "@/svgs/fairness.svg";
// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import Loader from "@/components/loader/Loader";
// import { GameReducer } from "mredux/reducers/game.reducer";
// import { useRouter } from "next/router";
// import { MainReducer } from "mredux/reducers/main.reducer";
// import {useWindowSize} from "@/hooks/windowSize";
// import { updateMainState } from "@/utils/updateState";
// import useRudderStackAnalytics from "@/utils/rudderstack";
// import { CustomCSSProperties } from "@/pages/_app";

// export const WonItemModal = () => {
//   const router = useRouter();
//   const { width } = useWindowSize();
//   const [loadingsell, setLoadingsell] = useState<boolean>(false);
//   const [itemSold, setitemsold] = useState<boolean>(false);
//   const analytics = useRudderStackAnalytics();
//   const [failedImages, setFailedImages] = useState<number[]>([]);

//   const handleImageFailed = (index: number) => {
//     if (!failedImages.includes(index)) {
//       setFailedImages((l) => [...l, index]);
//     }
//   };

//   const { itemUserWon } = useSelector<StateInterface, ModalsReducer>(
//     (state) => state.modalsReducer
//   );

//   const { boxes, boxDetails } = useSelector<StateInterface, GameReducer>(
//     (state) => state.gameReducer
//   );

//   const { user, cryptoPaymentsAvailable, inventory } = useSelector<
//     StateInterface,
//     MainReducer
//   >((state) => state.mainReducer);

//   const updateModalsState = (payload: Partial<ModalsReducer>) => {
//     store.dispatch({
//       type: UPDATE_MODALS_STATE,
//       payload,
//     });
//   };

//   const updateGameState = (payload: Partial<GameReducer>) => {
//     store.dispatch({
//       type: UPDATE_GAME_STATE,
//       payload,
//     });
//   };

//   const sellItem = async () => {
//     try {
//       if (!itemUserWon) return;

//       setLoadingsell(true);

//       const sellReq = await sellItems([itemUserWon.userItemWon?.id ?? ""]);

//       setLoadingsell(false);

//       if (
//         Array.isArray(sellReq) &&
//         sellReq.includes(itemUserWon.userItemWon?.id)
//       ) {
//         analytics &&
//           analytics.track("Item Sold", {
//             item: itemUserWon.itemWon.name,
//             price: itemUserWon.itemWon.price,
//             id: itemUserWon.userItemWon?.id,
//           });
//         toast.success("Item sold successfully");
//         setitemsold(true);
//       } else {
//         toast.error(
//           "Something went wrong, please try again later on inventory page"
//         );
//       }
//     } catch (error) {
//       setLoadingsell(false);
//       // console.log(error);
//       toast.error(handleErrorRequest(error));
//     }
//   };

//   const handleClose = () => {
//     router.push(`/boxes/${boxDetails?.slug}`);
//     // updateGameState({
//     //   goToSpin: true,
//     // });
//     updateModalsState({
//       itemUserWon: null,
//     });

//     if (itemSold) {
//       // router.push("/");
//       // updateGameState({
//       //   action: 0x0,
//       //   itemWon: null,
//       //   gameStarted: false,
//       //   boxDetails: null,
//       //   currentBoxId: null,
//       // });
//     }
//   };

//   const ItemImage = () => {
//     let image = null;
//     if (boxes) {
//       let box = boxes.find((box) => box.id === itemUserWon?.boxId);
//       if (box) {
//         let item = box.items.find(
//           (item) => item.item.id === itemUserWon?.itemWon?.id
//         );
//         if (item && item.item.images.length) {
//           image = item.item.images[0].url;
//         }
//       }
//     }

//     return image || imageURI(itemUserWon?.itemWon?.id ?? "", "item");
//   };

//   useEffect(() => {
//     if (itemUserWon) {
//       setitemsold(false);
//     }
//   }, [itemUserWon]);

//   useEffect(() => {
//     return () => {
//       setFailedImages([]);
//     };
//   }, []);

//   return (
//     <ModalOverlay
//       isOpened={!!itemUserWon}
//       className={styles.wonModal}
//       onClose={() => handleClose()}
//     >
//       {(itemUserWon && (
//         <>
//           <div className={styles.topBorder}>
//             <div
//               className={styles.borderGragient}
//               style={
//                 {
//                   "--variant": colorByVariant(itemUserWon.frequency ?? 0x0)
//                     .color,
//                 } as CustomCSSProperties
//               }
//             ></div>
//           </div>
//           <div className={styles.header}>
//             <h1>YOU WON AN ITEM!</h1>
//             <button
//               className={styles.closebutton}
//               onClick={() => handleClose()}
//               // disabled={loading}
//             >
//               <CrossIcon />
//             </button>
//           </div>
//           <div className={styles.itemPreview}>
//             <img
//               onError={() => handleImageFailed(0x0)}
//               src={
//                 failedImages.includes(0x0)
//                   ? "/imgs/placeholder.png"
//                   : ItemImage()
//               }
//               alt=""
//             />

//             <div className={styles.itemDetails}>
//               <span>
//                 <h2 title={itemUserWon.itemWon.name}>
//                   {shortIt(
//                     itemUserWon.itemWon.name,
//                     width > 900 ? 25 : width > 600 ? 20 : width > 400 ? 15 : 10
//                   )}
//                 </h2>
//                 {/* <div className={styles.dot}></div> */}
//               </span>
//               {/* <p></p> */}
//             </div>
//             <span className={styles.itemType}>
//               {itemUserWon.userItemWon &&
//                 itemUserWon?.userItemWon.categories.length > 0 &&
//                 itemUserWon?.userItemWon.categories[0].name}
//             </span>
//             <h3>$ {formatPrice(itemUserWon.itemWon.price ?? 0x0)}</h3>

//             <div className={styles.actionButtons}>
//               <button
//                 className={styles.spinButton}
//                 onClick={() => {
//                   if (!itemUserWon || !boxes || !user) return;
//                   // if (itemUserWon.itemWon.price > user?.usdBalance) {
//                   //   toast.error("You don't have enough balance to spin again");
//                   //   return;
//                   // }
//                   setitemsold(false);
//                   updateGameState({
//                     boxDetails: boxes?.find(
//                       (box) => box.id === itemUserWon?.boxId
//                     ),
//                     action: 0x0,
//                     spinAgain: !itemUserWon.demo,
//                     spinAgainDemo: itemUserWon.demo,
//                   });
//                   router.push(`/boxes/${boxDetails?.slug}`);
//                 }}
//                 disabled={
//                   !user ||
//                   boxDetails?.price == undefined ||
//                   boxDetails?.price > user?.usdBalance
//                 }
//               >
//                 <RefreshIcon />
//                 <span>Spin Again $ {formatPrice(boxDetails?.price ?? 0)}</span>
//               </button>
//               <button
//                 className={styles.sellForBalanceButton}
//                 onClick={() => {
//                   if (!user) return;
//                   sellItem();
//                   // updateModalsState({
//                   //   itemUserWon: null,
//                   // });
//                   updateMainState({
//                     user: {
//                       ...user,
//                       usdBalance: user.usdBalance + itemUserWon.itemWon.price,
//                       lootCoinsBalance:
//                         user.lootCoinsBalance +
//                         (itemUserWon?.adjustedLootCoins ?? 0),
//                       xpBalance:
//                         user.xpBalance + (itemUserWon?.adjustedXP ?? 0),
//                     },
//                   });
//                 }}
//                 disabled={loadingsell || itemSold || itemUserWon?.demo}
//               >
//                 {loadingsell ? (
//                   <Loader radius={15} />
//                 ) : (
//                   <>
//                     <WalletIcon />
//                     <span>{itemSold ? "Item Sold" : "Sell for Balance"}</span>
//                   </>
//                 )}
//               </button>
//               {/* <button
//                 className={styles.sellbutton}
//                 onClick={() =>
//                   updateModalsState({
//                     fairnessData: {
//                       boxId: itemUserWon?.boxId ?? "--",
//                       gameId: itemUserWon?.gameId ?? "--",
//                       publicSeed: itemUserWon?.publicSeed ?? "--",
//                     },
//                   })
//                 }
//               >
//                 <FairnessIcon />
//                 <span>Provably Fair</span>
//               </button> */}
//             </div>

//             {(itemUserWon.adjustedLootCoins || itemUserWon.adjustedXP) && (
//               <div className={styles.additionalPrize}>
//                 <span>You also get</span>
//                 {itemUserWon.adjustedLootCoins &&
//                   itemUserWon.adjustedLootCoins > 0 && (
//                     <div className={styles.prizeCard}>
//                       <div className={styles.svg}>
//                         <LootCoin />
//                       </div>
//                       <div className={styles.prizeWrapper}>
//                         <span className={styles.prizeTitle}>
//                           Lootcoin credit
//                         </span>
//                         <span className={styles.prizeAmount}>
//                           {formatPrice(itemUserWon.adjustedLootCoins)} Lootcoins
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 {itemUserWon.adjustedXP && itemUserWon.adjustedXP > 0 && (
//                   <div className={styles.prizeCard}>
//                     <div className={styles.svg}>
//                       <XPCoin />
//                     </div>
//                     <div className={styles.prizeWrapper}>
//                       <span className={styles.prizeTitle}>XP credit</span>
//                       <span className={styles.prizeAmount}>
//                         {formatPrice(itemUserWon.adjustedXP)} XPs
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </>
//       )) ||
//         null}
//     </ModalOverlay>
//   );
// };
