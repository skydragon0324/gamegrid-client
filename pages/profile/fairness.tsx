import CopyIcon from "@/svgs/copy.svg";
import ProfilePage, { ExternalPage } from ".";
import { useRef, useState } from "react";
import styles from "@/parts/profile/profile.module.scss";
import { Layout } from "@/components/layout/Layout";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { StateInterface } from "mredux";
import { MainReducer } from "mredux/reducers/main.reducer";
import { updateCurrentClientSeed } from "@/utils/api.service";
import Loader from "@/components/loader/Loader";
import { useWindowSize } from "@/hooks/windowSize";
import { handleErrorRequest } from "@/utils/handler";
import toast from "react-hot-toast";

export const ProbabilityPage: ExternalPage = () => {
  const { width } = useWindowSize();
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useSelector<StateInterface, MainReducer>(
    (state) => state.mainReducer
  );
  const [newClientSeed, setNewClientSeed] = useState<string>(
    user?.seeds?.currentClientSeed || ""
  );

  const [errorInput, setErrorInput] = useState<{ type: string; msg: string }>({
    type: "",
    msg: "",
  });

  const currentClientSeedRef = useRef<HTMLInputElement>(null);
  const previousClientSeedRef = useRef<HTMLInputElement>(null);
  const currentPrivateSeedRef = useRef<HTMLInputElement>(null);
  const previousPrivateSeedRef = useRef<HTMLInputElement>(null);
  const futurePrivateSeedHashedRef = useRef<HTMLInputElement>(null);
  const previousPrivateSeedHashedRef = useRef<HTMLInputElement>(null);
  const handleChangeCurrentClientSeed = async () => {
    try {
      setLoading(true);
      const res = await updateCurrentClientSeed(newClientSeed);
      if (res && res.seeds?.currentClientSeed) {
        toast.success("Changed client seed");
      }
      console.log(res);
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
      handleErrorRequest(error);
    }
  };

  const copyInputContent = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.select();
      document.execCommand("copy");
      toast.success("Copied to clipboard");
    }
  };

  return (
    <>
      <div className={classNames(styles.wrapper, styles.fairness)}>
        <p>
          The Provably Fair algorithm ensures that every roll result on our
          website is verifiable, transparent, and equally random for all users.
          We are committed to honesty and fairness, and we guarantee that our
          system cannot be cheated.{" "}
        </p>
        <p>
          With the Provably Fair system, you can verify the history of chances
          and box prices, as well as the fairness of your winnings. Our special
          drawing algorithm uses three main variables - the Server seed, Nonce
          and Client seed to ensure fairness.{" "}
        </p>
        <p>
          Before each game, the client and server data are used to calculate the
          result, which is immediately visible to the player upon opening the
          case. You will receive an encrypted hash of the server seed, which
          guarantees 100% fairness. The initial and final hash values will
          match, proving that our website does not interfere with the results.
        </p>
        <p>
          To check the functionality of the Provably Fair system, you will need
          the following data. <br />
          To verify a round result, you can use our{" "}
          <a
            href="https://fairness.loot.gg"
            target="blank"
            className={styles.external}
          >
            External tool
          </a>
          .
        </p>
      </div>
      <div className={classNames(styles.wrapper, styles.fairness)}>
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <h2>Current seed pair</h2>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Client seed</span>
                {(errorInput.type === "currentClientSeed" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                // className={styles.input}
                ref={currentClientSeedRef}
                value={newClientSeed}
                onChange={(e) => {
                  setNewClientSeed(e.target.value);
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter client seed"
              />
              <button
                // className={styles.applyButton}
                onClick={handleChangeCurrentClientSeed}
              >
                {loading ? <Loader radius={16} /> : <span>Change</span>}
              </button>
              <button
                className={styles.copyButton}
                onClick={() => copyInputContent(currentClientSeedRef)}
              >
                <CopyIcon />
              </button>
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Server seed (hashed)</span>
                {(errorInput.type === "currentPrivateSeedHashed" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                ref={currentPrivateSeedRef}
                value={user?.seeds?.currentPrivateSeedHashed}
                className={styles.input}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter server seed"
              />
              <button
                className={styles.copyButton}
                onClick={() => copyInputContent(currentPrivateSeedRef)}
              >
                <CopyIcon />
              </button>
              {/* <button className={styles.applyButton}>
                <span>Reveal</span>{" "}
              </button> */}
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Future server seed (hashed)</span>
                {(errorInput.type === "future_server_seed" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                ref={futurePrivateSeedHashedRef}
                className={styles.input}
                value={user?.seeds?.futurePrivateSeedHashed}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter future server seed"
              />
              <button
                className={styles.copyButton}
                onClick={() => copyInputContent(futurePrivateSeedHashedRef)}
              >
                <CopyIcon />
              </button>
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Nonce</span>
                {(errorInput.type === "currentNonce" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                className={styles.input}
                disabled
                value={user?.seeds?.currentNonce}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter Nonce"
              />
            </div>
          </div>
          <div className={styles.formWrapper}>
            <h2>Previous seed pair</h2>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Client seed</span>
                {(errorInput.type === "previousClientSeed" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                ref={previousClientSeedRef}
                value={user?.seeds?.previousClientSeed}
                className={styles.input}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter client seed"
              />
              <button
                className={styles.copyButton}
                onClick={() => copyInputContent(previousClientSeedRef)}
              >
                <CopyIcon />
              </button>
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Server seed</span>
                {(errorInput.type === "previousPrivateSeed" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                ref={previousPrivateSeedRef}
                value={user?.seeds?.previousPrivateSeed}
                className={styles.input}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter server seed"
              />
              <button
                className={styles.copyButton}
                onClick={() => copyInputContent(previousPrivateSeedRef)}
              >
                <CopyIcon />
              </button>
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Server seed hashed</span>
                {(errorInput.type === "previousPrivateSeedHashed" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                ref={previousPrivateSeedHashedRef}
                className={styles.input}
                value={user?.seeds?.previousPrivateSeedHashed}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter future server seed"
              />
              <button
                className={styles.copyButton}
                onClick={() => copyInputContent(previousPrivateSeedHashedRef)}
              >
                <CopyIcon />
              </button>
            </div>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>Previous Nonce</span>
                {(errorInput.type === "previousNonce" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                className={styles.input}
                disabled
                value={user?.seeds?.previousNonce}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter nonce"
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className={classNames(styles.wrapper, styles.fairness)}>
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <h2>Verify opening</h2>
            <div className={styles.formInput}>
              <div className={styles.label}>
                <span>ID</span>
                {(errorInput.type === "id" && (
                  <>
                    -<span className={styles.error}>{errorInput.msg}</span>
                  </>
                )) ||
                  null}
              </div>
              <input
                type="text"
                className={styles.input}
                onChange={(e) => {
                  setErrorInput({ type: "", msg: "" });
                }}
                placeholder="Enter your ID"
              />
              <button className={styles.applyButton}>
                <span>Apply</span>{" "}
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

ProbabilityPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <ProfilePage>{page}</ProfilePage>
    </Layout>
  );
};

export default ProbabilityPage;
