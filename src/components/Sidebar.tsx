import { Link, useLocation } from "react-router-dom";
import { Home, Search, Film, Heart, PlusSquare, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Film, label: "Reels", path: "/reels" },
  { icon: PlusSquare, label: "Create", path: "/create" },
  { icon: Heart, label: "Notifications", path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[72px] flex-col border-r border-border bg-card py-6 px-2 lg:w-[245px] md:flex">
      <Link to="/" className="mb-8 px-3">
        <h1 className="hidden text-xl font-semibold tracking-tight text-foreground lg:block">
          Instagram
        </h1>
        <span className="block text-2xl lg:hidden">📷</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-accent ${
                  isActive ? "font-bold" : "font-normal"
                }`}
              >
                <Icon
                  size={26}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className="text-foreground"
                />
                <span className="hidden text-foreground lg:block">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
