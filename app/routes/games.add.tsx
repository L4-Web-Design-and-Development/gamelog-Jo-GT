import { json, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { getUserId } from "../utils/auth.server";
import ImageUploader from "../components/ImageUploader";
import { useState } from "react";
import { useLoaderData, Form, Link, useActionData } from "@remix-run/react";

export const loader = async ({ request }: { request: Request }) => {
  const prisma = new PrismaClient();
  const categories = await prisma.category.findMany({ select: { id: true, title: true } });
  return json({ categories });
};

export const action = async ({ request }: { request: Request }) => {
  const prisma = new PrismaClient();
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");
  const formData = await request.formData();
  const title = (formData.get("title") as string || '').trim();
  const description = (formData.get("description") as string || '').trim();
  const price = parseFloat(formData.get("price") as string);
  const rating = parseFloat(formData.get("rating") as string);
  const releaseDateStr = formData.get("releaseDate") as string;
  const releaseDate = new Date(releaseDateStr);
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : undefined;
  const hoursPlayed = formData.get("hoursPlayed") ? parseFloat(formData.get("hoursPlayed") as string) : undefined;
  const completedDate = formData.get("completedDate") ? new Date(formData.get("completedDate") as string) : undefined;

  // Validation
  const errors: Record<string, string> = {};
  if (!title || title.length < 2 || title.length > 100) errors.title = "Title must be 2-100 characters.";
  if (!description || description.length < 10 || description.length > 1000) errors.description = "Description must be 10-1000 characters.";
  if (isNaN(price) || price < 0 || price > 1000) errors.price = "Price must be between 0 and 1000.";
  if (isNaN(rating) || rating < 0 || rating > 5) errors.rating = "Rating must be between 0 and 5.";
  if (!releaseDateStr || isNaN(releaseDate.getTime()) || releaseDate > new Date()) errors.releaseDate = "Release date is required and cannot be in the future.";
  if (!categoryId) errors.categoryId = "Category is required.";

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  await prisma.game.create({
    data: {
      title,
      description,
      price,
      rating,
      releaseDate,
      imageUrl,
      categoryId: categoryId === "" ? null : categoryId,
      userId,
      startDate,
      hoursPlayed,
      completedDate,
    },
  });
  return redirect("/games");
};

export default function AddGame() {
  const { categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ errors?: Record<string, string> }>();
  const [imageUrl, setImageUrl] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  function validate(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const errors: Record<string, string> = {};
    const title = (formData.get("title") as string || '').trim();
    const description = (formData.get("description") as string || '').trim();
    const price = parseFloat(formData.get("price") as string);
    const rating = parseFloat(formData.get("rating") as string);
    const releaseDate = new Date(formData.get("releaseDate") as string);
    const categoryId = formData.get("categoryId") as string;
    if (!title || title.length < 2 || title.length > 100) errors.title = "Title must be 2-100 characters.";
    if (!description || description.length < 10 || description.length > 1000) errors.description = "Description must be 10-1000 characters.";
    if (isNaN(price) || price < 0 || price > 1000) errors.price = "Price must be between 0 and 1000.";
    if (isNaN(rating) || rating < 0 || rating > 5) errors.rating = "Rating must be between 0 and 5.";
    if (!formData.get("releaseDate") || isNaN(releaseDate.getTime()) || releaseDate > new Date()) errors.releaseDate = "Release date is required and cannot be in the future.";
    if (!categoryId) errors.categoryId = "Category is required.";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) e.preventDefault();
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="font-bold text-5xl text-center mb-10">Add <span className="text-cyan-400">Game</span></h1>
      <div className="max-w-2xl mx-auto bg-gray-950 p-8 rounded-xl">
        <Form method="post" className="space-y-6" onSubmit={validate}>
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2 text-slate-400">Title</label>
            <input type="text" id="title" name="title" required minLength={2} maxLength={100} className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            <p className="text-red-400 text-xs mt-1">{formErrors.title || actionData?.errors?.title}</p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-slate-400">Description</label>
            <textarea id="description" name="description" required minLength={10} maxLength={1000} rows={4} className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
            <p className="text-red-400 text-xs mt-1">{formErrors.description || actionData?.errors?.description}</p>
          </div>
          <div className="mb-8">
            <ImageUploader onImageUploaded={url => { setImageUrl(url); setUploading(false); }} inputId="game-image-upload" />
            {imageUrl && <img src={imageUrl} alt="Game cover preview" className="mt-2 h-32 rounded" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2 text-slate-400">Price</label>
              <input type="number" id="price" name="price" step="0.01" min={0} max={1000} required className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <p className="text-red-400 text-xs mt-1">{formErrors.price || actionData?.errors?.price}</p>
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-2 text-slate-400">Rating</label>
              <input type="number" id="rating" name="rating" step="0.1" min={0} max={5} required className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <p className="text-red-400 text-xs mt-1">{formErrors.rating || actionData?.errors?.rating}</p>
            </div>
          </div>
          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium mb-2 text-slate-400">Release Date</label>
            <input type="date" id="releaseDate" name="releaseDate" required className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            <p className="text-red-400 text-xs mt-1">{formErrors.releaseDate || actionData?.errors?.releaseDate}</p>
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium mb-2 text-slate-400">Category</label>
            <select id="categoryId" name="categoryId" required className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.title}</option>
              ))}
            </select>
            <p className="text-red-400 text-xs mt-1">{formErrors.categoryId || actionData?.errors?.categoryId}</p>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-2 text-slate-400">Start Date</label>
            <input type="date" id="startDate" name="startDate" className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label htmlFor="hoursPlayed" className="block text-sm font-medium mb-2 text-slate-400">Hours Played (optional)</label>
            <input type="number" id="hoursPlayed" name="hoursPlayed" step="0.1" min={0} className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label htmlFor="completedDate" className="block text-sm font-medium mb-2 text-slate-400">Completed Date (optional)</label>
            <input type="date" id="completedDate" name="completedDate" className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="flex justify-end gap-16">
            <Link to="/games" className="text-red-300 border-2 border-red-300 py-3 px-6 rounded-md hover:bg-red-50/10 transition duration-200">Cancel</Link>
            <button type="submit" className="bg-cyan-600 text-white py-3 px-6 rounded-md hover:bg-cyan-500 transition duration-200" disabled={uploading || (!imageUrl && uploading !== false)}>Add Game</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
