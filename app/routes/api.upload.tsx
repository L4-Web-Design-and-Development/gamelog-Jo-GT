import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { uploadImage } from "~/utils/cloudinary.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const imageData = formData.get("image") as string;

    if (!imageData) {
      return json({ error: "No image provided" }, { status: 400 });
    }

    const imageUrl = await uploadImage(imageData);
    return json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return json({ error: "Failed to upload image" }, { status: 500 });
  }
}