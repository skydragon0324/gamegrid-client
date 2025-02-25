import Layout from "@/components/layout/Layout";
import { FC, useRef, useState } from "react";
import { ExternalPage } from "..";
import styles from "@/parts/raffle/raffle.module.scss";
import { useWindowSize } from "@/hooks/windowSize";
import { handleAvatar, formatNumber, formatPrice } from "@/utils/handler";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import classNames from "classnames";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import QuestionCircle from "@/svgs/question-circle.svg";
import Ticket from "@/svgs/ticket.svg";
// import "swiper/css";
import { Swiper as SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

export const RaffePage: ExternalPage = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const { user, lineprogressNV } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const lootgg_login_enabled = useFeatureIsOn("lootgg_login_enabled");
  const lootgg_registration_enabled = useFeatureIsOn(
    "lootgg_registration_enabled"
  );
  const lootgg_withdraw_enabled = useFeatureIsOn("lootgg_withdraw_enabled");
  const lootgg_deposit_enabled = useFeatureIsOn("lootgg_deposit_enabled");
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const [queries, setQueries] = useState({
    page: 0x0,
  });

  const [inventoryCheckBoxes, setInCb] = useState<Record<string, boolean>>({});
  const [selectAll, setSellectAll] = useState<boolean>(false);
  const [buttonSellLoading, setBsl] = useState<boolean>(false);
  const [inventoryPanel, setInventoryPanel] = useState<boolean>(false);

  return (
    (user && (
      <div className={styles.container}>
        <h2>Weekly Raffle</h2>
        <div className={styles.firstCont}>
          <div className={styles.detailsCard}>
            <div className={styles.left}>
              <div className={styles.profilesection}>
                <div
                  className={styles.circleAvatar}
                  style={{
                    backgroundImage: `url(${handleAvatar(
                      null,
                      user?.username
                    )})`,
                  }}
                  onClick={() => {
                    // if (width <= 1080) {
                    //   updateMainState({
                    //     mobileMenu: true,
                    //   });
                    // } else {
                    router.push("/profile");
                    // }
                  }}
                >
                  <span className={styles.line}>
                    {formatNumber(user.xpExtraInfo.level ?? 0x0)}
                  </span>
                </div>
                {(width > 1080 && (
                  <>
                    <div className={styles.details}>
                      <h3>{user?.username}</h3>
                      <div className={styles.progressline}>
                        <div className={classNames(styles.progressLevel)}>
                          <span
                            className={classNames(
                              lineprogressNV && styles.appear
                            )}
                          >
                            <strong>
                              {formatPrice(
                                user.xpBalance -
                                  user.xpExtraInfo.minXPInThisLevel ?? 0x0
                              )}
                            </strong>{" "}
                            /{" "}
                            <strong>
                              {formatPrice(
                                user.xpExtraInfo.maxXPInThisLevel -
                                  user.xpExtraInfo.minXPInThisLevel
                              )}
                            </strong>{" "}
                            Raffle Tickets
                          </span>
                          <div className={styles.bar}>
                            <div
                              style={{
                                width: `${
                                  lineprogressNV
                                    ? Math.max(
                                        ((user.xpBalance -
                                          user.xpExtraInfo.minXPInThisLevel) /
                                          (user.xpExtraInfo.maxXPInThisLevel -
                                            user.xpExtraInfo
                                              .minXPInThisLevel)) *
                                          100,
                                        0x2
                                      )
                                    : 0x0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )) ||
                  null}
              </div>
              <div className={styles.buttons}>
                <button className={styles.buttonMain} onClick={() => {}}>
                  <Ticket /> Buy Tickets
                </button>
                <button
                  // disabled
                  className={styles.buttonSecond}
                  onClick={() => {}}
                >
                  <QuestionCircle /> How it works?
                </button>
              </div>
            </div>

            <div className={styles.cardLevel}>
              <h3>Next up</h3>
              <div className={styles.polygon}>12</div>
              <p>70 Raffles</p>
              <span>25,500 XP LEFT</span>
              <div className={styles.bar}>
                <div
                  style={{
                    width: `${
                      lineprogressNV
                        ? Math.max(
                            ((user.xpBalance -
                              user.xpExtraInfo.minXPInThisLevel) /
                              (user.xpExtraInfo.maxXPInThisLevel -
                                user.xpExtraInfo.minXPInThisLevel)) *
                              100,
                            0x2
                          )
                        : 0x0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className={styles.levels}>
            <SwiperRef
              spaceBetween={15}
              className={styles.swiper}
              slidesPerView={"auto"}
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
              <SwiperSlide className={styles.levelcard}></SwiperSlide>
            </SwiperRef>
          </div>
        </div>
      </div>
    )) ||
    null
  );
};

RaffePage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default RaffePage;
