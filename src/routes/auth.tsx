import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({ component: AuthPage });

const signInSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(100),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) navigate({ to: "/app" }); }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl">DBS IT</span>
        </Link>

        <Card className="p-8 shadow-elegant">
          <h1 className="text-xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">Use the credentials provided by your administrator.</p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div><Label htmlFor="si-email">Email</Label><Input id="si-email" name="email" type="email" required /></div>
            <div><Label htmlFor="si-password">Password</Label><Input id="si-password" name="password" type="password" required /></div>
            <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Self-registration is disabled. Contact your superadmin for access.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
