import React, { FC, ReactNode, useEffect } from "react";
import styles from "@/parts/terms/terms.module.scss";
import Layout from "@/components/layout/Layout";

export type ExternalPage<M = {}, L = {}> = FC<L> &
  M & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

interface CookieType {
  cookie: string;
  cookieName: string;
  principalDomains: string;
  purpose: string;
  expiration: string;
}

const necessary_cookies_header = [
  "COOKIE",
  "COOKIE NAME",
  "PRINCIPAL DOMAINS",
  "PURPOSE",
  "EXPIRATION",
];

const necessary_cookies: CookieType[] = [
  {
    cookie: "Random Session ID",
    cookieName: "random_session_id",
    principalDomains: "earnmoney.gg",
    purpose: "Session ID for user tracking",
    expiration: "Session",
  },
  {
    cookie: "Unique User ID",
    cookieName: "user_unique_id",
    principalDomains: "earnmoney.gg",
    purpose: "Unique identifier for a returning user.",
    expiration: "1 year",
  },
  {
    cookie: "Event Tracking",
    cookieName: "event_preferences",
    principalDomains: "earnmoney.gg",
    purpose: "Stores user’s event tracking preferences.",
    expiration: "1 year",
  },
  {
    cookie: "Preferences",
    cookieName: "",
    principalDomains: "",
    purpose: "",
    expiration: "",
  },
  {
    cookie: "Last Visited Page",
    cookieName: "last_visited_page",
    principalDomains: "earnmoney.gg",
    purpose: "Saves the URL of the last visited page.",
    expiration: "1 year",
  },
  {
    cookie: "Authentication Token",
    cookieName: "__Secure-next-auth.session-token",
    principalDomains: "earnmoney.gg",
    purpose: "Saves the URL of the last visited page.",
    expiration: "1 year",
  },
  {
    cookie: "Login Callback",
    cookieName: "__Secure-next-auth.callback-ur",
    principalDomains: "earnmoney.gg",
    purpose: "Callback URL for login.",
    expiration: "Session",
  },
  {
    cookie: "CSRF Token",
    cookieName: "__Host-next-auth.csrf-token",
    principalDomains: "earnmoney.gg",
    purpose: "CSRF token used to prevent Cross-Site Request Forgery attacks",
    expiration: "Session",
  },
];

const analytical_cookies: CookieType[] = [
  {
    cookie: "Rudderstack User ID",
    cookieName: "rudder_{id}_id",
    principalDomains: "rudderstack.com",
    purpose: "Rudderstack specific user tracking",
    expiration: "1 year",
  },
  {
    cookie: "Rudderstack Anonymous ID",
    cookieName: "rudder_anon_id",
    principalDomains: "rudderstack.com",
    purpose: "Rudderstack anonymous user tracking.",
    expiration: "1 year",
  },
];

const CookiePrivacyPage: ExternalPage<{}, { children?: ReactNode }> = () => {
  return (
    <div className={styles.container}>
      <h1>Cookies Policy</h1>

      <h2 style={{ textAlign: "center" }}>Last updated: September 14, 2023</h2>

      <p>
        This Cookies Policy explains what Cookies are and how We use them. You
        should read this policy so You can understand what type of cookies We
        use, or the information We collect using Cookies and how that
        information is used.
      </p>

      <p>
        Cookies do not typically contain any information that personally
        identifies a user, but personal information that we store about You may
        be linked to the information stored in and obtained from Cookies. For
        further information on how We use, store and keep your personal data
        secure, see our Privacy Policy.
      </p>

      <p>
        We do not store sensitive personal information, such as mailing
        addresses, account passwords, etc. in the Cookies We use.
      </p>

      <h2>Interpretation and Definitions</h2>

      <h3>Interpretation</h3>
      <p>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>

      <h3>Definitions</h3>
      <p>For the purposes of this Cookies Policy:</p>
      <ul>
        <li>
          {" "}
          <strong>Company</strong> (referred to as either "the Company", "We",
          "Us" or "Our" in this Cookies Policy) refers to GameGrid, Inc , 251
          Little Falls Drive Wilmington, Delaware 19808 support@gamegrid.co.
        </li>
        <li>
          {" "}
          <strong>Cookies</strong> means small files that are placed on Your
          computer, mobile device or any other device by a website, containing
          details of your browsing history on that website among its many uses.
        </li>
        <li>
          {" "}
          <strong>Website</strong> refers to EarnMoney, accessible from
          EarnMoney.gg
        </li>
        <li>
          {" "}
          <strong>You</strong> means the individual accessing or using the
          Website, or a company, or any legal entity on behalf of which such
          individual is accessing or using the Website, as applicable.
        </li>
      </ul>

      <h2>The use of the Cookies</h2>

      <h3>Type of Cookies We Use</h3>
      <p>
        Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
        remain on your personal computer or mobile device when You go offline,
        while Session Cookies are deleted as soon as You close your web browser.
      </p>

      <p>
        We may use both session and persistent Cookies for the purposes set out
        below:
      </p>

      <div style={{ marginLeft: "50px" }}>
        <h4>Strictly Necessary / Essential Cookies</h4>
        <p>Type: Session Cookies</p>
        <p>
          Purpose: These Cookies are essential to provide You with services
          available through the Website and to enable You to use some of its
          features. They help to authenticate users and prevent fraudulent use
          of user accounts. Without these Cookies, the services that You have
          asked for cannot be provided, and We only use these Cookies to provide
          You with those services.
        </p>

        <h4>Functionality Cookie</h4>
        <p>Type: Persistent Cookies</p>
        <p>
          Purpose: These Cookies allow us to remember choices You make when You
          use the Website, such as remembering your login details or language
          preference. The purpose of these Cookies is to provide You with a more
          personal experience and to avoid You having to re-enter your
          preferences every time You use the Website.
        </p>

        <h4>Tracking and Performance Cookies</h4>
        <p>Type: Persistent Cookies</p>
        <p>
          Purpose: These Cookies are used to track information about traffic to
          the Website and how users use the Website. The information gathered
          via these Cookies may directly or indirectly identify you as an
          individual visitor. This is because the information collected is
          typically linked to a pseudonymous identifier associated with the
          device you use to access the Website. We may also use these Cookies to
          test new advertisements, pages, features or new functionality of the
          Website to see how our users react to them.
        </p>

        <h4>Targeting and Advertising Cookies</h4>
        <p>Type: Persistent Cookies</p>
        <p>
          Purpose: These Cookies track your browsing habits to enable Us to show
          advertising which is more likely to be of interest to You. These
          Cookies use information about your browsing history to group You with
          other users who have similar interests. Based on that information, and
          with Our permission, third party advertisers can place Cookies to
          enable them to show adverts which We think will be relevant to your
          interests while You are on third party websites
        </p>

        <h4>Third- Party Cookies</h4>
        <p>
          Our website may contain helpful but non-essential features or plug-ins
          enabling third-party services that use cookies, such as social network
          connectors, maps, advertising networks, or web traffic analysis
          services. These cookies may enable visitor identification across
          websites and over time. We do not control the third party's use of
          these cookies, their duration, or their ability to share information
          with other third parties. Please review each party's cookie disclosure
          before consenting to this use category.
        </p>
      </div>

      <p>
        Our Privacy Policy outlines our procedures for handling any personal
        information collected, stored, or used by our first-party cookies. We
        rely on this legal basis to process personal data collected through our
        first party cookies.
      </p>

      <p>
        With the exception of strictly necessary cookies, all first-party
        cookies employed by this website will expire no later than two years
        after your most recent visit to our website. Third-party cookies have
        expiration periods determined by their respective owners.
      </p>

      <p>
        Please consult the Cookie Table below for a comprehensive list of
        individual first-party and third-party cookies that may be utilized on
        this website, along with their specific purposes.
      </p>

      <h3>International Data Transfers</h3>
      <p>
        The cookies we use might process, store, or transfer personal
        information and data to a country outside of your own, which may have
        privacy laws offering different, possibly lower, levels of protection.
        Your consent to our cookie usage implies your agreement to this
        transfer, storage, or processing. To learn more about the location of
        each third-party cookie provider, please refer to their respective
        policies.
      </p>

      <h3>Your Choices Regarding Cookies</h3>
      <p>
        You consent to our use of cookies when you sign up through our site. If
        you do not consent to our use of Cookies, you may not use our Website.
      </p>
      <p>
        Most web browsers allow you to directly block all cookies, or just
        third-party cookies, through your browser settings. Using your browser
        settings to block all cookies, including strictly necessary ones, may
        interfere with proper site operation.
      </p>
      <p>
        If You'd like to delete Cookies or instruct your web browser to delete
        or refuse Cookies, please visit the help pages of your web browser.
      </p>

      <div style={{ marginLeft: "50px" }}>
        <p style={{ textJustify: "unset" }}>
          For the Chrome web browser, please visit this page from Google:
          https://support.google.com/accounts/answer/32050
        </p>
        <p style={{ textJustify: "unset" }}>
          For the Internet Explorer web browser, please visit this page from
          Microsoft: http://support.microsoft.com/kb/278835
        </p>
        <p style={{ textJustify: "unset" }}>
          For the Firefox web browser, please visit this page from Mozilla:
          https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
        </p>
        <p style={{ textJustify: "unset" }}>
          For the Safari web browser, please visit this page from Apple:
          https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
        </p>
      </div>

      <p>
        For any other web browser, please visit your web browser's official web
        pages.
      </p>

      <h3>Changes to Our Cookie Uses</h3>
      <p>
        Any modifications to how we utilize cookies will be posted on this page,
        and our website will indicate that we have updated this cookie notice.
        If these changes significantly affect how we use cookies, we will issue
        a notice on our website and seek your consent for the substantially
        different usage. We encourage you to visit this page regularly to stay
        informed about updates or changes to our cookie use notice.
      </p>
      <p>
        Contact Information Please feel free to send any questions, comments, or
        requests related to this cookie use notice to:
      </p>

      <a href="support@gamegrid.co">support@gamegrid.co</a>
      <p>GameGrid</p>
      <p>251 Little Falls Drive</p>
      <p>Wilmington, Delaware 19808</p>

      <h3>Contact Us</h3>
      <p>
        If you have any questions about this Cookies Policy, You can contact us:
      </p>
      <ul>
        <li>
          By email: <a href="support@gamegrid.co"> support@gamegrid.co</a>
        </li>
      </ul>

      <h3>Cookies Used</h3>
      <p>
        The table below lists all cookies potentially in use on the EarnMoney.gg
        website. Without the use of these cookies, you may not be able to use
        some of the features of websites. The table will be updated from time to
        time as our website changes and evolves. Please check back regularly to
        review any new cookie uses.
      </p>
      <p>Last modified: September 8, 2023</p>
      <p>Strictly Necessary Cookies</p>

      <div className={styles.wrapper}>
        <table>
          <thead>
            {necessary_cookies_header.map((header, i) => (
              <th key={i}>
                <span>{header}</span>
              </th>
            ))}
          </thead>
          <tbody>
            {necessary_cookies.map((cookie, i) => (
              <tr>
                <td>{cookie.cookie}</td>
                <td>{cookie.cookieName}</td>
                <td>{cookie.principalDomains}</td>
                <td>{cookie.purpose}</td>
                <td>{cookie.expiration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Analytical/performance cookies</p>

      <div className={styles.wrapper}>
        <>
          <table>
            <thead>
              {necessary_cookies_header.map((header, i) => (
                <th key={i}>
                  <span>{header}</span>
                </th>
              ))}
            </thead>
            <tbody>
              {analytical_cookies.map((cookie, i) => (
                <tr>
                  <td>{cookie.cookie}</td>
                  <td>{cookie.cookieName}</td>
                  <td>{cookie.principalDomains}</td>
                  <td>{cookie.purpose}</td>
                  <td>{cookie.expiration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      </div>
    </div>
  );
};

CookiePrivacyPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default CookiePrivacyPage;
