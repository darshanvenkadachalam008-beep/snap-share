import StoriesBar from "@/components/StoriesBar";
import PostCard from "@/components/PostCard";
import { useFeedPosts } from "@/hooks/useSupabase";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Demo posts for when database is empty
const demoPosts = [
  {
    id: "demo-1",
    user_id: "demo",
    image_url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop",
    caption: "Beautiful sunset views 🌅 #nature #travel",
    location: null,
    is_reel: false,
    video_url: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    profiles: {
      id: "demo",
      username: "travel_photography",
      display_name: "Travel Photography",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      bio: null,
      website: null,
      is_verified: true,
      is_private: false,
    },
    likes_count: 1234,
    comments_count: 56,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "demo-2",
    user_id: "demo",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    caption: "Mountain adventures await! 🏔️ #hiking #explore",
    location: null,
    is_reel: false,
    video_url: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    profiles: {
      id: "demo",
      username: "adventure_seeker",
      display_name: "Adventure Seeker",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: null,
      website: null,
      is_verified: false,
      is_private: false,
    },
    likes_count: 892,
    comments_count: 23,
    is_liked: false,
    is_saved: false,
  },
  {
    id: "demo-3",
    user_id: "demo",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
    caption: "Foodie paradise 🍕 #foodstagram #delicious",
    location: null,
    is_reel: false,
    video_url: null,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    profiles: {
      id: "demo",
      username: "foodie_diaries",
      display_name: "Foodie Diaries",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: null,
      website: null,
      is_verified: true,
      is_private: false,
    },
    likes_count: 2456,
    comments_count: 89,
    is_liked: false,
    is_saved: false,
  },
];

const Index = () => {
  const { data: posts, isLoading } = useFeedPosts();

  const displayPosts = posts && posts.length > 0 ? posts : demoPosts;

  return (
    <div className="mx-auto max-w-[470px]">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <h1 className="text-xl font-semibold italic text-foreground">Instagram</h1>
        <Link to="/notifications" className="text-foreground hover:text-muted-foreground transition-colors">
          <Heart size={24} />
        </Link>
      </header>

      <StoriesBar />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div>
          {displayPosts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {displayPosts === demoPosts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-border bg-card px-4 py-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Create your first post to see it in your feed!
              </p>
              <Link
                to="/create"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
              >
                Create Post
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
