export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isVerified: boolean;
}

export interface Story {
  id: string;
  user: Pick<User, "id" | "username" | "avatar">;
  seen: boolean;
}

export interface Post {
  id: string;
  user: Pick<User, "id" | "username" | "avatar" | "isVerified">;
  image: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  timeAgo: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timeAgo: string;
}

export interface Reel {
  id: string;
  user: Pick<User, "id" | "username" | "avatar" | "isVerified">;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
];

const postImages = [
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1540206395-68808572332f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=600&h=600&fit=crop",
];

const usernames = ["emma.travels", "alex.photo", "sarah.daily", "mike.creates", "lisa.art", "james.world", "nina.style", "david.eats"];

export const currentUser: User = {
  id: "me",
  username: "your.username",
  displayName: "Your Name",
  avatar: avatars[0],
  bio: "📸 Photography | ✈️ Travel | 🎨 Art\nLiving my best life ✨",
  postsCount: 42,
  followersCount: 1234,
  followingCount: 567,
  isFollowing: false,
  isVerified: true,
};

export const users: User[] = usernames.map((username, i) => ({
  id: `user-${i}`,
  username,
  displayName: username.split(".").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
  avatar: avatars[i % avatars.length],
  bio: "✨ Living life one post at a time",
  postsCount: Math.floor(Math.random() * 200) + 10,
  followersCount: Math.floor(Math.random() * 50000) + 100,
  followingCount: Math.floor(Math.random() * 1000) + 50,
  isFollowing: Math.random() > 0.5,
  isVerified: Math.random() > 0.7,
}));

export const stories: Story[] = [
  { id: "your-story", user: { id: "me", username: "Your story", avatar: currentUser.avatar }, seen: false },
  ...users.slice(0, 7).map((u, i) => ({
    id: `story-${i}`,
    user: { id: u.id, username: u.username, avatar: u.avatar },
    seen: i > 3,
  })),
];

export const posts: Post[] = Array.from({ length: 10 }, (_, i) => {
  const user = users[i % users.length];
  return {
    id: `post-${i}`,
    user: { id: user.id, username: user.username, avatar: user.avatar, isVerified: user.isVerified },
    image: postImages[i % postImages.length],
    caption: [
      "Beautiful sunset views 🌅 #nature #travel",
      "Perfect morning coffee ☕ #lifestyle",
      "Adventures await! 🏔️ #explore #wanderlust",
      "Good vibes only ✨ #mood #happy",
      "Chasing light 📸 #photography",
      "Foodie paradise 🍕 #foodstagram",
      "Mountain magic 🏔️ #hiking #nature",
      "Ocean breeze 🌊 #beach #summer",
      "City lights ✨ #urban #nightlife",
      "Nature's beauty 🌿 #green #earth",
    ][i],
    likesCount: Math.floor(Math.random() * 5000) + 50,
    commentsCount: Math.floor(Math.random() * 200) + 5,
    isLiked: Math.random() > 0.6,
    isSaved: Math.random() > 0.8,
    timeAgo: [`${i + 1}h`, `${i + 2}h`, "1d", "2d", "3d"][i % 5],
    comments: [
      { id: `c-${i}-1`, username: users[(i + 1) % users.length].username, text: "Amazing shot! 🔥", timeAgo: "1h" },
      { id: `c-${i}-2`, username: users[(i + 2) % users.length].username, text: "Love this! ❤️", timeAgo: "30m" },
    ],
  };
});

export const explorePosts = Array.from({ length: 24 }, (_, i) => ({
  id: `explore-${i}`,
  image: postImages[i % postImages.length],
  likesCount: Math.floor(Math.random() * 10000) + 100,
  commentsCount: Math.floor(Math.random() * 500) + 10,
}));

export const reels: Reel[] = Array.from({ length: 5 }, (_, i) => {
  const user = users[i % users.length];
  return {
    id: `reel-${i}`,
    user: { id: user.id, username: user.username, avatar: user.avatar, isVerified: user.isVerified },
    videoUrl: "",
    thumbnail: postImages[i % postImages.length],
    caption: ["Dancing in the rain 💃", "Cooking masterclass 👨‍🍳", "Travel vlog ✈️", "Workout motivation 💪", "Art timelapse 🎨"][i],
    likesCount: Math.floor(Math.random() * 50000) + 1000,
    commentsCount: Math.floor(Math.random() * 2000) + 50,
    isLiked: Math.random() > 0.5,
  };
});
