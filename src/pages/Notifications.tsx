import { useNotifications } from "@/hooks/useSupabase";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

// Demo notifications for when database is empty
const demoNotifications = [
  {
    id: "1",
    type: "like",
    actor: { username: "travel_life", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    time: "2h",
  },
  {
    id: "2",
    type: "follow",
    actor: { username: "food_lover", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    time: "4h",
  },
  {
    id: "3",
    type: "comment",
    actor: { username: "nature_pics", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" },
    time: "6h",
    text: "Amazing photo! 🔥",
  },
  {
    id: "4",
    type: "like",
    actor: { username: "city_vibes", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
    time: "8h",
  },
  {
    id: "5",
    type: "follow",
    actor: { username: "art_daily", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
    time: "1d",
  },
];

const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();

  const hasRealNotifications = notifications && notifications.length > 0;
  const displayNotifications = hasRealNotifications ? notifications : demoNotifications;

  return (
    <div className="mx-auto max-w-[470px]">
      <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 md:hidden">
        <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="px-4 py-2">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Recent</h3>
          {displayNotifications.map((n: any, i: number) => {
            const actor = n.actor || n.actor;
            const timeAgo = n.created_at
              ? formatDistanceToNow(new Date(n.created_at), { addSuffix: false })
              : n.time;

            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-3"
              >
                <Link to={actor?.id ? `/profile/${actor.id}` : "#"}>
                  <img
                    src={actor?.avatar_url || actor?.avatar || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150"}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                  />
                </Link>
                <div className="flex-1 text-sm text-foreground">
                  <span className="font-semibold">{actor?.username}</span>{" "}
                  {n.type === "like" && "liked your photo."}
                  {n.type === "follow" && "started following you."}
                  {n.type === "comment" && (
                    <>
                      commented: <span className="text-muted-foreground">{n.text || "Nice!"}</span>
                    </>
                  )}
                  <span className="text-muted-foreground"> {timeAgo}</span>
                </div>
                {n.type === "follow" && (
                  <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Follow
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
