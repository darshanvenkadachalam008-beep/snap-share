import { Link, useLocation } from "react-router-dom";
import { Home, Search, Film, PlusSquare, User } from "lucide-react";

const navItems = [
  { icon: Home, path: "/" },
  { icon: Search, path: "/search" },
  { icon: PlusSquare, path: "/create" },
  { icon: Film, path: "/reels" },
  { icon: User, path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card py-2 md:hidden">
      {navItems.map(({ icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <Link key={path} to={path} className="p-2">
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.5}
              className="text-foreground"
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
