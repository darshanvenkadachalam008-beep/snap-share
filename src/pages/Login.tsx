import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[350px] space-y-4"
      >
        {/* Login box */}
        <div className="rounded-sm border border-border bg-card p-10">
          <h1 className="mb-8 text-center text-4xl font-semibold italic text-foreground">
            Instagram
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              disabled={loading || !email || !password}
              className="w-full rounded-lg bg-primary py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
            Forgot password?
          </button>
        </div>

        {/* Signup link */}
        <div className="rounded-sm border border-border bg-card p-5 text-center text-sm text-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
