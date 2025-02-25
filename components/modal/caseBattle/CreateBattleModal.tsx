import { ModalOverlay } from "../ModalOverlay";
import styles from "./mcaseBattle.module.scss";
import CrossIcon from "@/svgs/cross.svg";
import ShieldIcon from "@/svgs/shield.svg";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { fetchBoxList } from "@/utils/api.service";
import { formatPrice, handleErrorRequest } from "@/utils/handler";
import { UPDATE_CREATE_BATTLE_STATE, UPDATE_MODALS_STATE } from "mredux/types";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MainReducer } from "mredux/reducers/main.reducer";
import SearchIcon from "@/svgs/search.svg";
import _ from "lodash";
import Select from "react-select";
import { BOX_SORT_LIST } from "@/utils/constants";
import { reactSelectStyles } from "../wallet/selectstyles";
import AddedBox from "@/components/box/AddedBox";
import Loader from "@/components/loader/Loader";
import { Pagination } from "@/components/pagination";

export const CreateBattleModal = () => {
  const [allBoxes, setAllBoxes] = useState<BoxType[]>([]);
  const [tempboxes, setTempBoxes] = useState<
    Array<{ box: BoxType; BCount: number }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [queries, setQuery] = useState<FilterType>({
    sortBy: "createdAt",
    sortDescending: true,
    totalPages: 0,
    page: 0,
  });

  // data from redux
  const { createBattleModal } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { boxes } = useSelector<StateInterface, CreateBattleReducer>(
    (state) => state.createBattleReducer
  );

  useEffect(() => {
    setTempBoxes(boxes);
  }, [boxes]);

  useEffect(() => {
    let sumCnt = 0,
      sumPrice = 0;
    tempboxes.forEach((l) => {
      sumCnt += l.BCount;
      sumPrice += l.box.price * l.BCount;
    });

    setTotalCount(sumCnt);
    setTotalPrice(sumPrice);
  }, [tempboxes]);

  const updateModalsState = (payload: Partial<ModalsReducer>) => {
    store.dispatch({
      type: UPDATE_MODALS_STATE,
      payload,
    });
  };

  const updateCreateBattle = (payload: Partial<CreateBattleReducer>) => {
    store.dispatch({
      type: UPDATE_CREATE_BATTLE_STATE,
      payload,
    });
  };

  // fetch all boxes
  const fetchBoxesLk = useCallback(async () => {
    try {
      // if (allBoxes) {
      //   return;
      // }
      setLoading(true);
      const res = await fetchBoxList(queries);
      if (res && res.content && res.content.length > 0x0) {
        setAllBoxes(res.content);
        queries?.totalPages !== res.totalPages &&
          setQuery((l) => ({
            ...l,
            totalPages: res.totalPages,
          }));
      }
      setLoading(false);
    } catch (e) {
      handleErrorRequest(e);
    }
  }, [queries]);
  useEffect(() => {
    user && fetchBoxesLk();
  }, [fetchBoxesLk]);

  const handleDoneClick = () => {
    updateModalsState({
      createBattleModal: false,
    });
    if (tempboxes.length) {
      updateCreateBattle({
        boxes: tempboxes,
      });
    }
  };

  const increase = (boxId: string, cnt: number) => {
    const temp = allBoxes.find((box) => box.id === boxId);
    if (cnt === 1) {
      setTempBoxes([
        ...tempboxes,
        { box: temp ? temp : ({} as BoxType), BCount: 1 },
      ]);
    } else {
      setTempBoxes((prevTempBoxes) =>
        prevTempBoxes.map((item) =>
          item.box?.id === boxId ? { box: item.box, BCount: cnt } : item
        )
      );
    }
  };

  const decrease = (boxId: string, cnt: number) => {
    if (cnt > 0) {
      setTempBoxes((pre) =>
        pre.map((item) =>
          item.box?.id === boxId ? { box: item.box, BCount: cnt } : item
        )
      );
    } else {
      setTempBoxes((pre) => pre.filter((item) => item.box?.id !== boxId));
    }
  };

  const handleCloseModal = () => {
    updateModalsState({
      createBattleModal: false,
    });
    setTempBoxes(boxes);
  };

  return (
    <ModalOverlay
      isOpened={createBattleModal}
      className={styles.createBattle}
      onClose={handleCloseModal}
    >
      <div className={styles.header}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerTitle}>Add Case</div>
        </div>
        <button className={styles.closebutton} onClick={handleCloseModal}>
          <CrossIcon />
        </button>
      </div>

      {(createBattleModal && (
        <div className={styles.content}>
          <div className={styles.options}>
            {/* <div className={styles.inputSection}>
              <input type="text" placeholder="Search items" />
              <SearchIcon />
              </div> */}
            <div className={styles.filtercomp}>
              <p>Sort by: </p>
              <Select
                options={BOX_SORT_LIST}
                className={styles.typeSelect}
                onChange={(e: any) => {
                  if (e.value === "cheapest") {
                    setQuery((l) => ({
                      ...l,
                      sortBy: "price",
                      sortDescending: false,
                    }));
                  } else if (e.value === "expensice") {
                    setQuery((l) => ({
                      ...l,
                      sortBy: "price",
                      sortDescending: true,
                    }));
                  } else {
                    setQuery((l) => ({
                      ...l,
                      sortBy: "createdAt",
                      sortDescending: true,
                    }));
                  }
                }}
                formatOptionLabel={(option: SelectOptionType) => (
                  <span>{(option as SelectOptionType).Label}</span>
                )}
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={reactSelectStyles as any}
              />
            </div>
          </div>
          <div className={styles.boxesWrapper}>
            {loading ? (
              <Loader />
            ) : (
              <div className={styles.boxes}>
                {allBoxes.map((item, i) => {
                  const foundBox = tempboxes.find(
                    (box) => item.id === box.box.id
                  );
                  return (
                    <React.Fragment key={i}>
                      {foundBox ? (
                        <AddedBox
                          box={foundBox.box}
                          b_count={foundBox.BCount}
                          increase={(id, count) => increase(id, count)}
                          decrease={(id, count) => decrease(id, count)}
                        />
                      ) : (
                        <AddedBox
                          box={item}
                          b_count={0}
                          increase={(id, count) => increase(id, count)}
                          decrease={(id, count) => decrease(id, count)}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
          <div className={styles.footer}>
            <div className={styles.total}>
              <div className={styles.count}>
                Cases : <span>{totalCount}</span>
              </div>
              <div className={styles.value}>
                Total Value: <span>$ {formatPrice(totalPrice)}</span>
              </div>
            </div>
            <div className={styles.pagination}>
              <Pagination
                page={queries.page}
                totalPages={queries?.totalPages ?? null}
                onChange={(index) => setQuery((l) => ({ ...l, page: index }))}
              />
            </div>
            <div className={styles.btnHolder}>
              <button onClick={handleDoneClick} className={styles.doneButton}>
                Done
              </button>
            </div>
          </div>
        </div>
      )) ||
        null}
    </ModalOverlay>
  );
};
