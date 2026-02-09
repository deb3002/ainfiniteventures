import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type View = "login" | "signup" | "forgot";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<View>("login");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/admin/reset-password",
        });
        if (error) {
          toast({ variant: "destructive", title: "Error", description: error.message });
        } else {
          toast({ title: "Check your email", description: "We sent you a password reset link." });
          setView("login");
        }
        return;
      }

      const { error } = view === "signup"
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
        return;
      }

      if (view === "signup") {
        toast({ title: "Check your email", description: "We sent you a confirmation link." });
      } else {
        navigate("/admin/dashboard");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const title = view === "forgot" ? "Reset Password" : view === "signup" ? "Admin Sign Up" : "Admin Login";

  return (
    <Layout>
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-sm mx-auto">
          <FadeIn>
            <h1 className="text-3xl font-semibold text-foreground mb-8 text-center">
              {title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {view !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting
                  ? "Please wait…"
                  : view === "forgot"
                  ? "Send Reset Link"
                  : view === "signup"
                  ? "Sign Up"
                  : "Sign In"}
              </Button>
            </form>

            {view === "login" && (
              <p className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm text-muted-foreground hover:text-accent hover:underline"
                >
                  Forgot Password?
                </button>
              </p>
            )}

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {view === "signup" ? "Already have an account?" : view === "login" ? "Need an account?" : "Back to"}{" "}
              <button
                type="button"
                onClick={() => setView(view === "signup" ? "login" : view === "forgot" ? "login" : "signup")}
                className="text-accent hover:underline font-medium"
              >
                {view === "signup" ? "Sign In" : view === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLogin;
