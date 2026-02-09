import StoriesBar from "@/components/StoriesBar";
import PostCard from "@/components/PostCard";
import { posts } from "@/data/mockData";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="mx-auto max-w-[470px]">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <h1 className="text-xl font-semibold text-foreground">Instagram</h1>
        <Link to="/notifications" className="text-foreground">
          <Heart size={24} />
        </Link>
      </header>

      <StoriesBar />

      <div>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Index;
