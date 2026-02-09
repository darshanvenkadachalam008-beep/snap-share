import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLikePost, useSavePost, useComments, useAddComment, type PostWithDetails } from "@/hooks/useSupabase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostCardProps {
  post: PostWithDetails;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);

  const likePost = useLikePost();
  const savePost = useSavePost();
  const { data: comments } = useComments(post.id);
  const addComment = useAddComment();

  const handleLike = () => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }
    likePost.mutate({ postId: post.id, isLiked: post.is_liked });
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please log in to save posts");
      return;
    }
    savePost.mutate({ postId: post.id, isSaved: post.is_saved });
  };

  const handleDoubleTap = () => {
    if (!post.is_liked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment.mutate(
      { postId: post.id, content: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Comment added!");
        },
      }
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/post/" + post.id);
    toast.success("Link copied to clipboard!");
    setShowShareDialog(false);
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: false });

  return (
    <>
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
                <img
                  src={post.profiles.avatar_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150"}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{post.profiles.username}</span>
              {post.profiles.is_verified && <span className="text-primary">✓</span>}
            </div>
          </div>
          <button className="text-foreground hover:text-muted-foreground transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Image */}
        <div className="relative" onDoubleClick={handleDoubleTap}>
          <img src={post.image_url} alt={post.caption || ""} className="w-full object-cover" loading="lazy" />
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
                className={`transition-colors ${
                  post.is_liked ? "fill-ig-like text-ig-like animate-like-pop" : "text-foreground hover:text-muted-foreground"
                }`}
              />
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowComments(!showComments)}>
              <MessageCircle size={24} className="text-foreground hover:text-muted-foreground transition-colors" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowShareDialog(true)}>
              <Send size={24} className="text-foreground hover:text-muted-foreground transition-colors" />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleSave}>
            <Bookmark
              size={24}
              className={`transition-colors ${
                post.is_saved ? "fill-foreground text-foreground" : "text-foreground hover:text-muted-foreground"
              }`}
            />
          </motion.button>
        </div>

        {/* Likes & Caption */}
        <div className="px-4 pb-3">
          <p className="text-sm font-semibold text-foreground">{post.likes_count.toLocaleString()} likes</p>
          {post.caption && (
            <p className="mt-1 text-sm text-foreground">
              <span className="font-semibold">{post.profiles.username}</span> {post.caption}
            </p>
          )}
          {post.comments_count > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="mt-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all {post.comments_count} comments
            </button>
          )}

          {/* Comments */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {comments?.slice(0, 5).map((comment: any) => (
                  <p key={comment.id} className="text-sm text-foreground">
                    <span className="font-semibold">{comment.profiles.username}</span> {comment.content}
                  </p>
                ))}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  {commentText && (
                    <button
                      onClick={handleAddComment}
                      className="text-sm font-semibold text-primary hover:text-primary/80"
                    >
                      Post
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{timeAgo}</p>
        </div>
      </motion.article>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <button
              onClick={handleShare}
              className="w-full rounded-lg bg-secondary px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Copy link
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
