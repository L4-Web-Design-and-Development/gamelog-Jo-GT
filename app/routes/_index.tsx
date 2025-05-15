import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import GameCard from "~/components/GameCard";
import gamelogFallback from "~/assets/svg/gamelog-logo.svg";
import { useState } from "react";
import { NavBar } from "~/components/NavBar";
import { Footer } from "~/components/Footer";
import { Add-Game } from "~/routes/add-game";

export const meta: MetaFunction = () => {
  return [
    { title: "GameLog" },
    { name: "description", content: "Track your games with GameLog." },
  ];
};

export async function loader() {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({
    select: {
      id: true,
      title: true,
      releaseDate: true,
      imageUrl: true,
      category: {
        select: {
          title: true,
        },
      },
    },
  });
  return json({ games });
}

export default function IndexPage() {
    const { games } = useLoaderData<typeof loader>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-[#0F161F] min-h-screen text-white flex flex-col">
            <Header onAddGameClick={() => setIsModalOpen(true)} />
            <main className="flex-grow p-8 container mx-auto grid grid-cols-3 gap-8">
                {games.map((game) => (
                    <GameCard
                        key={game.id}
                        title={game.title}
                        releaseDate={game.releaseDate}
                        imageUrl={game.imageUrl || gamelogFallback}
                        genre={game.category?.title || "No Category"}
                    />
                ))}
            </main>
            <Footer />
            {isModalOpen && <AddGameForm onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}