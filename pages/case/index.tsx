import React, { ReactNode, useEffect } from "react";

import { ExternalPage } from "@/pages/profile";
import { Layout } from "@/components/layout/Layout";
import { InfoBoxes } from "@/components/infoboxes/infoboxes";
import styles from "@/parts/casebattle/case.module.scss";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { StateInterface, store } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { wsHandler } from "@/utils/ws.service";
import classNames from "classnames";
import { UPDATE_MODALS_STATE } from "mredux/types";

export const Case: ExternalPage<{}, { children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  // useEffect(() => {
  //   if (!user) {
  //     store.dispatch({
  //       type: UPDATE_MODALS_STATE,
  //       payload: { authModal: true, authTab: 0x0 },
  //     });
  //     router.push("/case/lobby");
  //   }
  // }, [user]);
  useEffect(() => {
    if (!children) {
      router.push("/case/lobby");
    }
  }, [children]);

  // useEffect(() => {
  //   wsHandler.caseBattle();
  // }, []);
  return (
    <div className={classNames(styles.case, "contentinsider")}>
      {children}
      <InfoBoxes />
    </div>
  );
};

Case.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default Case;
