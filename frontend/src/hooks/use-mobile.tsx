import * as React from "react"
import { Link } from "react-router-dom";

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export default function LogoHeader() {
  return (
    <header className="w-full flex items-center px-6 py-4 shadow-sm bg-white">
      <Link to="/" className="flex items-center gap-2 group">
        {/* Replace with your SVG or image if you have a logo file */}
        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent group-hover:opacity-80 transition">
          SPARK
        </span>
      </Link>
    </header>
  );
}
