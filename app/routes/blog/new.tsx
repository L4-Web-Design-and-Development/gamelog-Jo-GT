import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { getUserId } from "../../utils/auth.server";
import { PrismaClient } from "@prisma/client";

export const loader = async () => {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({ select: { id: true, title: true } });
  return json({ games });
};

export const action = async ({ request }: { request: Request }) => {
  const prisma = new PrismaClient();
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const gameId = formData.get("gameId") as string;
  await prisma.blogPost.create({
    data: { title, content, gameId, userId },
  });
  return redirect("/blog");
};

export default function BlogNew() {
  const { games } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-cyan-400">Add Blog Post</h1>
        <Form method="post" className="flex flex-col gap-4 w-full">
          <input name="title" type="text" placeholder="Title" required className="input input-bordered bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-cyan-400" />
          <textarea name="content" placeholder="Write your blog post here..." required className="textarea textarea-bordered min-h-[150px] bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-cyan-400" />
          <select name="gameId" required className="select select-bordered bg-white text-black focus:ring-2 focus:ring-cyan-400">
            <option value="">Select a game</option>
            {games.map((game: { id: string; title: string }) => (
              <option key={game.id} value={game.id}>{game.title}</option>
            ))}
          </select>
          <div className="flex justify-between w-full mt-4">
            <Link to="/blog" className="text-red-400 border-2 border-red-400 py-2 px-4 rounded-md hover:bg-red-50/10 transition duration-200">Cancel</Link>
            <button type="submit" className="bg-cyan-600 text-white py-2 px-6 rounded-md hover:bg-cyan-500 transition duration-200 font-bold">Post</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
