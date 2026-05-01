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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Video, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/batches/$batchId/videos")({ component: VideosPage });

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
  return m ? m[1] : null;
}

function VideosPage() {
  const { batchId } = useParams({ from: "/app/batches/$batchId/videos" });
  const { user, hasAnyRole, isAdmin } = useAuth();
  const canAdd = isAdmin || hasAnyRole(["teacher"]);
  const [videos, setVideos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<"youtube"|"vimeo"|"other">("youtube");

  const load = async () => {
    const { data } = await supabase.from("video_recordings").select("*").eq("batch_id", batchId).order("created_at", { ascending: false });
    setVideos(data ?? []);
  };
  useEffect(() => { load(); }, [batchId]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") as string)?.trim();
    const video_url = (fd.get("url") as string)?.trim();
    const description = (fd.get("description") as string)?.trim();
    if (!title || !video_url) { toast.error("Title and URL required"); return; }
    try { new URL(video_url); } catch { toast.error("Invalid URL"); return; }
    const { error } = await supabase.from("video_recordings").insert({
      batch_id: batchId, title, video_url, description, provider, uploaded_by: user?.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Video added"); setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("video_recordings").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="p-8">
      <PageHeader title="Video recordings" description="Class recordings — paste YouTube/Vimeo links."
        actions={canAdd && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Add recording</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add recording</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
                <div><Label>Provider</Label>
                  <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="url">Video URL (use unlisted videos for privacy)</Label><Input id="url" name="url" type="url" required placeholder="https://youtube.com/watch?v=..." /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={2} /></div>
                <DialogFooter><Button type="submit">Add</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {videos.length === 0 ? (
        <Card className="p-12 text-center shadow-card"><Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No recordings yet.</p></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => {
            const ytId = v.provider === "youtube" ? getYouTubeId(v.video_url) : null;
            return (
              <Card key={v.id} className="overflow-hidden shadow-card hover:shadow-elegant transition-all">
                <div className="aspect-video bg-muted relative">
                  {ytId ? (
                    <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allowFullScreen title={v.title} />
                  ) : (
                    <a href={v.video_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full h-full bg-gradient-primary text-primary-foreground">
                      <div className="text-center"><Video className="h-10 w-10 mx-auto mb-2" /><div className="text-sm">Open video</div></div>
                    </a>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold flex-1">{v.title}</h3>
                    {(v.uploaded_by === user?.id || isAdmin) && (
                      <Button size="icon" variant="ghost" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    )}
                  </div>
                  {v.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>}
                  <a href={v.video_url} target="_blank" rel="noreferrer" className="text-xs text-primary mt-2 inline-flex items-center gap-1">Open in new tab <ExternalLink className="h-3 w-3" /></a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
