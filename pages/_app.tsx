import {
  FC,
  ReactNode,
  useEffect,
  useState,
  Suspense,
  useRef,
  CSSProperties,
} from "react";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "@/hooks/windowSize";
import { nanoid } from "nanoid";
import { Toaster, toast } from "react-hot-toast";
import { store } from "../mredux";
import {
  UPDATE_GAME_STATE,
  UPDATE_MAIN_STATE,
  UPDATE_MODALS_STATE,
} from "../mredux/types";
import ErrorBoundary from "../components/errorhandler";
import { LoaderScreen } from "@/components/preloader/LoaderScreen";

import "@/styles/global.scss";
import { accountAction } from "mredux/actions/account";
import { MainReducer } from "mredux/reducers/main.reducer";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import {
  fetchBoxes,
  fetchGrowthBookFeatureFlags,
  getAvailableStripeKeys,
  initializeAPI,
} from "@/utils/api.service";
import { dominateColorFromUrls, imageURI } from "@/utils/colordetector";
import { wsHandler } from "@/utils/ws.service";
import { liveFeedWSHandler } from "@/utils/livefeed.service";
import { Elements } from "@stripe/react-stripe-js";
import {
  GrowthBookProvider,
  useFeatureIsOn,
} from "@growthbook/growthbook-react";
import { growthbook } from "@/utils/growthbook";
import { WaitPage } from "@/parts/home/waitlist";
import Keycloak from "keycloak-js";
import { updateMainState } from "@/utils/updateState";
import useRudderStackAnalytics from "@/utils/rudderstack";
import { initScripts } from "@/utils/addi";

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

export interface CustomCSSProperties extends CSSProperties {
  [key: `--${string}`]: string | number;
}

function MyApp({ Component, pageProps }: Props) {
  const router = useRouter();
  const sizes = useWindowSize();
  const [oneSignalInitialized, setOneSignalInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waityPage, setWaityPage] = useState(false);
  const analytics = useRudderStackAnalytics();

  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  useEffect(() => {
    // Function to handle WebSocket connection based on route
    const handleWebSocketConnection = () => {
      const path = router.pathname;
      console.log("--------------route change------------------", router);

      if (
        path === "/" ||
        path.startsWith("/case/lobby") ||
        path.startsWith("/boxes")
      ) {
        console.log("successfully connected to livefeed");

        liveFeedWSHandler.connectLivefeed();
      } else {
        console.log("successfully disconnecting livefeed");

        liveFeedWSHandler.disconnectLivefeed();
      }
    };

    // Call once on mount and then on every route change
    handleWebSocketConnection();
    router.events.on("routeChangeComplete", handleWebSocketConnection);

    return () => {
      // Clean up listeners and disconnect WebSocket on component unmount
      router.events.off("routeChangeComplete", handleWebSocketConnection);
      liveFeedWSHandler.disconnectLivefeed();
    };
  }, [router]);

  useEffect(() => {
    const handleRouteChange = () => {
      try {
        const { loaded } = store.getState().mainReducer;

        analytics && analytics.page(location.pathname + location.search);

        if (loaded) {
          return;
        }
        setLoading(true);
      } catch (error) {
        // console.log(error);
      }
    };

    const handleRouteChangeComplete = async () => {
      const { loaded } = store.getState().mainReducer;
      const updateStMain = (lk: boolean, addy?: Partial<MainReducer>) =>
        store.dispatch({
          type: UPDATE_MAIN_STATE,
          payload: { loaded: lk, ...(addy || {}) },
        });
      const updateStModals = (addy: Partial<ModalsReducer>) =>
        store.dispatch({
          type: UPDATE_MODALS_STATE,
          payload: addy,
        });

      const token = localStorage.getItem("token");

      try {
      } catch (e) {}
      let featureFlags = null;

      try {
        featureFlags = await fetchGrowthBookFeatureFlags();
      } catch (e) {}

      let waitlistEnabled = !!(
        featureFlags &&
        "features" in featureFlags &&
        featureFlags.features &&
        featureFlags.features?.["lootgg_waitlist_enabled"] &&
        featureFlags.features?.["lootgg_waitlist_enabled"].defaultValue
      );

      waitlistEnabled && setWaityPage(true);

      let state = store.getState().mainReducer;

      updateMainState({
        fflags:
          featureFlags && featureFlags?.features
            ? featureFlags?.features
            : state.fflags,
        waitpage:
          store.getState().mainReducer.waitpage === false || !waitlistEnabled
            ? false
            : store.getState().mainReducer.waitpage,
      });

      if (token) {
        try {
          const userInfo = await accountAction(token);

          if (userInfo) {
            analytics &&
              analytics.identify(userInfo.payload.user.id, {
                email: userInfo.payload.user.email,
                name: userInfo.payload.user.username,
                dob: userInfo.payload.user.dateOfBirth,
                id: userInfo.payload.user.id,
                lastLogin: new Date().toString(),
              });
            updateStMain(true, { user: userInfo.payload.user });

            // console.log("userInfo", featureFlags.data.features);
            featureFlags &&
              !userInfo.payload.user.emailVerified &&
              featureFlags.features?.["lootgg_email_verified_enabled"]
                ?.defaultValue &&
              !store.getState().modalsReducer.closedModalCode &&
              updateStModals({ authModal: true, authTab: 0x4 });

            // we disable the stripe deposit for now
            updateStMain(true, {
              availableStripeKeys: [],
              stripeDepositDisabled: true,
              currentStripeKey: null,
            });
            /* try {
              const keys = await getAvailableStripeKeys();
              // console.log({ keys });
              if (!keys || keys.length === 0) {
                updateStMain(true, {
                  availableStripeKeys: [],
                  stripeDepositDisabled: true,
                  currentStripeKey: null,
                });
              }
              updateStMain(true, {
                availableStripeKeys: keys,
                currentStripeKey: keys[0],
                stripeDepositDisabled: false,
              });
            } catch (e) {
              console.log();
            }*/

            setLoading(false);
          } else {
            throw new Error("Session expired, please login again");
          }
        } catch (e) {
          // console.log("Session expired, please login again", e);
          updateStMain(true, { user: null });
          setLoading(false);
        }
      } else {
        initializeAPI(null);
        updateStMain(true, { user: null });
        setLoading(false);
      }
    };

    handleRouteChangeComplete();

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChangeComplete);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);

  useEffect(() => {
    try {
      initScripts();
      growthbook.loadFeatures();
      wsHandler.init();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  const loaded = !loading && sizes.width > 0x0;

  // const stripePromise: Promise<Stripe | null> = loadStripe(
  //   process.env.NEXT_PUBLIC_PUBLISHABLE_KEY || ""
  // );

  // const handleFetchPublishableKey = async () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const userInfo = await accountAction(token);
  //       if (userInfo) {
  //         const res = await getAvailableStripeKeys();
  //         if (res && res.length > 0 ) {
  //           console.log("changed to 1")
  //           updateMainState({ currentStripeKey: res[0], availableStripeKeys: res});
  //         }
  //         // else if (localStorage.getItem("stripeKey")) {
  //         //   const stripeKey = JSON.parse(localStorage.getItem("stripeKey") as string);
  //         //   updateMainState({ currentStripeKey: stripeKey });
  //         // }
  //       }
  //     } catch (error) {
  //       console.log("fethc p key", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   console.log("fetccccccc");
  //   handleFetchPublishableKey();
  // }, []);

  return (
    <ErrorBoundary>
      <Toaster
        position="bottom-center"
        containerStyle={{
          // @ts-ignore
          zIndex: 9999999999,
        }}
      />

      {/* <Elements stripe={stripePromise}> */}
      <GrowthBookProvider growthbook={growthbook}>
        <Provider store={store}>
          <LoaderScreen className={loaded ? "fadeout" : undefined} />
          {(waityPage && <WaitPage />) || null}
          {(loaded &&
            getLayout(
              <Component
                {...pageProps}
                oneSignalInitialized={oneSignalInitialized}
              />
            )) ||
            null}
        </Provider>
      </GrowthBookProvider>
      {/* </Elements> */}
    </ErrorBoundary>
  );
}

export default MyApp;
