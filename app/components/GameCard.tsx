interface GameCardProps {
    title: string;
    releaseDate: string;
    genre: string;
  }
  
  export default function GameCard({ title, releaseDate, genre }: GameCardProps) {
    const formattedDate = releaseDate.substring(0, 10);
  
    return (
      <div className="flex flex-col gap-4">
        <div className="relative h-72 overflow-hidden">
          <img
            src="https://picsum.photos/400/300"
            alt="Game Cover"
            className="w-full object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between">
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
  