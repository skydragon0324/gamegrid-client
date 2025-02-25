import { BasicNotification } from "@/components/modal/notification/BasicNotification";
import { keycloaker } from "@/hooks/keycloak";
import {
  fetchUser,
  initializeAPI,
  coastalPayConfirm,
} from "@/utils/api.service";
import { getUrlParams } from "@/utils/getparams";
import { updateMainState, updateModalsState } from "@/utils/updateState";
import axios from "axios";
// import { reject } from "lodash";
import { store } from "mredux";
import { LootUser } from "mredux/reducers/main.reducer";
import { toast } from "react-hot-toast";
import { parseNumberToCommas } from "react-letshook";

export const accountAction = async (token: string) => {
  try {
    await initializeAPI(null, token);

    let user: LootUser = structuredClone(await fetchUser(token));

    let ingame = store.getState().gameReducer.ingame;

    const removeParamsFromURL = () => {
      var urlWithoutParams =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, urlWithoutParams);
    };

    try {
      const params = getUrlParams();

      if (
        params &&
        "id" in params &&
        "externalId" in params &&
        "status" in params &&
        params.amount &&
        String(params.amount).match(/^[0-9]+$/g) &&
        "amount" in params &&
        params.status?.toLowerCase() === "success"
      ) {
        let paymentsSentIds = structuredClone(
          store.getState().mainReducer.paymentsSentIds
        );
        if (!paymentsSentIds.includes(params.id)) {
          updateMainState({
            paymentsSentIds: [...paymentsSentIds, params.id],
          });
          const confirmReq = await coastalPayConfirm({
            paymentId: Number(params.id),
            externalId: params.externalId,
          });

          if (confirmReq && confirmReq.success) {
            removeParamsFromURL();

            window?.rudderanalytics &&
              (window as any)?.rudderanalytics?.track("DEPOSIT", {
                amount: parseFloat(params.amount),
                type: "USD",
              });

            user.usdBalance += Number(params.amount);

            toast.success(
              `You successfully deposited $${parseNumberToCommas(
                Number(params.amount)
              )}!`
            );
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    return user
      ? {
          type: "UPDATE_MAIN_STATE",
          payload: {
            user: Object.assign(
              {},
              store.getState().mainReducer.user ?? {},
              ingame ? {} : user
            ) as LootUser,
            loaded: true,
          },
        }
      : null;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (
        token &&
        e.response?.status === 401 &&
        localStorage.getItem("token")
      ) {
        localStorage.removeItem("token");
        if ("keycloakLK" in (window as any)) {
          (window as any).keycloakLK?.logout();
        } else {
          location.reload();
        }
      }
    }

    return null;
    // console.log(e);
  }
};
