import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export const loader = async ({ params }: { params: { id: string } }) => {
  const prisma = new PrismaClient();
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      price: true,
      rating: true,
      releaseDate: true,
      category: { select: { title: true } },
    },
  });
  return json({ game });
};

export default function AboutGame() {
  const { game } = useLoaderData<typeof loader>();
  if (!game) return <div className="container mx-auto px-8 py-8">Game not found.</div>;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-12">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-10 w-full max-w-3xl flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400 text-center">{game.title}</h1>
        {game.imageUrl && (
          <img src={game.imageUrl} alt={game.title} className="rounded-lg shadow mb-8 max-h-[400px] w-auto object-contain mx-auto" />
        )}
        <div className="w-full flex flex-col gap-4 text-lg text-slate-200 mb-8">
          <div><span className="font-semibold text-cyan-300">Category:</span> {game.category?.title || 'Uncategorized'}</div>
          <div><span className="font-semibold text-cyan-300">Rating:</span> {game.rating ?? 'N/A'}</div>
          <div><span className="font-semibold text-cyan-300">Price:</span> {game.price != null ? `$${game.price.toFixed(2)}` : 'N/A'}</div>
          <div><span className="font-semibold text-cyan-300">Release Date:</span> {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}</div>
        </div>
        <div className="bg-gray-800 rounded p-6 shadow w-full text-slate-100 text-lg">
          {game.description}
        </div>
      </div>
    </div>
  );
}
