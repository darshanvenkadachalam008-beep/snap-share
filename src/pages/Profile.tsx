import { useState } from "react";
import { Settings, Grid3X3, Film, Bookmark } from "lucide-react";
import { currentUser, posts } from "@/data/mockData";
import { motion } from "framer-motion";

type Tab = "posts" | "reels" | "saved";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const tabs = [
    { id: "posts" as Tab, icon: Grid3X3, label: "Posts" },
    { id: "reels" as Tab, icon: Film, label: "Reels" },
    { id: "saved" as Tab, icon: Bookmark, label: "Saved" },
  ];

  const displayPosts = activeTab === "posts" ? posts.slice(0, 9) : activeTab === "reels" ? posts.slice(0, 3) : posts.slice(0, 2);

  return (
    <div className="mx-auto max-w-[935px] px-4 py-6">
      {/* Header */}
      <div className="flex items-start gap-8 md:gap-20">
        <div className="ig-story-ring flex-shrink-0">
          <div className="rounded-full border-4 border-card">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="h-20 w-20 rounded-full object-cover md:h-36 md:w-36"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="text-xl font-normal text-foreground">{currentUser.username}</h2>
            <button className="rounded-lg bg-secondary px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
              Edit profile
            </button>
            <button className="text-foreground">
              <Settings size={24} />
            </button>
          </div>

          <div className="hidden md:flex gap-8 mb-4">
            <span className="text-foreground"><strong>{currentUser.postsCount}</strong> posts</span>
            <span className="text-foreground"><strong>{currentUser.followersCount.toLocaleString()}</strong> followers</span>
            <span className="text-foreground"><strong>{currentUser.followingCount}</strong> following</span>
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground">{currentUser.displayName}</p>
            <p className="whitespace-pre-line text-sm text-foreground">{currentUser.bio}</p>
          </div>
        </div>
      </div>

      {/* Mobile bio */}
      <div className="mt-4 md:hidden">
        <p className="text-sm font-semibold text-foreground">{currentUser.displayName}</p>
        <p className="whitespace-pre-line text-sm text-foreground">{currentUser.bio}</p>
      </div>

      {/* Mobile stats */}
      <div className="mt-4 flex justify-around border-y border-border py-3 md:hidden">
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-foreground">{currentUser.postsCount}</span>
          <span className="text-xs text-muted-foreground">posts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-foreground">{currentUser.followersCount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold text-foreground">{currentUser.followingCount}</span>
          <span className="text-xs text-muted-foreground">following</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex border-t border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "border-t-2 border-foreground text-foreground -mt-px"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon size={12} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 mt-1">
        {displayPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-square cursor-pointer overflow-hidden"
          >
            <img
              src={post.image}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
