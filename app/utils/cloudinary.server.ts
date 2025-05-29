import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageData: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not set");
  }
  // Accept base64 data URL or raw base64 string
  let uploadData = imageData;
  if (imageData.startsWith("data:image")) {
    uploadData = imageData;
  } else {
    uploadData = `data:image/jpeg;base64,${imageData}`;
  }
  try {
    const result = await cloudinary.uploader.upload(uploadData, {
      folder: "game-covers",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}