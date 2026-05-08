import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Lock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createUser, deleteUser } from "@/actions/users";

export const Route = createFileRoute("/app/users")({ component: UsersPage });

function UsersPage() {
  const { isAdmin, hasRole } = useAuth();
  const isSuperadmin = hasRole("superadmin");
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState<AppRole>("student");
  const [batches, setBatches] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<Record<string, any[]>>({});
  const [assignOpen, setAssignOpen] = useState<string | null>(null);

  const load = async () => {
    const [u, r, b, m] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("batches").select("id, name"),
      supabase.from("batch_members").select("user_id, batch_id, role, batches(name)"),
    ]);
    setUsers(u.data ?? []);
    const rmap: Record<string, string[]> = {};
    (r.data ?? []).forEach(x => { (rmap[x.user_id] ||= []).push(x.role); });
    setRoles(rmap);
    setBatches(b.data ?? []);
    const mmap: Record<string, any[]> = {};
    (m.data ?? []).forEach((x: any) => { (mmap[x.user_id] ||= []).push(x); });
    setMemberships(mmap);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (!isAdmin) return (
    <div className="p-8"><Card className="p-12 text-center shadow-card"><Lock className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" /><p>Admins only.</p></Card></div>
  );

  const assignToBatch = async (userId: string, batchId: string, role: "teacher"|"student", checked: boolean) => {
    if (checked) {
      const { error } = await supabase.from("batch_members").insert({ user_id: userId, batch_id: batchId, role });
      if (error) toast.error(error.message); else toast.success("Added");
    } else {
      const { error } = await supabase.from("batch_members").delete().eq("user_id", userId).eq("batch_id", batchId);
      if (error) toast.error(error.message); else toast.success("Removed");
    }
    load();
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      
      await deleteUser({
        data: userId,
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      toast.success("User deleted");
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete user");
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      password: String(fd.get("password") || ""),
      role: newRole,
    };
    if (payload.full_name.length < 2 || !payload.email || payload.password.length < 6) {
      toast.error("Name, valid email, and password (6+ chars) are required");
      return;
    }
    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      await createUser({
        data: payload,
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      toast.success("User created");
      setCreateOpen(false);
      setNewRole("student");
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Users"
        description="All users on the platform."
        actions={isSuperadmin && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />Add user
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a new user</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div><Label htmlFor="nu-name">Full name</Label><Input id="nu-name" name="full_name" required /></div>
                <div><Label htmlFor="nu-email">Email</Label><Input id="nu-email" name="email" type="email" required /></div>
                <div><Label htmlFor="nu-password">Temporary password (min 6 chars)</Label><Input id="nu-password" name="password" type="text" required minLength={6} /></div>
                <div>
                  <Label>Role</Label>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="superadmin">Superadmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Share these credentials with the user. They can change their password after signing in.</p>
                <DialogFooter><Button type="submit" disabled={creating}>{creating ? "Creating…" : "Create user"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />
      <Card className="shadow-card overflow-hidden">
        <div className="divide-y">
          {users.map(u => {
            const userRoles = roles[u.id] || [];
            const userMemberships = memberships[u.id] || [];
            const isOpen = assignOpen === u.id;
            return (
              <div key={u.id} className="p-4 flex items-center gap-4">
                <Avatar><AvatarFallback className="bg-gradient-primary text-primary-foreground">{(u.full_name || u.email || "U").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.full_name || "—"}</div>
                  <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {userRoles.map(r => <Badge key={r} variant="secondary" className="capitalize text-xs">{r}</Badge>)}
                    {userMemberships.map((m: any) => <Badge key={m.batch_id} variant="outline" className="text-xs">{m.batches?.name} · {m.role}</Badge>)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={isOpen} onOpenChange={(o) => setAssignOpen(o ? u.id : null)}>
                    <DialogTrigger asChild><Button variant="outline" size="sm"><UserPlus className="h-4 w-4 mr-2" />Batches</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Assign {u.full_name || u.email} to batches</DialogTitle></DialogHeader>
                      <div className="space-y-3 max-h-96 overflow-auto">
                        {batches.length === 0 && <p className="text-sm text-muted-foreground">No batches yet.</p>}
                        {batches.map(b => {
                          const m = userMemberships.find((x: any) => x.batch_id === b.id);
                          return (
                            <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="font-medium">{b.name}</div>
                              <div className="flex items-center gap-3">
                                <Select
                                  value={m?.role ?? "student"}
                                  onValueChange={async (newRole: any) => {
                                    if (m) {
                                      await supabase.from("batch_members").update({ role: newRole }).eq("user_id", u.id).eq("batch_id", b.id);
                                      load();
                                    }
                                  }}
                                  disabled={!m}
                                >
                                  <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Checkbox checked={!!m} onCheckedChange={(c) => assignToBatch(u.id, b.id, (m?.role as any) ?? "student", !!c)} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <DialogFooter><Button onClick={() => setAssignOpen(null)}>Done</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {isSuperadmin && u.id !== (useAuth().user?.id) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(u.id, u.email)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {users.length === 0 && <div className="p-8 text-center text-muted-foreground"><Users className="h-10 w-10 mx-auto mb-2 opacity-40" />No users yet.</div>}
        </div>
      </Card>
    </div>
  );
}
