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
      <h2>Loot GG Non-EU Terms of Service</h2>
      <h3 style={{ margin: "unset" }}>Last updated: 20/02/2024</h3>
      <br />
      <br />
      <h2>Introduction</h2>

      <p>
        Welcome to Loot GG. Your privacy is critically important to us. Loot GG
        is committed to respecting your privacy and protecting your personal
        data, which is any information that is capable of identifying you as an
        individual person. This Privacy Policy describes how we handle and
        protect your personal data in connection with Loot GG's business
        activities, like registration, gaming, and marketing, in accordance with
        applicable laws and regulations.
      </p>
      <br />
      <h2>Information We Collect</h2>

      <p>
        When you interact with our website and services, we may collect
        information about you in the following ways:
      </p>
      <ul>
        <li>
          {" "}
          Information You Provide Directly: This includes personal information
          you provide when you sign up for Loot GG, participate in our online
          games, or make purchases. It may include your name, email address,
          shipping address, payment information, and any other details necessary
          for the transaction.
        </li>
        <li>
          {" "}
          Information Collected Automatically: We collect some information
          automatically when you visit Loot GG. This information may include
          your IP address, device information, browser types, and information
          collected through cookies and other tracking technologies.
        </li>
      </ul>

      <br />
      <h2>How We Use Your Information</h2>

      <p>
        We may use the information we collect for several purposes, including:
      </p>
      <ul>
        <li> To provide you with Loot GG services.</li>
        <li>To personalize your experience with our services.</li>
        <li>
          To communicate with you about your account or transactions with us.
        </li>
        <li>
          To provide customer support and respond to your requests and
          inquiries.
        </li>
        <li>
          To improve and optimize the operation and performance of our services.
        </li>
        <li>To detect and prevent fraud and abuse.</li>
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

      <h2>Data Security</h2>
      <p>
        We implement technical and organizational measures to ensure a level of
        security appropriate to the risk to the personal information we process.
        These measures are aimed at ensuring the ongoing integrity and
        confidentiality of personal information.
      </p>
      <br />

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal information we keep about you.</li>
        <li>
          Request that we correct, amend, or delete your personal information.
        </li>
        <li>
          Object to certain types of processing or request a limitation on
          processing.
        </li>
        <li>Request the portability of your personal information.</li>
      </ul>

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
