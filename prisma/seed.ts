import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const categories = [
    {
      title: "Action",
      description: "Games that require quick reflexes and hand-eye coordination.",
    },
    {
      title: "Adventure",
      description: "Games that involve exploration and puzzle-solving.",
    },
    {
      title: "RPG",
      description: "Games that focus on character development and story.",
    },
    {
      title: "Simulation",
      description: "Games that simulate real-world activities or systems.",
    },
    {
      title: "Strategy",
      description: "Games that require strategic thinking and planning.",
    },
    {
      title: "Puzzle",
      description: "Games that challenge players with logic and problem-solving.",
    },
    {
      title: "Sports",
      description: "Games that simulate sports or physical activities.",
    },
    {
      title: "Multiplayer",
      description: "Games that can be played with multiple players.",
    },
    {
      title: "Indie",
      description: "Games developed by independent studios or individuals.",
    },
    {
      title: "Horror",
      description: "Games that aim to scare or unsettle players.",
    },
  ];

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  console.log("🎮 Categories created successfully");

  const games = [
    {
      title: "The Legend of Zelda: Breath of the Wild",
      description: "An open-world adventure game set in the kingdom of Hyrule.",
      price: 59.99,
      rating: 4.9,
      releaseDate: new Date("2017-03-03"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701148/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58_rooxmf.jpg"
    },
    {
      title: "The Witcher 3: Wild Hunt",
      description: "An action RPG set in a fantasy world full of monsters and magic.",
      price: 39.99,
      rating: 4.8,
      releaseDate: new Date("2015-05-19"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701074/xe9pwmbklc551_qn5gxk.jpg"
    },
    {
      title: "Red Dead Redemption 2",
      description: "An open-world western adventure game.",
      price: 59.99,
      rating: 4.7,
      releaseDate: new Date("2018-10-26"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746700970/hq720_j1y35d.jpg"
    },
    {
      title: "God of War",
      description: "An action-adventure game based on Norse mythology.",
      price: 49.99,
      rating: 4.9,
      releaseDate: new Date("2018-04-20"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701180/g-o-d-o-f-w-a-r_mbco8i.png"
    },
    {
      title: "Minecraft",
      description: "A sandbox game where players can build and explore their own worlds.",
      price: 26.95,
      rating: 4.8,
      releaseDate: new Date("2011-11-18"),
      imageUrl:
        "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701218/2_kigjoh.png",
    },
    {
      title: "Fortnite",
      description: "A battle royale game where players fight to be the last one standing.",
      price: 0.0,
      rating: 4.5,
      releaseDate: new Date("2017-07-25"),
      imageUrl:
        "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701118/mixcollage-27-dec-2024-08-32-am-4380_tub5v4.jpg",
    },
    {
      title: "Cyberpunk 2077",
      description: "An open-world RPG set in a dystopian future.",
      price: 59.99,
      rating: 4.0,
      releaseDate: new Date("2020-12-10"),
      imageUrl:
        "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701021/cyberpunk-2077-johnny-judy_wkmpod.png",

    },
    {
      title: "Among Us",
      description: "A multiplayer game where players work together to complete tasks on a spaceship.",
      price: 4.99,
      rating: 4.4,
      releaseDate: new Date("2018-06-15"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701038/AU3D-KeyArt-NoLogo-2560x1440-1_gpkffz.webp"
    },
    {
      title: "Animal Crossing: New Horizons",
      description: "A life simulation game where players can build and manage their own island.",
      price: 59.99,
      rating: 4.9,
      releaseDate: new Date("2020-03-20"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701249/9989957eae3a6b545194c42fec2071675c34aadacd65e6b33fdfe7b3b6a86c3a_uga9a9.jpg"
    },
    {
      title: "Hades",
      description: "A rogue-like dungeon crawler where players fight their way out of the Underworld.",
      price: 24.99,
      rating: 4.9,
      releaseDate: new Date("2020-09-17"),
      imageUrl:
      "https://res.cloudinary.com/dms4l5bab/image/upload/v1746701278/dbc8c55a21688b446a5c57711b726956483a14ef8c5ddb861f897c0595ccb6b5_zlhlj1.jpg"
    },
  ];

  for (const game of games) {
    await prisma.game.create({ data: game });
  }

  console.log("👾 Games created successfully");

  console.log("🔗 Linking each game to a category");

  // Fetch from DB
  const dbGames = await prisma.game.findMany();
  const dbCategories = await prisma.category.findMany();

  // Link each game to a random category
  for (const game of dbGames) {
    const category = dbCategories[Math.floor(Math.random() * dbCategories.length)];
    await prisma.game.update({
      where: { id: game.id },
      data: { categoryId: category.id },
    });
  }

  console.log("✅ Games and categories linked");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
