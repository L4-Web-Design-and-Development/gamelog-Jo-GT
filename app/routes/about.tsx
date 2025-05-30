import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate, useParams } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import GameCard from "../components/GameCard";
import gamelogFallback from "../assets/svg/gamelog-logo.svg";
import { useState } from "react";

export const loader = async () => {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      releaseDate: true,
      price: true,
      rating: true,
      category: { select: { title: true } },
    },
    orderBy: { title: "asc" },
  });
  return json({ games });
};

export default function About() {
  const { games } = useLoaderData<typeof loader>();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const selectedGame = games.find((g) => g.id === selectedGameId);
  // Use the actual imageUrl for each game, fallback to gamelogFallback only if missing or empty
  return (
    <div className="container mx-auto px-4 py-8 sm:px-2 sm:py-4">
      <h1 className="text-3xl font-bold mb-6 text-center">About - Game List</h1>
      {selectedGame && (
        <div className="w-full max-w-2xl mx-auto mb-6 bg-gray-900 p-4 sm:p-2 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-cyan-400">{selectedGame.title}</h2>
          <p className="text-base sm:text-sm text-slate-200 whitespace-pre-line">{selectedGame.description}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {games.map((game: { id: string; title: string; description: string; imageUrl?: string; releaseDate?: string; price: number; rating: number; category?: { title: string } }) => (
          <button
            key={game.id}
            onClick={() => setSelectedGameId(game.id)}
            className={`cursor-pointer bg-transparent border-none p-0 text-left focus:outline-none w-full ${selectedGameId === game.id ? 'ring-2 ring-cyan-400' : ''}`}
            tabIndex={0}
            aria-label={`Show description for ${game.title}`}
          >
            <GameCard
              id={game.id}
              title={game.title}
              releaseDate={game.releaseDate || ""}
              genre={game.category?.title || ""}
              imageUrl={game.imageUrl && game.imageUrl.trim() !== '' ? game.imageUrl : gamelogFallback}
              price={game.price}
              rating={game.rating}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
