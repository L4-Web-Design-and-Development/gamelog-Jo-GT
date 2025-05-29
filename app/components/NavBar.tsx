import { Link, useFetcher } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import siteLogo from "~/assets/svg/gamelog-logo.svg";
// import { getUserId } from "../utils/auth.server";

export default function Navbar({ userId, userProfilePic }: { userId: string | null, userProfilePic?: string | null }) {
  const fetcher = useFetcher();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

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
        <div>
          {userId ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="rounded-full border-2 border-cyan-400 w-12 h-12 flex items-center justify-center bg-gray-900 focus:outline-none"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <img
                  src={userProfilePic || "/default-profile.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-50">
                  <Link to="/my-games" className="block px-4 py-2 hover:bg-gray-800">My Games</Link>
                  <fetcher.Form action="/logout" method="post">
                    <button type="submit" className="w-full text-left px-4 py-2 hover:bg-gray-800">Log out</button>
                  </fetcher.Form>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}