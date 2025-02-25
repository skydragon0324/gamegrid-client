import React, { FC, ReactNode, useEffect } from "react";
import styles from "@/parts/terms/terms.module.scss";
import Layout from "@/components/layout/Layout";

export type ExternalPage<M = {}, L = {}> = FC<L> &
  M & {
    getLayout?: (page: ReactNode) => ReactNode;
  };

const TermsPage: ExternalPage<{}, { children?: ReactNode }> = () => {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>

      <p>
        BOXLEGENDS LIMITED. (“we, us, our, ours, etc.”) is the owner and
        operator of <a href="/">www.loot.gg</a>
        and any affiliated websites and related mobile versions and all services
        provided thereon (“Loot.gg”). These Terms of Service constitute a legal
        contract that establishes the relationship between you, the user, (“you,
        your, yours, etc.”) and us as it relates to your access to and use of
        Loot.gg, a gamified shopping platform where users may purchase virtual
        credits (“Credits”) which may be exchanged for loot boxes (“Boxes”)
        containing physical and digital goods and services (“Item(s)”) and/or
        experience points which advance the user’s level and allow the user to
        partake in additional features and experiences on Loot.gg (“Points”).
      </p>

      <p>
        By accessing or using Loot.gg, you accept and agree to our website
        policies, including these Terms of Service, and you certify to us that
        (a) you are eighteen (18) years of age or older, and are at least the
        age of majority in your jurisdiction, (b) you have the legal capacity to
        enter into and agree to these Terms of Service, (c) you are using
        Loot.gg freely, voluntarily, willingly, and for your own personal
        enjoyment, and (d) you will only provide accurate and complete
        information to us and promptly update this information as necessary to
        maintain its accuracy and completeness.
      </p>

      <p>
        We reserve the right to revise these Terms of Service at any time. You
        agree that we have this unilateral right, and that all modifications or
        changes are in force and enforceable immediately upon posting. The
        updated version supersedes any prior versions immediately upon posting,
        and the prior version is of no continuing legal effect unless the
        revised version specifically refers to the prior version and keeps the
        prior version or portions thereof in effect. We agree that if we change
        anything in these Terms of Service, we will change the “Last Updated”
        date at the top of these Terms of Service. You agree to re-visit this
        page on a frequent basis, and to use the “Refresh” or “Clear Cache”
        function on your browser when doing so. You agree to note the date
        above. If the “Last Updated” date remains unchanged from the last time
        you reviewed these Terms of Service, then you may presume that nothing
        in these Terms of Service has changed since the last time you visited.
        If the “Last Updated” date has changed, then you must review the updated
        Terms of Service in their entirety. You must agree to any updated Terms
        of Service or immediately cease use of Loot.gg. If you fail to review
        these Terms of Service as required to determine if any changes have been
        made, you assume all responsibility for such omission, and you agree
        that such failure amounts to your affirmative waiver of your right to
        review the updated terms. We are not responsible for your neglect of
        your legal rights.
      </p>

      <p>
        <strong>
          We are not a gambling service, we do not take or place illegal bets,
          and we do not recommend or encourage illegal gambling
        </strong>{" "}
        . Instead, we offer entertaining online lootboxes which do not trigger
        the prohibitions imposed by state and federal gambling laws. Gambling,
        whether in-person or online, is not legal in all areas. If you seek
        information regarding any illegal activity, you must leave Loot.gg
        immediately. You agree not to use Loot.gg if doing so would violate the
        laws of your state, province, or country. Please consult with your local
        authorities or legal advisors before participating in online gaming of
        any kind. It is your sole and absolute responsibility to comply with all
        applicable laws, and you assume all risk in using Loot.gg. Nothing
        published on Loot.gg shall be construed as legal advice on any issue.{" "}
        <strong>
          You assume all risk and responsibility for your access to and use of
          Loot.gg. We bear no responsibility for your access to or use of
          Loot.gg in connection with illegal gambling activities, and we do not
          condone illegal gambling. You understand and agree that Loot.gg is for
          entertainment purposes only. We make no guarantee that Loot.gg is
          legal in your jurisdiction
        </strong>
      </p>

      <h2>1. Accounts</h2>

      <h3>A. Registration</h3>
      <p>
        All users may register for a single account on Loot.gg, provided you
        meet the requirements set forth herein and otherwise abide by these
        Terms of Service. To purchase Credits, open Boxes, obtain Points, or
        make other purchases on Loot.gg, you must also provide a valid payment
        method. To withdraw Items or cryptocurrency from Loot.gg, we may require
        you to provide certain age and/or identity verification documentation,
        including a copy of a government-issued identification card, and to
        undergo and pass our age and/or identity verification procedures. To
        withdraw cryptocurrency from Loot.gg, you must also provide your wallet
        address.
      </p>

      <h3>B. Accuracy</h3>
      <p>
        If you fail to provide the required information, if we reasonably
        believe that you have provided false, misleading, inaccurate,
        incomplete, not current, or otherwise incorrect information to us, if
        you fail to promptly update such information to maintain its accuracy
        and completeness, or if we or any of our authorized agents have
        reasonable grounds to suspect that a violation of this provision has
        occurred, we may reject, suspend, or terminate your account, as well as
        subject you to criminal and civil liability. Acceptance of registration
        is subject to our sole discretion. While we may require you to provide
        additional information as necessary to verify the accuracy of your
        identity and the information you provide to us, you understand and agree
        that we do not sponsor or endorse any user.
      </p>

      <h3>C. No Account Sharing</h3>
      <p>
        You will not use, attempt to access, or ask for the login credentials
        for any third party’s account at any time. You will not allow any third
        party to access or use your account at any time, nor provide any third
        party with your login credentials. We will not be liable for any loss
        that you may incur as a result of any third party that uses your
        password or otherwise accesses your account, either with or without your
        knowledge. You will be liable for losses incurred by us or any third
        party due to release of account credentials to unauthorized persons.
      </p>

      <h3>D. Termination by You</h3>
      <p>
        You may delete your account by clicking “Delete Account” in your account
        settings. You will not assign, transfer, sell, or share your membership
        to Loot.gg. If you do, both you and any unauthorized user are jointly
        and severally liable for any fees that will be due.
      </p>

      <h3>E. Termination by Us</h3>
      <p>
        We may suspend or terminate your account, membership, and any licenses
        herein, at any time, for any reason, in our sole discretion, including
        if you violate these Terms of Service or if your account becomes
        inactive for more than six months. If we terminate your account, you
        will be responsible for all charges to your account at the time of
        termination, and any remaining balance or unwithdrawn Items on the
        account will become non-refundable and non-withdrawable. We are not
        responsible for preserving terminated account information which may be
        permanently deleted in our discretion.
      </p>

      <h2>2. Our Materials</h2>
      <p>
        We are the owner of all text, images, graphics, photographs, audio,
        video, buttons, icons, animations, data, messages, software, content,
        information, or materials on Loot.gg (“Materials”). You understand that
        all we are offering you is access to and use Loot.gg and the Materials,
        as we provide them from time to time. You need to provide your own
        access to the Internet, hardware, and software, and you are solely
        responsible for any fees that you incur to access or use Loot.gg. All
        users may access and use certain public areas of Loot.gg, free of
        charge. We grant all users a limited, nonexclusive, revocable, and
        nontransferable personal license to access and use only those Materials
        provided on free areas of Loot.gg for private, non-commercial purposes.
        This free license does not include a license to access or use paid areas
        of Loot.gg or the Materials therein. We also grant you a limited,
        nonexclusive, revocable, and nontransferable personal license to access
        and use Loot.gg and the Materials, as limited by your purchase of
        certain paid features and/or your user level. This paid license is for
        private, non-commercial purposes. We reserve the right to limit the
        amount of Materials viewed or features available to you. Your license to
        access and use Loot.gg, the Materials, and certain paid features is not
        a transfer of title. You will not copy or redistribute any Material, and
        you will prevent others from unauthorized access, use of, or copying of
        the Materials. You understand and agree that your submission of any
        user-generated materials to any chat room or other feature owned by a
        third party, including but not limited to Discord, shall be governed by
        the website policies of such third party.
      </p>

      <h2>3. Acceptable Use Policy</h2>

      <h3>A. Prohibited Uses for All Users</h3>
      <p>
        You agree that you will only use Loot.gg for purposes expressly
        permitted and contemplated by these Terms of Service. You may not use
        Loot.gg for any other purposes without our express prior written
        consent. Without our express prior written authorization, you will not:
      </p>

      <ul>
        <li>
          use Loot.gg for any purpose other than as offered by us, including in
          any way that is prohibited by these Terms of Service or that is
          violative of any applicable law, regulation, or treaty of any
          applicable governmental body, including:
          <ul>
            <li>laws prohibiting illegal gambling;</li>
            <li>
              intellectual property right laws protecting patents, copyrights,
              trademarks, trade secrets, and any other intellectual property
              right, including making, obtaining, distributing, or otherwise
              accessing illegal copies of copyrighted, trademarked, or patented
              content, deleting intellectual property right indications and
              notices, or otherwise manipulating identifiers in order to
              disguise the origin of your content;
            </li>
            <li>
              laws against obscene, lewd, defamatory, or libelous speech; and
            </li>
            <li>
              laws protecting confidentiality, privacy rights, publicity rights,
              or data protection.
            </li>
          </ul>
        </li>
        <li>
          fail to comply with orders, judgments, or mandates from courts of
          competent jurisdiction.
        </li>
        <li>
          link to Loot.gg on any third-party website in any way that is illegal,
          unfair, or damages or takes advantage of our reputation, including any
          link which establishes or suggests a form of association, approval, or
          endorsement by us where none exists.
        </li>
        <li>
          post, upload, or share any content (whether to Loot.gg or any feature
          operated by a third party but utilized by us, including any Discord or
          similar chatroom) that: (i) is sexual, harmful, inaccurate,
          threatening, abusive, vulgar, violent, indecent, harassing, hateful,
          menacing, scandalous, inflammatory, blasphemous, racially or
          ethnically offensive, likely to cause annoyance, intimidation, alarm,
          embarrassment, distress, discomfort, or inconvenience, otherwise
          objectionable or inappropriate; (ii) with the intent to extort money
          or other benefit from a third party in exchange for removal of the
          content; (iii) contains any employment ads or content which violates
          anti-discrimination laws; (iv) contains or collects the telephone
          numbers, street addresses, last names, email addresses, URLs,
          geographic location, or any other personal information about users or
          third parties without their consent, or, except as expressly
          authorized in these Terms of Service; (v) contains slang, acronyms,
          abbreviations, emojis, GIFs, or other media to communicate any
          activity that violates these Terms of Service; or (vi) contains
          antisocial, disruptive, or destructive behavior, including “doxing,”
          “bombing,” “flaming,” “spamming,” “flooding,” “trolling,” and
          “griefing” as those terms are commonly understood and used on the
          Internet, or engage in any other behavior that serves no purpose other
          than to harass, annoy, or offend users.
        </li>
        <li>access the accounts of other users.</li>
        <li>
          engage in any fraudulent activity, including impersonating any real or
          fictitious third party, falsely claiming affiliation with any third
          party, misrepresenting the source, identity, or contents of your
          user-generated content.
        </li>
        <li>
          engage in platform manipulation, including utilizing bots or other
          fraudulent means to gain an unfair advantage.
        </li>
        <li>
          circumvent, disable, damage, or otherwise interfere with the
          operations of Loot.gg, any user’s enjoyment of Loot.gg, or our
          security-related features or features that prevent, limit, restrict,
          or otherwise enforce limitations on the access to, use of, or copying
          of Loot.gg, by any means, including posting, linking to, uploading, or
          otherwise disseminating viruses, adware, spyware, malware, logic
          bombs, Trojan horses, worms, harmful components, corrupted data, or
          other malicious code, file, or program designed to interrupt, destroy,
          limit, or monitor the functionality of any computer software or
          hardware or any telecommunications equipment.
        </li>
        <li>
          reverse engineer, decompile, disassemble, or otherwise discover the
          source code of Loot.gg or any part of it, except and only if that
          activity is expressly permitted by applicable law despite this
          limitation.
        </li>
        <li>
          access or use any automated process (such as a robot, spider, scraper,
          or similar) to access or use Loot.gg in violation of our robot
          exclusion headers or to scrap all or a substantial part of the Loot.gg
          (other than in connection with bona fide search engine indexing or as
          we may otherwise expressly permit).
        </li>
        <li>
          modify, adapt, translate, or create derivative works based on Loot.gg,
          except and only if applicable law expressly permits that activity
          despite this limitation.
        </li>
        <li>
          commercially exploit or make available, mirror, or frame Loot.gg
        </li>
        <li>
          take any action that imposes or may impose (in our sole discretion) an
          unreasonable or disproportionately large load on our technology
          infrastructure or otherwise make excessive demands on it.
        </li>
        <li>
          attempt to do any of the acts described in this section or assist or
          permit any person in engaging in any of the acts described in this
          section.
        </li>
      </ul>

      <p>
        Engaging in any Prohibited Use will be considered a breach of these
        Terms of Service and may result in immediate suspension or termination
        of the user’s account and access to Loot.gg or the platform without
        notice, in our sole discretion. We may pursue any legal remedies or
        other appropriate actions against you if you engage in any of the above
        Prohibited Uses or otherwise violate these Terms of Service or any
        international, foreign, or domestic laws, including civil, criminal, or
        injunctive relief, forfeiture of Credits, Items, and Points, and
        termination of your account.
      </p>

      <h3>B. Law Enforcement</h3>
      <p>
        We will fully cooperate with law enforcement authorities or orders from
        courts of competent jurisdiction, requesting or directing us to disclose
        the identity or location of any user in breach of these Terms of
        Service, in accordance with our privacy policies, law enforcement
        policies, and applicable law or regulation. If we receive a subpoena,
        discovery request, production order, search warrant, or court order in
        response to your activities which causes us to incur legal expenses,
        costs, or fees for compliance, you agree to reimburse us for any such
        legal expenses, costs, and fees upon our request.
      </p>

      <h2>4. Billing and Withdrawals</h2>

      <h3>A. Purchases</h3>
      <p>
        If you provide valid and current payment information may purchase
        Credits which may be exchanged for Boxes and/or Points. Credits and
        Points have no cash value and are for entertainment purposes only.
        Unused Credits and Points are not eligible for any full or partial
        refunds. Credits and Points may be deleted from inactive accounts. We
        offer you the opportunity to purchase differing amounts of Credits for
        differing prices, and we may offer you the opportunity to exchange
        differing amounts of Credits for different Boxes or Points packages. The
        price of Credits and the exchange rate for any Box or VP package is
        displayed on Loot.gg. You may only purchase Credits for the currently
        displayed price, and you may only exchange Credits for Boxes or Points
        at the currently displayed rate. Credits cannot be exchanged for cash or
        cryptocurrency. We reserve the right to charge additional fees for
        access to or use of Loot.gg or any of our other features, and to change
        our fee structure at our discretion. All previous offers or discounts
        are unavailable once removed from Loot.gg.
      </p>
      <p>
        You agree to pay all fees or account charges related to any fees, taxes,
        charges, purchases, or upgraded features associated with your account,
        immediately when due in accordance with our stated billing policy, or
        that of our third-party billing agent. You acknowledge that the charge
        on your banking statement may display our company name, one of our brand
        names, or our third-party billing agent’s name. You understand and agree
        that you are responsible for all fees or penalties that are associated
        with your account. Your account will be deemed past due if it is not
        paid in full by the payment due date. Your card issuer agreement may
        contain additional terms with respect to your rights and liabilities as
        a card holder. You agree to pay all amounts due immediately upon
        cancellation or termination of your account.
      </p>

      <h3>B. Exchanges</h3>
      <p>
        From time to time, we may allow you to exchange Items that are revealed
        to be in a Box you purchased for cryptocurrency, other Items, or Points
        at the currently displayed rates. Exchanges of Items for cryptocurrency
        may be subject to processing or gas fees which are currently displayed
        on Loot.gg. By agreeing to exchange any Item for cryptocurrency, you
        agree to pay such fees or that such fees may be deducted from the amount
        of cryptocurrency transferred to you.
      </p>

      <h3>C. Points and Levels</h3>
      <p>
        There are two types of Points: Base Points and Bonus Points. Both Base
        Points and Bonus Points are used to calculate your level and the
        features available for you to use on Loot.gg and our third-party service
        providers, such as our Discord chatroom.
      </p>
      <p>
        Base Points are not available for direct purchase from Loot.gg. A set
        number of Base Points are automatically added to your account each time
        you purchase a Box. The specific number of Base Points to be added to
        your account varies from Box to Box but is displayed at the time of
        purchase. All previous offers are null and void once removed from
        Loot.gg. Base Points are generally not deductible from your account;
        however, we reserve the right to remove or revoke Base Points from your
        account if you violate these Terms of Service or if your purchase
        results in a chargeback.
      </p>
      <p>
        Bonus Points are available for direct purchase from Loot.gg. The price
        of Bonus Points is displayed on Loot.gg. You may only purchase Bonus
        Points at the currently displayed price, and you may only exchange
        Credits for Bonus Points at the currently displayed rate. All previous
        offers or discounts are unavailable once removed from Loot.gg. You may
        also obtain Bonus Points as the contents of a purchased Box. The
        specific number of Bonus Points revealed as the contents of a purchased
        Box varies from Box to Box, and the odds of revealing any number of
        Bonus Points as the contents of a purchased Box is displayed on the Box
        page. The number of Bonus Points within any Box may be positive or
        negative. If the Bonus Points revealed as the contents of a purchased
        Box are positive, those Bonus Points will be automatically added to your
        account after opening the Box. However, if the Bonus Points revealed as
        the contents of a purchased Box are negative, those Bonus Points will be
        deducted from the number of Bonus Points currently on your account.
        Negative Bonus Points will never reduce the amount of Base Points on
        your account.
      </p>
      <p>
        Your level is determined by your highest total combined amount of Base
        Points and Bonus Points at any point in time. The number of total Points
        needed to attain any level and the features and benefits associated with
        each level is displayed on Loot.gg; however, we reserve the right to
        change the number of total Points needed to attain any level and the
        features and benefits associated with each level at any time for any
        reason, with or without notice to you. Your total Points amount will
        never drop below the total Points amount needed to maintain your current
        level. In other words, while Bonus Points may be deducted from your
        account in the event that you open a Box with negative Bonus Points,
        your level will not be reduced, regardless of the number of negative
        Bonus Points in any Boxes that you open. Reduction of Bonus Points only
        makes it more difficult to attain the next level and has no impact on
        maintaining your current level.
      </p>

      <h3>D. Account Balances</h3>
      <p>
        You understand and agree that (i) your account balance (including any
        Credits, unwithdrawn Items, and Points on your account) may not be
        returned or paid to you if Loot.gg becomes insolvent, (ii) Loot.gg does
        not pay interest on account balances, and (iii) account balances and
        transactions are only reported to you through Loot.gg, and we are under
        no obligation to issue any other report regarding your account balance
        or transactions.
      </p>

      <h3>E. Taxes</h3>
      <p>
        You shall be responsible for payment of all taxes, and we will not be
        responsible for any federal income tax withholding, unemployment
        contribution, workers compensation, Medicare / Medicaid, or any
        employment-related benefits. If requested, you will provide us with a
        Social Security Number or Taxpayer Identification Number, so that an IRS
        form 1099 may be issued where required by law. Failure to provide such
        information to us may result in termination of these Terms of Service.
      </p>

      <h3>F. Cryptocurrency</h3>
      <p>
        We may permit you to pay for access to and use of Loot.gg and the
        features thereon using one or more cryptocurrencies, such as Bitcoin. We
        may also permit you to exchange unwanted Items for such
        cryptocurrencies. Acceptance of such payment or exchange method is in
        our sole discretion and may be of limited duration. Any payment or
        transfer in cryptocurrency is irreversible. Refunds of cryptocurrency
        payments is at our sole discretion, and, if allowed, may take the form
        of cryptocurrency transfer, or corresponding cash value of the requested
        refund, at our option. Additional administrative fees may apply to
        cryptocurrency transactions. By paying for Credits in cryptocurrency, or
        by withdrawing cryptocurrency, you acknowledge that the value of
        cryptocurrencies is highly volatile and that there is a substantial risk
        of loss associated with using cryptocurrencies. You consent to the risk
        that the value of cryptocurrencies may be influenced by activity outside
        our control, including fluctuating public interest in cryptocurrencies,
        potential regulation of cryptocurrencies, and risks associated with
        hardware, software, or Internet connection issues, malicious software,
        unauthorized access, or other communication failures, disruptions,
        errors, distortions, and delays. We do not represent, guarantee, or
        warrant the accuracy or fairness of the value of any cryptocurrency. You
        are solely responsible for making your own independent appraisal and
        investigations into the value of any purchase or exchange on Loot.gg
      </p>

      <h3>G. Third-Party Payment Processin</h3>
      <p>
        We utilize various third-party payment processors and gateways, and we
        reserve the right to contract with additional third-party payment
        processors and gateways in our sole discretion to process all payments
        associated with Loot.gg. Such third parties may impose additional terms
        and conditions governing payment processing. You are responsible for
        abiding by such terms. We further disclaim any liability associated with
        your violation of such terms.
      </p>

      <h3>H. Changes to Your Billing and Payment Information</h3>
      <p>
        You must promptly inform our third-party billing and payment agents of
        all changes, including changes in your address, debit or credit card,
        and other banking information used in connection with billing or
        payments through Loot.gg. You are responsible for any debit or credit
        card charge backs, dishonored checks, and any related fees that we incur
        with respect to your account, along with any additional fees or
        penalties imposed by our third-party billing or payment agents
      </p>

      <h3>I. Chargebacks</h3>
      <p>
        If you make a purchase on Loot.gg that results in a chargeback, we may
        terminate your account. You agree to contact us to seek a resolution of
        any issue before initiating a chargeback. We reserve the right to
        withhold or reverse any funds or proceeds (including any Items, Credits,
        and/or Points) obtained or generated from purchases that result in a
        chargeback or other reversal of payment.
      </p>

      <h3>J. Changes to Our Billing and Payment Methods</h3>
      <p>
        We reserve the right to make changes at any time to our fees and billing
        and payment methods, including the addition of administrative or
        supplemental charges for any feature, with or without prior notice to
        you.
      </p>

      <h3>K. Refunds</h3>
      <p>
        You understand and agree that it is our standard policy that all
        purchases are final and nonrefundable. We reserve the right to address
        all refund requests in our sole discretion. In no instance will a refund
        be provided where the user initiates a chargeback.
      </p>

      <h3>L. Billing and Payment Error</h3>
      <p>
        If you believe that you have been erroneously billed for activity
        associated with your account, or if you believe that we have paid you an
        insufficient amount for any activity associated with your account,
        please notify our third-party billing or payment agents immediately of
        such error. If you do not do so within thirty (30) days after such
        billing or payment error first appears on any account statement, the fee
        or payment in question will be deemed acceptable by you for all
        purposes, including resolution of inquiries made by or on behalf of your
        banking institution. You release us from all liabilities and claims of
        loss resulting from any error or discrepancy that is not reported within
        thirty (30) days of the bill or payment being rendered to you. These
        terms shall supplement and be in addition to any terms required by third
        party billing or payment entities we engage to provide billing or
        payment services. You are responsible for review and compliance with
        such entity’s terms in addition to those contained in these Terms of
        Service.
      </p>

      <h3>M. Fraudulent Use of Credit Cards</h3>
      <p>
        We take credit card fraud very seriously. Discovery that you have used a
        stolen or fraudulent credit card will result in the notification of the
        appropriate law enforcement agencies and termination of your account.
      </p>

      <h3>N. Anti-Money Laundering</h3>
      <p>
        We prohibit and seek to prevent money laundering and the funding of
        criminal activities. We train our employees to monitor for suspicious
        transactions on Loot.gg and to review transactions that meet certain
        thresholds or criteria. We may provide any evidence of such activities
        by our users (and your personally identifiable information as detailed
        in our [<a href="/privacy">https://loot.gg/privacy: Privacy Policy</a>{" "}
        ]) to financial regulators or law enforcement as deemed necessary by us.
      </p>
      <p>
        We may prevent you from creating an account, suspend or terminate your
        account, or request additional information from you if (1) you provide
        fraudulent account or payment information, such as impersonating a third
        party, (2) one or more of your transactions is flagged, or (3) you are
        on OFAC’s list of Specially Designated Nationals and Blocked Persons or
        a similar sanctions or terrorism watch lists. If you refuse or fail to
        provide any requested information in a timely manner, we will terminate
        your account.
      </p>

      <h2>5. Referral Program</h2>

      <h3>A. Referrals</h3>
      <p>
        By participating in the Program, you accept and agree to comply with
        this section. We may terminate your participation in the Program for any
        reason or no reason, in our sole and absolute discretion. If you violate
        any provision of this section, you will forfeit all right to any unpaid
        and future referral commissions. We may allow you to participate in a
        referral program (“Program”) to provide marketing services in exchange
        for a commission of one percent (1%) of all purchases made within one
        year of registration by all new users that subscribe to Loot.gg
        (“Referral(s)”) using your personalized referral link (“Link”) to be
        paid in the form of Credits of equivalent value.
      </p>
      <p>
        We will automatically add Credits to your account for all referrals. We
        may deduct from your commissions an amount equal to any commission
        resulting in a refund or chargeback related to a purchase on an account
        created through your Link or any commission resulting from fraud, other
        illegal activity, technical error, or as required by law. No commission
        will be paid on transactions that are in violation of this section or
        any other provision of these Terms of Service. We may temporarily
        withhold any commissions if we reasonably believe a violation of these
        Terms of Service has occurred until such time as an investigation can be
        conducted and a determination can be made.
      </p>

      <h3>B. Channel Information</h3>
      <p>
        You may market, advertise, and promote Loot.gg by sharing the Link on
        your website, web page, blog, forum, third-party social media accounts,
        and any other media outlet or online account owned or operated by you
        that is ordinarily used to advertise online services (“Channels”). You
        shall be solely responsible for all content, materials, and other
        information thereupon, including the Link (“Channel Information”). You
        represent and warrant that you own or operate the Channels, and that the
        Channel Information does not infringe upon or violate any applicable
        law, rule, or regulation, including intellectual property and publicity
        rights. We shall have no obligations with respect to the Channel
        Information, including but not limited to, any duty to review or monitor
        any such Channel Information. You agree to indemnify us for any claims,
        charges, debts, allegations, or lawsuits arising out of any Channel
        Information or other information appearing on the Channels.
      </p>

      <h3>C. Grant of Rights</h3>
      <p>
        We grant you a limited, revocable, non-exclusive right to use our
        trademarks and service marks (“Marks”) and the Link on the Channels for
        the purposes of your participation in this Program. You agree that the
        Marks are and shall remain our property, and that nothing in these Terms
        of Service conveys to you any right of ownership in the Marks. You will
        not now nor in the future contest the validity of the Marks. You will
        not take any action that would impair or diminish the value of, or the
        goodwill associated with, the Marks, including using the Marks in a
        manner that disparages or portrays us or our products or services in a
        false, competitively adverse, or poor light. Your use of the Marks shall
        inure to our benefit. You will not register any domain name or account
        on any third-party website that contains or is confusingly similar to
        any Mark belonging to us, and you agree that, if you do, you will
        immediately disable the offending domain name or account on any
        third-party website upon our demand and at your expense, or that, if you
        fail to immediately do so, you will reimburse us for all fees incurred
        in order to enforce these obligations, including attorneys’ fees and
        costs associated with filing a domain dispute complaint.
      </p>

      <h3>D. Code of Conduct for Program Participants</h3>
      <p>
        We reserve the right to terminate your participation in the Program at
        any time and for any reason or no reason, in our sole and absolute
        discretion. Reasons for refusal or acceptance or termination of
        participation may include violation of this Code of Conduct for Program
        Participants, or the other provisions of this Section.
      </p>
      <p>
        You must fully comply with state or federal consumer protection
        statutes, regulations, rules, policies, or advisory opinions. You will
        notify us of any inquiries or concerns made, accusing you of or
        investigating you for any activities related to the Referrals that are
        questionable, illegal, or otherwise violate these Terms of Service.
      </p>

      <p>You will not:</p>
      <ul>
        <li>
          Use deceptive, unlawful, or unfair promotional tactics or devices,
          such as manipulating search engine results, or otherwise engaging in
          activity that is false, misleading, infringing, manipulative, or
          deceptive in order to drive traffic through the Link.
        </li>
        <li>
          Use any meta-tags, key words, pay-per-click advertising campaigns, or
          other marketing tactics that would imply or suggest that illegal
          gambling is conducted on Loot.gg or the Channel, or otherwise market
          Loot.gg or the Channel to those seeking to engage in gambling
          services.
        </li>
        <li>
          Transmit or distribute the Link to any minors or any unwilling adults.
        </li>
        <li>Solicit or permit a minor to become a user of Loot.gg</li>
        <li>Use any form of unlawful email promotion to promote the Link</li>
        <li>
          Violate the policies of any third-party website while sharing the Link
        </li>
        <li>
          Engage in any activities that, in our sole discretion, are harmful to
          our image, goodwill, or reputation.
        </li>
        <li>
          Attempt to do any of the acts described in this section or assist or
          permit any person in engaging in any of the acts described in this
          section.
        </li>
      </ul>

      <h3>E. FTC Guideline</h3>
      <p>
        At all times, you will comply with all FTC guidelines related to
        affiliate and/or “influencer” marketing, including:
      </p>
      <ul>
        <li>
          The Channel Information must be truthful and shall not be misleading
        </li>
        <li>
          You must actually use Loot.gg before participating in the Program
        </li>
        <li>
          You must post a clear and conspicuous disclosure on all Channel
          Information which includes the Link or otherwise promotes or
          advertises Loot.gg. This disclosure must be
        </li>
        <ul>
          <li>close to the claims to which they relate,</li>
          <li>
            if text, in an easy-to-read font and color that stands out from the
            background,
          </li>
          <li>
            if video, on screen long enough to be noticed, read, and understood,
          </li>
          <li>if audio, read at an easily understandable cadence,</li>
          <li>
            if commissions are earned, a statement that “I get commissions for
            purchases made through links in this post” or something similar,
          </li>
          <li>
            if above average results were obtained from use of Loot.gg, a
            statement that “I opened Box A and obtained Item B which has value
            of $C, even though the average user only obtains an Item with a
            value of $D or less” or something similar, and
          </li>
          <li>
            if you have a connection to Loot.gg that your followers would not
            expect, such as an employment or familial relationship, a statement
            that “I work for Loot.gg” or something similar.
          </li>
        </ul>
      </ul>

      <h3>F. Access to the Channels</h3>
      <p>
        During your participation in the Program, you agree to provide us with
        the means necessary to monitor the source of traffic you send to
        Loot.gg, although we undertake no obligation to do so. To that end, and
        solely for that purpose, if the Channels have any method of access
        restrictions in place, you agree to send us valid access credentials to
        any password-protected area of the Channels within twenty-four (24)
        hours of receiving a request for such access by us. You agree that we
        shall not be charged or incur any expense from you for such access.
      </p>

      <h2>6. Dispute Resolution and Damages</h2>

      <h3>A. Governing Law and Venue</h3>
      <p>
        These Terms of Service and all matters arising out of, or otherwise
        relating to, these Terms of Service shall be governed by the laws of the
        state of Florida, and United States federal law, excluding any conflict
        of law provisions. The sum of this paragraph is that all disputes must
        be, without exception, resolved in Orange County, Florida. All Parties
        to these Terms of Service agree that all legal actions or proceedings
        arising in connection with these Terms of Service or any services or
        business interactions between the Parties that may be subject to these
        Terms of Service shall be brought exclusively in Orange County, Florida.
        The Parties agree to exclusive jurisdiction and venue in, and only in,
        Orange County, Florida. The Parties additionally agree that this choice
        of venue and forum is mandatory and not permissive in nature, thereby
        precluding any possibility of litigation between the Parties with
        respect to, or arising out of, these Terms of Service in a jurisdiction
        other than that specified in this paragraph. All Parties hereby waive
        any right to assert the doctrine of forum non-conveniens or similar
        doctrines challenging venue or jurisdiction, or to object to venue with
        respect to any proceeding brought in accordance with this paragraph or
        with respect to any dispute under these Terms of Service whatsoever. All
        Parties stipulate that the courts located in Orange County, Florida
        shall have personal jurisdiction over them for resolution of any
        litigation permitted by these Terms of Service. You agree to accept
        service of process by registered or certified mail, Federal Express, or
        Priority Mail, with proof of delivery or return receipt requested, sent
        to your last known address for any legal action arising from these Terms
        of Service. Any final judgment rendered against you or us in any action
        or proceeding shall be conclusive as to the subject matter and may be
        enforced in the courts located in Orange County, Florida or other
        jurisdictions in any manner provided by law if such enforcement becomes
        necessary.
      </p>

      <h3>B. Arbitration</h3>
      <p>
        If you have a dispute with us arising out of or otherwise relating to
        your purchase or use of Credits, Boxes, or Points, or your withdrawal of
        any Items or cryptocurrency, you shall confer with us and negotiate in
        good faith to attempt to resolve the dispute. If you are unable to
        resolve the dispute with us through direct negotiations, then, except as
        otherwise provided herein, either party must submit the issue to binding
        arbitration in accordance with the then-existing Commercial Arbitration
        Rules of the American Arbitration Association. Arbitral Claims shall
        include, but are not limited to, contract and tort claims of all kinds,
        and all claims based on any federal, state, or local law, statute, or
        regulation, excepting only claims by us for intellectual property
        infringement, actions for injunctions, attachment, garnishment, and
        other equitable relief. The arbitration shall be confidential. The
        arbitration shall be conducted in Orange County, Florida and conducted
        by a single arbitrator, knowledgeable in Internet and e-Commerce
        disputes. The arbitrator shall be willing to execute an oath of
        neutrality. The Arbitrator shall have no authority to award any punitive
        or exemplary damages; certify a class action; add any parties; vary or
        ignore the provisions of this Agreement; and shall be bound by governing
        and applicable law. There shall be no waiver of the right to arbitration
        unless such waiver is provided affirmatively and in writing by the
        waiving party to the other party. There shall be no implied waiver of
        this right to arbitration. No acts, including the filing of litigation,
        shall be construed as a waiver or a repudiation of the right to
        arbitrate.
      </p>

      <h3>C. Waivers</h3>
      <p>
        You hereby waive any right or ability to initiate any class action or
        collective proceeding along with any right to trial by jury.
      </p>

      <h3>D. Rights to Injunctive Relief</h3>
      <p>
        You acknowledge that remedies at law may be inadequate to provide us
        with full compensation in the event you breach these Terms of Service,
        and that we shall therefore be entitled to seek injunctive relief in the
        event of any such breach, in addition to seeking all other remedies
        available at law or in equity.
      </p>

      <h3>E. Additional Fee</h3>
      <p>
        If we are required to enlist the assistance of an attorney,
        investigator, collections agent, or other person to collect any damages
        or any other amount of money from you, or if we are required to seek the
        assistance of an attorney to pursue injunctive relief against you, then
        you additionally agree that you will reimburse us for all fees incurred
        in order to collect these damages or in order to seek injunctive relief
        from you. You understand that even a nominal amount of damages may
        require the expenditure of extensive legal fees, travel expenses, costs,
        and other amounts that may dwarf the damages themselves. You agree that
        you will pay these fees and costs.
      </p>

      <h2>7. Disclaimers</h2>

      <h3>A. We Disclaim All Warranties</h3>
      <p>
        We provide access to and use of Loot.gg “as is” and “with all faults.”
        We make no warranty that Loot.gg will meet your needs or requirements.
        We disclaim all warranties — express, statutory, or implied — including
        warranties of merchantability, fitness for a particular purpose,
        workmanlike effort, quality, suitability, truthfulness, usefulness,
        performance, accuracy, completeness, reliability, security, title,
        exclusivity, quiet enjoyment, non-infringement, and warranties that your
        access to or use of Loot.gg will be uninterrupted, timely, secure,
        error-free, or that loss of content will not occur, to the greatest
        extent provided by applicable law. We may change any of the information
        found on Loot.gg at any time or remove any or all Materials. We make no
        commitment to update the Materials. We make no warranty regarding any
        goods or services purchased or obtained through Loot.gg or any
        transaction entered into through Loot.gg. There are no warranties of any
        kind that extend beyond the face of these Terms of Service or that arise
        because of course of performance, course of dealing, or usage of trade.
      </p>

      <h3>B. Use at Your Own Ris</h3>
      <p>
        You expressly agree that access to and use of Loot.gg is at your own and
        sole risk. You understand that we cannot and do not guarantee or warrant
        that Loot.gg will be free of viruses, malware, worms, Trojan horses, or
        other code that may manifest contaminating or destructive properties. We
        do not assume any responsibility or risk for your access to or use of
        the Internet, generally, or Loot.gg, specifically. You understand and
        agree that any Materials downloaded or otherwise obtained through
        Loot.gg is done at your own discretion and risk, and that you will be
        solely responsible for any damage to your computer system or loss of
        data that results from your activity.
      </p>

      <h3>C. Fraud and Scam Warning</h3>
      <p>
        While we take efforts to prevent our services from being used for any
        fraudulent purposes, we specifically and emphatically warn members never
        to send money to anyone that they interact with on Loot.gg or our social
        media channels. We have no way of determining the validity of any
        communication that you may receive from other users, and we cannot
        discern the validity of the person or intentions behind such
        communication. It is a violation of our policy for users to solicit
        money from or to send money to any other user. You expressly understand
        and agree that if any other user that you are in communication with on
        Loot.gg or our social media channels requests money from you for travel,
        medical assistance, subsistence or for any other reason, it is likely a
        scam or a fraudulent scheme, and you are at a very high risk of being
        defrauded. You agree to report such request along with the username of
        the requesting user to us immediately. While we are not obligated to
        investigate any such report, we may do so in our sole discretion
      </p>

      <h3>D. Third-Party Links</h3>
      <p>
        Loot.gg may contain links to websites or resources owned and operated by
        our users or third parties. You understand and agree that we have no
        control over, are not responsible for, and do not screen nor warrant,
        endorse, guarantee, or assume responsibility for the goods or services
        provided by our users or on third-party links. We will not be a party to
        or be in any way responsible for monitoring any transaction between you
        and other providers of products or services. As with the purchase of a
        product or service through any medium or in any environment, you should
        use your best judgment and exercise caution where appropriate. You agree
        to hold us harmless from all damages and liability that may result from
        use of third-party links that appear on Loot.gg and any advertising,
        services, goods, products, or other materials available on third-party
        links. We are not responsible for any use of confidential or private
        information by sellers or third parties. You agree that your use of any
        third-party link or the goods or services provided thereon is governed
        by the policies of those third parties, not by these Terms of Service or
        our other policies. We reserve the right to demote or remove any link at
        any time.
      </p>

      <h3>E. Violations of Law</h3>
      <p>
        Access to and use of Loot.gg in violation of any law is strictly
        prohibited. If we determine that you have provided or intend to purchase
        or provide any services in violation of any law, your ability to access
        and use Loot.gg will be terminated immediately. We do hereby disclaim
        any liability for damages that may arise from you or any user providing
        any services that violates any law. You do hereby agree to defend,
        indemnify, and hold us harmless from any liability that may arise for us
        should you violate any law. You also agree to defend and indemnify us
        should any third party be harmed by your illegal actions or should we be
        obligated to defend any such claims by any party.
      </p>

      <h2>8. Indemnification</h2>

      <p>
        You agree to defend, indemnify, and hold harmless us and our officers,
        directors, shareholders, employees, independent contractors,
        telecommunication providers, attorneys, and agents, from and against all
        claims, actions, loss, liabilities, expenses, costs, or demands,
        including without limitation legal and accounting fees, for all damages
        directly, indirectly, or consequentially resulting or allegedly
        resulting from your actions, or the actions of another person under your
        authority, including without limitation to governmental agencies, use,
        misuse, or inability to use Loot.gg, or any breach of these Terms of
        Service by you or another person under your authority. We shall promptly
        notify you by electronic mail of any such claim or suit, and we may
        cooperate fully (at your expense) in the defense of such claim or suit.
        We reserve the right to participate in the defense of such claim or suit
        at our own expense, and choose our own legal counsel; however, we are
        not obligated to do so.
      </p>

      <h2>9. Limitation of Liability</h2>

      <p>
        You acknowledge that we will not be liable to you for the offensive or
        illegal conduct of any person. You understand that the risk of harm or
        damage from this rests entirely with you, and you expressly release us
        from any liability arising out of the conduct of any person. You
        discharge, acquit, and otherwise release us, our parent company, agents,
        employees, officers, directors, shareholders, attorneys, and affiliates,
        from all allegations, counts, charges, debts, causes of action, and
        claims relating in any way to the use of, or activities relating to the
        use of Loot.gg including claims relating to the following:
      </p>
      <div className={styles.tabbed}>
        <p>
          Negligence, gross negligence, reckless conduct, alienation of
          affections (to the extent recognized in any jurisdiction), intentional
          infliction of emotional distress, intentional interference with
          contract or advantageous business relationship, defamation, privacy,
          publicity, intellectual property infringement, misrepresentation,
          infectious disease, illegal gambling, any financial loss not due to
          our fault, missed meetings, unmet expectations, false identities,
          fraudulent acts by others, invasion of privacy, release of personal
          information, failed transactions, purchases or functionality of
          Loot.gg, unavailability of Loot.gg, its functions and any other
          technical failure that may result in inaccessibility of Loot.gg, or
          any claim based on vicarious liability for torts committed by
          individuals met on or through Loot.gg, including fraud, theft or
          misuse of personal information, assault, battery, stalking,
          harassment, cyber-bullying, rape, theft, cheating, perjury,
          manslaughter, or murder.
        </p>
      </div>

      <p>
        The above list is intended to be illustrative only, and not exhaustive
        of the types or categories of claims released by you. This release is
        intended by the parties to be interpreted broadly in our favor, and thus
        any ambiguity shall be interpreted in a manner providing release of the
        broadest claims. This release is intended to be a full release of
        claims, and the parties acknowledge the legally binding nature of this
        provision, and the nature of the rights given up in connection
        therewith.
      </p>

      <p>
        We expressly disclaim any liability or responsibility to you for any of
        the following:
      </p>
      <ul>
        <li>
          Any loss or damage of any kind incurred because of the Materials,
          including errors, mistakes, or inaccuracies thereof or any Materials
          that are infringing, obscene, indecent, threatening, offensive,
          defamatory, invasive of privacy, or illegal.
        </li>
        <li>
          Personal injury or property damage of any nature resulting from your
          access to and use of Loot.gg.
        </li>
        <li>
          Any third party’s unauthorized access to or alterations of your
          account, transmissions, data, or content.
        </li>
        <li>
          Any interruption or cessation of transmission to or from Loot.gg and
          any delays or failures you may experience in initiating, conducting,
          or completing any transmissions to or transactions through Loot.gg.
        </li>
        <li>
          Any bugs, viruses, malware, Trojan horses, or the like that may be
          transmitted to or through Loot.gg by any third party.
        </li>
        <li>
          Any incompatibility between Loot.gg and your other services, hardware,
          or software.
        </li>
      </ul>

      <h2>10. Intellectual Property</h2>

      <h3>A. Trademark</h3>
      <p>
        Loot.gg is our brand name and trademark. We aggressively defend our
        intellectual property rights. Other manufacturers’ product and service
        names referenced herein may be trademarks and service marks of their
        respective companies and are the exclusive property of such respective
        owners, and may not be used publicly without the express written consent
        of the owners or holders of such trademarks and service marks. All of
        the marks, logos, domains, and trademarks that you find on Loot.gg may
        not be used publicly except with express written permission from us, and
        may not be used in any manner that is likely to cause confusion among
        consumers, or in any manner that disparages or discredits us
      </p>

      <h3>B. Copyrights</h3>
      <p>
        The Materials are our proprietary information and valuable intellectual
        property. We retain all right, title, and interest in the Materials.
        Loot.gg and the Materials are protected by copyright law. The Materials
        may not be copied, downloaded, distributed, republished, modified,
        uploaded, posted, or transmitted in any way without our prior written
        consent. You may not remove or alter, or cause to be removed or altered,
        any copyright, trademark, trade name, service mark, or any other
        proprietary notice or legend appearing on any of the Materials.
        Modification or use of the Materials except as expressly provided in
        these Terms of Service violates our intellectual property rights.
      </p>

      <h2>11. General</h2>

      <h3>A. Entire Agreement</h3>
      <p>
        These Terms of Service and any other legal notice or agreement published
        by us on Loot.gg, form the entire agreement between you and us
        concerning your use of Loot.gg. It supersedes all prior terms,
        understandings, or agreements between you and us regarding use of
        Loot.gg. A printed version of these Terms of Service and of any notice
        given in electronic form will be admissible in any proceedings based on
        or relating to these Terms of Service. Such version of these Terms of
        Service shall be utilized to the same evidentiary extent, and subject to
        the same conditions as other business documents and records originally
        generated and maintained in printed form.
      </p>

      <h3>B. Policies of Our Service Providers</h3>
      <p>
        You understand and agree that we may use certain third-party service
        providers to provide you with access to and use of Loot.gg. You
        understand and agree that you must agree to and abide by any user terms,
        privacy policy, or other policy that such third party requires you to
        agree to in order to use their services. In the event of a conflict
        between those policies and our policies, the terms of our policies shall
        govern.
      </p>

      <h3>C. Assignment and Delegation</h3>
      <p>
        We may assign any rights or delegate any performance under these Terms
        of Service without notice to you. You will not assign, delegate, or
        sublicense any of your rights or duties without our advanced written
        consent. Any attempted assignment or delegation in violation of this
        provision will be void.
      </p>

      <h3>D. Severability</h3>
      <p>
        If any provision of these Terms of Service is determined to be invalid,
        illegal, or unenforceable, the remaining provisions shall continue in
        full force, if the essential terms for each party remain valid, binding,
        and enforceable.
      </p>

      <h3>E. Cumulative Remedies</h3>
      <p>
        All rights and remedies provided in these Terms of Service are
        cumulative and not exclusive, and the assertion by a party of any right
        or remedy will not preclude the assertion by the party of any other
        rights or the seeking of any other remedies available at law, in equity,
        by statute, in any other agreement between the parties, or otherwise.
      </p>

      <h3>F. Successors and Assigns</h3>
      <p>
        These Terms of Service inure to the benefit of, and are binding on, the
        parties and their respective successors and assigns. This section does
        not address, directly or indirectly, whether a party may assign its
        rights or delegate its performance under these Terms of Service.
      </p>

      <h3>G. Force Majeure</h3>
      <p>
        We are not responsible for any failure to perform because of unforeseen
        circumstances or causes beyond our reasonable control, including: Acts
        of God, such as fire, flood, earthquakes, hurricanes, tropical storms,
        or other natural disasters; epidemics; pandemics; war, riot, arson,
        embargoes, acts of civil or military authority, or terrorism; fiber
        cuts; strikes, or shortages in transportation, facilities, fuel, energy,
        labor, or materials; failure of the telecommunications or information
        services infrastructure; hacking, spam, data breach, malware, or any
        failure of a computer, server, network, or software for so long as the
        event continues to delay our performance; and unlawful acts of our
        employees, agents, or contractors.
      </p>

      <h3>H. Notices</h3>
      <p>
        Any notice required to be given by us under these Terms of Service may
        be provided by email to a functioning email address of the party to be
        noticed, by a general posting on Loot.gg, or by personal delivery via
        commercial carrier. Notices by customers to us shall be given by
        contacting us at info@loot.gg unless otherwise specified in these Terms
        of Service. Either party may change the address to which notice is to be
        sent by written notice to the other party pursuant to this provision of
        these Terms of Service. Notices shall be deemed effective upon delivery.
        Notices delivered by overnight carrier shall be deemed delivered on the
        business day following mailing. Notices delivered by any other method
        shall be deemed given upon receipt. Either party may, by giving the
        other party appropriate written notice, change the designated address,
        email address, or recipient for any notice hereunder. Any correctly
        addressed notice that is refused, unclaimed, or undeliverable, because
        of an act or omission of the party to be notified shall be deemed
        effective as of the first date that said notice was refused or deemed
        undeliverable by the postal authorities, messenger, email server, or
        overnight delivery service.
      </p>

      <h3>I. Communications are Not Private</h3>
      <p>
        We do not provide any facility for sending or receiving private or
        confidential electronic communications. All messages transmitted to us
        shall be deemed to be readily accessible to the general public. Notice
        is hereby given that all messages entered into Loot.gg may be read by us
        and our moderators and other agents, regardless of whether we are
        intended recipients of such messages.
      </p>

      <h3>J. Authorization and Permission to Send Emails to You</h3>
      <p>
        You authorize us to email you notices, advertisements, and other
        communications. You understand and agree that such communications may
        information about lootboxes and Items which may not be suitable for
        minors. This authorization will continue until you request us to remove
        you from our email list. You understand and agree that even unsolicited
        email correspondence from us, or our affiliates, is not spam as that
        term is defined under the law.
      </p>

      <h3>K. Consideration</h3>
      <p>
        We allow you to access and use Loot.gg, as limited by purchase of
        certain paid features and/or your user level, in consideration for your
        acquiescence to all the provisions in these Terms of Service. You agree
        that such consideration is both adequate and received upon your viewing
        or downloading any portion of Loot.gg.
      </p>

      <h3>L. Electronic Signatures</h3>
      <p>
        You agree to be bound by any affirmation, assent, or agreement you
        transmit through Loot.gg. You agree that when in the future you click on
        an “I agree,” “I consent,” or other similarly worded button, check box,
        or entry field with your mouse, keystroke, or other computer device,
        your agreement or consent will be legally binding and enforceable and
        the legal equivalent of your handwritten signature.
      </p>

      <h3>M. English Language</h3>
      <p>
        We have written these Terms of Service and our associated website
        policies in the English language. You are representing your
        understanding and assent to the English language version of these Terms
        of Service as they are published. We are not liable to you or any third
        party for any costs or expenses incurred in translating these Terms of
        Service. In the event that you choose to translate these Terms of
        Service, you do so at your own risk, as only the English language
        version is binding.
      </p>

      <h3>N. Export Control</h3>
      <p>
        You understand and acknowledge that the software elements of Loot.gg may
        be subject to regulation by governmental agencies which prohibit export
        or diversion of software and other goods to certain countries and third
        parties. Diversion of such elements contrary to U.S. or international
        law is prohibited. You will not assist or participate in any such
        diversion or other violation of applicable laws and regulations. You
        warrant that you will not license or otherwise permit anyone not
        approved to receive controlled commodities under applicable laws and
        regulations and that you will abide by such laws and regulations. You
        agree that none of the elements are being or will be acquired for,
        shipped, transferred, or re-exported, directly or indirectly, to
        proscribed or embargoed countries or their nationals or be used for
        proscribed activities.
      </p>

      <h3>O. No Agency Relationship</h3>
      <p>
        Nothing in these Terms of Service shall be deemed to constitute, create,
        imply, give effect to, or otherwise recognize a partnership, employment,
        joint venture, or formal business entity of any kind; and the rights and
        obligations of the parties shall be limited to those expressly set forth
        herein.
      </p>

      <h3>P. Usages</h3>
      <p>
        In these Terms of Service, unless otherwise stated or the context
        otherwise requires, the following usages will apply:
      </p>
      <ul>
        <li>
          References to a statute will refer to the statute and any successor
          statute, and to all regulations promulgated under or implementing the
          statute or successor, as in effect at the relevant time.
        </li>
        <li>
          In computing periods from a specified date to a later specified date,
          the words “from” and “commencing on” (and the like) mean “from and
          including,” and the words “to,” “until,” and “ending on” (and the
          like) mean “to but excluding.”
        </li>
        <li>
          References to a governmental or quasi-governmental agency, authority,
          or instrumentality will also refer to a regulatory body that succeeds
          to the functions of the agency, authority, or instrumentality.
        </li>
        <li>
          “A or B” means “A or B or both.” “A, B, or C” means “one or more of A,
          B, and C.” The same construction applies to longer strings.
        </li>
        <li>“Including” means “including, but not limited to.”</li>
      </ul>

      <h3>Q. No Waiver</h3>
      <p>
        No waiver or action made by us shall be deemed a waiver of any
        subsequent default of the same provision of these Terms of Service. If
        any term, clause, or provision hereof is held invalid or unenforceable
        by a court of competent jurisdiction, such invalidity shall not affect
        the validity or operation of any other term, clause or provision and
        such invalid term, clause or provision shall be deemed to be severed
        from these Terms of Service.
      </p>

      <h3>R. Headings</h3>
      <p>
        All headings are solely for the convenience of reference and shall not
        affect the meaning, construction, or effect of these Terms of Service.
      </p>

      <h3>S. Other Jurisdictions/Foreign Law</h3>
      <p>
        We make no representation that Loot.gg is appropriate or available for
        use in all locations. You may not access or use Loot.gg from territories
        where their contents may be illegal or is otherwise prohibited. Those
        who choose to access and use Loot.gg from such locations do so on their
        own initiative and are solely responsible for determining compliance
        with all applicable local laws. Nothing contained in these Terms of
        Service shall be interpreted as an admission that that we are subject to
        the laws of any nation besides the United States.
      </p>

      <h3>T. Service Not Available in Some Areas</h3>
      <p>
        You are subject to the laws of the state, province, city, country, or
        other legal entity in which you reside or from which you access and use
        Loot.gg. Loot.gg IS VOID WHERE PROHIBITED OR RESTRICTED BY LAW. If you
        open an account or use Loot.gg while located in a prohibited
        jurisdiction, you will be in violation of the law of such jurisdiction
        and these Terms of Service, and subject to having your account suspended
        or terminated without any notice to you. You hereby agree that we cannot
        be held liable if laws applicable to you restrict or prohibit your
        participation. We make no representations or warranties, implicit or
        explicit, as to your legal right to participate in any Service offered
        on Loot.gg, nor shall any person affiliated, or claiming affiliation,
        with us have authority to make any such representations or warranties.
        We reserve the right to restrict access to and use of Loot.gg in any
        jurisdiction.
      </p>

      <div className={styles.center}>
        <p className={styles.italic}>[nothing more follows]</p>
        <p>
          © <a href="https://www.firstamendment.com/">Walters Law Group</a>{" "}
          (2023). All rights reserved.
        </p>
      </div>
    </div>
  );
};

TermsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default TermsPage;
