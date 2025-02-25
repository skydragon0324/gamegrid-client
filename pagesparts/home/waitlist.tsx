import { FC, useEffect, useState } from "react";
import styles from "./waitlist.module.scss";
import classNames from "classnames";
import Logout from "@/svgs/logout.svg";
import DiscordIcon from "@/svgs/discord.svg";
import {
  checkIfUserJoined,
  fetchWaitCount,
  fetchWaitList,
  joinWaitList,
  setAuthToken,
} from "@/utils/api.service";
import { useRouter } from "next/router";
import KeycloakPage from "@/pages/keycloak";
import { keycloaker } from "@/hooks/keycloak";
import Keycloak, { KeycloakInstance } from "keycloak-js";
import { accountAction } from "mredux/actions/account";
import { updateMainState } from "@/utils/updateState";
import { handleAvatar, handleErrorRequest } from "@/utils/handler";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { toast } from "react-hot-toast";
import { LoaderScreen } from "@/components/preloader/LoaderScreen";

export const WaitPage: FC = () => {
  const router = useRouter();
  const [waitRedirect, setWaitRedirect] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [alreadyJoined, setjoined] = useState<boolean | null>(null);
  const [keycloak, setKeycloak] = useState<KeycloakInstance | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [usersJoined, setusers] = useState<number | null>(null);
  const [userDiscord, setDiscordUser] = useState<{
    status: "PENDING" | "APPROVED" | "DENIED";
    position: number;
    username: string;
  } | null>(null);
  const { waitpage } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const fetchUsersinQueue = async () => {
    try {
      const data = await fetchWaitCount();
      setusers(data);
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchWaitListl = async () => {
    try {
      const data = await fetchWaitList();
      if (data) {
        if (data.status === "APPROVED") {
          updateMainState({
            waitpage: false,
          });
        } else {
          updateMainState({
            waitpage: true,
          });
          setjoined(true);
          setDiscordUser({
            status: data.status,
            position: data.position,
            username: data.user.username,
          });
        }
      }
    } catch (error) {
      if (
        error &&
        (error as any)?.response &&
        (error as any)?.response?.status === 400
      ) {
      }
      // console.log(error);
    }
  };

  const joinWaitListl = async () => {
    try {
      setButtonLoading(true);

      const data = await joinWaitList();
      setButtonLoading(false);

      if (data) {
        if (data.status === "APPROVED") {
          updateMainState({
            waitpage: false,
          });
        } else {
          updateMainState({
            waitpage: true,
          });
          setjoined(true);

          setDiscordUser({
            status: data.status,
            position: data.position,
            username: data.user.username,
          });
        }
      }
    } catch (error) {
      setButtonLoading(false);
      toast.error(handleErrorRequest(error));
      // console.log(error);
    }
  };

  const checkIfamin = async () => {
    try {
      const data = await checkIfUserJoined();
      if (data) {
        setjoined(true);
      } else {
        setjoined(false);
      }
    } catch (error) {
      // console.log(error);
      updateMainState({
        waitpage: true,
      });
    }
  };

  const authWithKeycloak = async (login: boolean = false) => {
    keycloaker(undefined, !login)
      .then((res) => {
        let status = res[0x0];
        let _keycloak = res[0x1];

        if (!login && !status) {
          updateMainState({
            waitpage: true,
          });
        }

        if (login && !status && _keycloak) {
          _keycloak.login({
            prompt: "none",
          });
        } else if (_keycloak && _keycloak.authenticated) {
          setAuthenticated(true);
          setKeycloak(_keycloak);
          updateMainState({
            waitpage: true,
          });
        }
      })
      .catch((err) => {
        // console.log(err);
        updateMainState({
          waitpage: true,
        });
      });
  };

  const logout = async () => {
    try {
      if (keycloak) {
        setButtonLoading(true);
        await keycloak.logout();
        setButtonLoading(false);
        setAuthenticated(false);
      }
    } catch (error) {
      setButtonLoading(false);
      // console.log(error);
    }
  };

  const loadUserInfo = async () => {
    try {
      if (keycloak?.authenticated) {
        const token = keycloak.token;
        setAuthToken(token ?? "");
        const user = await accountAction(token ?? "");

        if (!user) {
          throw new Error("Session expired, please login again");
        }
        updateMainState({
          token,
          user: Object.assign({}, user ?? {}, user.payload.user ?? {}),
        });
        await fetchWaitListl();
        await checkIfamin();
      }
    } catch (error) {
      // console.log(error);
      updateMainState({
        waitpage: true,
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (waitRedirect) {
          setButtonLoading(true);
          keycloak && (await authWithKeycloak(true));
          setButtonLoading(false);
          setWaitRedirect(false);
        }
        setButtonLoading(false);
      } catch (error) {
        // console.log(error);
        setButtonLoading(false);
      }
    })();
  }, [waitRedirect, keycloak]);

  useEffect(() => {
    if (keycloak && authenticated) {
      loadUserInfo();
    }
  }, [authenticated, keycloak]);

  useEffect(() => {
    let keycloakFunc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
    });

    setKeycloak(keycloakFunc);
    authWithKeycloak(false);
    fetchUsersinQueue();
  }, []);

  useEffect(() => {
    keycloak && ((window as any).keycloakLK = keycloak);
  }, [keycloak]);

  return (
    <>
      <LoaderScreen className={waitpage !== null ? "fadeout" : undefined} />

      {(waitpage && (
        <div className={styles.waitpage}>
          <div className={styles.decorations}></div>
          <div className={styles.container}>
            {/* <div className={styles.lastusers}>
          <div className={styles.users}>
            {[...Array(5)].map((_, i) => (
              <div className={styles.user}>
                <img
                  src="https://media.discordapp.net/attachments/803320462267514940/1193927810780250203/3198975.webp?ex=65ae7eec&is=659c09ec&hm=672a346579aec0a59f4cb2aea568772950bfe3b9c340f3a0440ccc1f303b262d&=&format=webp&width=719&height=404"
                  alt=""
                />
              </div>
            ))}
            <div className={classNames(styles.user, styles.circle)}>
              <span>+{usersJoined ?? "--"}</span>
            </div>
          </div>
          <span>Users have already joined!</span>
        </div> */}

            <h1>the Next Level of Online Unboxing</h1>
            <h2>Your Exclusive Pass to Loot.gg Awaits!</h2>
            <p>
              Join our thriving community and start your journey to epic wins.
              Our waitlist is the golden ticket to special offers, member-only
              cases, and priority access. Ready to step up your game?
            </p>
            {(!userDiscord && (
              <p className={styles.steps}>
                1 - Join{" "}
                <button
                  onClick={() =>
                    (window.location.href = "https://discord.com/invite/loot")
                  }
                >
                  <DiscordIcon />
                  Discord server
                </button>
                <br />2 - Go to the waitlist channel and receive a role
              </p>
            )) ||
              null}
            {(userDiscord && (
              <div className={styles.userdiscord}>
                <img
                  src={handleAvatar(null, userDiscord.username ?? "")}
                  alt=""
                />
                <span>{userDiscord.username ?? "--"}</span>
                <p>Status: {userDiscord.status}</p>
                <p>Position: {Math.max(0x0, userDiscord.position)}</p>
                <p>Total waitlist users: {Math.max(0x0, usersJoined ?? 0x0)}</p>
              </div>
            )) ||
              null}
            <div className={styles.buttons}>
              {(!authenticated && (
                <button
                  className={classNames("primarybutton", styles.button)}
                  disabled={buttonLoading || authenticated}
                  onClick={() => setWaitRedirect(true)}
                >
                  {buttonLoading ? (
                    "..."
                  ) : (
                    <>
                      <DiscordIcon />
                      <span>Login with Discord</span>
                    </>
                  )}
                </button>
              )) ||
                null}

              {(authenticated && (
                <>
                  {(!alreadyJoined && (
                    <button
                      className={classNames("primarybutton", styles.button)}
                      disabled={buttonLoading || alreadyJoined === null}
                      onClick={() => joinWaitListl()}
                    >
                      {buttonLoading ? (
                        "..."
                      ) : (
                        <>
                          <span>Join Waitlist</span>
                        </>
                      )}
                    </button>
                  )) ||
                    null}
                  <button
                    className={styles.buttonlogout}
                    disabled={buttonLoading}
                    onClick={() => logout()}
                  >
                    {buttonLoading ? (
                      "..."
                    ) : (
                      <>
                        <Logout />
                        <span onClick={() => setWaitRedirect(true)}>
                          Logout
                        </span>
                      </>
                    )}
                  </button>
                </>
              )) ||
                null}
            </div>
          </div>
        </div>
      )) ||
        null}
    </>
  );
};
