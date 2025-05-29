import { json } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export const loader = async () => {
  const prisma = new PrismaClient();
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
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
        <Link to="/blog/new" className="btn btn-primary">New Post</Link>
      </div>
      <div className="space-y-8">
        {posts.length === 0 && <p>No blog posts yet.</p>}
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 rounded p-6 shadow relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <Link to={`/blog/edit/${post.id}`} className="btn btn-xs btn-secondary">Edit</Link>
              <Form method="post" action="/blog/delete">
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="btn btn-xs btn-error">Delete</button>
              </Form>
            </div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="mb-2 text-gray-300">{post.content}</p>
            <div className="text-sm text-gray-400">
              Game: {post.game?.title || "Unknown"} | By: {post.user?.email || "Unknown"} | {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
