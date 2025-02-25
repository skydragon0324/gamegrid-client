import { FC } from "react";
import styles from "./footer.module.scss";
import TwitterIcon from "@/svgs/twitter.svg";
import classNames from "classnames";
import InstagramIcon from "@/svgs/insta.svg";
import YoutubeIcon from "@/svgs/youtube.svg";
import TwitchIcon from "@/svgs/twitch.svg";
import TiktokIcon from "@/svgs/tiktok.svg";
import Link from "next/link";
export const Footer: FC = () => {
  return (
    <footer className={classNames(styles.footer, "contentinsider")}>
      <div className={styles.leftsection}>
        <img className={styles.logo} src="/svgs/logo.svg" alt="" />
        <br />
        <br />
        <div className={styles.links}>
          <Link href={"/aboutus"}>About Us</Link>
          <a href="mailto:info@loot.gg" target="_blank" rel="noreferrer">
            Contact Us
          </a>
        </div>
        <br />
        <div className={styles.links}>
          <Link href={"/terms"}>Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          {/* <Link href="/privacystatement">Privacy Statement</Link> */}
          <Link href="/cookie">Cookie Policy</Link>
        </div>
        <div className={styles.socials}>
          <a
            href="https://tiktok.com/@loot.gg_official"
            target="_blank"
            rel="noreferrer"
          >
            <TiktokIcon />
          </a>
          <a
            href="https://www.twitch.tv/loot_gg_official"
            target="_blank"
            rel="noreferrer"
          >
            <TwitchIcon />
          </a>
          {/* <a href="https://discord.gg/lootgg" target="_blank" rel="noreferrer">
            <InstagramIcon />
          </a> */}
          <a
            href="https://x.com/lootgg_official"
            target="_blank"
            rel="noreferrer"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://www.youtube.com/@loot.gg_official"
            target="_blank"
            rel="noreferrer"
          >
            <YoutubeIcon />
          </a>
        </div>
      </div>
      <div className={styles.rightsection}>
        <p>
          Loot.gg is a brand name of BOXLEGENDS LIMITED, Reg No: HE 453802,
          Having it's registered address at Steliou Kiriakidi 6 Limassol 3080,
          Cyprus
        </p>
        <div className={styles.uses}>
          <img src="/imgs/bitcoin.png" alt="" />
          <img src="/imgs/litecoin.png" alt="" />
          <img src="/imgs/mastercard.png" alt="" />
          <img src="/imgs/visa.png" alt="" />
          {/* <img src="/imgs/steam.png" alt="" /> */}
          {/* <img src="/imgs/paypal.png" alt="" /> */}
        </div>
      </div>
    </footer>
  );
};
