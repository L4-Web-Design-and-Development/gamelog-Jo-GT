import { useState } from "react";

interface GameCardProps {
    id: string;
    title: string;
    releaseDate: string;
    genre: string;
    imageUrl: string;
    price: number;
    rating: number;
  }
  
  import { useFetcher, useNavigate } from "@remix-run/react";
  
  export default function GameCard({
    id,
    title,
    releaseDate,
    genre,
    imageUrl,
    price,
    rating,
  }: GameCardProps) {
    const formattedDate = releaseDate.substring(0, 10);
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
  
    return (
      <div className="flex flex-col gap-4 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10 relative h-full group w-full">
        <div className="relative h-64 sm:h-72 overflow-hidden rounded-md group">
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
            <button
              type="button"
              className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-800 transition"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </button>
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 shadow-xl flex flex-col items-center">
                  <p className="text-lg text-slate-200 mb-6">Are you sure you want to delete <span className="text-cyan-400 font-bold">{title}</span>?</p>
                  <div className="flex gap-6">
                    <button
                      className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold transition"
                      onClick={() => {
                        fetcher.submit({ id }, { method: 'post', action: '/delete-game' });
                        setShowConfirm(false);
                      }}
                    >
                      Yes, Delete
                    </button>
                    <button
                      className="bg-gray-700 text-slate-200 px-6 py-2 rounded hover:bg-gray-600 font-semibold transition"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between flex-1">
          <div className="flex flex-col justify-between w-full">
            <h3 className="font-bold text-xl sm:text-2xl text-slate-300 line-clamp-2 break-words">{title}</h3>
            <p className="text-cyan-300 uppercase text-xs sm:text-sm font-semibold">
              {genre}
            </p>
            <div className="flex gap-4 text-slate-200/80 text-xs sm:text-sm font-semibold mt-1">
              <span>💲{price.toFixed(2)}</span>
              <span>⭐ {rating.toFixed(1)}</span>
            </div>
            <p className="text-slate-200/60 text-xs sm:text-sm font-semibold">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    );
  }
