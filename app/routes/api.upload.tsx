import type { ActionFunctionArgs } from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";
import {
  unstable_parseMultipartFormData,
  unstable_createMemoryUploadHandler,
  json,
} from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const uploadHandler = unstable_createMemoryUploadHandler({
      maxPartSize: 5_000_000,
    });
    const formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const file = formData.get("image");
    if (!file || typeof file !== "object" || !(file instanceof File)) {
      return json({ error: "No image provided" }, { status: 400 });
    }
    // Use File.type for contentType, fallback to image/jpeg
    const contentType = file.type || "image/jpeg";
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${contentType};base64,${buffer.toString("base64")}`;
    const imageUrl = await uploadImage(base64);
    return json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return json({ error: "Failed to upload image" }, { status: 500 });
  }
}