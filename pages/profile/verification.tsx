import PassportIcon from "@/svgs/passport.svg";
import ProfilePage, { ExternalPage } from ".";
import { ReactNode, useEffect, useState } from "react";
import styles from "@/parts/profile/profile.module.scss";
import { Layout } from "@/components/layout/Layout";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import toast from "react-hot-toast";
import { checkKYC, startKYC, userKycStatus } from "@/utils/api.service";
import Badge from "@/svgs/badge.svg";
import VerifiedBadge from "@/svgs/verified-badge.svg";
import Oldloading from "@/svgs/old-loading.svg";
import { updateMainState } from "@/utils/updateState";

declare const ComplyCube: any;

interface ComplyCubeResult {
  documentCapture: {
    documentId: string;
    documentType: string;
  };
  faceCapture: {
    livePhotoId: string;
  };
}

export const VerificationPage: ExternalPage = () => {
  const { user, kycStatus } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );

  useEffect(() => {
    if (!document.getElementById("complycube-script")) {
      const script = document.createElement("script");
      script.src = "https://assets.complycube.com/web-sdk/v1/complycube.min.js";
      script.id = "complycube-script";
      document.body.appendChild(script);
    }
  }, []);

  let complycube: any;
  const startVerification = async () => {
    try {
      const script = document.getElementById(
        "complycube-script"
      ) as HTMLScriptElement;
      if (script && document.getElementById("complycube-mount")) {
        if (!user) {
          toast.error("You must be logged in to verify your account");
          return;
        }

        if (!user.firstName || !user.lastName) {
          toast.error(
            "You must update your profile before verifying your account, please update first name and last name"
          );
          return;
        }

        const kycStart = await startKYC(user.firstName, user.lastName);

        console.log({ kycStart });

        complycube = ComplyCube.mount({
          token: kycStart.token,
          useModal: true,
          customUI: {
            colors: {
              primary: "yellow",
              secondary: "blue",
            },
          },
          onComplete: async (result: ComplyCubeResult) => {
            console.log({ result });
            try {
              if (
                !result ||
                !result?.documentCapture?.documentId ||
                !result?.faceCapture.livePhotoId
              )
                return;
              const currentUserCheckKYC = await checkKYC(
                result.documentCapture.documentId,
                result.faceCapture.livePhotoId
              );
              console.log({ currentUserCheckKYC });

              const currentUserKYCStatus = await userKycStatus();
              if (currentUserKYCStatus.status) {
                updateMainState({
                  kycStatus: currentUserKYCStatus,
                  user: { ...user, kycVerified: true },
                });
              }
              console.log(currentUserKYCStatus);
            } catch (error) {
              console.log("onComplete", error);
              toast.error("Something went wrong, please try again later");
            }
          },
          onModalClose: () => {
            complycube.updateSettings({ isModalOpen: false });
          },
          onError: function ({ type, message }: any) {
            console.log({ type, message });
            toast.error("Something went wrong, please try again later");
          },
        });
        console.log({ complycube });
      } else {
        console.error("ComplyCube script not loaded or container not found");
        toast.error("Something went wrong, please try again later");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again later");
    }
  };

  console.log({ user, kycStatus });

  return (
    <>
      <div className={classNames(styles.wrapper, styles.verification)}>
        <h2>{user?.kycVerified ? "Verified Account" : "Unverified Account"}</h2>
        <p>
          Unlock additional features, increased limits and much more when you
          verify your account.
        </p>

        <div className={styles.liner}>
          <div className={styles.left}>
            <PassportIcon />
            <span className={styles.text}>
              <h3>VERIFICATION</h3>

              {user?.kycVerified ? (
                <p>
                  You have successfully passed the verification! Now you can use
                  all of the functions of the site. Enjoy!
                </p>
              ) : kycStatus?.status === "pending" ? (
                <p>
                  Your document is currently under review. We are checking your
                  document and will update you shortly.
                </p>
              ) : kycStatus?.status === "failed" ? (
                <p style={{ color: "#F04438" }}>
                  We’re sorry, but your verification has been rejected. Please
                  check the information provided and try again.
                </p>
              ) : (
                <p>
                  You have not yet been verified by Loot.gg. To use all the
                  functions of the site, you need to confirm your identity.
                </p>
              )}
            </span>
          </div>
          {!user?.kycVerified && (
            <div className={styles.right}>
              <span className={styles.text}>
                <p>Verification time takes</p>
                <p>1-2 days</p>
              </span>
              <button
                className={classNames("primarybutton", styles.buttonverify)}
                onClick={startVerification}
              >
                <Badge />
                Verify
              </button>
            </div>
          )}
          {user?.kycVerified && (
            <div className={styles.verified}>
              <VerifiedBadge />
              <div className={styles.verifiedText}>Account verified</div>
            </div>
          )}
          {!user?.kycVerified && kycStatus?.status === "pending" && (
            <div className={styles.verified}>
              <Oldloading />
              <div className={styles.verifiedText} style={{ color: "#FDB022" }}>
                Your documents are being verified.
              </div>
            </div>
          )}
        </div>
        <div id="complycube-mount" style={{ color: "#fff" }}></div>
      </div>
    </>
  );
};

VerificationPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <ProfilePage>{page}</ProfilePage>
    </Layout>
  );
};

export default VerificationPage;
