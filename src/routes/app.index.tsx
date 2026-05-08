import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Users, Calendar, FileText, Video, MessageSquare,
  GraduationCap, Presentation, ClipboardList, TrendingUp, Clock, ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Dashboard() {
  const { user, roles, isAdmin, hasRole } = useAuth();
  const isTeacher = hasRole("teacher");
  const isStudent = hasRole("student") && !isAdmin && !isTeacher;

  if (isAdmin) return <AdminDashboard email={user?.email ?? ""} roles={roles} />;
  if (isTeacher) return <TeacherDashboard email={user?.email ?? ""} userId={user!.id} />;
  return <StudentDashboard email={user?.email ?? ""} userId={user!.id} />;
}

/* ---------------- ADMIN ---------------- */
function AdminDashboard({ email, roles }: { email: string; roles: string[] }) {
  const [stats, setStats] = useState({ batches: 0, users: 0, teachers: 0, students: 0, classes: 0, notes: 0, videos: 0 });
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [b, u, t, s, c, n, v, up] = await Promise.all([
        supabase.from("batches").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("live_classes").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }),
        supabase.from("video_recordings").select("id", { count: "exact", head: true }),
        supabase.from("live_classes").select("id, title, scheduled_at, batch_id, batches(name)").gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(5),
      ]);
      setStats({
        batches: b.count ?? 0, users: u.count ?? 0, teachers: t.count ?? 0, students: s.count ?? 0,
        classes: c.count ?? 0, notes: n.count ?? 0, videos: v.count ?? 0,
      });
      setUpcoming(up.data ?? []);
    })();
  }, []);

  const tiles = [
    { label: "Batches", value: stats.batches, icon: BookOpen, color: "from-violet-500 to-fuchsia-500" },
    { label: "Total users", value: stats.users, icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Teachers", value: stats.teachers, icon: Presentation, color: "from-amber-500 to-orange-500" },
    { label: "Students", value: stats.students, icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
    { label: "Live classes", value: stats.classes, icon: Calendar, color: "from-pink-500 to-rose-500" },
    { label: "Notes", value: stats.notes, icon: FileText, color: "from-indigo-500 to-purple-500" },
    { label: "Recordings", value: stats.videos, icon: Video, color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Admin Console"
        description={`Signed in as ${roles.join(", ") || "admin"} · ${email}`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {tiles.map(t => (
          <Card key={t.label} className="p-5 shadow-card hover:shadow-elegant transition-all">
            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-3`}>
              <t.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold">{t.value}</div>
            <div className="text-xs text-muted-foreground">{t.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-card lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
          <div className="space-y-2">
            <Link to="/app/users"><Button variant="outline" className="w-full justify-between">Manage users <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/app/batches"><Button variant="outline" className="w-full justify-between">Manage batches <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/app/roles"><Button variant="outline" className="w-full justify-between">Assign roles <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </Card>

        <Card className="p-6 shadow-card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Upcoming live classes (all batches)</h2>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No upcoming classes.</p>
          ) : (
            <div className="divide-y">
              {upcoming.map(c => (
                <Link key={c.id} to="/app/batches/$batchId/live" params={{ batchId: c.batch_id }} className="flex items-center justify-between py-3 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors">
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.batches?.name} · {new Date(c.scheduled_at).toLocaleString()}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- TEACHER ---------------- */
function TeacherDashboard({ email, userId }: { email: string; userId: string }) {
  const [myBatches, setMyBatches] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [counts, setCounts] = useState({ students: 0, notes: 0, videos: 0 });

  useEffect(() => {
    (async () => {
      const { data: memberships } = await supabase
        .from("batch_members")
        .select("batch_id, batches(id, name, subject)")
        .eq("user_id", userId)
        .eq("role", "teacher");
      const batches = (memberships ?? []).map((m: any) => m.batches).filter(Boolean);
      setMyBatches(batches);
      const ids = batches.map((b: any) => b.id);
      if (ids.length === 0) return;

      const nowIso = new Date().toISOString();
      const [up, pa, st, n, v] = await Promise.all([
        supabase.from("live_classes").select("id, title, scheduled_at, duration_minutes, meeting_url, batch_id, batches(name)").in("batch_id", ids).gte("scheduled_at", nowIso).order("scheduled_at").limit(5),
        supabase.from("live_classes").select("id, title, scheduled_at, batch_id, batches(name)").in("batch_id", ids).lt("scheduled_at", nowIso).order("scheduled_at", { ascending: false }).limit(3),
        supabase.from("batch_members").select("user_id", { count: "exact", head: true }).in("batch_id", ids).eq("role", "student"),
        supabase.from("notes").select("id", { count: "exact", head: true }).in("batch_id", ids).eq("uploaded_by", userId),
        supabase.from("video_recordings").select("id", { count: "exact", head: true }).in("batch_id", ids).eq("uploaded_by", userId),
      ]);
      setUpcoming(up.data ?? []);
      setPast(pa.data ?? []);
      setCounts({ students: st.count ?? 0, notes: n.count ?? 0, videos: v.count ?? 0 });
    })();
  }, [userId]);

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title={`Welcome, ${email.split("@")[0]}`}
        description="Teacher dashboard — manage your batches, schedule classes and share materials."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatTile icon={BookOpen} label="My batches" value={myBatches.length} color="from-violet-500 to-fuchsia-500" />
        <StatTile icon={GraduationCap} label="My students" value={counts.students} color="from-emerald-500 to-teal-500" />
        <StatTile icon={FileText} label="Notes I uploaded" value={counts.notes} color="from-amber-500 to-orange-500" />
        <StatTile icon={Video} label="Recordings I added" value={counts.videos} color="from-pink-500 to-rose-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Your upcoming classes</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="py-10 text-center">
              <Clock className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground text-sm">No classes scheduled. Open a batch to schedule one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-card transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.batches?.name} · {new Date(c.scheduled_at).toLocaleString()} · {c.duration_minutes} min</div>
                  </div>
                  <a href={c.meeting_url} target="_blank" rel="noreferrer">
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Video className="h-4 w-4 mr-1" />Start</Button>
                  </a>
                </div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground mt-6 mb-2">Recently taught</h3>
              <div className="space-y-1.5">
                {past.map(c => (
                  <div key={c.id} className="text-sm py-1.5 px-2 rounded hover:bg-muted/50 flex justify-between">
                    <span className="truncate">{c.title} <span className="text-muted-foreground">— {c.batches?.name}</span></span>
                    <span className="text-xs text-muted-foreground">{new Date(c.scheduled_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Presentation className="h-5 w-5 text-primary" /> My batches</h2>
          {myBatches.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">You haven't been assigned to any batch yet.</p>
          ) : (
            <div className="space-y-2">
              {myBatches.map((b: any) => (
                <Link key={b.id} to="/app/batches/$batchId" params={{ batchId: b.id }} className="block p-3 rounded-lg border hover:border-primary hover:shadow-card transition-all">
                  <div className="font-medium">{b.name}</div>
                  {b.subject && <Badge variant="secondary" className="mt-1 text-xs">{b.subject}</Badge>}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- STUDENT ---------------- */
function StudentDashboard({ email, userId }: { email: string; userId: string }) {
  const [myBatches, setMyBatches] = useState<any[]>([]);
  const [nextClass, setNextClass] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: memberships } = await supabase
        .from("batch_members")
        .select("batch_id, batches(id, name, subject)")
        .eq("user_id", userId);
      const batches = (memberships ?? []).map((m: any) => m.batches).filter(Boolean);
      setMyBatches(batches);
      const ids = batches.map((b: any) => b.id);
      if (ids.length === 0) return;

      const nowIso = new Date().toISOString();
      const [up, n, v] = await Promise.all([
        supabase.from("live_classes").select("id, title, scheduled_at, duration_minutes, meeting_url, batch_id, batches(name)").in("batch_id", ids).gte("scheduled_at", nowIso).order("scheduled_at").limit(5),
        supabase.from("notes").select("id, title, batch_id, created_at, batches(name)").in("batch_id", ids).order("created_at", { ascending: false }).limit(5),
        supabase.from("video_recordings").select("id, title, batch_id, created_at, batches(name)").in("batch_id", ids).order("created_at", { ascending: false }).limit(5),
      ]);
      const list = up.data ?? [];
      setNextClass(list[0] ?? null);
      setUpcoming(list.slice(1));
      setRecentNotes(n.data ?? []);
      setRecentVideos(v.data ?? []);
    })();
  }, [userId]);

  return (
    <div className="p-8">
      <PageHeader
        title={`Hi ${email.split("@")[0]} 👋`}
        description="Your learning hub — join live classes, review notes and watch recordings."
      />

      {/* Hero: next class */}
      {nextClass ? (
        <Card className="p-0 overflow-hidden shadow-elegant mb-6 border-0">
          <div className="bg-gradient-hero text-white p-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,oklch(0.85_0.18_310/.4),transparent_60%)]" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className="bg-white/25 text-white border-white/30 mb-2">Next live class</Badge>
                <h2 className="text-2xl font-bold">{nextClass.title}</h2>
                <div className="text-white/85 text-sm mt-1">{nextClass.batches?.name} · {new Date(nextClass.scheduled_at).toLocaleString()} · {nextClass.duration_minutes} min</div>
              </div>
              <a href={nextClass.meeting_url} target="_blank" rel="noreferrer">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90"><Video className="h-4 w-4 mr-2" />Join class</Button>
              </a>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 mb-6 shadow-card flex items-center gap-4">
          <Calendar className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <div className="font-medium">No upcoming live classes</div>
            <div className="text-sm text-muted-foreground">Check back later or browse your batches below.</div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatTile icon={BookOpen} label="Enrolled batches" value={myBatches.length} color="from-violet-500 to-fuchsia-500" />
        <StatTile icon={Calendar} label="Upcoming classes" value={upcoming.length + (nextClass ? 1 : 0)} color="from-emerald-500 to-teal-500" />
        <StatTile icon={FileText} label="New notes" value={recentNotes.length} color="from-amber-500 to-orange-500" />
        <StatTile icon={Video} label="New recordings" value={recentVideos.length} color="from-pink-500 to-rose-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> My batches</h2>
          {myBatches.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">You haven't been added to a batch yet. Ask your teacher to add you.</p>
          ) : (
            <div className="space-y-2">
              {myBatches.map((b: any) => (
                <Link key={b.id} to="/app/batches/$batchId" params={{ batchId: b.id }} className="block p-3 rounded-lg border hover:border-primary hover:shadow-card transition-all">
                  <div className="font-medium">{b.name}</div>
                  {b.subject && <Badge variant="secondary" className="mt-1 text-xs">{b.subject}</Badge>}
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Latest notes</h2>
          {recentNotes.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No notes shared yet.</p>
          ) : (
            <div className="divide-y">
              {recentNotes.map(n => (
                <Link key={n.id} to="/app/batches/$batchId/notes" params={{ batchId: n.batch_id }} className="block py-2.5 hover:bg-muted/50 rounded px-2 -mx-2">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.batches?.name} · {new Date(n.created_at).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Latest recordings</h2>
          {recentVideos.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No recordings yet.</p>
          ) : (
            <div className="divide-y">
              {recentVideos.map(v => (
                <Link key={v.id} to="/app/batches/$batchId/videos" params={{ batchId: v.batch_id }} className="block py-2.5 hover:bg-muted/50 rounded px-2 -mx-2">
                  <div className="text-sm font-medium truncate">{v.title}</div>
                  <div className="text-xs text-muted-foreground">{v.batches?.name} · {new Date(v.created_at).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card className="p-5 shadow-card hover:shadow-elegant transition-all">
      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
