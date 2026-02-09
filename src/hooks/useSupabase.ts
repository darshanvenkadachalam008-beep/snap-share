import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  is_verified: boolean;
  is_private: boolean;
}

export interface PostWithDetails {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  location: string | null;
  is_reel: boolean;
  video_url: string | null;
  created_at: string;
  profiles: Profile;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved: boolean;
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetId = userId || user?.id;

  return useQuery({
    queryKey: ["profile", targetId],
    queryFn: async () => {
      if (!targetId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", targetId)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!targetId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useFeedPosts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["feed-posts"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles!posts_user_id_fkey (*)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get likes and saves for current user
      const postIds = posts.map((p) => p.id);
      
      let userLikes: string[] = [];
      let userSaves: string[] = [];

      if (user) {
        const [likesRes, savesRes] = await Promise.all([
          supabase.from("likes").select("post_id").eq("user_id", user.id).in("post_id", postIds),
          supabase.from("saved_posts").select("post_id").eq("user_id", user.id).in("post_id", postIds),
        ]);
        userLikes = likesRes.data?.map((l) => l.post_id) || [];
        userSaves = savesRes.data?.map((s) => s.post_id) || [];
      }

      // Get counts
      const countsPromises = postIds.map(async (postId) => {
        const [likesCount, commentsCount] = await Promise.all([
          supabase.from("likes").select("id", { count: "exact", head: true }).eq("post_id", postId),
          supabase.from("comments").select("id", { count: "exact", head: true }).eq("post_id", postId),
        ]);
        return { postId, likes: likesCount.count || 0, comments: commentsCount.count || 0 };
      });

      const counts = await Promise.all(countsPromises);
      const countsMap = Object.fromEntries(counts.map((c) => [c.postId, c]));

      return posts.map((post) => ({
        ...post,
        likes_count: countsMap[post.id]?.likes || 0,
        comments_count: countsMap[post.id]?.comments || 0,
        is_liked: userLikes.includes(post.id),
        is_saved: userSaves.includes(post.id),
      })) as PostWithDetails[];
    },
  });
};

export const useUserPosts = (userId?: string) => {
  const { user } = useAuth();
  const targetId = userId || user?.id;

  return useQuery({
    queryKey: ["user-posts", targetId],
    queryFn: async () => {
      if (!targetId) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", targetId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!targetId,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      
      if (isLiked) {
        await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId);
      } else {
        await supabase.from("likes").insert({ user_id: user.id, post_id: postId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isSaved }: { postId: string; isSaved: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      
      if (isSaved) {
        await supabase.from("saved_posts").delete().eq("user_id", user.id).eq("post_id", postId);
      } else {
        await supabase.from("saved_posts").insert({ user_id: user.id, post_id: postId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, isFollowing }: { userId: string; isFollowing: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", userId);
      } else {
        await supabase.from("follows").insert({ follower_id: user.id, following_id: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};

export const useUserStats = (userId?: string) => {
  const { user } = useAuth();
  const targetId = userId || user?.id;

  return useQuery({
    queryKey: ["user-stats", targetId],
    queryFn: async () => {
      if (!targetId) return { posts: 0, followers: 0, following: 0, isFollowing: false };

      const [postsRes, followersRes, followingRes, isFollowingRes] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", targetId),
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", targetId),
        supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", targetId),
        user && user.id !== targetId
          ? supabase.from("follows").select("id").eq("follower_id", user.id).eq("following_id", targetId).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      return {
        posts: postsRes.count || 0,
        followers: followersRes.count || 0,
        following: followingRes.count || 0,
        isFollowing: !!isFollowingRes.data,
      };
    },
    enabled: !!targetId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ imageUrl, caption, isReel }: { imageUrl: string; caption: string; isReel?: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: imageUrl,
        caption,
        is_reel: isReel || false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
  });
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`*, profiles!comments_user_id_fkey (*)`)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        post_id: postId,
        content,
      });
      if (error) throw error;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });
};

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stories")
        .select(`*, profiles!stories_user_id_fkey (*)`)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select(`*, actor:profiles!notifications_actor_id_fkey (*)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["search-users", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(20);
      if (error) throw error;
      return data as Profile[];
    },
    enabled: query.length >= 2,
  });
};
