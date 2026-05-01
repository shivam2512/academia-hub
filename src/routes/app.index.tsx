import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Calendar, FileText, Video, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const { user, roles, isAdmin } = useAuth();
  const [stats, setStats] = useState({ batches: 0, users: 0, classes: 0, notes: 0, videos: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [b, u, c, n, v, up] = await Promise.all([
        supabase.from("batches").select("id", { count: "exact", head: true }),
        isAdmin ? supabase.from("profiles").select("id", { count: "exact", head: true }) : Promise.resolve({ count: 0 } as any),
        supabase.from("live_classes").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }),
        supabase.from("video_recordings").select("id", { count: "exact", head: true }),
        supabase.from("live_classes").select("id, title, scheduled_at, meeting_url, batch_id, batches(name)").gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(5),
      ]);
      setStats({
        batches: b.count ?? 0, users: u.count ?? 0, classes: c.count ?? 0,
        notes: n.count ?? 0, videos: v.count ?? 0,
      });
      setUpcoming(up.data ?? []);
    })();
  }, [isAdmin]);

  const tiles = [
    { label: "Batches", value: stats.batches, icon: BookOpen, color: "from-violet-500 to-fuchsia-500" },
    ...(isAdmin ? [{ label: "Users", value: stats.users, icon: Users, color: "from-blue-500 to-cyan-500" }] : []),
    { label: "Live classes", value: stats.classes, icon: Calendar, color: "from-emerald-500 to-teal-500" },
    { label: "Notes", value: stats.notes, icon: FileText, color: "from-amber-500 to-orange-500" },
    { label: "Recordings", value: stats.videos, icon: Video, color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title={`Welcome back${user?.email ? ", " + user.email.split("@")[0] : ""}`}
        description={`You're signed in as ${roles.join(", ") || "student"}.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {tiles.map(t => (
          <Card key={t.label} className="p-5 shadow-card hover:shadow-elegant transition-all">
            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-3`}>
              <t.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold">{t.value}</div>
            <div className="text-sm text-muted-foreground">{t.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Upcoming live classes</h2>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No upcoming classes scheduled.</p>
        ) : (
          <div className="divide-y">
            {upcoming.map(c => (
              <Link key={c.id} to="/app/batches/$batchId/live" params={{ batchId: c.batch_id }} className="flex items-center justify-between py-3 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted-foreground">{c.batches?.name} · {new Date(c.scheduled_at).toLocaleString()}</div>
                </div>
                <div className="text-sm text-primary font-medium">View →</div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
