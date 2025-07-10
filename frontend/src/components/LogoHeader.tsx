import { Link } from "react-router-dom";

export default function LogoHeader() {
  return (
    <header className="w-full flex items-center px-6 py-4 shadow-sm bg-white">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent group-hover:opacity-80 transition">
          SPARK
        </span>
      </Link>
    </header>
  );
} 