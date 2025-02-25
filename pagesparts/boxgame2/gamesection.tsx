// import { useEffect, useRef, useState } from "react";
// import styles from "./battles.module.scss";
// import Wheel from "@/svgs/wheel.svg";
// import { drawItemsOnWheel } from "@/utils/wheel";
// import { StateInterface, store } from "mredux";
// import { GameReducer } from "mredux/reducers/game.reducer";
// import { useSelector } from "react-redux";
// import { colorByVariant, imageURI } from "@/utils/colordetector";
// import Loader from "@/components/loader/Loader";
// import ArrowLeft from "@/svgs/arrow-left.svg";
// import ArrowWheel from "@/svgs/arrow.svg";
// import FairnessIcon from "@/svgs/fairness.svg";
// import { UPDATE_GAME_STATE, UPDATE_MODALS_STATE } from "mredux/types";
// import { useRouter } from "next/router";
// import { ModalsReducer } from "mredux/reducers/modals.reducer";
// import { MainReducer } from "mredux/reducers/main.reducer";

// export const GameSection = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const wheelRef = useRef<string>(null);
//   const router = useRouter();
//   const [transitionDelay, setTransitionDelay] = useState<number>(0.5);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(0x0);
//   const [degrees, setDegrees] = useState<number>(0);
//   const { itemWon, gameStarted, boxes, currentBoxId, boxDetails } = useSelector<
//     StateInterface,
//     GameReducer
//   >((state) => state.gameReducer);

//   const updateGameState = (payload: Partial<GameReducer>) => {
//     store.dispatch({
//       type: UPDATE_GAME_STATE,
//       payload,
//     });
//   };

//   const updateMainState = (payload: Partial<MainReducer>) => {
//     store.dispatch({
//       type: "UPDATE_MAIN_STATE",
//       payload,
//     });
//   };
//   const completeAnimation = () => {
//     setSelectedIndex(null);
//   };

//   const updateModalsState = (payload: Partial<ModalsReducer>) => {
//     store.dispatch({
//       type: UPDATE_MODALS_STATE,
//       payload,
//     });
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         if (boxDetails && itemWon) {
//           const image = await drawItemsOnWheel(
//             "/imgs/wheel2.png",
//             new Array(16).fill(null).map((_, i) => {
//               let ItemL =
//                 boxDetails?.items[i % boxDetails?.items.length].item ?? null;

//               return ItemL && ItemL.images.length
//                 ? ItemL.images[0].url
//                 : imageURI(ItemL?.id ?? "", "item");
//             }),
//             boxDetails?.items.map(
//               (item) => colorByVariant(item.frequency).color
//             )
//           );

//           if (image) {
//             setLoading(false);
//             (wheelRef as any).current = image;

//             let _sl = boxDetails.items.findIndex(
//               (item) => item.item.id === itemWon.itemWon.id
//             );

//             setSelectedIndex(_sl);

//             setTransitionDelay(0);
//             setDegrees(0);

//             setTimeout(() => {
//               setTransitionDelay(0x7);
//               const rotations = 360 * 0x5;
//               const itemDegrees = _sl * (360 / 0x10) + 4 * (360 / 0x10);
//               const Ylr = -(rotations + itemDegrees);
//               const YlrAf =
//                 Ylr - Math.max(0x5, (360 * Math.random()) / 0x10 - 0x5);

//               setDegrees(YlrAf);

//               setTimeout(() => {
//                 setTransitionDelay(0x2);

//                 let leftOLI = YlrAf + (Ylr - YlrAf) - 360 / 0x10 / 0x2;

//                 setDegrees(leftOLI);

//                 setTimeout(() => {
//                   typeof _sl === "number" &&
//                     !itemWon?.woModal &&
//                     updateModalsState({
//                       itemUserWon: itemWon,
//                     });

//                   const mainState = store.getState().mainReducer;

//                   setTransitionDelay(0x7);

//                   updateMainState({
//                     refreshInventory: !mainState.refreshInventory,
//                   });
//                 }, 2000);
//               }, 7150);
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         // console.log(error);
//       }
//     })();
//   }, [wheelRef.current, boxDetails, itemWon]);

//   return (
//     <div className={styles.gamesection}>
//       {!itemWon || loading ? (
//         <Loader radius={40} centered className={styles.loader} isBlue />
//       ) : (
//         <>
//           <div className={styles.divider}>
//             <button
//               className={styles.backcases}
//               onClick={() => {
//                 router.push("/");
//                 updateGameState({
//                   action: 0x0,
//                   itemWon: null,
//                   gameStarted: false,
//                   boxDetails: null,
//                   currentBoxId: null,
//                 });
//                 completeAnimation();
//                 setSelectedIndex(null);
//               }}
//             >
//               <ArrowLeft />
//               <span>Back to cases</span>
//             </button>

//             <button
//               className={styles.fairness}
//               onClick={() => {
//                 updateModalsState({
//                   fairnessData: {
//                     gameId: itemWon?.gameId ?? "--",
//                     publicSeed: itemWon?.publicSeed ?? "--",
//                     boxId: boxDetails?.id ?? "--",
//                   },
//                 });
//               }}
//             >
//               <FairnessIcon />
//               <span>Fairness Guaranteed</span>
//             </button>
//           </div>
//           <div className={styles.decorations}>
//             <div className={styles.left}>
//               <img src="/imgs/cloth-box.png" alt="" />
//               <img src="/imgs/purple-box.png" alt="" />
//             </div>
//             <div className={styles.right}>
//               <img src="/imgs/watches-box.png" alt="" />
//             </div>
//           </div>
//           <div className={styles.game}>
//             <div className={styles.wheel}>
//               <div className={styles.arrows}>
//                 <ArrowWheel />
//                 <ArrowWheel />
//               </div>
//               <img
//                 src={wheelRef.current ?? "/imgs/wheel.png"}
//                 alt=""
//                 style={{
//                   transition: `transform ${transitionDelay}s cubic-bezier(0.33, 1, 0.68, 1)`,
//                   transform: `rotate(${degrees}deg)`,
//                 }}
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default GameSection;
