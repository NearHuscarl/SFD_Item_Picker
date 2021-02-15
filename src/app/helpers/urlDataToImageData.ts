export function urlDataToImageData(urlData: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    if (!urlData) {
      return reject("urlData param must be provided");
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();

    if (!ctx) {
      return reject("canvas is not supported in this crappy browser");
    }

    image.src = urlData;
    image.addEventListener("load", () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    });
  });
}
