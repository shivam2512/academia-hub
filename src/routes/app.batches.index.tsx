import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, BookOpen, MoreVertical, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/app/batches/")({ component: BatchesList });

const batchSchema = z.object({
  name: z.string().trim().min(2).max(100),
  subject: z.string().trim().max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

function BatchesList() {
  const { isAdmin } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("batches").select("*, batch_members(count)").order("created_at", { ascending: false });
    setBatches(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = batchSchema.safeParse({ name: fd.get("name"), subject: fd.get("subject"), description: fd.get("description") });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("batches").insert({ ...parsed.data, created_by: user?.id });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Batch created"); setOpen(false); load();
  };

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = batchSchema.safeParse({ name: fd.get("name"), subject: fd.get("subject"), description: fd.get("description") });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.from("batches").update(parsed.data).eq("id", editingBatch.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Batch updated"); setEditOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch? All data including recordings, notes and chat will be lost.")) return;
    setBusy(true);
    const { error } = await supabase.from("batches").delete().eq("id", id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Batch deleted"); load();
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Batches"
        description="All batches you have access to."
        actions={isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />New batch</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create batch</DialogTitle></DialogHeader>
              <form onSubmit={create} className="space-y-4">
                <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="JEE Mains 2026 — Morning" /></div>
                <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" placeholder="Physics, Chemistry, Math" /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} /></div>
                <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit batch</DialogTitle></DialogHeader>
          {editingBatch && (
            <form onSubmit={update} className="space-y-4">
              <div><Label htmlFor="edit-name">Name</Label><Input id="edit-name" name="name" defaultValue={editingBatch.name} required /></div>
              <div><Label htmlFor="edit-subject">Subject</Label><Input id="edit-subject" name="subject" defaultValue={editingBatch.subject ?? ""} /></div>
              <div><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" name="description" defaultValue={editingBatch.description ?? ""} rows={3} /></div>
              <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Updating…" : "Update"}</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {batches.length === 0 ? (
        <Card className="p-12 text-center shadow-card">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">{isAdmin ? "No batches yet. Create your first one." : "You haven't been added to any batches yet."}</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map(b => (
            <Card key={b.id} className="relative shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 h-full group overflow-hidden">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditingBatch(b); setEditOpen(true); }}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => remove(b.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <Link to="/app/batches/$batchId" params={{ batchId: b.id }} className="block p-6 h-full">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-3 shadow-glow">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg pr-8">{b.name}</h3>
                {b.subject && <Badge variant="secondary" className="mt-1">{b.subject}</Badge>}
                {b.description && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{b.description}</p>}
                <div className="text-xs text-muted-foreground mt-4">{b.batch_members?.[0]?.count ?? 0} members</div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
