import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import GameCard from "~/components/GameCard";
import gamelogFallback from "~/assets/svg/gamelog-logo.svg";
import { getUserId } from "../utils/auth.server";


export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function loader({ request }: { request: Request }) {
  const prisma = new PrismaClient();
  const userId = await getUserId(request);

  // All games (limit 6 for preview)
  const games = await prisma.game.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      releaseDate: true,
      imageUrl: true,
      category: { select: { title: true } },
    },
  });

  // User's games (limit 6 for preview)
  let userGames: typeof games = [];
  let username: string | null = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    username = user?.username || null;
    userGames = await prisma.game.findMany({
      where: { userId },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        releaseDate: true,
        imageUrl: true,
        category: { select: { title: true } },
      },
    });
  }

  // Top rated games (limit 6 for preview)
  const topRatedGames = await prisma.game.findMany({
    take: 6,
    orderBy: { rating: "desc" },
    select: {
      id: true,
      title: true,
      releaseDate: true,
      imageUrl: true,
      rating: true,
      category: { select: { title: true } },
    },
  });

  return json({ games, userGames, topRatedGames, username });
}

export default function Index() {
  const { games, userGames, topRatedGames, username } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto px-8 py-8 flex flex-col gap-16">
      {/* All Games Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">Games</h2>
          <a href="/about" className="text-cyan-300 hover:underline">See all</a>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {/* Add Game Rectangle Card */}
          <div className="col-span-3 flex justify-center mb-8">
            <div className="flex flex-col items-center justify-center bg-gray-900 rounded-2xl shadow-xl p-12 w-full max-w-2xl border-2 border-cyan-600">
              <img src={gamelogFallback} alt="Add Game" className="h-28 w-28 mb-6" />
              <a href="/add-game" className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-12 rounded-lg text-2xl transition shadow-lg">+ Add Game</a>
            </div>
          </div>
          {/* Actual game cards */}
          {games.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              releaseDate={game.releaseDate}
              imageUrl={game.imageUrl || gamelogFallback}
              genre={game.category?.title || "No Category"}
              hideActions={true}
            />
          ))}
        </div>
      </section>
      {/* User's Games Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">{username ? `${username}'s Games` : 'Your Games'}</h2>
          <a href="/games" className="text-cyan-300 hover:underline">See all</a>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {userGames.length === 0 ? (
            <p className="col-span-3 text-center text-slate-400">{username ? 'No games added yet.' : 'Log in to see your games.'}</p>
          ) : (
            userGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                releaseDate={game.releaseDate}
                imageUrl={game.imageUrl || gamelogFallback}
                genre={game.category?.title || "No Category"}
                hideActions={true}
              />
            ))
          )}
        </div>
      </section>
      {/* Top Rated Games Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">Top Rated Games</h2>
          <a href="/about" className="text-cyan-300 hover:underline">See all</a>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {topRatedGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              releaseDate={game.releaseDate}
              imageUrl={game.imageUrl || gamelogFallback}
              genre={game.category?.title || "No Category"}
              hideActions={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}