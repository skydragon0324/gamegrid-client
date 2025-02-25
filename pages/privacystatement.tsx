import React, { FC, ReactNode, useEffect } from "react";
import styles from "@/parts/terms/terms.module.scss";
import Layout from "@/components/layout/Layout";

export type ExternalPage<M = {}, L = {}> = FC<L> &
  M & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

const CookiePrivacyPage: ExternalPage<{}, { children?: ReactNode }> = () => {
  return (
    <div className={styles.container}>
      <br />
      <br />
      <br />
      <h1
        style={{
          textAlign: "left",
          textTransform: "uppercase",
          fontSize: "36px",
        }}
      >
        Privacy Statement
      </h1>
      <br />
      <br />
      <h2>Commitment to Privacy</h2>

      <p>
        At Loot GG, your privacy is our priority. We are committed to protecting
        your personal information and being transparent about how we collect,
        use, and share your data.
      </p>
      <br />
      <h2>Collection of Information</h2>

      <p>
        We collect information that you provide to us directly, such as when you
        create an account, use our services, or contact us for support. We also
        collect some information automatically, like when you navigate through
        our site, which may include cookies and other tracking technologies.
      </p>
      <h2>Use of Personal Information</h2>
      <p>
        The personal information we collect allows us to provide you with our
        services, improve your user experience, and communicate with you
        effectively. We may use your data to:
      </p>
      <ul>
        <li> Process transactions and send notices about your transactions.</li>
        <li> Resolve disputes, collect fees, and troubleshoot problems.</li>

        <li>
          Prevent potentially prohibited or illegal activities and enforce our
          User Agreement.
        </li>
        <li>
          Customize, measure, and improve our services and the content and
          layout of our website.
        </li>
        <li>
          Compare information for accuracy and verify it with third parties.
        </li>
      </ul>

      <br />

      <h2>Sharing of Your Information</h2>

      <p>
        Loot GG does not share your personal information with third parties for
        their marketing purposes without your explicit consent. We may share
        your information with:
      </p>
      <ul>
        <li> Service providers who perform services on our behalf.</li>
        <li>
          {" "}
          Law enforcement or other governmental entities if required by law.
        </li>
      </ul>
      <br />
      <h2>Security of Your Information</h2>

      <p>
        We implement a variety of security measures to maintain the safety of
        your personal information when you place an order or enter, submit, or
        access your personal information.
      </p>
      <br />
      <h2>Access to Your Information</h2>
      <p>
        You may access, review, and change your personal information by logging
        into your account on our website or by contacting customer service.
      </p>
      <br />
      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at: <br /> Email: support@gamegrid.co <br /> Address: --
      </p>
    </div>
  );
};

CookiePrivacyPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default CookiePrivacyPage;
