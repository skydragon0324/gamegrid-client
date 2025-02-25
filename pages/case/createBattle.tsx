import { Layout } from "@/components/layout/Layout";
import { ExternalPage } from "@/pages/profile";
import Case from ".";
import styles from "@/parts/casebattle/case.module.scss";
import { Switch } from "@/components/switch";
import React, { RefObject, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import AddedBox from "@/components/box/AddedBox";
import "swiper/scss";
import { Swiper as SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import {
  UPDATE_CREATE_BATTLE_STATE,
  UPDATE_CURRENT_BATTLE_STATE,
  UPDATE_MODALS_STATE,
} from "mredux/types";
import { MainReducer } from "mredux/reducers/main.reducer";
import Lock from "@/svgs/lock.svg";
import Star from "@/svgs/star.svg";
import PeopleGroup from "@/svgs/people.svg";
import ArrowUp from "@/svgs/arrow-up.svg";
import ArrowDown from "@/svgs/arrow-down-1.svg";
import Plus from "@/svgs/plus.svg";
import Fast from "@/svgs/fastMode.svg";
import { createRoom } from "@/utils/api.service";
import { formatPrice, handleErrorRequest } from "@/utils/handler";
import { useRouter } from "next/router";
import { Players } from "@/components/numofplayers/Players";
import Loader from "@/components/loader/Loader";
import toast from "react-hot-toast";
import { useWindowSize } from "@/hooks/windowSize";
import ArrowLeft from "@/svgs/arrow-left.svg";
import { wsHandler } from "@/utils/ws.service";

const gameTypes: { teams: number; teamSize: number }[] = [
  { teams: 2, teamSize: 1 },
  { teams: 3, teamSize: 1 },
  { teams: 4, teamSize: 1 },
  { teams: 2, teamSize: 2 },
];

const CreateBattle: ExternalPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [playerOptionOpen, setPlayerOptionOpen] = useState<boolean>(false);
  const [playerType, setPlayerType] = useState<{
    teams: number;
    teamSize: number;
  }>({
    teams: 2,
    teamSize: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // data from Redux
  const { boxes, privateMode, fastMode, crazyMode, teams, teamsSize, userId } =
    useSelector<StateInterface, CreateBattleReducer>(
      (state) => state.createBattleReducer
    );

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  //open Create Battle modal
  const openCreateBattleModal = () => {
    dispatch({
      type: UPDATE_MODALS_STATE,
      payload: {
        createBattleModal: true,
      },
    });
  };

  // update create battle redux
  const updateCreateBattle = (payload: Partial<CreateBattleReducer>) => {
    dispatch({
      type: UPDATE_CREATE_BATTLE_STATE,
      payload,
    });
  };
  const handleSelectPlayerType = (countOfTeam: number, sizeOfTeam: number) => {
    setPlayerType({ teams: countOfTeam, teamSize: sizeOfTeam });
    setPlayerOptionOpen(false);
    updateCreateBattle({
      teams: countOfTeam,
      teamsSize: sizeOfTeam,
    });
  };

  useEffect(() => {
    let sumCnt = 0,
      sumPrice = 0;
    Promise.all(
      boxes.map((l) => {
        sumCnt += l.BCount;
        sumPrice += l.box.price * l.BCount;
      })
    );
    setTotalCount(sumCnt);
    setTotalPrice(sumPrice);
    setPlayerType({ teams: teams, teamSize: teamsSize });
  }, [boxes, teams, teamsSize]);

  const changeBoxCount = (id: string, cnt: number) => {
    if (cnt === 0) {
      updateCreateBattle({
        boxes: [...boxes.filter((item) => item.box.id !== id)],
      });
    } else {
      updateCreateBattle({
        boxes: [
          ...boxes.map((item) =>
            item.box?.id === id ? { box: item.box, BCount: cnt } : item
          ),
        ],
      });
    }
  };

  const handleMode = (type: string) => {
    if (type === "private") {
      updateCreateBattle({
        privateMode: !privateMode,
      });
    } else if (type === "crazy") {
      updateCreateBattle({
        crazyMode: !crazyMode,
      });
    } else if (type === "fast") {
      updateCreateBattle({
        fastMode: !fastMode,
      });
    }
  };

  const updateBattleState = (payload: Partial<Battle>) => {
    dispatch({
      type: UPDATE_CURRENT_BATTLE_STATE,
      payload,
    });
  };
  const createBattle = async () => {
    setLoading(true);
    if (!user) {
      toast.error("Please Log in");
      store.dispatch({
        type: UPDATE_MODALS_STATE,
        payload: { authModal: true },
      });
      setLoading(false);
      return;
    }
    const tempboxIds = boxes
      .map((box) => new Array(box.BCount).fill(0).map((el) => box.box.id))
      .flat();
    try {
      const res = await createRoom(
        tempboxIds,
        teams,
        teamsSize,
        fastMode,
        privateMode
      );
      if (res) {
        updateBattleState(res);
        store.dispatch({
          type: "RESET_CREATE_BATTLE",
        });
        setLoading(false);
        router.push(`/case/battle/${res.id}`);
      }
    } catch (error) {
      toast.error(handleErrorRequest(error));
      setLoading(false);
    }
  };

  const { width } = useWindowSize();

  const dropdownRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setPlayerOptionOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // wsHandler.caseBattle();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // wsHandler.closeBattleWS();
    };
  }, []);

  return (
    <div className={styles.createBattle}>
      <div className={styles.header}>
        <div className={styles.backbtn}>
          <button
            className={styles.backcases}
            onClick={() => {
              router.push("/case/lobby");
            }}
          >
            <ArrowLeft />
            <span>Back</span>
          </button>
        </div>
        <div className={styles.title}>
          <p>Create battle</p>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.setting}>
          <div className={styles.settingHead}>
            <p>Battle Settings</p>
            <button
              className={styles.createBtn}
              disabled={boxes.length < 1}
              onClick={createBattle}
            >
              {loading ? <Loader /> : "Create Battle"}
            </button>
          </div>
          <div className={styles.options}>
            <div className={styles.battleMode}>
              {/* <div className={styles.mode}>
                <div className={styles.head}>
                  <div className={styles.type}>
                    <Lock />
                    <p className={styles.typeTitle}>Private game</p>
                  </div>
                  <Switch
                    id="privateMode"
                    disabled={false}
                    onChange={() => handleMode("private")}
                    checked={privateMode}
                  />
                </div>
                <div className={styles.desc}>
                  The battle will be visible only to those with a link.
                </div>
              </div> */}
              {/* <div className={styles.mode}>
                <div className={styles.head}>
                  <div className={styles.type}>
                    <Star />
                    <p className={styles.typeTitle}>Crazy Type</p>
                  </div>
                  <Switch
                    id="crazyMode"
                    disabled={false}
                    onChange={() => handleMode("crazy")}
                    checked={crazyMode}
                  />
                </div>
                <div className={styles.desc}>
                  Unique game Type where the objective is to unbox the least in
                  total value to win the battle.
                </div>
              </div> */}
              <div className={styles.mode}>
                <div className={styles.head}>
                  <div className={styles.type}>
                    <Fast />
                    <p className={styles.typeTitle}>Fast mode</p>
                  </div>
                  <Switch
                    id="fastMode"
                    disabled={false}
                    onChange={() => handleMode("fast")}
                    checked={fastMode}
                  />
                </div>
                <div className={styles.desc}>
                  If you plan on opening a large number of boxes, it is
                  recommended to use this option as it will accelerate the
                  box-opening animation.
                </div>
              </div>
            </div>
            <div className={styles.palyerMode}>
              <div className={styles.player}>
                <PeopleGroup />
                <p className={styles.typeTitle}>Players</p>
              </div>
              <div className={styles.playerNum} ref={dropdownRef}>
                <div
                  className={classNames(
                    styles.selectPlayer,
                    playerOptionOpen && styles.border_t_14_radius
                  )}
                  onClick={() => setPlayerOptionOpen((prev) => !prev)}
                >
                  <Players
                    teams={playerType.teams}
                    teamSize={playerType.teamSize}
                    selection={true}
                  />
                  <div className={styles.dropBtn}>
                    {playerOptionOpen ? <ArrowUp /> : <ArrowDown />}
                  </div>
                </div>
                <div
                  className={`${styles.playerOptions} ${
                    playerOptionOpen ? styles.active : ""
                  }`}
                >
                  {gameTypes.map((type, i) => (
                    <div className={styles.playerType} key={i}>
                      <Players
                        key={i}
                        teams={type.teams}
                        teamSize={type.teamSize}
                        click={(l: number, i: number) =>
                          handleSelectPlayerType(l, i)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.selectBox}>
          <div className={styles.boxHead}>
            <p>Select cases</p>
            <div className={styles.totalBox}>
              <p>
                Cases : <span>{totalCount}</span>
              </p>
              <p>
                Total Value: <span> $ {formatPrice(totalPrice)}</span>
              </p>
            </div>
          </div>
          <div className={styles.manageCases}>
            <div className={styles.addCase} onClick={openCreateBattleModal}>
              <div className={styles.addCaseBtn}>
                <Plus />
                <p className={classNames("upperCase", "fontSize_16")}>
                  add a case
                </p>
              </div>
            </div>
            {width > 425 ? (
              <div className={styles.selectedBoxes}>
                <SwiperRef
                  spaceBetween={10}
                  slidesPerView={"auto"}
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                >
                  {boxes &&
                    boxes.map((box) => (
                      <SwiperSlide className={styles.drag} key={box.box.id}>
                        <AddedBox
                          box={box.box}
                          b_count={box.BCount}
                          increase={(id, count) => changeBoxCount(id, count)}
                          decrease={(id, count) => changeBoxCount(id, count)}
                        />
                      </SwiperSlide>
                    ))}
                </SwiperRef>
              </div>
            ) : (
              boxes &&
              boxes.map((box) => (
                <AddedBox
                  box={box.box}
                  b_count={box.BCount}
                  increase={(id, count) => changeBoxCount(id, count)}
                  decrease={(id, count) => changeBoxCount(id, count)}
                  key={box.box.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CreateBattle.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Case>{page}</Case>
    </Layout>
  );
};

export default CreateBattle;
