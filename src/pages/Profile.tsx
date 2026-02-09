import { useState } from "react";
import { useParams } from "react-router-dom";
import { Settings, Grid3X3, Film, Bookmark, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUserStats, useUserPosts, useUpdateProfile, useFollowUser } from "@/hooks/useSupabase";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Tab = "posts" | "reels" | "saved";

const Profile = () => {
  const { userId } = useParams();
  const { user, signOut } = useAuth();
  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  const { data: profile, isLoading: profileLoading } = useProfile(targetUserId);
  const { data: stats } = useUserStats(targetUserId);
  const { data: posts } = useUserPosts(targetUserId);
  const updateProfile = useUpdateProfile();
  const followUser = useFollowUser();

  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    bio: "",
    website: "",
  });

  const tabs = [
    { id: "posts" as Tab, icon: Grid3X3, label: "Posts" },
    { id: "reels" as Tab, icon: Film, label: "Reels" },
    { id: "saved" as Tab, icon: Bookmark, label: "Saved" },
  ];

  const handleEditProfile = () => {
    if (profile) {
      setEditForm({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        website: profile.website || "",
      });
    }
    setShowEditDialog(true);
  };

  const handleSaveProfile = () => {
    updateProfile.mutate(editForm, {
      onSuccess: () => {
        toast.success("Profile updated!");
        setShowEditDialog(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleFollow = () => {
    if (!targetUserId) return;
    followUser.mutate(
      { userId: targetUserId, isFollowing: stats?.isFollowing || false },
      {
        onSuccess: () => {
          toast.success(stats?.isFollowing ? "Unfollowed" : "Following!");
        },
      }
    );
  };

  const filteredPosts = posts?.filter((p) => {
    if (activeTab === "reels") return p.is_reel;
    if (activeTab === "posts") return !p.is_reel;
    return true;
  });

  if (profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <p className="text-lg text-foreground">User not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[935px] px-4 py-6">
        {/* Header */}
        <div className="flex items-start gap-8 md:gap-20">
          <div className="ig-story-ring flex-shrink-0">
            <div className="rounded-full border-4 border-card">
              <img
                src={profile.avatar_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150"}
                alt={profile.username}
                className="h-20 w-20 rounded-full object-cover md:h-36 md:w-36"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h2 className="text-xl font-normal text-foreground">{profile.username}</h2>
              {isOwnProfile ? (
                <>
                  <button
                    onClick={handleEditProfile}
                    className="rounded-lg bg-secondary px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Edit profile
                  </button>
                  <button onClick={signOut} className="text-foreground hover:text-muted-foreground">
                    <Settings size={24} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                    stats?.isFollowing
                      ? "bg-secondary text-foreground hover:bg-accent"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {stats?.isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <div className="hidden md:flex gap-8 mb-4">
              <span className="text-foreground">
                <strong>{stats?.posts || 0}</strong> posts
              </span>
              <span className="text-foreground">
                <strong>{(stats?.followers || 0).toLocaleString()}</strong> followers
              </span>
              <span className="text-foreground">
                <strong>{stats?.following || 0}</strong> following
              </span>
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-foreground">{profile.display_name}</p>
              {profile.bio && <p className="whitespace-pre-line text-sm text-foreground">{profile.bio}</p>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {profile.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile bio */}
        <div className="mt-4 md:hidden">
          <p className="text-sm font-semibold text-foreground">{profile.display_name}</p>
          {profile.bio && <p className="whitespace-pre-line text-sm text-foreground">{profile.bio}</p>}
        </div>

        {/* Mobile stats */}
        <div className="mt-4 flex justify-around border-y border-border py-3 md:hidden">
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">{stats?.posts || 0}</span>
            <span className="text-xs text-muted-foreground">posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">
              {(stats?.followers || 0).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">{stats?.following || 0}</span>
            <span className="text-xs text-muted-foreground">following</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex border-t border-border">
          {tabs.map((tab) => {
            if (tab.id === "saved" && !isOwnProfile) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? "border-t-2 border-foreground text-foreground -mt-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={12} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filteredPosts && filteredPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 mt-1">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square cursor-pointer overflow-hidden"
              >
                <img
                  src={post.image_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 rounded-full border-2 border-foreground p-4">
              <Camera size={32} className="text-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {activeTab === "posts" ? "No Posts Yet" : activeTab === "reels" ? "No Reels Yet" : "No Saved Posts"}
            </h3>
          </div>
        )}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                value={editForm.display_name}
                onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={3}
                className="mt-1 w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Website</label>
              <input
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending}
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {updateProfile.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
