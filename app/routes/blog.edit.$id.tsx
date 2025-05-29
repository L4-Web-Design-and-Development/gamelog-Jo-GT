import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { getUserId } from "../utils/auth.server";

export const loader = async ({ params }: { params: { id: string } }) => {
  const prisma = new PrismaClient();
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: { game: true },
  });
  const games = await prisma.game.findMany({ select: { id: true, title: true } });
  return json({ post, games });
};

export const action = async ({ request, params }: { request: Request, params: { id: string } }) => {
  const prisma = new PrismaClient();
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const gameId = formData.get("gameId") as string;
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");
  await prisma.blogPost.update({
    where: { id: params.id, userId },
    data: { title, content, gameId },
  });
  return redirect("/blog");
};

export default function EditBlogPost() {
  const { post, games } = useLoaderData<typeof loader>();
  if (!post) return <div>Post not found.</div>;
  return (
    <div className="container mx-auto px-8 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <Form method="post" className="flex flex-col gap-4">
        <input name="title" type="text" defaultValue={post.title} required className="input input-bordered" />
        <textarea name="content" defaultValue={post.content} required className="textarea textarea-bordered min-h-[150px]" />
        <select name="gameId" required className="select select-bordered" defaultValue={post.gameId}>
          <option value="">Select a game</option>
          {games.map((game: any) => (
            <option key={game.id} value={game.id}>{game.title}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Update Post</button>
      </Form>
    </div>
  );
}
