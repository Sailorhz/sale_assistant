"use client";

const MAX_LONG_EDGE = 1280;
const JPEG_QUALITY = 0.8;

export type ResizedImage = {
  base64: string;
  mediaType: "image/jpeg";
};

/**
 * Downscales an image client-side before it's base64-encoded and sent to the
 * photo-suggestion API -- keeps per-call token/cost down and stays under
 * request-size limits. Always re-encodes to JPEG regardless of the source
 * format, since a single consistent output format keeps the server side
 * simple (only ever needs to declare "image/jpeg" for this path).
 */
export async function resizeImageForAnalysis(file: File): Promise<ResizedImage> {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(1, MAX_LONG_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context is unavailable.");
    }

    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });

    if (!blob) {
      throw new Error("Image could not be encoded.");
    }

    const base64 = await blobToBase64(blob);
    return { base64, mediaType: "image/jpeg" };
  } finally {
    bitmap.close();
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read image data."));
        return;
      }
      // Strip the "data:image/jpeg;base64," prefix -- the API route expects
      // bare base64 and takes mediaType as a separate, explicit field.
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image data."));
    reader.readAsDataURL(blob);
  });
}
