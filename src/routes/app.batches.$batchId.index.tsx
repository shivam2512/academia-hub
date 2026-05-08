import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, FileText, Video, Calendar, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/batches/$batchId/")({ component: BatchOverview });

function BatchOverview() {
  const { batchId } = useParams({ from: "/app/batches/$batchId/" });
  const [batch, setBatch] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [counts, setCounts] = useState({ notes: 0, videos: 0, classes: 0 });

  useEffect(() => {
    (async () => {
      const [b, m, n, v, c] = await Promise.all([
        supabase.from("batches").select("*").eq("id", batchId).single(),
        supabase.from("batch_members").select("role, profiles(id, full_name, email)").eq("batch_id", batchId),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("batch_id", batchId),
        supabase.from("video_recordings").select("id", { count: "exact", head: true }).eq("batch_id", batchId),
        supabase.from("live_classes").select("id", { count: "exact", head: true }).eq("batch_id", batchId),
      ]);
      setBatch(b.data); setMembers(m.data ?? []);
      setCounts({ notes: n.count ?? 0, videos: v.count ?? 0, classes: c.count ?? 0 });
    })();
  }, [batchId]);

  if (!batch) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const teachers = members.filter(m => m.role === "teacher");
  const students = members.filter(m => m.role === "student");

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="rounded-2xl bg-gradient-hero p-8 text-white shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,oklch(0.85_0.18_310/.4),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3"><BookOpen className="h-5 w-5" /><span className="text-white/80 text-sm">Batch</span></div>
          <h1 className="text-3xl font-bold">{batch.name}</h1>
          {batch.subject && <Badge className="mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30">{batch.subject}</Badge>}
          {batch.description && <p className="mt-3 text-white/85 max-w-2xl">{batch.description}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/app/batches/$batchId/notes" params={{ batchId }}><Card className="p-5 shadow-card hover:shadow-elegant transition-all"><FileText className="h-6 w-6 text-primary mb-2" /><div className="text-2xl font-bold">{counts.notes}</div><div className="text-sm text-muted-foreground">Notes</div></Card></Link>
        <Link to="/app/batches/$batchId/videos" params={{ batchId }}><Card className="p-5 shadow-card hover:shadow-elegant transition-all"><Video className="h-6 w-6 text-primary mb-2" /><div className="text-2xl font-bold">{counts.videos}</div><div className="text-sm text-muted-foreground">Recordings</div></Card></Link>
        <Link to="/app/batches/$batchId/live" params={{ batchId }}><Card className="p-5 shadow-card hover:shadow-elegant transition-all"><Calendar className="h-6 w-6 text-primary mb-2" /><div className="text-2xl font-bold">{counts.classes}</div><div className="text-sm text-muted-foreground">Live classes</div></Card></Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4" /> Teachers ({teachers.length})</h3>
          <div className="space-y-3">
            {teachers.length === 0 && <p className="text-sm text-muted-foreground">No teachers assigned.</p>}
            {teachers.map((m: any) => <MemberRow key={m.profiles?.id} m={m} />)}
          </div>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4" /> Students ({students.length})</h3>
          <div className="space-y-3 max-h-80 overflow-auto">
            {students.length === 0 && <p className="text-sm text-muted-foreground">No students yet.</p>}
            {students.map((m: any) => <MemberRow key={m.profiles?.id} m={m} />)}
          </div>
        </Card>
      </div>

      <Link to="/app/batches/$batchId/chat" params={{ batchId }}>
        <Card className="p-6 shadow-card hover:shadow-elegant transition-all flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow"><MessageSquare className="h-6 w-6 text-primary-foreground" /></div>
          <div className="flex-1"><div className="font-semibold">Open batch chat</div><div className="text-sm text-muted-foreground">WhatsApp-style realtime chat for this batch</div></div>
          <div className="text-primary font-medium">Open →</div>
        </Card>
      </Link>
    </div>
  );
}

function MemberRow({ m }: { m: any }) {
  const name = m.profiles?.full_name || m.profiles?.email || "Unknown";
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{name.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
      <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{name}</div><div className="text-xs text-muted-foreground truncate">{m.profiles?.email}</div></div>
    </div>
  );
}
