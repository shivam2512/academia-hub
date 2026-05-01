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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/batches/$batchId/notes")({ component: NotesPage });

function NotesPage() {
  const { batchId } = useParams({ from: "/app/batches/$batchId/notes" });
  const { user, hasAnyRole, isAdmin } = useAuth();
  const canUpload = isAdmin || hasAnyRole(["teacher"]);
  const [notes, setNotes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("notes").select("*").eq("batch_id", batchId).order("created_at", { ascending: false });
    setNotes(data ?? []);
  };
  useEffect(() => { load(); }, [batchId]);

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File;
    const title = (fd.get("title") as string)?.trim();
    const description = (fd.get("description") as string)?.trim();
    if (!file || !title) { toast.error("Title and file required"); return; }
    if (file.size > 25 * 1024 * 1024) { toast.error("File must be under 25 MB"); return; }
    setBusy(true);
    const path = `${batchId}/${Date.now()}-${file.name}`;
    const up = await supabase.storage.from("notes").upload(path, file);
    if (up.error) { toast.error(up.error.message); setBusy(false); return; }
    const { error } = await supabase.from("notes").insert({
      batch_id: batchId, title, description, file_url: path, uploaded_by: user?.id,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Note uploaded"); setOpen(false); load();
  };

  const download = async (path: string, filename: string) => {
    const { data, error } = await supabase.storage.from("notes").createSignedUrl(path, 60);
    if (error || !data) { toast.error("Could not get download link"); return; }
    window.open(data.signedUrl, "_blank");
  };

  const remove = async (id: string, path: string) => {
    if (!confirm("Delete this note?")) return;
    await supabase.storage.from("notes").remove([path]);
    await supabase.from("notes").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="p-8">
      <PageHeader title="Notes" description="Study materials shared with this batch."
        actions={canUpload && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Upload note</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Upload note</DialogTitle></DialogHeader>
              <form onSubmit={upload} className="space-y-4">
                <div><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={2} /></div>
                <div><Label htmlFor="file">File (PDF, DOCX, etc. — max 25 MB)</Label><Input id="file" name="file" type="file" required /></div>
                <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {notes.length === 0 ? (
        <Card className="p-12 text-center shadow-card"><FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No notes yet.</p></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(n => (
            <Card key={n.id} className="p-5 shadow-card hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center"><FileText className="h-5 w-5 text-primary-foreground" /></div>
                {(n.uploaded_by === user?.id || isAdmin) && (
                  <Button size="icon" variant="ghost" onClick={() => remove(n.id, n.file_url)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                )}
              </div>
              <h3 className="font-semibold">{n.title}</h3>
              {n.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.description}</p>}
              <div className="text-xs text-muted-foreground mt-3">{new Date(n.created_at).toLocaleDateString()}</div>
              <Button onClick={() => download(n.file_url, n.title)} variant="outline" size="sm" className="mt-3 w-full"><Download className="h-4 w-4 mr-2" />Download</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
