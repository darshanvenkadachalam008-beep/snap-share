import { useStories } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useSupabase";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Demo stories for when database is empty
const demoStories = [
  { id: "demo-1", username: "travel_life", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { id: "demo-2", username: "food_lover", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { id: "demo-3", username: "nature_pics", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { id: "demo-4", username: "city_vibes", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
  { id: "demo-5", username: "art_daily", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
];

const StoriesBar = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: stories } = useStories();

  const hasRealStories = stories && stories.length > 0;

  return (
    <div className="border-b border-border bg-card py-4">
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4">
        {/* Your story */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-shrink-0 flex-col items-center gap-1"
        >
          <Link to="/create" className="relative">
            <div className="rounded-full border-2 border-muted p-0.5">
              <img
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150"}
                alt="Your story"
                className="h-14 w-14 rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary">
              <Plus size={12} className="text-primary-foreground" />
            </div>
          </Link>
          <span className="max-w-[66px] truncate text-xs text-foreground">Your story</span>
        </motion.div>

        {/* Real stories from database */}
        {hasRealStories &&
          stories.map((story: any, index: number) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index + 1) * 0.05 }}
              className="flex flex-shrink-0 flex-col items-center gap-1"
            >
              <div className="ig-story-ring">
                <div className="rounded-full border-2 border-card">
                  <img
                    src={story.profiles.avatar_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150"}
                    alt={story.profiles.username}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="max-w-[66px] truncate text-xs text-foreground">
                {story.profiles.username}
              </span>
            </motion.button>
          ))}

        {/* Demo stories when no real stories exist */}
        {!hasRealStories &&
          demoStories.map((story, index) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index + 1) * 0.05 }}
              className="flex flex-shrink-0 flex-col items-center gap-1"
            >
              <div className="ig-story-ring">
                <div className="rounded-full border-2 border-card">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="max-w-[66px] truncate text-xs text-foreground">
                {story.username}
              </span>
            </motion.button>
          ))}
      </div>
    </div>
  );
};

export default StoriesBar;
