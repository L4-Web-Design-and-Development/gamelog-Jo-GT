interface GameCardProps {
    id: string;
    title: string;
    releaseDate: string;
    genre: string;
    imageUrl: string;
    hideActions?: boolean;
  }
  
  import { useFetcher, useNavigate } from "@remix-run/react";
  
  export default function GameCard({
    id,
    title,
    releaseDate,
    genre,
    imageUrl,
    hideActions = false,
  }: GameCardProps) {
    const formattedDate = releaseDate.substring(0, 10);
    const fetcher = useFetcher();
    const navigate = useNavigate();
  
    return (
      <div className="flex flex-col gap-4 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10 relative h-full group">
        <div className="relative h-72 overflow-hidden rounded-md group">
          <img
            src={imageUrl}
            alt={`${title} cover`}
            className="w-full object-cover h-full rounded-md transition duration-200 group-hover:blur-sm"
          />
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white font-bold text-lg rounded-md"
            onClick={() => navigate(`/about/${id}`)}
          >
            View
          </button>
          <div className="absolute bottom-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              className="bg-blue-600 text-white rounded px-2 py-1 text-xs hover:bg-blue-800 transition"
              onClick={() => navigate(`/add-game?id=${id}`)}
            >
              Edit
            </button>
            <fetcher.Form method="post" action="/delete-game">
              <input type="hidden" name="id" value={id} />
              <button type="submit" className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-800 transition">Delete</button>
            </fetcher.Form>
          </div>
        </div>
        <div className="flex justify-between flex-1">
          <div className="flex flex-col justify-between w-2/3">
            <h3 className="font-bold text-2xl text-slate-300">{title}</h3>
            <p className="text-cyan-300 uppercase text-sm font-semibold">
              {genre}
            </p>
            <p className="text-slate-200/60 text-sm font-semibold">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    );
  }
