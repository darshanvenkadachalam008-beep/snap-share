import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, username);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Please check your email to verify.");
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[350px] space-y-4"
      >
        {/* Signup box */}
        <div className="rounded-sm border border-border bg-card p-10">
          <h1 className="mb-2 text-center text-4xl font-semibold italic text-foreground">
            Instagram
          </h1>
          <p className="mb-6 text-center text-sm font-semibold text-muted-foreground">
            Sign up to see photos and videos from your friends.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-border bg-secondary px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
              className="w-full rounded-sm border border-border bg-secondary px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-border bg-secondary px-2 py-2 pr-10 text-xs text-foreground placeholder:text-muted-foreground focus:border-muted-foreground focus:outline-none"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !email || !password || !username}
              className="w-full rounded-lg bg-primary py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>
        </div>

        {/* Login link */}
        <div className="rounded-sm border border-border bg-card p-5 text-center text-sm text-foreground">
          Have an account?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
