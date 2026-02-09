import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchUsers, Profile } from "@/hooks/useSupabase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Demo explore posts
const explorePosts = [
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1540206395-68808572332f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
];

const Search = () => {
  const [query, setQuery] = useState("");
  const { data: users, isLoading } = useSearchUsers(query);
  const showResults = query.length >= 2;

  return (
    <div className="mx-auto max-w-[935px] px-4 py-4">
      {/* Search Input */}
      <div className="relative mb-4">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="mb-4 rounded-lg border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : users && users.length > 0 ? (
            users.map((user: Profile) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
              >
                <img
                  src={user.avatar_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150"}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-foreground">{user.username}</p>
                    {user.is_verified && <span className="text-primary">✓</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.display_name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No results found.</p>
          )}
        </div>
      )}

      {/* Explore Grid */}
      {!showResults && (
        <div className="grid grid-cols-3 gap-1">
          {explorePosts.map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative aspect-square cursor-pointer overflow-hidden"
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-foreground/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1 text-sm font-semibold text-primary-foreground">
                  ❤️ {Math.floor(Math.random() * 5000) + 100}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
