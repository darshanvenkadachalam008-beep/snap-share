import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { explorePosts, users } from "@/data/mockData";
import { motion } from "framer-motion";

const Search = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-[935px] px-4 py-4">
      {/* Search Input */}
      <div className="relative mb-4">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onFocus={() => query && setShowResults(true)}
          className="w-full rounded-lg bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="mb-4 rounded-lg border border-border bg-card">
          {filteredUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer">
              <img src={user.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.displayName}</p>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No results found.</p>
          )}
        </div>
      )}

      {/* Explore Grid */}
      {!showResults && (
        <div className="grid grid-cols-3 gap-1">
          {explorePosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative aspect-square cursor-pointer overflow-hidden"
            >
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-foreground/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1 text-sm font-semibold text-primary-foreground">
                  ❤️ {post.likesCount.toLocaleString()}
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
