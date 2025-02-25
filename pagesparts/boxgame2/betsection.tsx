import { Dropdown } from "@/components/dropdown/dropdown";
import styles from "./battles.module.scss";
import ArrowLeft from "@/svgs/arrow-left.svg";
import FairnessIcon from "@/svgs/fairness.svg";
import { FC, use, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { formatPrice } from "@/utils/handler";
import Loader from "@/components/loader/Loader";
import { Skeleton } from "@/components/sekelton/Skeleton";
import ChevronDown from "@/svgs/chevron-down.svg";
import StarsIcon from "@/svgs/stars.svg";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import toast from "react-hot-toast";
import { updateGameState, updateModalsState } from "@/utils/updateState";

import { useSelector } from "react-redux";
import { GameReducer } from "mredux/reducers/game.reducer";
import { StateInterface, store } from "mredux";
import { UPDATE_GAME_STATE } from "mredux/types";
import { MainReducer } from "mredux/reducers/main.reducer";

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

  const { spinAgain, spinAgainDemo, fastSpin, spins } = useSelector<
    StateInterface,
    GameReducer
  >((state) => state.gameReducer);

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const updateGameState = (payload: Partial<GameReducer>) => {
    store.dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  const handleFastSpinButton = (fast: boolean) => {
    if (fast) {
      localStorage.setItem("fastSpin", "true");
    } else {
      localStorage.removeItem("fastSpin");
    }

    updateGameState({
      fastSpin: fast,
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

  useEffect(() => {
    let isfastSpin = localStorage.getItem("fastSpin");

    if (isfastSpin) {
      updateGameState({
        fastSpin: true,
      });
    }
  }, []);

  return (
    <div className={styles.betsection}>
      <div className={styles.divider}>
        <button
          className={styles.backcases}
          onClick={() => {
            updateGameState({
              action: 0x0,
              itemWons: null,
              gameStarted: false,
              boxDetails: null,
              currentBoxId: null,
            });
            router.push("/");
          }}
        >
          <ArrowLeft />
          <span>Back to cases</span>
        </button>

        <button className={styles.fairness}>
          <FairnessIcon />
          <span>Fairness Guaranteed</span>
        </button>
      </div>

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

          <h3>
            {boxDetails ? (
              (!!boxDetails?.categories.length &&
                boxDetails?.categories?.[0x0].name) ||
              "--"
            ) : (
              <Skeleton width="100px" height="10px" borderRadius="20px" />
            )}
          </h3>
          <p>
            {boxDetails ? (
              boxDetails.description ?? "--"
            ) : (
              <Skeleton width="250px" height="10px" borderRadius="20px" />
            )}
          </p>

          <div className={styles.startsections}>
            <Dropdown
              classNameButton={styles.dropdownButton}
              classNameList={styles.dropdownMorelist}
              normalList
              currentIndex={spins - 0x1}
              disabled={!boxDetails}
              options={[
                { value: "l1", Label: "1 Case" },
                { value: "l2", Label: "2 Cases" },
                { value: "l3", Label: "3 Cases" },
                { value: "l4", Label: "4 Cases" },
              ].filter((_, i) => i !== spins - 1)}
              onChange={(_, value) => {
                updateGameState({
                  spins: parseInt(value[0x1]),
                });
              }}
            >
              <span>{spins}</span>
              <ChevronDown />
            </Dropdown>
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
                  Open for ${" "}
                  {formatPrice((boxDetails?.price ?? 0) * spins, false, true)}
                </>
              )}
            </button>

            <div className={styles.fastspin}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={fastSpin}
                  defaultChecked={
                    localStorage.getItem("fastSpin") ? true : false
                  }
                  onChange={() => handleFastSpinButton(!fastSpin)}
                />
                <span className="checkmark"></span>
              </label>
              <span
                className={fastSpin ? styles.fastspinlabel : ""}
                onClick={() => handleFastSpinButton(!fastSpin)}
              >
                Fast spin
              </span>
            </div>
            <button
              ref={openCaseDemoRef}
              className={styles.demo}
              onClick={() => openCase(true)}
              disabled={btnLoading[0x1] || btnLoading[0x0] || !boxDetails}
            >
              <StarsIcon /> Test-spin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetSection;
