import { useState } from "react";
import { Image, X } from "lucide-react";
import { motion } from "framer-motion";

const Create = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const handleImageSelect = () => {
    // Simulate image selection with a placeholder
    setPreview("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop");
  };

  return (
    <div className="mx-auto max-w-[470px] py-6 px-4">
      <h1 className="mb-6 text-center text-lg font-semibold text-foreground">Create new post</h1>

      {!preview ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-20"
        >
          <Image size={64} className="mb-4 text-muted-foreground" />
          <p className="mb-4 text-lg text-foreground">Drag photos and videos here</p>
          <button
            onClick={handleImageSelect}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
          >
            Select from computer
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
            <button
              onClick={() => setPreview(null)}
              className="absolute right-2 top-2 rounded-full bg-foreground/50 p-1"
            >
              <X size={16} className="text-primary-foreground" />
            </button>
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 2200))}
            placeholder="Write a caption..."
            className="w-full resize-none rounded-lg bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            rows={4}
          />
          <p className="text-right text-xs text-muted-foreground">{caption.length}/2,200</p>
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
            Share
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Create;
