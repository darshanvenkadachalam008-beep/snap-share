import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Music, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const reelsData = [
  {
    id: "1",
    username: "travel_photography",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    thumbnail: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=1200&fit=crop",
    caption: "Dancing in the rain 💃 #travel #adventure",
    likes: 12500,
    comments: 234,
    isVerified: true,
  },
  {
    id: "2",
    username: "foodie_diaries",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=1200&fit=crop",
    caption: "Cooking masterclass 👨‍🍳 #food #cooking",
    likes: 8900,
    comments: 156,
    isVerified: false,
  },
  {
    id: "3",
    username: "adventure_seeker",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=1200&fit=crop",
    caption: "Mountain views 🏔️ #hiking #nature",
    likes: 25600,
    comments: 489,
    isVerified: true,
  },
  {
    id: "4",
    username: "art_daily",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=1200&fit=crop",
    caption: "Art timelapse 🎨 #art #creative",
    likes: 15200,
    comments: 278,
    isVerified: false,
  },
];

interface ReelCardProps {
  reel: typeof reelsData[0];
}

const ReelCard = ({ reel }: ReelCardProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    if (!user) {
      toast.error("Please log in to like");
      return;
    }
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please log in to save");
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/reels/" + reel.id);
    toast.success("Link copied!");
  };

  return (
    <div
      className="relative flex h-[calc(100vh-56px)] w-full snap-start items-end md:h-screen"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Background image simulating video */}
      <img src={reel.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

      {/* Play/Pause indicator */}
      {!isPlaying && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="rounded-full bg-foreground/50 p-4">
            <Play size={40} className="text-primary-foreground" fill="white" />
          </div>
        </motion.div>
      )}

      {/* Right actions */}
      <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="flex flex-col items-center gap-1"
        >
          <Heart
            size={28}
            className={isLiked ? "fill-ig-like text-ig-like" : "text-primary-foreground"}
          />
          <span className="text-xs font-semibold text-primary-foreground">
            {(likes / 1000).toFixed(1)}K
          </span>
        </motion.button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.info("Comments coming soon!");
          }}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle size={28} className="text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground">{reel.comments}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
        >
          <Send size={28} className="text-primary-foreground" />
        </button>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
        >
          <Bookmark
            size={28}
            className={isSaved ? "fill-primary-foreground text-primary-foreground" : "text-primary-foreground"}
          />
        </motion.button>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 w-full p-4 pr-20">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={reel.avatar}
            alt=""
            className="h-8 w-8 rounded-full border-2 border-primary-foreground object-cover"
          />
          <span className="text-sm font-semibold text-primary-foreground">{reel.username}</span>
          {reel.isVerified && <span className="text-primary-foreground">✓</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Following!");
            }}
            className="rounded border border-primary-foreground px-3 py-0.5 text-xs font-semibold text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
          >
            Follow
          </button>
        </div>
        <p className="text-sm text-primary-foreground">{reel.caption}</p>
        <div className="mt-2 flex items-center gap-2">
          <Music size={12} className="text-primary-foreground" />
          <span className="text-xs text-primary-foreground">Original audio</span>
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  return (
    <div className="mx-auto h-[calc(100vh-56px)] max-w-[470px] snap-y snap-mandatory overflow-y-scroll scrollbar-hide md:h-screen">
      {reelsData.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

export default Reels;
