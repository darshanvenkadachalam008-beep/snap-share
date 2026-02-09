import { useState, useRef } from "react";
import { Image, X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePost } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Create = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleShare = async () => {
    if (!file || !user) return;

    setUploading(true);
    try {
      // Upload image to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(fileName);

      // Create post
      await createPost.mutateAsync({
        imageUrl: publicUrl,
        caption,
      });

      toast.success("Post shared!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to share post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[470px] py-6 px-4">
      <h1 className="mb-6 text-center text-lg font-semibold text-foreground">Create new post</h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {!preview ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-20 transition-colors hover:border-muted-foreground"
        >
          <Image size={64} className="mb-4 text-muted-foreground" />
          <p className="mb-4 text-lg text-foreground">Drag photos and videos here</p>
          <button className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">
            Select from computer
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
            <button
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
              className="absolute right-2 top-2 rounded-full bg-foreground/50 p-1 hover:bg-foreground/70 transition-colors"
            >
              <X size={16} className="text-primary-foreground" />
            </button>
          </div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 2200))}
            placeholder="Write a caption..."
            className="w-full resize-none rounded-lg bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            rows={4}
          />
          <p className="text-right text-xs text-muted-foreground">{caption.length}/2,200</p>
          <button
            onClick={handleShare}
            disabled={uploading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Upload size={16} className="animate-bounce" />
                Sharing...
              </>
            ) : (
              "Share"
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Create;
