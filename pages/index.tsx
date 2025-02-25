import React, { FC, ReactNode, use, useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import classNames from "classnames";
import { IntroduceCard } from "pagesparts/home/introducecard";
import styles from "@/parts/home/index.module.scss";
import { Swiper as SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import ChevronLeft from "@/svgs/chevron-left.svg";
import ChevronRight from "@/svgs/chevron-right.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import SearchIcon from "@/svgs/search.svg";
import "swiper/css";
import Swiper from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface, store } from "mredux";
import { ItemsBox, MainReducer } from "mredux/reducers/main.reducer";
import { calcDiscount, formatPrice } from "utils/handler";
import { ShadowByColor } from "@/components/shadow/Shadow";
import Select from "react-select";
import { Dropdown } from "@/components/dropdown/dropdown";
import { useWindowSize } from "@/hooks/windowSize";
import { DropsItems } from "@/components/drops/drops";
import { InfoBoxes } from "@/components/infoboxes/infoboxes";
import { fetchBoxes } from "@/utils/api.service";
import { GameReducer } from "mredux/reducers/game.reducer";
import { UPDATE_GAME_STATE } from "mredux/types";
import { dominateColorFromUrls } from "@/utils/colordetector";
import Image from "next/image";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import toast from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { useWindowSizeHook } from "react-letshook";

export type ExternalPage<M = {}> = FC &
  M & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

const itemUniquer: string[] = ["new", "hot", "Limited"];

const options = [
  { value: "chocolate", Label: "Popular" },
  { value: "strawberry", Label: "Limited" },
  { value: "vanilla", Label: "Hot" },
  { value: "vanilla", Label: "All" },
];

export const IndexPage: ExternalPage = () => {
  const router = useRouter();

  const dispatch = useDispatch<Dispatch<GameReducer>>();
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const { boxes } = useSelector<StateInterface, GameReducer>(
    (state) => state.gameReducer
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(-1);
  const { width } = useWindowSizeHook();
  const [swiper, setSwiper] = useState<Swiper | null>(null);
  const [casesLoading, setCasesLoading] = useState<boolean>(false);

  const updateGameState = (payload: Partial<GameReducer>) => {
    dispatch({
      type: UPDATE_GAME_STATE,
      payload,
    });
  };

  const fetchBoxesLk = async () => {
    try {
      if (boxes && boxes.length && Math.ceil(boxes?.length / 30) === page) {
        console.log("Page same as boxes content length");
        return;
      }

      setCasesLoading(true);

      const res = await fetchBoxes({ page: page, size: 100 });

      setCasesLoading(false);

      if (res && res.content && res.content.length > 0x0) {
        let newBoxesIds = res.content.map((l) => l.id);

        setTotalPages(res.totalPages);

        store.dispatch({
          type: UPDATE_GAME_STATE,
          payload: {
            boxes: (boxes ?? [])
              .filter((m) => !newBoxesIds.includes(m.id))
              .concat(res.content),
          },
        });
      } else {
        setPage((l) => Math.max(0x0, l - 0x1));
      }
    } catch (e) {
      setCasesLoading(false);
      // console.log(e);
    }
  };

  useEffect(() => {
    fetchBoxesLk();
  }, [user, page]);

  // console.log({ boxes });

  return (
    <div className={classNames(styles.homepage, "contentinsider")}>
      <div className={styles.cardsPreview}>
        {/* <div className={styles.pagiButtons}>
          <button
            disabled={activeIndex === 0}
            className={styles.pagiButton}
            onClick={() => swiper?.slidePrev()}
          >
            <ChevronLeft />
          </button>
          <button
            disabled={
              !swiper ||
              swiper?.slides.length === 0x0 ||
              activeIndex === swiper.slides.length - 1
            }
            className={styles.pagiButton}
            onClick={() => swiper?.slideNext()}
          >
            <ChevronRight />
          </button>
        </div> */}
        <div className={styles.container}>
          <SwiperRef
            spaceBetween={20}
            slidesPerView={1}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            onSwiper={(swiper) => setSwiper(swiper)}
          >
            <SwiperSlide>
              <IntroduceCard />
            </SwiperSlide>
          </SwiperRef>
        </div>
        {/* <div className={styles.dotsProgress}>
          {[...Array(swiper?.slides.length)].map((_, i) => (
            <div
              className={classNames(
                styles.dot,
                i === activeIndex && styles.active
              )}
              key={i}
              onClick={() => swiper?.slideTo(i)}
            ></div>
          ))}
        </div> */}
      </div>

      <br />
      <br />
      <br />
      <DropsItems />

      <div className={styles.itemscontainer}>
        {/* <div className={styles.headerpart}>
          <div className={styles.leftsection}>
            <h1>OUR CASES</h1>
            <div className={styles.buttons}>
              {categories.cats.map((category, i) => (
                <button
                  key={i}
                  disabled
                  className={classNames(
                    styles.category,
                    i === categories.index && styles.active
                  )}
                  onClick={() =>
                    setCatgories(({ cats }) => ({
                      index: i,
                      cats,
                    }))
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.rightsection}>
            <div className={classNames(styles.inputform, "disabled")}>
              <SearchIcon />
              <input type="text" placeholder="Search for cases..." />
            </div>

            <div className={classNames(styles.sorter, "disabled")}>
              {(width > 400 && <span>Sort by:</span>) || null}
              <Dropdown
                options={options}
                classNameButton={styles.buttonsort}
                classNameList={styles.sortlist}
                onChange={(index) => setSortIndex(index)}
                currentIndex={sortIndex}
              >
                <span>{options[sortIndex].Label}</span>
                <ChevronDown />
              </Dropdown>
            </div>
          </div>
        </div> */}

        {/* <div className={styles.label}>
          <div />
          <span>Featured</span>
          <div />
        </div> */}

        {/* <div className={styles.container}>
          {itemsBox.slice(0, 10).map((item, i) => (
            <div
              className={styles.item}
              key={i}
              style={{ animationDuration: `${i * 0.2}s` }}
            >
              <div className={styles.uniquer}>{itemUniquer[item.uniqueId]}</div>
              <div className={styles.image}>
                <ShadowByColor
                  className={styles.shadow}
                  color="lk"
                  customColor={{ lk: ["#307eb2", "#307eb2"] }}
                  disableOuterShadow
                  animation
                />
                <img src={item.image} alt="" />
              </div>
              <h2>{item.boxName}</h2>
              <p>{item.boxCategory}</p>
              <div className={styles.pricecn}>
                <span className={styles.price}>
                  $ {formatPrice(calcDiscount(item.boxPrice, 10))}
                </span>
                <span className={styles.discounted}>
                  $ {formatPrice(item.boxPrice)}
                </span>
              </div>
            </div>
          ))}
        </div> */}
        <div className={styles.label}>
          <div />
          <span>Popular</span>
          <div />
        </div>
        <div className={styles.container}>
          {/* I want to have duration by index */}
          {boxes
            ? boxes.map(
                (box, i) =>
                  (
                    <div
                      className={styles.item}
                      key={i}
                      style={{
                        animationDuration: `${Math.min(i * 0.2, 1.4)}s`,
                      }}
                      onClick={() => {
                        updateGameState({
                          action: 0x0,
                        });

                        router.push(`/boxes/${box.slug}`);
                        // if (user) {

                        // } else {
                        //   lootgg_login_enabled
                        //     ? updateModalsState({
                        //         authModal: true,
                        //       })
                        //     : toast.error("Login is not available yet");
                        // }
                      }}
                    >
                      <div className={styles.uniquer}>{itemUniquer[0x0]}</div>
                      <div className={styles.image}>
                        <ShadowByColor
                          className={styles.shadow}
                          color={"lk" + i}
                          customColor={{
                            ["lk" + i]: [box.color ?? "", box.color ?? ""],
                          }}
                          disableOuterShadow
                          animation
                        />
                        <Image
                          src={box.imageUrl}
                          alt=""
                          layout="fill"
                          quality={100}
                        />
                        {/* <img src={box.imageUrl} alt="" /> */}
                      </div>
                      <h2>{box.name}</h2>
                      <p>
                        {(box &&
                          box.categories &&
                          !!box?.categories.length &&
                          box?.categories?.[0x0].name) ||
                          "Unknown"}
                      </p>
                      <div className={styles.pricecn}>
                        <span className={styles.price}>
                          {/* $ {formatPrice(box.price - 0.01)} */}${" "}
                          {user
                            ? formatPrice(
                                box.price,
                                false,
                                true,
                                user?.usdBalance < box.price
                              )
                            : formatPrice(box.price, false, true, true)}
                        </span>
                        {/* <span className={styles.discounted}>
                          $ {formatPrice(box.price)}
                        </span> */}
                      </div>
                    </div>
                  ) || null
              )
            : Array.from({ length: 14 }).map((_, i) => (
                <Skeleton key={i} height="300px" borderRadius="14px" />
              ))}
        </div>
        {boxes && boxes.length && (
          <button
            className={styles.loadmore}
            onClick={() => setPage((m) => m + 0x1)}
            disabled={
              casesLoading || (totalPages !== -1 && totalPages === page + 1)
            }
          >
            {casesLoading ? <Loader radius={19} isBlue /> : "Load More"}
          </button>
        )}
      </div>

      <InfoBoxes />
    </div>
  );
};

IndexPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default IndexPage;
