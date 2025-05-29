import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { getUserId } from "../utils/auth.server";

export const loader = async () => {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({ select: { id: true, title: true } });
  return json({ games });
};

export const action = async ({ request }: { request: Request }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const gameId = formData.get("gameId") as string;
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");
  await prisma.blogPost.create({
    data: { title, content, gameId, userId },
  });
  return redirect("/blog");
};

export default function NewBlogPost() {
  const { games } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto px-8 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <Form method="post" className="flex flex-col gap-4">
        <input name="title" type="text" placeholder="Title" required className="input input-bordered" />
        <textarea name="content" placeholder="Write your blog post here..." required className="textarea textarea-bordered min-h-[150px]" />
        <select name="gameId" required className="select select-bordered">
          <option value="">Select a game</option>
          {games.map((game: any) => (
            <option key={game.id} value={game.id}>{game.title}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Create Post</button>
      </Form>
    </div>
  );
}
