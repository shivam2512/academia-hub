import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Calendar, ExternalLink, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/batches/$batchId/live")({ component: LiveClassesPage });

function LiveClassesPage() {
  const { batchId } = useParams({ from: "/app/batches/$batchId/live" });
  const { user, hasAnyRole, isAdmin } = useAuth();
  const canAdd = isAdmin || hasAnyRole(["teacher"]);
  const [classes, setClasses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<"zoom"|"meet"|"other">("zoom");

  const load = async () => {
    const { data } = await supabase.from("live_classes").select("*").eq("batch_id", batchId).order("scheduled_at", { ascending: true });
    setClasses(data ?? []);
  };
  useEffect(() => { load(); }, [batchId]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") as string)?.trim();
    const meeting_url = (fd.get("url") as string)?.trim();
    const scheduled_at = fd.get("scheduled_at") as string;
    const duration_minutes = parseInt(fd.get("duration") as string) || 60;
    const description = (fd.get("description") as string)?.trim();
    if (!title || !meeting_url || !scheduled_at) { toast.error("Title, link and time required"); return; }
    try { new URL(meeting_url); } catch { toast.error("Invalid URL"); return; }
    const { error } = await supabase.from("live_classes").insert({
      batch_id: batchId, title, meeting_url, scheduled_at: new Date(scheduled_at).toISOString(),
      duration_minutes, description, provider, created_by: user?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Class scheduled"); setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this class?")) return;
    await supabase.from("live_classes").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  const now = Date.now();
  const upcoming = classes.filter(c => new Date(c.scheduled_at).getTime() + (c.duration_minutes ?? 60) * 60000 > now);
  const past = classes.filter(c => new Date(c.scheduled_at).getTime() + (c.duration_minutes ?? 60) * 60000 <= now);

  return (
    <div className="p-8">
      <PageHeader title="Live classes" description="Scheduled Zoom / Google Meet sessions."
        actions={canAdd && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Schedule class</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Schedule live class</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label htmlFor="scheduled_at">Date & time</Label><Input id="scheduled_at" name="scheduled_at" type="datetime-local" required /></div>
                  <div><Label htmlFor="duration">Duration (min)</Label><Input id="duration" name="duration" type="number" defaultValue={60} min={5} max={600} /></div>
                </div>
                <div><Label>Provider</Label>
                  <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="url">Meeting URL</Label><Input id="url" name="url" type="url" required placeholder="https://zoom.us/j/..." /></div>
                <div><Label htmlFor="description">Description / agenda</Label><Textarea id="description" name="description" rows={2} /></div>
                <DialogFooter><Button type="submit">Schedule</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      <Section title="Upcoming" classes={upcoming} userId={user?.id} isAdmin={isAdmin} onDelete={remove} highlight />
      <div className="mt-8"><Section title="Past" classes={past} userId={user?.id} isAdmin={isAdmin} onDelete={remove} /></div>
    </div>
  );
}

function Section({ title, classes, userId, isAdmin, onDelete, highlight }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4" />{title} <Badge variant="secondary">{classes.length}</Badge></h2>
      {classes.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground shadow-card">No {title.toLowerCase()} classes.</Card>
      ) : (
        <div className="space-y-3">
          {classes.map((c: any) => (
            <Card key={c.id} className={`p-5 shadow-card ${highlight ? "border-l-4 border-l-primary" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge variant="secondary" className="capitalize">{c.provider}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(c.scheduled_at).toLocaleString()} · {c.duration_minutes} min
                  </div>
                  {c.description && <p className="text-sm mt-2">{c.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <a href={c.meeting_url} target="_blank" rel="noreferrer">
                    <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Video className="h-4 w-4 mr-2" />Join</Button>
                  </a>
                  {(c.created_by === userId || isAdmin) && (
                    <Button size="icon" variant="ghost" onClick={() => onDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
