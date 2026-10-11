const MAX_INPUT_BYTES = 8 * 1024 * 1024;

// Shrinks a chosen photo to a small square-ish JPEG data URL (at most
// `size` px on its longest side) so profile pictures stay well under the
// server's 300 KB limit.
export const resizeImage = (file: File, size = 256): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp|gif|bmp)$/.test(file.type)) {
      reject(new Error("Choose a PNG, JPEG or WebP image."));
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error("The image is larger than 8 MB."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, size / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("This browser cannot process images."));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };
    img.src = url;
  });
