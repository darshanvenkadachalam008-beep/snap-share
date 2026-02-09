import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, Music } from "lucide-react";
import { motion } from "framer-motion";
import { reels } from "@/data/mockData";
import type { Reel } from "@/data/mockData";

const ReelCard = ({ reel }: { reel: Reel }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likesCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="relative flex h-[calc(100vh-56px)] w-full snap-start items-end md:h-screen">
      {/* Background image simulating video */}
      <img
        src={reel.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

      {/* Right actions */}
      <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6">
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart size={28} className={isLiked ? "fill-ig-like text-ig-like" : "text-primary-foreground"} />
          <span className="text-xs font-semibold text-primary-foreground">{(likes / 1000).toFixed(1)}K</span>
        </motion.button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={28} className="text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground">{reel.commentsCount}</span>
        </button>
        <button>
          <Send size={28} className="text-primary-foreground" />
        </button>
        <button>
          <Bookmark size={28} className="text-primary-foreground" />
        </button>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 w-full p-4 pr-20">
        <div className="flex items-center gap-2 mb-2">
          <img src={reel.user.avatar} alt="" className="h-8 w-8 rounded-full border-2 border-primary-foreground object-cover" />
          <span className="text-sm font-semibold text-primary-foreground">{reel.user.username}</span>
          <button className="rounded border border-primary-foreground px-3 py-0.5 text-xs font-semibold text-primary-foreground">
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
      {reels.map(reel => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

export default Reels;
