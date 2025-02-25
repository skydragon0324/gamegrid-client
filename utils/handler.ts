import { parseNumberToCommas } from "react-letshook";

export const calcDiscount = (price: number, discount: number) => {
  return price - price * (discount / 100);
};

export const formatPrice = (
  price: number,
  irk: boolean = false,
  roundPrice: boolean = false,
  roundUp: boolean = false
) => {
  !price && (price = 0x0);
  if (roundPrice) {
    // round price to two decimal places
    price = Math.round(price * 100) / 100; // 2.114 -> 2.11 2.115 -> 2.12
  }
  let iU =
    (irk ? (price > 0 ? "+" : "") : "") +
    parseNumberToCommas(parseFloat(price.toFixed(2)));

  roundUp && iU === "0.00" && (iU = "0");
  return iU;
};

const tobeFixed = (value: number, dgt: number = 2) => {
  return (
    String(value).match(new RegExp(`^[0-9]+\\.\\d{${dgt}}`, "g"))?.[0x0] ??
    String(value)
  );
};

export const formatFrequency = (frequency: number) => {
  let toFixed = (value: number, dgt: number = 2) => {
    return String(value).match(/\.\d+/)
      ? `${value.toFixed(dgt)}`
      : String(value);
  };

  if (String(frequency).length === 1) {
    return frequency.toFixed(2);
  }

  if (frequency >= 0.01) {
    return toFixed(frequency, 2);
  } else {
    let decimalPlaces = 2;
    while (frequency < Math.pow(10, -decimalPlaces) && decimalPlaces < 100) {
      decimalPlaces++;
    }

    let result = toFixed(frequency, decimalPlaces);
    let decimalIndex = result.indexOf(".");

    if (decimalIndex === -1) {
      return result;
    }

    let endIndex = result.length;

    while (result.charAt(endIndex - 1) === "0") {
      endIndex--;
    }

    result = result.slice(0, endIndex);
    if (result.charAt(result.length - 1) === ".") {
      result = result.slice(0, -1);
    }

    return result;
  }
};

export const shortIt = (value: string, length: number = 0x0) => {
  return value?.length > length
    ? value.slice(0x0, length) + "..."
    : value ?? "";
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const handleErrorRequest = (
  _error: any,
  dflt: string = "Something went wrong, Please try again later"
): string => {
  let msg: string | null = null;

  if (typeof _error === "object") {
    for (let error of [...(Array.isArray(_error) ? _error : [_error])]) {
      if (
        error &&
        "response" in error &&
        error.response &&
        "data" in error.response &&
        error.response.data &&
        Object.keys(error.response.data).length
      ) {
        error = error.response.data;
      }

      for (const hv of [
        "detail",
        "message",
        "msg",
        "localizedMessage",
        "title",
      ]) {
        if (hv in error && error[hv]) {
          msg = error[hv];
          break;
        }
      }
    }
  }

  if ((!msg || !msg.length) && String(_error).length) {
    const uH = String(_error).replace(/(Error: )/g, "");
    uH && (msg = uH);
  }

  if (
    msg &&
    (msg.match(/(Network Error)/g) ||
      msg.match(/(Request failed with status)/g))
  ) {
    msg = null;
  }

  return msg || dflt;
};

export const handleAvatar = (url?: string | null, username?: string) => {
  let hash = 0x0;
  username = (username?.trim().match(/^(\w)+/g)?.[0x0] ?? "").slice(0, 0x6);

  if (username) {
    for (let i = 0x0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 0x5) - hash);
    }
  }

  hash !== 0x0 && (hash = Math.abs(hash) % 255);

  return url
    ? url
    : `https://ui-avatars.com/api/?name=${
        username ?? "LT"
      }&color=fff&background=${
        hash !== 0x0
          ? ((0x01 << 24) | (hash << 0x10) | (2e2 << 0x8) | 87)
              .toString(0x10)
              .slice(0x01)
              .trim()
          : "random"
      }`.trim();
};

export const formatNumber = (num: number, l?: boolean): string => {
  if (num < 1000) {
    return num.toFixed(l ? 2 : 0).toString();
  }
  if (num < 1000000) {
    return (num / 1000).toFixed(1) + "K";
  }
  if (num < 1000000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  return (num / 1000000000).toFixed(1) + "B";
};
