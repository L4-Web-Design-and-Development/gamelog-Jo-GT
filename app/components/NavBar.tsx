import { Link } from "@remix-run/react";
import siteLogo from "~/assets/svg/gamelog-logo.svg";

export default function Navbar() {
  return (
    <nav className="container mx-auto flex justify-between flex-wrap py-8 p-8">
      <div>
        <Link to="/">
          <img src={siteLogo} alt="GameLog Logo" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link to="/add-game">Add Games</Link>
        <Link to="/games">Games</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </div>
    </nav>
  );
}