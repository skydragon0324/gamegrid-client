import cx from "classnames";
import Head from "next/head";
import React, {
  FC,
  Fragment,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import styles from "./layout.module.scss";
import { useWindowSize } from "@/hooks/windowSize";
import StickyBox from "react-sticky-box";
import { Navbar } from "../navbar/Navbar";
import { Footer } from "../footer/Footer";
import { MobilePanel } from "../navbar/mobilepanel";
import { ModalsContainer } from "../modal/modalscontainer";
import { DropsItems } from "../drops/drops";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import { accountAction } from "mredux/actions/account";
import { getAvailableStripeKeys } from "@/utils/api.service";
import { updateMainState } from "@/utils/updateState";
import { ModalsReducer } from "mredux/reducers/modals.reducer";

interface LayoutProps extends HTMLAttributes<HTMLElement> {}

export const Layout: FC<LayoutProps> = ({ children, className, ...rest }) => {
  const size = useWindowSize();
  const router = useRouter();
  const refRow = React.useRef<HTMLDivElement>(null);

  const [stripeLoader, setStripeLoader] = useState<any>(null);

  const { user, waitpage, currentStripeKey } = useSelector<
    StateInterface,
    MainReducer
  >((state) => state.mainReducer);

  const { walletModal, walletTab } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );

  useEffect(() => {
    if (refRow.current) {
      refRow.current.scrollTop = 0;
    }
  }, [router.pathname]);

  useEffect(() => {
    (async () => {
      try {
        if (currentStripeKey && walletModal && walletTab === 0x0) {
          loadStripe.setLoadParameters({ advancedFraudSignals: false });
          const loadStripePromise = await loadStripe(
            currentStripeKey?.stripePublishableKey
          );
          setStripeLoader(loadStripePromise);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentStripeKey, walletModal, walletTab]);

  // useEffect(() => {
  //   if (currentStripeKey) {
  //     console.log("changed", currentStripeKey)
  //     setStripeLoader(loadStripe(currentStripeKey.stripePublishableKey))
  //     // stripeHandler.init(currentStripeKey.stripePublishableKey)
  //   };
  // }, [currentStripeKey]);

  return (
    <Fragment>
      <Head>
        <title>Loot.gg</title>
        <link rel="icon" href="/imgs/favicon.ico" />
      </Head>
      <div key={currentStripeKey?.stripePublishableKey}>
        <Elements
          stripe={stripeLoader}
          key={currentStripeKey?.stripePublishableKey}
        >
          {(waitpage === false && (
            <div className={cx(styles.layout, className)} {...rest}>
              <div className={styles.layoutRow} ref={refRow}>
                <MobilePanel />
                <ModalsContainer />
                <div className={styles.layoutSidebar}>
                  <StickyBox offsetTop={96} offsetBottom={24}>
                    <Navbar />
                  </StickyBox>
                </div>
                <div className={styles.layoutColumn}>
                  {children}
                  <Footer />
                </div>
                {/* {size.width > 1170 && (
              <div className={styles.layoutChat}>
                <Chat />
              </div>
            )} */}
              </div>
            </div>
          )) ||
            null}
        </Elements>
      </div>
    </Fragment>
  );
};

const LayooutWithVariableStripeKey = (props: LayoutProps) => {
  const { user, waitpage, currentStripeKey } = useSelector<
    StateInterface,
    MainReducer
  >((state) => state.mainReducer);

  const handleFetchPublishableKey = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userInfo = await accountAction(token);
        if (userInfo) {
          const res = await getAvailableStripeKeys();
          if (res && res.length > 0) {
            console.log("changed to 1");
            updateMainState({ currentStripeKey: res[0] });
          }
          // else if (localStorage.getItem("stripeKey")) {
          //   const stripeKey = JSON.parse(localStorage.getItem("stripeKey") as string);
          //   updateMainState({ currentStripeKey: stripeKey });
          // }
        }
      } catch (error) {
        console.log("fethc p key", error);
      }
    }
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("fetccccccc");
    // we disable the stripe deposit for now
    // handleFetchPublishableKey();
  }, [token]);

  return <Layout {...props} key={currentStripeKey?.stripePublishableKey} />;
};

export default LayooutWithVariableStripeKey;
