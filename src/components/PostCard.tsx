import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "@/data/mockData";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="ig-story-ring">
            <div className="rounded-full border-2 border-card">
              <img src={post.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-foreground">{post.user.username}</span>
            {post.user.isVerified && (
              <span className="text-primary">✓</span>
            )}
          </div>
        </div>
        <button className="text-foreground">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="relative" onDoubleClick={handleDoubleTap}>
        <img
          src={post.image}
          alt={post.caption}
          className="w-full object-cover"
          loading="lazy"
        />
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart size={80} className="fill-primary-foreground text-primary-foreground drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleLike}>
            <Heart
              size={24}
              className={`transition-colors ${isLiked ? "fill-ig-like text-ig-like animate-like-pop" : "text-foreground"}`}
            />
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowComments(!showComments)}>
            <MessageCircle size={24} className="text-foreground" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.8 }}>
            <Send size={24} className="text-foreground" />
          </motion.button>
        </div>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setIsSaved(!isSaved)}>
          <Bookmark
            size={24}
            className={`transition-colors ${isSaved ? "fill-foreground text-foreground" : "text-foreground"}`}
          />
        </motion.button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm font-semibold text-foreground">{likesCount.toLocaleString()} likes</p>
        <p className="mt-1 text-sm text-foreground">
          <span className="font-semibold">{post.user.username}</span>{" "}
          {post.caption}
        </p>
        {post.commentsCount > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="mt-1 text-sm text-muted-foreground"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Comments preview */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 space-y-1 overflow-hidden"
            >
              {post.comments.map(comment => (
                <p key={comment.id} className="text-sm text-foreground">
                  <span className="font-semibold">{comment.username}</span> {comment.text}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{post.timeAgo}</p>
      </div>
    </motion.article>
  );
};

export default PostCard;
