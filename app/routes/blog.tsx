import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export const loader = async () => {
  const prisma = new PrismaClient();
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, username: true } },
      game: { select: { title: true } },
    },
  });
  return json({ posts });
};

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog</h1>
        <Link to="/blog/new" className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg shadow transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Blog Post
        </Link>
      </div>
      <div className="space-y-8">
        {posts.length === 0 && <p>No blog posts yet.</p>}
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 rounded p-6 shadow relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <Link to={`/blog/edit/${post.id}`} className="btn btn-xs btn-secondary">Edit</Link>
              <form method="post" action="/blog/delete">
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="btn btn-xs btn-error">Delete</button>
              </form>
            </div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="mb-2 text-gray-300">{post.content}</p>
            <div className="text-sm text-gray-400">
              Game: {post.game?.title || "Unknown"} | By: {post.user?.username || post.user?.email || "Unknown"} | {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
