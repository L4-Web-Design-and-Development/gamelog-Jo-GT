import { Link } from "@remix-run/react";

export function Footer() {
    return (
        <footer className="bg-[#0F161F] text-gray-400 p-8 text-center mt-8 grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
                <Link to="/" className="text-2xl font-bold text-[#3E94F9]">GameLog</Link>
                <div className="flex gap-4 mt-4">
                    <Link to="#">FB</Link>
                    <Link to="#">IG</Link>
                    <Link to="#">X</Link>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h3>Site</h3>
                <Link to="/games">Games</Link>
                <Link to="/about">About</Link>
                <Link to="/blog">Blog</Link>
            </div>
            <div className="flex flex-col items-center">
                <h3>Support</h3>
                <Link to="/contact">Contact Us</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/legal">Legal</Link>
            </div>
        </footer>
    );
}
