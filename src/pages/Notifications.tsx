import { users } from "@/data/mockData";
import { motion } from "framer-motion";

const notifications = [
  { id: "1", user: users[0], type: "like" as const, time: "2h" },
  { id: "2", user: users[1], type: "follow" as const, time: "4h" },
  { id: "3", user: users[2], type: "comment" as const, time: "6h", text: "Amazing photo! 🔥" },
  { id: "4", user: users[3], type: "like" as const, time: "8h" },
  { id: "5", user: users[4], type: "follow" as const, time: "1d" },
  { id: "6", user: users[5], type: "comment" as const, time: "1d", text: "Love this! ❤️" },
  { id: "7", user: users[6], type: "like" as const, time: "2d" },
  { id: "8", user: users[7], type: "follow" as const, time: "3d" },
];

const Notifications = () => {
  return (
    <div className="mx-auto max-w-[470px]">
      <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 md:hidden">
        <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
      </header>

      <div className="px-4 py-2">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Recent</h3>
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 py-3"
          >
            <img src={n.user.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
            <div className="flex-1 text-sm text-foreground">
              <span className="font-semibold">{n.user.username}</span>{" "}
              {n.type === "like" && "liked your photo."}
              {n.type === "follow" && "started following you."}
              {n.type === "comment" && <>commented: {n.text}</>}
              <span className="text-muted-foreground"> {n.time}</span>
            </div>
            {n.type === "follow" && (
              <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                Follow
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
