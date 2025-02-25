import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/parts/casebattle/case.module.scss";

import { Layout } from "@/components/layout/Layout";
import { BATTLE_TYPE_LIST } from "@/utils/constants";
import PlusIcon from "@/svgs/plus.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import ChevronUp from "@/svgs/chevron-up.svg";
import PeopleGroup from "@/svgs/people.svg";
import CloseIcon from "@/svgs/close.svg";
import NoRoom from "@/svgs/noRoom.svg";
import Room from "@/parts/casebattle/room";
import { ExternalPage } from "@/pages/profile";
import Case from ".";
import "swiper/css";
import { StateInterface, store } from "mredux";
import { useSelector } from "react-redux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { UPDATE_MODALS_STATE } from "mredux/types";
import { Dropdown } from "@/components/dropdown/dropdown";
import { wsHandler } from "@/utils/ws.service";
import { useWindowSize } from "@/hooks/windowSize";
import { Players } from "@/components/numofplayers/Players";
import classNames from "classnames";
import { getRooms } from "@/utils/api.service";
import { updateBattles } from "mredux/reducers/casebattle.reducer";
import Loader from "@/components/loader/Loader";
import { Pagination } from "@/components/pagination";
import { handleErrorRequest } from "@/utils/handler";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { DropsItems } from "@/components/drops/drops";

const Lobby: ExternalPage = () => {
  const router = useRouter();
  // const [sortIndex, setSortIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [playerOptionOpen, setPlayerOptionOpen] = useState<boolean>(false);
  const [queries, setQuery] = useState<FilterLobbyType>({
    page: 0,
    totalPages: 0,
    teamTypes: [],
  });
  const [teamTypes, setTeamTypes] = useState<
    { teams: number; teamsSize: number }[] | []
  >([]);
  const playerOptionsRef = useRef<HTMLDivElement>(null);

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

    wsHandler.caseBattle();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      wsHandler.closeBattleWS();
    };
  }, []);

  const fetchData = async (queries: FilterLobbyType) => {
    try {
      setLoading(true);
      const res = await getRooms(queries);
      if (res && res.content) {
        updateBattles(res.content);
        queries?.totalPages !== res.totalPages &&
          setQuery((prevQuery) => ({
            ...prevQuery,
            totalPages: res.totalPages,
          }));
      }
    } catch (e) {
      handleErrorRequest(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(queries);
  }, [queries.page, queries.status, queries.teamTypes]);

  const { battles } = useSelector<StateInterface, BattlesReducer>(
    (state) => state.battlesReducer
  );
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const createBattle = () => {
    // if (user) {
    router.push("/case/createBattle");
    // } else {
    //   store.dispatch({
    //     type: UPDATE_MODALS_STATE,
    //     payload: { authModal: true, authTab: 0x0 },
    //   });
    //   return;
    // }
  };

  const handleSelectPlayerType = (team: number, size: number) => {
    if (team === 0) {
      setTeamTypes([]);
    } else {
      const index = teamTypes.findIndex(
        (type) => type.teams === team && type.teamsSize === size
      );
      if (index !== -1) {
        const newTeamTypes = [...teamTypes];
        newTeamTypes.splice(index, 1);
        setTeamTypes(newTeamTypes);
      } else {
        setTeamTypes((prevTypes) => [
          ...prevTypes,
          { teams: team, teamsSize: size },
        ]);
      }
    }
  };

  const clearFilter = () => {
    setTeamTypes([]);
    setQuery((l) => ({ ...l, teamTypes: [] }));
    setPlayerOptionOpen(false);
  };

  const saveFilter = () => {
    setQuery((l) => ({ ...l, teamTypes: teamTypes }));
    setPlayerOptionOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        playerOptionsRef.current &&
        !playerOptionsRef.current.contains(event.target as Node)
      ) {
        setPlayerOptionOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [playerOptionsRef]);

  const { width } = useWindowSize();
  return (
    <div className={styles.lobby}>
      <div className={styles.topbar}>
        <div className={styles.recentItems}>
          {loading ? (
            <Skeleton
              width={width > 1500 ? "1500px" : `${width - 50}px`}
              height="100px"
            />
          ) : (
            <DropsItems />
          )}
        </div>
        <div className={styles.func}>
          <div className={styles.filtercomp}>
            <div className={styles.playerNum} ref={dropdownRef}>
              <div
                className={classNames(
                  styles.selectPlayer
                  // playerOptionOpen && styles.border_t_14_radius
                )}
                onClick={() => setPlayerOptionOpen((prev) => !prev)}
              >
                {/* <div className={styles.player}>
                  <PeopleGroup />
                  <p className={styles.typeTitle}>Type</p>
                </div> */}
                {/* show selected type if there is any */}
                {teamTypes.length === 0 ? (
                  <div className={styles.player}>
                    <PeopleGroup />
                    <p className={styles.typeTitle}>Type</p>
                  </div>
                ) : (
                  teamTypes.slice(0, 2).map((type, index) => (
                    <div className={styles.playerHolder}>
                      {index === 0 ? (
                        <div className={styles.closable}>
                          <Players
                            key={index}
                            teams={type.teams}
                            teamSize={type.teamsSize}
                            personWidth={16}
                          />
                          <div
                            className={styles.closer}
                            onClick={() => {
                              const newTeamTypes = [...teamTypes];
                              newTeamTypes.splice(index, 1);
                              setTeamTypes(newTeamTypes);
                            }}
                          >
                            <CloseIcon />
                          </div>
                        </div>
                      ) : (
                        <p>More</p>
                      )}
                    </div>
                  ))
                )}
                <div className={styles.dropBtn}>
                  {playerOptionOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
              {/* {playerOptionOpen && ( */}
              <div
                className={`${styles.playerOptions} ${
                  playerOptionOpen ? styles.active : ""
                }`}
              >
                <div className={classNames(styles.allteams, styles.teamstype)}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={teamTypes.length === 0}
                      onChange={() => handleSelectPlayerType(0, 0)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className={styles.centered}>All</div>
                </div>
                <div className={classNames(styles.teamstype)}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={
                        teamTypes.findIndex(
                          (type) => type.teams === 2 && type.teamsSize === 1
                        ) !== -1
                      }
                      onChange={() => handleSelectPlayerType(2, 1)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className={styles.centered}>
                    <Players teams={2} teamSize={1} personWidth={16} />
                  </div>
                </div>
                <div className={classNames(styles.teamstype)}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={
                        teamTypes.findIndex(
                          (type) => type.teams === 3 && type.teamsSize === 1
                        ) !== -1
                      }
                      onChange={() => handleSelectPlayerType(3, 1)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className={styles.centered}>
                    <Players teams={3} teamSize={1} personWidth={16} />
                  </div>
                </div>
                <div className={classNames(styles.teamstype)}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={
                        teamTypes.findIndex(
                          (type) => type.teams === 4 && type.teamsSize === 1
                        ) !== -1
                      }
                      onChange={() => handleSelectPlayerType(4, 1)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className={styles.centered}>
                    <Players teams={4} teamSize={1} personWidth={16} />
                  </div>
                </div>
                <div className={classNames(styles.teamstype)}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={
                        teamTypes.findIndex(
                          (type) => type.teams === 2 && type.teamsSize === 2
                        ) !== -1
                      }
                      onChange={() => handleSelectPlayerType(2, 2)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className={styles.centered}>
                    <Players teams={2} teamSize={2} personWidth={16} />
                  </div>
                </div>
                <div className={styles.filterBtn}>
                  <button className={styles.clearBtn} onClick={clearFilter}>
                    Clear
                  </button>
                  <button className={styles.saveBtn} onClick={saveFilter}>
                    Save
                  </button>
                </div>
              </div>
              {/* )} */}
            </div>
            {/* <p>Status: </p>
            <Dropdown
              options={BATTLE_TYPE_LIST.map((item, index) => {
                return {
                  Label: <>{item.Label.toUpperCase()}</>,
                  value: item.value,
                  onClick: () =>
                    setQuery((l) => ({
                      ...l,
                      status: item.value.toUpperCase(),
                    })),
                };
              })}
              classNameButton={styles.dropdownbutton}
              classNameList={styles.dropdownlist}
              onChange={(index) => setSortIndex(index)}
              currentIndex={sortIndex}
            >
              <span>
                {BATTLE_TYPE_LIST.find(
                  (item) =>
                    item.value.toLowerCase() === queries.status?.toLowerCase()
                )
                  ? BATTLE_TYPE_LIST.find(
                      (item) => item.value === queries.status?.toLowerCase()
                    )?.Label.toLowerCase()
                  : BATTLE_TYPE_LIST[0].Label.toLowerCase()}
              </span>
              <ChevronDown />
            </Dropdown> */}
          </div>
          <div className={styles.createBtn} onClick={createBattle}>
            <PlusIcon />
            <p>Create Battle</p>
          </div>
        </div>
      </div>
      <div className={styles.rooms}>
        {width > 768 && !loading && battles.length > 0 && (
          <div className={styles.header}>
            <p>Rounds</p>
            <p>Players</p>
            <p>Cases</p>
          </div>
        )}

        {loading && (
          <div className={styles.loading}>
            {/* <Loader centered /> */}
            <div className={styles.skeleton}>
              {new Array(10).fill(0).map((el, index) => (
                <Skeleton
                  width={width > 1500 ? "1500px" : `${width - 50}px`}
                  height="130px"
                  key={index + "room"}
                />
              ))}
            </div>
          </div>
        )}
        {!loading && battles.length === 0 && (
          <div className={styles.noRoom}>
            <NoRoom />
            <div className={styles.noRoom_content}>
              <div className={styles.topContent}>
                <div className={styles.topcontext}>No Rooms Available</div>
                <div className={styles.description}>
                  Try to create a battle or do a single unboxing instead.
                </div>
              </div>
              <button className={styles.btn} onClick={createBattle}>
                Create Battle
              </button>
            </div>
          </div>
        )}
        {!loading &&
          battles.length > 0 &&
          battles
            .slice()
            .sort((battleA, battleB) => {
              return (
                BATTLE_TYPE_LIST.findIndex(
                  (item) => item.value.toUpperCase() === battleA.state
                ) -
                BATTLE_TYPE_LIST.findIndex(
                  (item) => item.value.toUpperCase() === battleB.state
                )
              );
            })
            .map((room, index) => (
              <div
                className={styles.roomHolder}
                style={{
                  animationDuration: `${Math.min(index * 0.5, 1.4)}s`,
                }}
              >
                <Room room={room} key={room.id} />
              </div>
            ))}

        <Pagination
          page={queries.page}
          totalPages={queries?.totalPages ?? null}
          onChange={(index) => setQuery((l) => ({ ...l, page: index }))}
        />
      </div>
    </div>
  );
};

Lobby.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <Case>{page}</Case>
    </Layout>
  );
};

export default Lobby;
