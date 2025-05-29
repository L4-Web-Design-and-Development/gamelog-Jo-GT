import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate, useParams } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import GameCard from "../components/GameCard";
import gamelogFallback from "../assets/svg/gamelog-logo.svg";

export const loader = async () => {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({
    select: { id: true, title: true, description: true },
    orderBy: { title: "asc" },
  });
  return json({ games });
};

export default function About() {
  const { games } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  // Use the actual imageUrl for each game, fallback to gamelogFallback only if missing or empty
  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">About - Game List</h1>
      <div className="grid grid-cols-3 gap-8">
        {games.map((game: { id: string; title: string; description: string; imageUrl?: string; releaseDate?: string; category?: { title: string } }) => (
          <button
            key={game.id}
            onClick={() => navigate(`/about/${game.id}`)}
            className="cursor-pointer bg-transparent border-none p-0 text-left focus:outline-none"
            tabIndex={0}
            aria-label={`View details for ${game.title}`}
          >
            <GameCard
              id={game.id}
              title={game.title}
              releaseDate={game.releaseDate || ""}
              genre={game.category?.title || ""}
              imageUrl={game.imageUrl && game.imageUrl.trim() !== '' ? game.imageUrl : gamelogFallback}
              hideActions={true}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
