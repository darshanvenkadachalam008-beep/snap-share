import { stories } from "@/data/mockData";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const StoriesBar = () => {
  return (
    <div className="border-b border-border bg-card py-4">
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-shrink-0 flex-col items-center gap-1"
          >
            <div className={`relative ${story.seen ? "opacity-60" : ""}`}>
              <div className={`ig-story-ring ${story.seen ? "!bg-muted" : ""}`}>
                <div className="rounded-full border-2 border-card">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
              </div>
              {story.id === "your-story" && (
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary">
                  <Plus size={12} className="text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="max-w-[66px] truncate text-xs text-foreground">
              {story.user.username}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
