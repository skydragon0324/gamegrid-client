import ColorThief from "colorthief";

export const dominateColor = (img: HTMLImageElement) => {
  const colorthf = new ColorThief();
  const color = colorthf.getColor(img);

  return color;
};

export const dominateColorFromUrls = (
  urls: { id: string; url: string }[],
  loadFailedOnes?: boolean
) => {
  return new Promise<Record<string, string | null>>(async (resolve, reject) => {
    const colors: Record<string, string | null> = {};

    for await (const u of urls) {
      try {
        const color = await dominateColorFromUrl(u.url);

        colors[u.id] = color;
      } catch (e) {
        // console.log(e);
        if (loadFailedOnes) {
          colors[u.id] = null;
        }
      }
    }

    resolve(colors);
  });
};

export const dominateColorFromUrl = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();

    img.addEventListener("load", function () {
      if (img.complete) {
        const colorthf = new ColorThief();
        const color = colorthf.getColor(img) as number[];
        resolve(`rgb(${color[0x0]}, ${color[0x1]}, ${color[0x2]})`);
      } else {
        reject("Image not loaded");
      }
    });

    img.crossOrigin = "Anonymous";

    img.src = imageURI(url, undefined, true);

    img.onerror = (e) => {
      reject(e);
    };
  });
};

export const imageURI = (
  target: string,
  type?: "item" | "box",
  wproxy: boolean = false
) => {
  let imageURL = target;
  const googleProxyURL =
    "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=";

  if (!imageURL.includes("http")) {
    if (type) {
      if (type === "item") {
        imageURL = `${
          process.env.NEXT_PUBLIC_S3 ??
          "https://lgg-staging.s3.us-east-1.amazonaws.com"
        }/items/${target}/image`;
      } else if (type === "box") {
        imageURL = `${
          process.env.NEXT_PUBLIC_S3 ??
          "https://lgg-staging.s3.us-east-1.amazonaws.com"
        }/boxes/${target}/image`;
      }
    }
  } else if (wproxy) {
    imageURL = googleProxyURL + encodeURIComponent(imageURL);
  }

  return imageURL;
};

export const colorByVariant = (chance: number) => {
  let label = "white";
  let color = "#fff";

  if (chance <= 1) {
    label = "red";
    color = "#f04438";
  } else if (chance <= 5) {
    label = "orange";
    color = "#fdb022";
  } else if (chance <= 20) {
    label = "purple";
    color = "#8962f8";
  } else if (chance <= 50) {
    label = "green";
    color = "#3ccb7f";
  } else if (chance <= 100) {
    label = "white";
    color = "#fff";
  }

  return { label, color };
};
