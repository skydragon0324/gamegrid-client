import React, { FC, useEffect } from "react";
import Keycloak from "keycloak-js";
import { accountAction } from "mredux/actions/account";
import { useDispatch } from "react-redux";
import { LoaderScreen } from "@/components/preloader/LoaderScreen";
import { useRouter } from "next/router";
import { ExternalPage } from "..";

export const KeycloakPage: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [keycloak, setKeycloak] = React.useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);

  const handleKeycloakInit = async () => {
    let keycloakFunc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    });

    await keycloakFunc
      .init({ onLoad: "login-required", prompt: "none" })
      .then((authenticated) => {
        setKeycloak(keycloakFunc);
        setAuthenticated(authenticated);
      });
  };

  const loadUserInfo = async () => {
    try {
      if (keycloak?.authenticated) {
        const token = keycloak.token;
        setLoading(true);
        const user = await accountAction(token ?? "");
        if (!user) {
          throw new Error("Session expired, please login again");
        }
        dispatch({
          type: "UPDATE_MAIN_STATE",
          payload: {
            token,
            ...user.payload,
          },
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("keycloak");
    handleKeycloakInit();
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadUserInfo();
      router.push("/");
    }
  }, [keycloak]);

  return <LoaderScreen className={keycloak ? "fadeout" : undefined} />;
};

export default KeycloakPage;
