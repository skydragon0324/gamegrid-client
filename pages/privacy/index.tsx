import React, { FC, ReactNode, useEffect } from "react";
import styles from "@/parts/terms/terms.module.scss";
import Layout from "@/components/layout/Layout";

export type ExternalPage<M = {}, L = {}> = FC<L> &
  M & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

const PrivacyPage: ExternalPage<{}, { children?: ReactNode }> = () => {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>

      <h2 style={{ textAlign: "center" }}>Last Updated: 1/1/24</h2>

      <h2 style={{ textAlign: "center" }}>Introduction</h2>

      <p>
        BLOXLEGENDS LIMITED. is the owner and operator of{" "}
        <a href="/">www.loot.gg</a> and all affiliated websites and mobile
        versions (the “Site” or we, us, our, ours, etc.). We respect your
        privacy and are committed to protecting it through this Privacy Policy
        (the “Policy”). This Policy describes the types of personal information
        we may collect from you, the user, (you, your, yours, etc.) or that you
        may provide to us when you use the services offered by us on the Site
        (the “Services”), and our practices for collecting, using, keeping,
        protecting, and disclosing your personal information.
      </p>

      <p>
        Please read this Policy carefully to understand our practices regarding
        your personal information and how we will treat it. If you do not agree
        with this Policy, your sole choice is to leave the Site. By accessing or
        using the Site, you agree to this Policy and consent to our collection,
        use, disclosure, retention, and protection of your information as
        described in this Policy.
      </p>

      <p>
        We reserve the right to revise, amend, or modify this Policy at any time
        and in any manner. We will consider your continued use of the Site after
        we make changes to this Policy as your acceptance of the changes, so you
        must periodically revisit this Policy and check the “Last Updated” date
        above. If changed, this Policy has been updated or edited, and the
        updated or edited version supersedes any prior versions immediately upon
        posting.
      </p>

      <h2>1. How old do you have to be to use the Services?</h2>
      <p>
        We prohibit anyone under the age of eighteen (18) from accessing the
        Site or using the Services. We do not knowingly market to or collect or
        solicit any information from or about anyone under the age of eighteen
        (18). If you are under the age of eighteen (18), you must not submit
        information to us and must immediately leave the Site. If we learn that
        we have collected information from or about a person under the age of
        eighteen (18), we will delete that information as quickly as possible.
        If you believe that we might have such information, please contact us at
        info@loot.g
      </p>

      <h2>2. What types of information do we collect about you?</h2>
      <p>
        We may collect several types of “personal information” from and about
        users of the Site, including any information that personally identifies
        you or that could be reasonably linked to you or your household,
        including your name; alias; username or other unique personal
        identifier, password, and security questions and answers; postal,
        billing, and shipping address; email address; IP address and other
        Internet network activity information such as browsing history, search
        history, and online interactions; device ID; geolocation data; driver’s
        license, passport, or other identification card number; credit card or
        banking information; cryptocurrency wallet identifier, and/or order
        history. However, this Policy does not apply to personal information
        that has been de-identified or that is otherwise publicly available.
      </p>

      <h2>3. How do we collect your personal information?</h2>
      <p>
        We collect your personal information directly from you when you provide
        it to us, such as through:
      </p>
      <ul>
        <li>The account registration process;</li>
        <li>Your profile information or other posts;</li>
        <li>Your purchases, exchanges, and other financial transactions;</li>
        <li>Your search queries;</li>
        <li>Your linked social media accounts;</li>
        <li>Your responses to any surveys we ask you to complete;</li>
        <li>
          Your other communications and interactions with us, whether by contact
          form, phone, mail, email, text, or other means, including on
          third-party social media platforms; and
        </li>
        <li>
          Our technologies, including our servers, log files, cookies, pixel
          tags, and analytics services.
        </li>
      </ul>
      <p>
        We also collect your personal information automatically from your
        computer device or mobile phone and through cookies, web beacons, and
        other tracking technologies.
      </p>
      <p>
        This Policy does not apply to information collected by us offline or
        through any other means, or by any third party that is linked to or
        accessible through the Site
      </p>

      <h2>4. Do third parties collect my personal information on the Site?</h2>
      <p>
        Third parties including users, advertisers, content or application
        providers, and third-party plug-ins may provide materials to the site
        which use cookies, web beacons, or other tracking technologies to
        collect your personal information, including information about your
        online activities over time and across different websites and other
        online services. Those third parties may use this information to provide
        you with interest-based (behavioral) advertising or other targeted
        content. We do not control third-party tracking technologies or how
        third parties use them. Your use of third-party plug-ins are governed by
        the user terms and privacy policy of the third party that provided that
        plug-in. If you have any questions about an advertisement or plug-in,
        you should contact the responsible provider directly.
      </p>
      <p>
        Please be aware that we do not operate, control, or endorse third-party
        websites that may be linked on the Site, nor are we responsible for the
        content or privacy practices of third-party websites. We disclaim any
        responsibility for your personal information on third-party websites,
        and we do not make any warranties or representations that any
        third-party website (or even this Site) will function without error or
        interruption, that defects will be corrected, or that any third-party
        websites or their servers are free of viruses or other problems that may
        harm your computer. We encourage you to be aware when you leave the Site
        and to read the privacy policies of any third-party website that
        collects your personal information.
      </p>

      <h2>5. How do we use your personal information?</h2>
      <p>We may use your personal information:</p>

      <ul>
        <li>To provide you with access to the Site and use of the Services;</li>
        <li>
          To speed up the Services, such as by automatically updating your
          account information;
        </li>
        <li>To recognize you when you return to the Services;</li>
        <li>
          To personalize the Services according to your preferences and
          individual interests;
        </li>
        <li>To notify you about changes to the Services and our policies;</li>
        <li>
          To carry out our obligations and enforce our rights arising from any
          contracts between you and us, including this Policy and our [{" "}
          <a href="/terms">https://loot.gg/terms: Terms of Service Agreement</a>{" "}
          ];
        </li>
        <li>
          To monitor and analyze traffic and usage trends related to the
          Services;
        </li>
        <li>To verify the integrity and security of the Services;</li>
        <li>To improve the Services and provide customer service;</li>
        <li>
          To investigate and prevent unauthorized or prohibited uses of the
          Services;
        </li>
        <li>For marketing or advertising purposes; and</li>
        <li>For any other purpose with your consent.</li>
      </ul>

      <h2>6. Do we share your personal information with third parties?</h2>
      <p>
        We may share publicly available information and de-identified
        information with third parties without restriction. However, we may only
        disclose your personal information to:
      </p>

      <ul>
        <li>
          Our subsidiaries, affiliates, contractors, service providers, and
          other third parties as necessary to provide the Services to you;
        </li>
        <li>
          Potential buyers or other successors in the event of a merger, joint
          venture, assignment, divestiture, restructuring, reorganization,
          dissolution, or other sale or transfer of assets including bankruptcy,
          liquidation, or similar proceeding;
        </li>
        <li>
          Law enforcement authorities, government agencies, and private
          litigants, such as in response to lawful criminal, civil, or
          administrative process or discovery requests, subpoenas, court orders,
          writs, or reasonable requests of authorities or persons with the
          reasonable power to obtain such process;
        </li>
        <li>
          Any other party as necessary to identify, contact, or bring legal
          action against someone who may be violating our policies;
        </li>
        <li>
          Any other party to comply with a legal or tax obligation or to protect
          our legitimate interests;
        </li>
        <li>
          Any other party as necessary to protect the rights, property, or
          safety of us, our users, or the general public, including but not
          limited to disclosures for the purposes of fraud protection and credit
          risk reduction; and
        </li>
        <li>Any other party with your consent.</li>
      </ul>

      <h2>7. What choices do you have over your personal information</h2>
      <p>
        We strive to provide you with choices about the personal information you
        provide directly to us. You can always delete or restrict any personal
        information that you provided directly to us. We will delete any
        personal information that you have provided directly to us, if you
        request to permanently delete your account. However, we may retain your
        personal information for any use set forth herein. Further, we may
        refuse to accommodate any change if we believe doing so would violate
        any law or legal requirement or cause the information to be incorrect.
      </p>
      <p>
        We also strive to provide you with choices about the personal
        information that we collect from you automatically. You may refuse to
        accept cookies by activating the appropriate setting on your browser. To
        learn how you can manage your other cookies, visit
        <a href="www.allaboutcookies.org/manage-cookies/">
          www.allaboutcookies.org/manage-cookies/
        </a>
        . However, if you select this setting you may be unable to access
        certain parts of the Site. Unless you have adjusted your browser setting
        so that it will refuse cookies, we will issue cookies when you access
        the Site.
      </p>
      <p>
        Do Not Track (“DNT”) is a privacy preference that you can set in your
        browser. DNT is a way for you to inform websites and services that you
        do not want certain information about your browser history collected
        over time and across websites or online services. However, we do not
        recognize or respond to any DNT signals as the Internet industry works
        toward defining exactly what DNT means, what it means to comply with
        DNT, and a common approach to responding to DNT. For more information,
        visit <a href="https://allaboutdnt.com/">www.allaboutdnt.com</a>.
      </p>
      <p>
        We do not control third parties’ collection or use of your personal
        information to serve interest-based advertising. However, these third
        parties may provide you with ways to choose not to have your information
        collected or used in this way.
      </p>

      <h2>8. How long do we retain your personal information?</h2>
      <p>
        Except as otherwise permitted or required by applicable law or
        regulation, we will retain your personal information only for as long as
        necessary to fulfill any use of your personal information set forth
        herein. However, we reserve the right to retain publicly available
        information and de-identified information for any legitimate business
        purpose without further notice to you or your consent.
      </p>

      <h2>9. Is my personal information secure?</h2>
      <p>
        We are committed to data security, and we have implemented measures
        designed to secure your personal information from accidental loss and
        from unauthorized access, use, change, and disclosure. All information
        you provide to us is stored on our secure servers behind firewalls.
        However, you understand and agree that the transmission of your personal
        information over the Internet is not completely secure. While we do our
        best to protect your personal information, we cannot guarantee the
        security of your personal information transmitted through the Site. Any
        transmission of personal information is at your own risk. We are not
        responsible for circumvention of any privacy settings or security
        measures used by the Site.
      </p>

      <h2>10. State Privacy Rights</h2>
      <ul>
        <li>
          Your California Privacy Rights: We do not meet the triggers of
          California Civil Code §1798.83, because we do not disclose personal
          information to third parties for direct marketing purposes. We do not
          meet the triggers of the California Consumer Privacy Act, in part
          because we do not sell your personal information.
        </li>
        <li>
          Nevada: We do not meet the triggers of Nevada Revised Statute Chapter
          603A. While we do not sell your personal information, Nevada residents
          may submit an opt-out request to info@loot.gg which we will honor if
          we sell your personal information at a future date
        </li>
        <li>
          Virginia: We do not meet the triggers of Virginia’s Consumer Data
          Protection Act.
        </li>
        <li>
          Colorado: We do not meet the triggers of the Colorado Privacy Act.
        </li>
        <li>
          Connecticut: We do not meet the triggers of the Connecticut Data
          Privacy Act.
        </li>
        <li>
          Utah: We do not meet the triggers of the Utah Consumer Privacy Act.
        </li>
        <li>
          Florida: We do not meet the triggers of the Florida Digital Bill of
          Rights.
        </li>
      </ul>

      <h2>11. International Users</h2>
      <p>
        This Policy is intended to cover collection and processing of personal
        information within our home jurisdiction. Some countries may require
        stricter privacy policies than those described in this Policy. If you
        are accessing the Site from a foreign country, you understand and agree
        that your personal information may be transferred to, stored, and
        processed in our home jurisdiction or the jurisdiction of the third
        parties described herein, and that the data protection and other laws of
        our home jurisdiction or the jurisdiction of such third parties might
        not be as comprehensive as those in your country.
      </p>

      <h2>12. No Third-Party Rights</h2>
      <p>
        This Policy does not create rights enforceable by third parties or
        require disclosure of any personal information relating to users of the
        Services.
      </p>

      <div className={styles.center}>
        <p>
          © <a href="https://www.firstamendment.com/">Walters Law Group</a>{" "}
          (2023). All rights reserved.
        </p>
      </div>
    </div>
  );
};

PrivacyPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default PrivacyPage;
