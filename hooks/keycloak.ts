import Keycloak, { KeycloakInstance } from "keycloak-js";

declare module "keycloak-js" {
  interface KeycloakInitOptions {
    prompt?: string;
  }
}

export const keycloaker = (_keycloak?: Keycloak, lk?: boolean) => {
  return new Promise<{ 0x0: boolean; 0x1: Keycloak }>((resolve, reject) => {
    let keycloak = _keycloak
      ? _keycloak
      : new Keycloak({
          url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
          realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
        });
    (lk
      ? keycloak.init({
          onLoad: "check-sso",
          // silentCheckSsoRedirectUri:
          //   window.location.origin + "/silent-check-sso.html",
          prompt: "none",
        })
      : keycloak.init({ onLoad: "login-required", prompt: "none" })
    )
      .then((authenticated) => {
        if (authenticated) {
          resolve([true, keycloak]);
        } else {
          resolve([false, keycloak]);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};
