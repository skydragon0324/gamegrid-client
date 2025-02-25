import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { Swiper as SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import styles from "./drops.module.scss";
import { ItemObject, MainReducer } from "mredux/reducers/main.reducer";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import "swiper/css";
import { fetchLiveFeed, fetchLiveFeedBox } from "@/utils/api.service";
import { formatPrice, handleAvatar, shortIt } from "@/utils/handler";
import { colorByVariant, imageURI } from "@/utils/colordetector";
import { wsHandler } from "@/utils/ws.service";
import { CustomCSSProperties } from "@/pages/_app";
import { updateMainState, updateModalsState } from "@/utils/updateState";
import { Router, useRouter } from "next/router";
import { Skeleton } from "../sekelton/Skeleton";

export const DropsItems: FC<{ boxId?: string | null }> = ({ boxId }) => {
  const router = useRouter();
  const { recentDrops, recentDropsBox } = useSelector<
    StateInterface,
    MainReducer
  >((state) => state.mainReducer);
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const handleImageFailed = (index: number) => {
    if (!failedImages.includes(index)) {
      setFailedImages((l) => [...l, index]);
    }
  };

  const fetchDrops = async () => {
    try {
      const res = await fetchLiveFeed({ size: 10 });

      if (res && Array.isArray(res)) {
        store.dispatch({
          type: "UPDATE_MAIN_STATE",
          payload: {
            recentDrops: res.map((item) =>
              Object.assign({}, item.event, { newElement: false })
            ),
          },
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const fetchDropsByBox = async () => {
    try {
      if (!boxId) {
        return;
      }

      const res = await fetchLiveFeedBox(boxId);

      if (res) {
        store.dispatch({
          type: "UPDATE_MAIN_STATE",
          payload: {
            recentDropsBox: res.recentWinnings.map((item) =>
              Object.assign({}, item, { newElement: false })
            ),
          },
        });
      }
    } catch (e) {
      // console.log(e);
    }
  };

  useEffect(() => {
    // alert("useEffect " + !!boxId);
    if (!boxId) {
      fetchDrops();
    } else {
      fetchDropsByBox();
    }

    return () => {
      recentDropsBox &&
        updateMainState({
          recentDropsBox: null,
        });
    };
  }, [boxId]);

  return (
    <div className={styles.drops} style={{ minHeight: "100px" }}>
      <SwiperRef
        spaceBetween={15}
        slidesPerView={"auto"}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {(boxId !== null &&
          (boxId
            ? recentDropsBox?.length
              ? recentDropsBox
              : null
            : recentDrops
          )?.map((item, i) => (
            <SwiperSlide
              className={classNames(
                styles.drop,
                i === 0x0 && item?.newElement && styles.newelement
              )}
              key={i === 0x0 ? item.gameId : i}
              style={
                item.frequency
                  ? ({
                      "--variant": colorByVariant((item.frequency ?? 0x0) * 100)
                        .color,
                    } as CustomCSSProperties)
                  : {}
              }
              onClick={() => {
                item && item?.boxSlug && router.push(`/boxes/${item?.boxSlug}`);
              }}
            >
              <div className={styles.leftBorder}></div>
              <div className={styles.itemImage}>
                <img
                  onError={() => handleImageFailed(i)}
                  src={
                    failedImages.includes(i)
                      ? "/imgs/placeholder.png"
                      : item.item?.images && item.item.images.length
                        ? item.item.images[0x0].url
                        : imageURI(item.item.id, "item")
                  }
                  alt=""
                />
              </div>
              <div className={styles.details}>
                <span className={styles.name} title={item.item.name}>
                  {shortIt(item.item.name, 14)}
                </span>
                <h3>$ {formatPrice(item.item.price)}</h3>

                <div className={styles.winner}>
                  <img
                    src={handleAvatar(
                      item.user?.profilePictureUrl ?? null,
                      item.user.username
                    )}
                    alt=""
                  />
                  <span>{shortIt(item.user.username, 10)}</span>
                </div>
              </div>
            </SwiperSlide>
          ))) ||
          new Array(15).fill(null).map((_, i) => (
            <SwiperSlide
              className={classNames(styles.drop, styles.loading)}
              key={i}
            >
              <Skeleton borderRadius="14px" width="100%" height="100%" />
            </SwiperSlide>
          )) ||
          null}
      </SwiperRef>
    </div>
  );
};
