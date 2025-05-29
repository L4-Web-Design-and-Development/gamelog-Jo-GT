import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getUserId, getUserById } from "../utils/auth.server";
import { PrismaClient } from "@prisma/client";
import GameCard from "../components/GameCard";
import gamelogFallback from "../assets/svg/gamelog-logo.svg";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) return json({ notLoggedIn: true, games: [], username: null, userProfilePic: null });
  const prisma = new PrismaClient();
  const user = await getUserById(userId);
  const games = await prisma.game.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      rating: true,
      releaseDate: true,
      imageUrl: true,
      category: { select: { title: true } },
    },
  });
  return json({ games, username: user?.username, userProfilePic: user?.profilePic, notLoggedIn: false });
};

export default function Games() {
  const data = useLoaderData<{ games: { id: string; title: string; description: string; price: number; rating: number; releaseDate: string; imageUrl?: string; category?: { title: string } }[]; username: string | null; userProfilePic: string | null; notLoggedIn: boolean }>();
  if (data.notLoggedIn) {
    return (
      <div className="container mx-auto px-8 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your games.</h1>
        <Link to="/login" className="btn btn-primary">Log in</Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img src={data.userProfilePic || "/assets/svg/gamelog-logo.svg"} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400" />
          <h1 className="text-3xl font-bold">{data.username}&apos;s Games</h1>
        </div>
        <Link to="/games/add" className="btn btn-primary">Add New Game</Link>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {data.games.length === 0 && <p>You haven&apos;t added any games yet.</p>}
        {data.games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            releaseDate={game.releaseDate || ""}
            genre={game.category?.title || ""}
            imageUrl={game.imageUrl && game.imageUrl.trim() !== '' ? game.imageUrl : gamelogFallback}
            price={game.price}
            rating={game.rating}
          />
        ))}
      </div>
    </div>
  );
}
