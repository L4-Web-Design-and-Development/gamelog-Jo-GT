import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export const loader = async ({ params }: { params: { id: string } }) => {
  const prisma = new PrismaClient();
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    select: { id: true, title: true, description: true },
  });
  return json({ game });
};

export default function AboutGame() {
  const { game } = useLoaderData<typeof loader>();
  if (!game) return <div className="container mx-auto px-8 py-8">Game not found.</div>;
  return (
    <div className="container mx-auto px-8 py-8 max-w-2xl">
      <Link to="/about" className="text-cyan-400 hover:underline">&larr; Back to all games</Link>
      <h1 className="text-3xl font-bold mb-4 mt-4">{game.title}</h1>
      <p className="text-lg text-slate-200 bg-gray-900 rounded p-6 shadow mt-2">{game.description}</p>
    </div>
  );
}
