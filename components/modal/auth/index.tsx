import { FC, useEffect, useRef, useState } from "react";
import styles from "./mauth.module.scss";
import LogoImg from "@/svgs/logo.svg";
import CrossIcon from "@/svgs/cross.svg";
import { ModalOverlay } from "../ModalOverlay";
import classNames from "classnames";
import DiscordIcon from "@/svgs/discord.svg";
import GoogleIcon from "@/svgs/google.svg";
import SteamIcon from "@/svgs/steam.svg";
import WarnIcon from "@/svgs/warn.svg";
import EyeOpened from "@/svgs/opened-eye.svg";
import EyeClosed from "@/svgs/closed-eye.svg";
import CheckMarkIcon from "@/svgs/checkmark.svg";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StateInterface } from "mredux";
import { ModalsReducer } from "mredux/reducers/modals.reducer";
import { toast } from "react-hot-toast";
import { handleErrorRequest } from "utils/handler";
import {
  confirmCode,
  loginUser,
  registerUser,
  requestCode,
  sendCodeForPass,
  validateCodePass,
} from "utils/api.service";
import { MainReducer } from "mredux/reducers/main.reducer";
import { accountAction } from "mredux/actions/account";
import Loader from "@/components/loader/Loader";
import ArrowIconLeft from "@/svgs/arrow-left.svg";
import { useFeatureIsOn } from "@growthbook/growthbook-react";
import { useRouter } from "next/router";
import Link from "next/link";
import Keycloak from "keycloak-js";
import { updateModalsState } from "@/utils/updateState";

interface IForm {
  username: string;
  email: string;
  password: string;
  password2: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
}

export const AuthModal: FC = () => {
  const lootgg_login_enabled = useFeatureIsOn("lootgg_login_enabled");
  const lootgg_registration_enabled = useFeatureIsOn(
    "lootgg_registration_enabled"
  );

  const dispatch = useDispatch<Dispatch<MainReducer>>();
  const dispatchModals = useDispatch<Dispatch<ModalsReducer>>();
  const { authModal, authTab } = useSelector<StateInterface, ModalsReducer>(
    (state) => state.modalsReducer
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [passwordEye, setPasswordEye] = useState<boolean[]>([true, true]);

  const [form, setForm] = useState<IForm>({
    username: "",
    email: "",
    password: "",
    password2: "",
    dateOfBirth: {
      day: "",
      month: "",
      year: "",
    },
  });

  const [errorInput, setErrorInput] = useState<{ type: string; msg: string }>({
    type: "",
    msg: "",
  });

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailref = useRef<HTMLInputElement>(null);
  const passref = useRef<HTMLInputElement>(null);
  const pass2ref = useRef<HTMLInputElement>(null);
  const dateref = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [codeInputs, _] = useState(
    new Array(0x6).fill(null).map(() => useRef<HTMLInputElement>(null))
  );

  const router = useRouter();

  const setTab = (index: number) => {
    dispatchModals({
      type: "UPDATE_MODALS_STATE",
      payload: {
        authTab: index,
      },
    });
  };

  const passValidation = (pass: string) => {
    return [
      {
        status: /[A-Z]/.test(pass),
        message: "At least 1 capital letter",
      },
      {
        status: !!(pass && pass.length >= 0x8),
        message: "Minimum 8 characters",
      },
      {
        status: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
        message: "Minimum 1 special symbol",
      },
    ];
  };

  const closeModal = () => {
    if (!loading) {
      setLoading(false);
      setForm({
        email: "",
        username: "",
        password: "",
        password2: "",
        dateOfBirth: {
          day: "",
          month: "",
          year: "",
        },
      });
      setErrorInput({
        type: "",
        msg: "",
      });
      dispatchModals({
        type: "UPDATE_MODALS_STATE",
        payload: {
          authModal: false,
        },
      });

      if (authTab === 0x4) {
        updateModalsState({
          closedModalCode: true,
        });
      }

      setTimeout(() => {
        setTab(0x0);
      }, 500);
    } else {
      toast.error("Please wait for the process to complete");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const { email, password, password2, username, dateOfBirth } = form;

      if (
        !username ||
        ((username.length < 0x6 || username.length > 16) && authTab === 0x1)
      ) {
        usernameRef.current?.focus();
        setErrorInput({
          type: "username",
          msg: "Invalid Username, It must be between 6 and 16 characters",
        });
        return;
      }

      if (
        (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g)) &&
        authTab === 0x1
      ) {
        emailref.current?.focus();
        setErrorInput({
          type: "email",
          msg: "Invalid Email, Check that you have filled it in correctly",
        });
        return;
      }

      if (
        !password ||
        (authTab === 0x1 && passValidation(password).find((l) => !l.status))
      ) {
        passref.current?.focus();
        setErrorInput({
          type: "password",
          msg: "Invalid Password, Check that you have filled it in correctly",
        });
        return;
      }

      if (password !== password2 && authTab === 0x1) {
        pass2ref.current?.focus();
        setErrorInput({
          type: "password2",
          msg: "Passwords must match",
        });
        return;
      }

      if (
        (!dateOfBirth ||
          !dateOfBirth.day ||
          !dateOfBirth.month ||
          !dateOfBirth.year) &&
        authTab === 0x1
      ) {
        dateref.current?.focus();
        setErrorInput({
          type: "date",
          msg: "Invalid date, Check that you have filled it in correctly",
        });
        return;
      }
      const birth: number = new Date(
        parseInt(dateOfBirth.year),
        parseInt(dateOfBirth.month) - 1,
        parseInt(dateOfBirth.day)
      ).valueOf();
      const oneYear = 1000 * 60 * 60 * 24 * 356;
      if ((new Date().valueOf() - birth) / oneYear < 18) {
        dateref.current?.focus();
        setErrorInput({
          type: "date",
          msg: "Users must be at least 18 years of age to use this website",
        });
        return;
      }

      setErrorInput({
        type: "",
        msg: "",
      });

      setLoading(true);

      const req =
        authTab === 0x0
          ? await loginUser({ username, password })
          : await registerUser({
              ...form,
              dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`,
            });

      if (
        !("access_token" in req) ||
        !req.access_token ||
        typeof req.access_token !== "string"
      ) {
        throw new Error("Invalid response, please try again later");
      }

      const token: string = req.access_token;

      const user = await accountAction(token);

      if (!user) {
        throw new Error("Invalid user token, please try again later");
      }

      dispatch({
        type: "UPDATE_MAIN_STATE",
        payload: {
          token,
          ...user.payload,
        },
      });

      setLoading(false);

      if (user.payload.user && user.payload.user.emailVerified === false) {
        setTab(0x4);
        return;
      } else if (
        user.payload.user &&
        user.payload.user.emailVerified === true
      ) {
        toast.success("You successfully logged in");
        closeModal();
      }
    } catch (e) {
      setLoading(false);
      // console.error(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const codeLK = code.join("");

      if (!codeLK || codeLK.length !== 0x6) {
        setErrorInput({
          type: "code",
          msg: "Invalid code, Check that you have filled it in correctly",
        });
        return;
      }

      setErrorInput({
        type: "",
        msg: "",
      });

      setLoading(true);

      const req = await confirmCode("EMAIL", codeLK);

      if (!req) {
        throw new Error("Invalid response, please try again later");
      }

      setLoading(false);

      if (req === "VALID") {
        toast.success("Your email has been successfully verified");
        closeModal();
      } else {
        setErrorInput({
          type: "code",
          msg: "Invalid code, Check that you have filled it in correctly",
        });
      }
    } catch (e) {
      setLoading(false);
      // console.error(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const handleForgotPass = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const email = form.email;

      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g)) {
        emailref.current?.focus();
        setErrorInput({
          type: "email",
          msg: "Invalid Email, Check that you have filled it in correctly",
        });
        return;
      }

      setErrorInput({
        type: "",
        msg: "",
      });

      setLoading(true);

      const req = await sendCodeForPass(email);

      setLoading(false);

      if (req) {
        toast.success(
          "We have sent you a six-digit code to your email address successfully."
        );
        setTab(0x3);
      } else {
        setErrorInput({
          type: "email",
          msg: "Invalid code, Check that you have filled it in correctly",
        });
      }
    } catch (e) {
      setLoading(false);
      // console.error(e);
      toast.error(handleErrorRequest(e));
    }
  };

  const handleCodePass = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const codeLK = code.join("");

      if (!codeLK || codeLK.length !== 0x6) {
        setErrorInput({
          type: "code",
          msg: "Invalid code, Check that you have filled it in correctly",
        });
        return;
      }

      const password = form.password;

      if (!password || passValidation(password).find((l) => !l.status)) {
        passref.current?.focus();
        setErrorInput({
          type: "password",
          msg: "Invalid Password, Check that you have filled it in correctly",
        });
        return;
      }

      setErrorInput({
        type: "",
        msg: "",
      });

      setLoading(true);

      const req = await validateCodePass(codeLK, form.email, password);

      if (!req) {
        throw new Error("Invalid response, please try again later");
      }

      setLoading(false);

      if (req === "VALID") {
        toast.success("Your password has been changed successfully");
        setCode(["", "", "", "", "", ""]);
        setTab(0x0);
      } else {
        setErrorInput({
          type: "code",
          msg: "Invalid code, Check that you have filled it in correctly",
        });
      }
    } catch (e) {
      setLoading(false);
      // console.error(e);
      toast.error(handleErrorRequest(e));
    }
  };

  useEffect(() => {
    authTab === 0x4 &&
      !codeSent &&
      requestCode("EMAIL")
        .then((req) => {
          if (!req) {
            throw new Error("Invalid response, please try again later");
          }
          setCodeSent(true);
        })
        .catch((e) => {
          // console.error(e);
          toast.error(handleErrorRequest(e));
        });
  }, [authTab]);

  return (
    <ModalOverlay
      isOpened={authModal}
      onClose={() => closeModal()}
      className={styles.authmodal}
    >
      <div className={styles.header}>
        <LogoImg className={styles.logo} />
        <button
          className={styles.closebutton}
          onClick={() => closeModal()}
          disabled={loading}
        >
          <CrossIcon />
        </button>
      </div>

      {((authTab === 0x0 || authTab === 0x1) && (
        <>
          <div className={styles.switcher}>
            {["Login", "Sign up"].map((item, index) => (
              <button
                onClick={() => {
                  if (!loading) {
                    setPasswordEye((l) => l.map((p, i) => true));
                    // consider feature flags
                    if (index === 0x0 && !lootgg_login_enabled) {
                      toast.error("Login is disabled");
                      return;
                    }
                    if (index === 0x1 && !lootgg_registration_enabled) {
                      toast.error("Registration is disabled");
                      return;
                    }
                    setTab(index);
                  }
                }}
                disabled={loading}
                className={classNames(
                  styles.swbutton,
                  index === authTab && styles.active
                )}
                key={index}
              >
                <span>{item}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Username</span>
                {(errorInput.type === "username" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                ref={usernameRef}
                className={styles.input}
                onChange={(e) => {
                  setForm({
                    ...form,
                    username: e.target.value,
                  });
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter your Username"
              />
            </div>
            {(authTab === 0x1 && (
              <div className={styles.formInput}>
                <div className={styles.label}>
                  <span>E-mail</span>
                  {(errorInput.type === "email" && (
                    <>
                      -<span className={styles.error}>{errorInput.msg}</span>
                    </>
                  )) ||
                    null}
                </div>
                <input
                  type="text"
                  ref={emailref}
                  className={styles.input}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      email: e.target.value,
                    });
                    setErrorInput({ type: "", msg: "" });
                  }}
                  placeholder="Enter your Email"
                />
              </div>
            )) ||
              null}
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Password</span>
                {(errorInput.type === "password" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>

              <div className={styles.passInput}>
                <input
                  type={passwordEye[0x0] ? "password" : "text"}
                  ref={passref}
                  className={styles.input}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter your Password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPasswordEye((l) => l.map((p, i) => (i === 0x0 ? !p : p)))
                  }
                >
                  {passwordEye[0x0] ? <EyeOpened /> : <EyeClosed />}
                </button>
              </div>
              {(authTab === 0x0 && (
                <div className={styles.forgotLb} onClick={() => setTab(0x2)}>
                  Forgot Password?
                </div>
              )) ||
                null}
            </div>

            {(authTab === 0x1 && (
              <>
                <div className={styles.formstatus}>
                  {passValidation(form.password).map((item, index) => (
                    <div
                      className={classNames(
                        styles.formstatusItem,
                        item.status && styles.success
                      )}
                      key={index}
                    >
                      <CheckMarkIcon />
                      <span>{item.message}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.formInput}>
                  <div className={styles.label}>
                    <span>Confirm password</span>
                    {(errorInput.type === "password2" && (
                      <>
                        -<span className={styles.error}>{errorInput.msg}</span>
                      </>
                    )) ||
                      null}
                  </div>
                  <div className={styles.passInput}>
                    <input
                      type={passwordEye[0x1] ? "password" : "text"}
                      className={styles.input}
                      ref={pass2ref}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          password2: e.target.value,
                        });
                        setErrorInput({
                          type: "",
                          msg: "",
                        });
                      }}
                      placeholder="Repeat your Password"
                    />
                    <button
                      type="button"
                      className={styles.hidePassButton}
                      onClick={() =>
                        setPasswordEye((l) =>
                          l.map((p, i) => (i === 0x1 ? !p : p))
                        )
                      }
                    >
                      {passwordEye[0x1] ? <EyeOpened /> : <EyeClosed />}
                    </button>
                  </div>
                </div>
                <div className={styles.formInput}>
                  <div className={styles.label}>
                    <span>Date birth</span>
                    {(errorInput.type === "date" && (
                      <>
                        -<span className={styles.error}>{errorInput.msg}</span>
                      </>
                    )) ||
                      null}
                  </div>
                  <div className={styles.date}>
                    <input
                      type="number"
                      className={styles.input}
                      placeholder="DD"
                      ref={dateref}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          dateOfBirth: {
                            ...form.dateOfBirth,
                            day: e.target.value,
                          },
                        });
                        setErrorInput({
                          type: "",
                          msg: "",
                        });
                      }}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      className={styles.input}
                      placeholder="MM"
                      onChange={(e) => {
                        setForm({
                          ...form,
                          dateOfBirth: {
                            ...form.dateOfBirth,
                            month: e.target.value,
                          },
                        });
                        setErrorInput({
                          type: "",
                          msg: "",
                        });
                      }}
                    />
                    <span>-</span>

                    <input
                      type="number"
                      className={styles.input}
                      placeholder="YYYY"
                      onChange={(e) => {
                        setForm({
                          ...form,
                          dateOfBirth: {
                            ...form.dateOfBirth,
                            year: e.target.value,
                          },
                        });
                        setErrorInput({
                          type: "",
                          msg: "",
                        });
                      }}
                    />
                  </div>
                </div>
              </>
            )) ||
              null}
            <div className={styles.hr}></div>
            <div className={styles.labelMd}>Or use social networks</div>
            <div className={styles.socialButtons}>
              {/* <button className={styles.socialButton} type="button">
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button className={styles.socialButton} type="button">
                <SteamIcon />
                <span>Steam</span>
              </button> */}
              <button
                className={styles.socialButton}
                type="button"
                onClick={() => router.push("/keycloak")}
              >
                <DiscordIcon />
                <span>Discord</span>
              </button>
            </div>
            <button
              className={styles.loginbutton}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader radius={18} centered />
              ) : authTab === 0x0 ? (
                "Login"
              ) : (
                "Sign up"
              )}
            </button>
          </form>
        </>
      )) ||
        null}

      {(authTab === 0x2 && (
        <form onSubmit={handleForgotPass}>
          <button
            className={classNames(styles.backBtn, styles.lk)}
            onClick={() => {
              setTab(0x0);
            }}
          >
            <ArrowIconLeft />
            <span>Back</span>
          </button>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>Your E-mail</span>
              {(errorInput.type === "email" && (
                <>
                  -<span className={styles.error}>{errorInput.msg}</span>
                </>
              )) ||
                null}
            </div>
            <input
              type="text"
              ref={emailref}
              className={styles.input}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setErrorInput({ type: "", msg: "" });
              }}
              placeholder="Enter your Email"
            />
          </div>
          <p>
            You will receive a six-digit code to your email address, If you
            didn't try to look for it on <strong>Spam</strong> channel.
          </p>
          <button
            className={styles.loginbutton}
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader radius={18} centered /> : "Continue"}
          </button>
        </form>
      )) ||
        null}
      {(authTab === 0x3 && (
        <form onSubmit={handleCodePass}>
          <p></p>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>
                <span>Code</span>
                {(errorInput.type === "code" && (
                  <>
                    {"  "} - {"  "}
                    <span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </span>
            </div>
            {
              <div className={styles.inputsVerify}>
                {new Array(0x6).fill(null).map((input, i) => (
                  <input
                    type="text"
                    placeholder=""
                    key={i}
                    ref={codeInputs[i]}
                    value={code[i]}
                    onChange={(e) => {
                      if (e.target.value.match(/^[0-9]+$/g)) {
                        if (e.target.value.length === 0x6) {
                          setCode((c) =>
                            c.map((lc, index) => e.target.value[index])
                          );
                          return;
                        }
                        setCode((c) =>
                          c.map((lc, index) =>
                            index === i ? e.target.value.slice(0x0, 0x1) : lc
                          )
                        );
                        if (e.target.value.length >= 0x1 && i !== 0x5) {
                          codeInputs[i + 0x1].current?.focus();
                          e.target.value.length === 0x2 &&
                            setCode((c) =>
                              c.map((lc, index) =>
                                index === i
                                  ? e.target.value.slice(0x0, 0x1)
                                  : index === i + 0x1
                                    ? e.target.value.slice(0x1, 0x2)
                                    : lc
                              )
                            );
                        }
                      } else {
                        e.preventDefault();
                      }
                    }}
                    onKeyDown={(e) => {
                      const indx = Math.max(i - 0x1, 0x0);

                      if (e.key === "Backspace" && i >= 0x0) {
                        e.preventDefault();
                        setCode((c) =>
                          c.map((lc, index) =>
                            index === i ? "" : index === i ? "" : lc
                          )
                        );
                        codeInputs[indx].current?.focus();
                      }
                    }}
                  />
                ))}
              </div>
            }
          </div>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>New Password</span>
              {(errorInput.type === "password" && (
                <>
                  -<span className={styles.error}>{errorInput.msg}</span>
                </>
              )) ||
                null}
            </div>
            <div className={styles.passInput}>
              <input
                type={passwordEye[0x0] ? "password" : "text"}
                ref={passref}
                className={styles.input}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Enter New Password"
              />
              <button
                type="button"
                onClick={() =>
                  setPasswordEye((l) => l.map((p, i) => (i === 0x0 ? !p : p)))
                }
              >
                {passwordEye[0x0] ? <EyeOpened /> : <EyeClosed />}
              </button>
            </div>
          </div>
          <div className={styles.formstatus}>
            {passValidation(form.password).map((item, index) => (
              <div
                className={classNames(
                  styles.formstatusItem,
                  item.status && styles.success
                )}
                key={index}
              >
                <CheckMarkIcon />
                <span>{item.message}</span>
              </div>
            ))}
          </div>
          <button
            className={styles.loginbutton}
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader radius={18} centered /> : "Confirm"}
          </button>
        </form>
      )) ||
        null}
      {(authTab === 0x4 && (
        <form onSubmit={handleVerification}>
          <p>We have sent you a six-digit code. Enter it in the field below</p>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>
                <span>Code</span>
                {(errorInput.type === "code" && (
                  <>
                    {"  "} - {"  "}
                    <span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </span>
            </div>
            {
              <div className={styles.inputsVerify}>
                {new Array(0x6).fill(null).map((input, i) => (
                  <input
                    type="text"
                    placeholder=""
                    key={i}
                    ref={codeInputs[i]}
                    value={code[i]}
                    onChange={(e) => {
                      if (e.target.value.match(/^[0-9]+$/g)) {
                        if (e.target.value.length === 0x6) {
                          setCode((c) =>
                            c.map((lc, index) => e.target.value[index])
                          );
                          return;
                        }
                        setCode((c) =>
                          c.map((lc, index) =>
                            index === i ? e.target.value.slice(0x0, 0x1) : lc
                          )
                        );
                        if (e.target.value.length >= 0x1 && i !== 0x5) {
                          codeInputs[i + 0x1].current?.focus();
                          e.target.value.length === 0x2 &&
                            setCode((c) =>
                              c.map((lc, index) =>
                                index === i
                                  ? e.target.value.slice(0x0, 0x1)
                                  : index === i + 0x1
                                    ? e.target.value.slice(0x1, 0x2)
                                    : lc
                              )
                            );
                        }
                      } else {
                        e.preventDefault();
                      }
                    }}
                    onKeyDown={(e) => {
                      const indx = Math.max(i - 0x1, 0x0);

                      if (e.key === "Backspace" && i >= 0x0) {
                        e.preventDefault();
                        setCode((c) =>
                          c.map((lc, index) =>
                            index === i ? "" : index === i ? "" : lc
                          )
                        );
                        codeInputs[indx].current?.focus();
                      }
                    }}
                  />
                ))}
              </div>
            }
          </div>
          <button
            className={styles.loginbutton}
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader radius={18} centered /> : "Confirm"}
          </button>
        </form>
      )) ||
        null}
    </ModalOverlay>
  );
};
