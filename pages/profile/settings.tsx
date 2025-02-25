import PassportIcon from "@/svgs/passport.svg";
import MasterCard from "@/svgs/mastercard.svg";
import EyeOpened from "@/svgs/opened-eye.svg";
import EyeClosed from "@/svgs/closed-eye.svg";
import ChevronUp from "@/svgs/chevron-up.svg";
import ChevronDown from "@/svgs/chevron-down.svg";
import ProfilePage, { ExternalPage } from ".";
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "@/parts/profile/profile.module.scss";
import { Layout } from "@/components/layout/Layout";
import classNames from "classnames";
import { Pagination } from "@/components/pagination";
import { useSelector } from "react-redux";
import CheckMarkIcon from "@/svgs/checkmark.svg";
import { StateInterface, store } from "mredux";
import {
  BalanceTransaction,
  DepositTransaction,
  GameTransaction,
  MainReducer,
} from "mredux/reducers/main.reducer";
import {
  changeDOB,
  changeEmail,
  changeFirstLastName,
  changePassowrd,
  fetchBalancesTransactions,
  fetchDepositsTransactions,
  fetchGamesTransactions,
  fetchWithdrawsTransactions,
  updateCurrentClientSeed,
} from "@/utils/api.service";
import { UPDATE_MAIN_STATE } from "mredux/types";
import { Skeleton } from "@/components/sekelton/Skeleton";
import { DepositsTable } from "@/parts/profile/DepositsTable";
import { GamesTable } from "@/parts/profile/GamesTable";
import Loader from "@/components/loader/Loader";
import { WithdrawTable } from "@/parts/profile/WithdrawTable";
import { AllTransTable } from "@/parts/profile/AllTable";
import { useWindowSize } from "@/hooks/windowSize";
import { Tabs } from "@/components/tabs/Tabs";
import { handleErrorRequest } from "@/utils/handler";
import toast from "react-hot-toast";
import { updateMainState, updateModalsState } from "@/utils/updateState";

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

interface IForm {
  newpass: string;
  password: string;
  password2: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
}

export const SettingsPage: ExternalPage = () => {
  const { width } = useWindowSize();
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [loadingPass, setLoadingPass] = useState<boolean>(false);

  const emailref = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const dob1ref = useRef<HTMLInputElement>(null);
  const dob2ref = useRef<HTMLInputElement>(null);
  const dob3ref = useRef<HTMLInputElement>(null);
  const newpassRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const repassref = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<IForm>({
    password: "",
    password2: "",
    newpass: "",
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: {
      day: "",
      month: "",
      year: "",
    },
  });

  const [passwordEye, setPasswordEye] = useState<boolean[]>([true, true, true]);

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  const [errorInput, setErrorInput] = useState<{ type: string; msg: string }>({
    type: "",
    msg: "",
  });

  const dobParser = (date?: null | string) => {
    let h = (date ?? "").split("-");

    return {
      year: h?.[0x0] ?? "",
      month: h?.[0x1] ?? "",
      day: h?.[0x2] ?? "",
    };
  };

  const handleChangeEmail = async () => {
    try {
      let email = form.email;
      let { firstName, lastName } = form;
      let uK = (l: string) =>
        l && l.length && l.trim().length === 0x1 ? `0${l.trim()}` : l.trim();
      let parser = (p?: Record<string, string> | null) =>
        p ? `${p.year ?? ""}-${uK(p.month ?? "")}-${uK(p.day ?? "")}` : "";

      if (form.dateOfBirth.day && parseInt(form.dateOfBirth.day) > 0x1f) {
        setErrorInput({
          type: "date",
          msg: "Day is incorrect",
        });
        return;
      }

      if (form.dateOfBirth.month && parseInt(form.dateOfBirth.month) > 0xc) {
        setErrorInput({
          type: "date",
          msg: "Month is incorrect",
        });
        return;
      }

      if (
        form.dateOfBirth.year &&
        parseInt(form.dateOfBirth.year) > new Date().getFullYear()
      ) {
        setErrorInput({
          type: "date",
          msg: "Year is incorrect",
        });
        return;
      }

      setErrorInput({
        type: "",
        msg: "",
      });

      let dob = parser(
        Object.assign(
          {},
          user?.dateOfBirth
            ? {
                year: user?.dateOfBirth.split("-")[0],
                month: user?.dateOfBirth.split("-")[1],
                day: user?.dateOfBirth.split("-")[2],
              }
            : {},
          ...Object.keys(form.dateOfBirth)
            .filter(
              (l) => !!form.dateOfBirth?.[l as keyof typeof form.dateOfBirth]
            )
            .map((l) => ({
              [l]: form.dateOfBirth?.[l as keyof typeof form.dateOfBirth],
            }))
        )
      );

      let needstobechanged = [false, false, false, false];

      if (!dob && !email && !firstName && !lastName) {
        return;
      }

      if (
        user &&
        email &&
        email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g) &&
        email !== user.email
      ) {
        needstobechanged[0x0] = true;
      }

      if (user && dob && dob !== user.dateOfBirth) {
        needstobechanged[0x1] = true;
      }

      if (user && firstName && firstName !== user.firstName) {
        needstobechanged[0x2] = true;
      }

      if (user && lastName && lastName !== user.lastName) {
        needstobechanged[0x3] = true;
      }

      if (
        !needstobechanged[0x0] &&
        !needstobechanged[0x1] &&
        !needstobechanged[0x2] &&
        !needstobechanged[0x3]
      ) {
        return toast.error("No changes was detected");
      }

      let status = [false, false, false, false];

      setLoadingDetails(true);

      if (needstobechanged[0x0]) {
        const updateEmail = await changeEmail({ newEmail: email });
        if (updateEmail) {
          status[0x0] = true;
          let stateUser = store.getState().mainReducer.user;

          if (stateUser) {
            updateMainState({
              user: { ...stateUser, emailVerified: false, email: email },
            });
            updateModalsState({
              authModal: true,
              authTab: 0x4,
              closedModalCode: false,
            });
          }
        } else {
          emailref.current &&
            (emailref.current.value = emailref.current?.defaultValue);
        }
      }

      if (needstobechanged[0x1]) {
        const updateDob = await changeDOB({ dateOfBirth: dob });
        if (updateDob) {
          status[0x1] = true;
          let stateUser = store.getState().mainReducer.user;
          stateUser &&
            updateMainState({
              user: { ...stateUser, dateOfBirth: dob },
            });
        } else {
          dob1ref.current &&
            (dob1ref.current.value = dob1ref.current?.defaultValue);
          dob2ref.current &&
            (dob2ref.current.value = dob2ref.current?.defaultValue);
          dob3ref.current &&
            (dob3ref.current.value = dob3ref.current?.defaultValue);
        }
      }

      if (needstobechanged[0x2]) {
        const updateFirstName = await changeFirstLastName({
          firstName: firstName,
        });

        if (updateFirstName) {
          status[0x2] = true;
          let stateUser = store.getState().mainReducer.user;
          stateUser &&
            updateMainState({
              user: { ...stateUser, firstName: firstName },
            });
        } else {
          firstNameRef.current &&
            (firstNameRef.current.value = firstNameRef.current?.defaultValue);
        }
      }

      if (needstobechanged[0x3]) {
        const updateLastName = await changeFirstLastName({
          lastName: lastName,
        });

        if (updateLastName) {
          status[0x3] = true;
          let stateUser = store.getState().mainReducer.user;
          stateUser &&
            updateMainState({
              user: { ...stateUser, lastName: lastName },
            });
        } else {
          lastNameRef.current &&
            (lastNameRef.current.value = lastNameRef.current?.defaultValue);
        }
      }

      setLoadingDetails(false);

      if (status.find((l) => !!l))
        toast.success("Details updated successfully");
      else toast.error("Failed to update account details");
    } catch (e) {
      setLoadingDetails(false);
      toast.error(handleErrorRequest(e));
    }
  };

  console.log({ user, form });

  const handleChangePass = async () => {
    try {
      let p = passValidation(form.newpass);

      if (p.find((l) => !l.status)) {
        throw new Error("Please enter correct new password");
      }

      let currentPass = form.password;
      let repPass = form.password2;

      if (!currentPass || !repPass || currentPass !== repPass) {
        throw new Error(
          "Incorrect current password or re-peat password does not match the current password"
        );
      }

      if (currentPass === form.newpass) {
        throw new Error("new password must be different");
      }

      setLoadingPass(true);

      const updatePass = await changePassowrd({
        password: currentPass.trim(),
        newPassword: form.newpass.trim(),
      });

      setLoadingPass(false);

      if (!updatePass) {
        throw new Error(
          "failed to update the password maybe currennt one you entered is incorrect"
        );
      }

      toast.success("Password has been changed successfully");

      passRef.current && (passRef.current.value = "");
      repassref.current && (repassref.current.value = "");
      newpassRef.current && (newpassRef.current.value = "");
    } catch (e) {
      setLoadingPass(false);
      toast.error(handleErrorRequest(e));
    }
  };

  useEffect(() => {
    updateMainState({
      soundsenabled: !!localStorage.getItem("sounds_enabled"),
    });
  }, []);
  return (
    <>
      <div className={classNames(styles.wrapper, styles.settings)}>
        <div className={styles.left}>
          <h4>Account details</h4>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>Email</span>
            </div>
            <input
              type="text"
              className={styles.input}
              ref={emailref}
              defaultValue={user?.email ?? ""}
              onChange={(e) => {
                setForm((l) => ({ ...l, email: e.target.value }));
              }}
              placeholder="Enter Email"
            />
            {(user && (
              <span
                className={classNames(
                  styles.emailstatus,
                  styles[user.emailVerified ? "green" : "red"]
                )}
              >
                {user.emailVerified ? "Verified" : "unverified"}
              </span>
            )) ||
              null}
          </div>
          <div className={styles.formInput}>
            <div className={styles.label}>
              <span>First Name</span>
            </div>
            <input
              type="text"
              className={styles.input}
              ref={firstNameRef}
              defaultValue={user?.firstName ?? ""}
              onChange={(e) => {
                setForm((l) => ({ ...l, firstName: e.target.value }));
              }}
              placeholder="Enter First Name"
            />
          </div>
          {width <= 700 && (
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Last Name</span>
              </div>
              <input
                type="text"
                className={styles.input}
                ref={lastNameRef}
                defaultValue={user?.lastName ?? ""}
                onChange={(e) => {
                  setForm((l) => ({ ...l, lastName: e.target.value }));
                }}
                placeholder="Enter Last Name"
              />
            </div>
          )}
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
                ref={dob1ref}
                defaultValue={dobParser(user?.dateOfBirth).day ?? ""}
                value={form.dateOfBirth.day}
                onChange={(e) => {
                  (String(e.target.value ?? "").length === 0x0 ||
                    (String(e.target.value ?? "").match(/^[0-9]+$/g) &&
                      String(e.target.value ?? "").length <= 0x2)) &&
                    setForm((l) => ({
                      ...l,
                      dateOfBirth: {
                        ...l.dateOfBirth,
                        day: e.target.value,
                      },
                    }));
                }}
              />
              <span>-</span>
              <input
                type="number"
                className={styles.input}
                placeholder="MM"
                ref={dob2ref}
                defaultValue={dobParser(user?.dateOfBirth).month ?? ""}
                value={form.dateOfBirth.month}
                onChange={(e) => {
                  (String(e.target.value ?? "").length === 0x0 ||
                    (String(e.target.value ?? "").match(/^[0-9]+$/g) &&
                      String(e.target.value ?? "").length <= 0x2)) &&
                    setForm((l) => ({
                      ...l,
                      dateOfBirth: {
                        ...l.dateOfBirth,
                        month: e.target.value,
                      },
                    }));
                }}
              />
              <span>-</span>

              <input
                type="number"
                className={styles.input}
                ref={dob3ref}
                placeholder="YYYY"
                defaultValue={dobParser(user?.dateOfBirth).year ?? ""}
                value={form.dateOfBirth.year}
                onChange={(e) => {
                  (String(e.target.value ?? "").length === 0x0 ||
                    (String(e.target.value ?? "").match(/^[0-9]+$/g) &&
                      String(e.target.value ?? "").length <= 0x4)) &&
                    setForm((l) => ({
                      ...l,
                      dateOfBirth: {
                        ...l.dateOfBirth,
                        year: e.target.value,
                      },
                    }));
                }}
              />
            </div>
          </div>
          {(width > 700 && (
            <button
              className={classNames("primarybutton", styles.submitButton)}
              onClick={() => handleChangeEmail()}
              disabled={loadingDetails || (!form.dateOfBirth && !form.email)}
            >
              {loadingDetails ? "..." : "Update Details"}
            </button>
          )) ||
            null}
        </div>
        {(width <= 700 && (
          <>
            <br />
          </>
        )) ||
          null}
        <div className={styles.right}>
          {(width > 700 && (
            <>
              <br />
              <br />
            </>
          )) ||
            null}
          <div className={classNames(styles.formInput, "disabled")}>
            <div className={styles.label}>
              <span>Nickname</span>
            </div>
            <input
              type="text"
              disabled
              className={styles.input}
              defaultValue={user?.username ?? ""}
              onChange={(e) => {
                setErrorInput({ type: "", msg: "" });
              }}
              placeholder="Enter Nickname"
            />
          </div>
          {width > 700 && (
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Last Name</span>
              </div>
              <input
                type="text"
                className={styles.input}
                ref={lastNameRef}
                defaultValue={user?.lastName ?? ""}
                onChange={(e) => {
                  setForm((l) => ({ ...l, lastName: e.target.value }));
                }}
                placeholder="Enter Last Name"
              />
            </div>
          )}
        </div>

        {(width <= 700 && (
          <>
            <br />
          </>
        )) ||
          null}

        {(width <= 700 && (
          <button
            className={classNames("primarybutton", styles.submitButton)}
            onClick={() => handleChangeEmail()}
            disabled={loadingDetails}
          >
            {loadingDetails ? "..." : "Update Details"}
          </button>
        )) ||
          null}
      </div>

      {(!user?.ssoLogin && (
        <div className={classNames(styles.wrapper, styles.settings)}>
          <div className={styles.left}>
            <h4>change password</h4>
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
                  ref={newpassRef}
                  className={styles.input}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      newpass: e.target.value,
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
              {passValidation(form.newpass).map((item, index) => (
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

            {(width > 700 && (
              <button
                className={classNames("primarybutton", styles.submitButton)}
                disabled={loadingPass}
                onClick={handleChangePass}
              >
                {loadingPass ? "..." : "Update Password"}
              </button>
            )) ||
              null}
          </div>
          {(width <= 700 && (
            <>
              <br />
            </>
          )) ||
            null}
          <div className={styles.right}>
            {(width > 700 && (
              <>
                <br />
                <br />
              </>
            )) ||
              null}
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Current Password</span>
                {(errorInput.type === "password" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <div className={styles.passInput}>
                <input
                  type={passwordEye[0x1] ? "password" : "text"}
                  ref={passRef}
                  className={styles.input}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Enter Your Current Password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPasswordEye((l) => l.map((p, i) => (i === 0x1 ? !p : p)))
                  }
                >
                  {passwordEye[0x1] ? <EyeOpened /> : <EyeClosed />}
                </button>
              </div>
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Confirm Password</span>
                {(errorInput.type === "password" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <div className={styles.passInput}>
                <input
                  type={passwordEye[0x2] ? "password" : "text"}
                  ref={repassref}
                  className={styles.input}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password2: e.target.value,
                    })
                  }
                  placeholder="Repeat you current Password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPasswordEye((l) => l.map((p, i) => (i === 0x2 ? !p : p)))
                  }
                >
                  {passwordEye[0x2] ? <EyeOpened /> : <EyeClosed />}
                </button>
              </div>
            </div>
          </div>

          {(width <= 700 && (
            <>
              <br />
            </>
          )) ||
            null}

          {(width <= 700 && (
            <button
              className={classNames("primarybutton", styles.submitButton)}
              disabled={loadingPass}
              onClick={handleChangePass}
            >
              {loadingPass ? "..." : "Update Password"}
            </button>
          )) ||
            null}
        </div>
      )) ||
        null}

      <div className={classNames(styles.wrapper, styles.settings)}>
        <div className={styles.left}>
          <h4>Main</h4>

          <div className={styles.switcher}>
            <label className="toggleswitch">
              <input
                defaultChecked={!!localStorage.getItem("sounds_enabled")}
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    localStorage.setItem("sounds_enabled", "true");
                  } else {
                    localStorage.removeItem("sounds_enabled");
                  }

                  updateMainState({
                    soundsenabled: e.target.checked,
                  });
                }}
              />
              <span className="slider round"></span>
            </label>
            <span>Sound on site</span>
          </div>
        </div>
        <div className={styles.right}></div>
      </div>
    </>
  );
};

SettingsPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <ProfilePage>{page}</ProfilePage>
    </Layout>
  );
};

export default SettingsPage;
