import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function LogoHeader() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-white">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent group-hover:opacity-80 transition">
          SPARK
        </span>
      </Link>
      <Button asChild>
        <Link to="/worldmap">Worldmap</Link>
      </Button>
    </header>
  );
} 