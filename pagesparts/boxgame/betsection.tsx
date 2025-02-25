import styles from "./battles.module.scss";
import ArrowIconLeft from "@/svgs/arrow-left.svg";
import Image from "next/image";
import FairnessIcon from "@/svgs/fairness.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import StarsIcon from "@/svgs/stars.svg";
import { Dropdown } from "@/components/dropdown/dropdown";
import { FC, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/loader/Loader";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { BoxType } from "@/utils/api.service";
import { formatPrice } from "@/utils/handler";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { GameReducer } from "mredux/reducers/game.reducer";
import { StateInterface, store } from "mredux";
import { UPDATE_GAME_STATE } from "mredux/types";

interface BetSectionProps {
  btnLoading: boolean[];
  openCase: (istest?: boolean) => void;
  boxDetails: BoxType | null;
}

export const BetSection: FC<BetSectionProps> = ({
  openCase,
  btnLoading,
  boxDetails,
}) => {
  const router = useRouter();

  const lootgg_game_enabled = useFeatureIsOn("lootgg_game_enabled");

  const openCaseRef = useRef<HTMLButtonElement>(null);
  const openCaseDemoRef = useRef<HTMLButtonElement>(null);

  const { spinAgain, spinAgainDemo } = useSelector<StateInterface, GameReducer>(
    (state) => state.gameReducer
  );

  const updateGameState = (payload: Partial<GameReducer>) => {
    store.dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  useEffect(() => {
    if (spinAgain && lootgg_game_enabled && openCaseRef.current) {
      openCaseRef.current.click();
      updateGameState({ spinAgain: false });
    }
  }, [spinAgain]);

  useEffect(() => {
    if (spinAgainDemo && lootgg_game_enabled && openCaseDemoRef.current) {
      openCaseDemoRef.current.click();
      updateGameState({ spinAgainDemo: false });
    }
  }, [spinAgainDemo]);

  return (
    <div className={styles.itemInfo}>
      <button className={styles.backBtn} onClick={() => router.push("/")}>
        <ArrowIconLeft />
        <span>Back to case</span>
      </button>
      <div className={styles.itemPreview}>
        {boxDetails ? (
          <Image
            src={boxDetails.imageUrl}
            alt={""}
            width={305}
            height={305}
            className={styles.itemImage}
          />
        ) : (
          <Skeleton width="305px" height="305px" borderRadius="10px" />
        )}

        <div className={styles.itemInfo}>
          <h2>
            {boxDetails ? (
              boxDetails.name ?? "--"
            ) : (
              <Skeleton width="150px" height="10px" borderRadius="20px" />
            )}
          </h2>
          <p>
            {boxDetails ? (
              "Gaming"
            ) : (
              <Skeleton width="100px" height="10px" borderRadius="20px" />
            )}
          </p>

          <button className={styles.fairnessButton} disabled={!boxDetails}>
            <FairnessIcon />
            <span>Fairness Guaranteed</span>
          </button>

          {/* <div className={styles.inputForm}>
            <div className={styles.label}>Number of openings</div>
            <Dropdown
              classNameButton={styles.dropdownButton}
              classNameList={styles.dropdownMorelist}
              normalList
              disabled={!boxDetails}
              options={[
                // { value: "l", Label: "1 Opens" },
                { value: "l2", Label: "2 Opens" },
                { value: "l2", Label: "3 Opens" },
              ]}
              onChange={() => void 0x0}
            >
              <span>1</span>
              <ChevronDown />
            </Dropdown>
          </div> */}

          <div className={styles.startsections}>
            <button
              ref={openCaseRef}
              className={styles.starter}
              onClick={() => {
                if (!lootgg_game_enabled) {
                  toast.error("This feature is not available yet");
                  return;
                }
                openCase();
              }}
              disabled={btnLoading[0x0] || btnLoading[0x1] || !boxDetails}
            >
              {btnLoading[0x0] ? (
                <Loader radius={15} />
              ) : (
                <>
                  <StarsIcon />
                  Open for $ {formatPrice(boxDetails?.price ?? 0)}
                </>
              )}
            </button>
            {/* <button
              ref={openCaseDemoRef}
              className={styles.demo}
              onClick={() => openCase(true)}
              // disabled={btnLoading[0x1] || btnLoading[0x0] || !boxDetails}
            >
              Fast Spin
            </button>
            <button
              ref={openCaseDemoRef}
              className={styles.demo}
              onClick={() => openCase(true)}
              disabled={btnLoading[0x1] || btnLoading[0x0] || !boxDetails}
            >
              <StarsIcon /> Test-spin
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
