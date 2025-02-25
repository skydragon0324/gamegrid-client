import BitcoinIcon from "@/svgs/btc.svg";
import EthereumIcon from "@/svgs/eth.svg";
import LiteIcon from "@/svgs/ltc.svg";
import XRP from "@/svgs/xrp.svg";
import USDC from "@/svgs/usdc.svg";
import BCH from "@/svgs/bch.svg";
import TRX from "@/svgs/trx.svg";
import USDT from "@/svgs/usdt.svg";

interface AvailableCrypto {
  id: string;
  name: string;
  cryptoCode: string;
  enabledForWithdraw: boolean;
  enabledForDeposit: boolean;
  description: string;
  currencyIconURL: string | null;
}

export const renderCoinIcons = (name: string, currencyIconUrl?: string) => {
  const coin = name.split("_")[0];

  if (currencyIconUrl) {
    return (
      <img src={currencyIconUrl} style={{ width: "24px", height: "24px" }} />
    );
  }

  switch (coin) {
    case "BTC":
      return <BitcoinIcon />;
    case "ETH":
      return <EthereumIcon />;
    case "LTC":
      return <LiteIcon />;
    case "USDT":
      return <USDT />;
    case "XRP":
      return <XRP />;
    case "USDC":
      return <USDC />;
    case "BCH":
      return <BCH />;
    case "TRX":
      return <TRX />;
    default:
      return null;
  }
};
