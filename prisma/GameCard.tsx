interface GameCardProps {
    title: string;
    releaseDate: string;
  }
  export default function GameCard({ title, releaseDate }: GameCardProps) {
    const formattedDate = releaseDate.substring(0, 10);