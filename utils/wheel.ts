import { imageURI } from "./colordetector";
import { wheelSvgByRarity } from "./wheelsvg";

export const drawItemsOnWheel = (
  wheelImageSrc: string,
  itemImages: string[],
  rarity: string[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    const wheelImage = new Image();
    wheelImage.crossOrigin = "Anonymous";

    wheelImage.onload = () => {
      canvas.width = wheelImage.width;
      canvas.height = wheelImage.height;

      ctx.drawImage(wheelImage, 0, 0);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.9;
      const itemsImages: HTMLImageElement[] = [];

      rarity = new Array(itemImages.length).fill("#000000").map((_, i) => {
        return rarity[i % rarity.length];
      });

      // console.log(itemImages);
      const itemPromises = itemImages.map((itemSrc) => {
        return new Promise<void>((resolveItem, rejectItem) => {
          const itemImage = new Image();
          itemImage.crossOrigin = "anonymous";
          itemImage.onload = () => {
            itemsImages.push(itemImage);
            resolveItem();
          };

          itemImage.onerror = (e) => {
            // console.log(e);
            rejectItem(new Error(`Image at ${itemSrc} failed to load`));
          };

          // console.log(imageURI(itemSrc, "item", false));

          itemImage.src = `/_next/image?url=${encodeURIComponent(
            imageURI(itemSrc, "item", false)
          )}&w=256&q=75`;
        });
      });

      Promise.all(itemPromises)
        .then(() => {
          let startAngle;
          let endAngle = 0;
          const anglePerSection = (2 * Math.PI) / itemImages.length;

          let yH = (2 * Math.PI) / itemImages.length + 0.02;
          let radiusForLine = radius * 1.1;

          let grd1 = ctx.createLinearGradient(
            centerX + radiusForLine * Math.cos(yH),
            centerY + radiusForLine * Math.sin(yH),
            centerX +
              radiusForLine *
                Math.cos(
                  (itemImages.length * Math.PI) / 180 +
                    (2 * Math.PI) / itemImages.length +
                    0.1
                ),
            centerY +
              radiusForLine *
                Math.sin(
                  (itemImages.length * Math.PI) / 180 +
                    (2 * Math.PI) / itemImages.length +
                    0.1
                )
          );

          grd1.addColorStop(0, "transparent");
          grd1.addColorStop(0.5, rarity[0x0]);
          grd1.addColorStop(1, "transparent");

          for (let i = 0; i <= itemImages.length - 1; i++) {
            // console.log(itemImages.length, rarity.length, i);
            ctx.beginPath();
            let startAngle = yH * i - 0.075 - 0.02 * (i - 4);
            let endAngle =
              (itemImages.length * Math.PI) / 180 +
              yH * i -
              0.015 -
              0.02 * (i - 4);
            ctx.arc(centerX, centerY, radius * 1.1, startAngle, endAngle);

            let gradient = ctx.createLinearGradient(
              centerX + radiusForLine * Math.cos(startAngle),
              centerY + radiusForLine * Math.sin(startAngle),
              centerX + radiusForLine * Math.cos(endAngle),
              centerY + radiusForLine * Math.sin(endAngle)
            );

            gradient.addColorStop(0, "transparent");
            gradient.addColorStop(0.5, rarity[i]); // Use modulus to cycle through the colors
            gradient.addColorStop(1, "transparent");

            ctx.lineWidth = 10; // Set the line width
            ctx.strokeStyle = gradient;
            ctx.stroke();
          }

          for (let i = 0; i < itemImages.length; i++) {
            startAngle = endAngle;
            endAngle = startAngle + anglePerSection;
            let itemImage = itemsImages[i];
            let MAX_WIDTH = 140;
            let MAX_HEIGHT = 140;
            let imgWidth = itemImage.width;
            let imgHeight = itemImage.height;
            const aspectRatio = imgWidth / imgHeight;

            if (imgWidth > MAX_WIDTH) {
              imgWidth = MAX_WIDTH;
              imgHeight = imgWidth / aspectRatio;
            }

            if (imgHeight > MAX_HEIGHT) {
              imgHeight = MAX_HEIGHT;
              imgWidth = imgHeight * aspectRatio;
            }

            const imageAngle = startAngle + anglePerSection / 2;
            const imageRadius = radius * 0.9;
            const imageX =
              centerX + imageRadius * Math.cos(imageAngle) - imgWidth / 2;
            const imageY =
              centerY + imageRadius * Math.sin(imageAngle) - imgHeight / 2;

            // var lineLength = 17; // length of each line in degrees
            // var gap = 10; // gap between lines in degrees

            // // Convert degrees to radians
            // var lineLengthRad = (lineLength * Math.PI) / 180;
            // var gapRad = (gap * Math.PI) / 180;
            // let radiusForLine = radius * 1.1;

            // var gradient = ctx.createLinearGradient(
            //   centerX + radiusForLine * Math.cos(startAngle),
            //   centerY + radiusForLine * Math.sin(startAngle),
            //   centerX + radiusForLine * Math.cos(endAngle),
            //   centerY + radiusForLine * Math.sin(endAngle)
            // );

            // // Add color stops to the gradient
            // gradient.addColorStop(0, "red");
            // gradient.addColorStop(0.5, "green");
            // gradient.addColorStop(1, "blue");

            // // Draw the line with the gradient
            // ctx.beginPath();
            // ctx.arc(centerX, centerY, radiusForLine, startAngle, startAngle + lineLengthRad);
            // ctx.lineWidth = 8; // Set the line width
            // ctx.strokeStyle = gradient;
            // ctx.stroke();

            ctx.save();
            ctx.translate(imageX + imgWidth / 2, imageY + imgHeight / 2);
            ctx.rotate(imageAngle + Math.PI / 2);

            ctx.drawImage(
              itemImage,
              -imgWidth / 2,
              -imgHeight / 2,
              imgWidth,
              imgHeight
            );
            ctx.restore();
          }

          resolve(canvas.toDataURL());
        })
        .catch((error) => {
          reject(new Error(`An item failed to load: ${error.message}`));
        });
    };

    wheelImage.onerror = () => {
      reject(new Error(`Wheel image at ${wheelImageSrc} failed to load`));
    };

    // wheelImage.src = url;
    wheelImage.src = wheelImageSrc;
  });
};
