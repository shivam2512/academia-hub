import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Lock, Plus, Trash2, Search, Edit } from "lucide-react";
import { toast } from "sonner";
import { createUser, deleteUser, updateUser } from "@/actions/users";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/users")({ component: UsersPage });

function UsersPage() {
  const { isAdmin, hasRole } = useAuth();
  const isSuperadmin = hasRole("superadmin");
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState<AppRole>("student");
  const [eligibleForPP, setEligibleForPP] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<Record<string, any[]>>({});
  const [invoices, setInvoices] = useState<Record<string, any>>({});
  const [assignOpen, setAssignOpen] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    const [u, r, b, m, i] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("batches").select("id, name"),
      supabase.from("batch_members").select("user_id, batch_id, role, batches(name)"),
      supabase.from("student_invoices").select("user_id, status"),
    ]);
    setUsers(u.data ?? []);
    const rmap: Record<string, string[]> = {};
    (r.data ?? []).forEach(x => { (rmap[x.user_id] ||= []).push(x.role); });
    setRoles(rmap);
    setBatches(b.data ?? []);
    const mmap: Record<string, any[]> = {};
    (m.data ?? []).forEach((x: any) => { (mmap[x.user_id] ||= []).push(x); });
    setMemberships(mmap);
    const imap: Record<string, any> = {};
    (i.data ?? []).forEach(x => { imap[x.user_id] = x; });
    setInvoices(imap);
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
      mobile_number: String(fd.get("mobile_number") || "").trim(),
      whatsapp_number: String(fd.get("whatsapp_number") || "").trim(),
      joining_date: String(fd.get("joining_date") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      state: String(fd.get("state") || "").trim(),
      education_details: String(fd.get("education_details") || "").trim(),
      designation: String(fd.get("designation") || "").trim(),
      experience_type: String(fd.get("experience_type") || ""),
      current_package: String(fd.get("current_package") || "").trim(),
      admission_type: String(fd.get("admission_type") || ""),
      eligible_for_pp: eligibleForPP,
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
      setEligibleForPP(false);
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      id: editingUser.id,
      full_name: String(fd.get("full_name") || "").trim(),
      role: (fd.get("role") as AppRole) || "student",
      mobile_number: String(fd.get("mobile_number") || "").trim(),
      whatsapp_number: String(fd.get("whatsapp_number") || "").trim(),
      joining_date: String(fd.get("joining_date") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      state: String(fd.get("state") || "").trim(),
      education_details: String(fd.get("education_details") || "").trim(),
      designation: String(fd.get("designation") || "").trim(),
      experience_type: String(fd.get("experience_type") || ""),
      current_package: String(fd.get("current_package") || "").trim(),
      admission_type: String(fd.get("admission_type") || ""),
      eligible_for_pp: fd.get("eligible_for_pp") === "true",
    };
    
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      await updateUser({
        data: payload,
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      toast.success("User updated");
      setEditOpen(false);
      setEditingUser(null);
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add a new user</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Account Info</h3>
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
                  </div>

                  {newRole === "student" && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Personal Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Mobile No</Label><Input name="mobile_number" placeholder="Mobile" /></div>
                        <div><Label>WhatsApp No</Label><Input name="whatsapp_number" placeholder="WhatsApp" /></div>
                      </div>
                      <div><Label>Joining Date</Label><Input name="joining_date" type="date" /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>City</Label><Input name="city" placeholder="City" /></div>
                        <div><Label>State</Label><Input name="state" placeholder="State" /></div>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="pp" checked={eligibleForPP} onCheckedChange={(v) => setEligibleForPP(!!v)} />
                        <Label htmlFor="pp" className="text-xs font-medium cursor-pointer">Eligible for PP Sessions</Label>
                      </div>
                    </div>
                  )}
                </div>

                {newRole === "student" && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Education & Career</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Education Details</Label><Input name="education_details" placeholder="Degree, College, etc." /></div>
                      <div><Label>Designation</Label><Input name="designation" placeholder="Job Title" /></div>
                      <div>
                        <Label>Candidate Type</Label>
                        <Select name="experience_type" defaultValue="fresher">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fresher">Fresher</SelectItem>
                            <SelectItem value="experienced">Experienced</SelectItem>
                            <SelectItem value="buy_experience">Buy Experience</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Current Package</Label><Input name="current_package" placeholder="e.g. 5 LPA" /></div>
                      <div>
                        <Label>Admission Type</Label>
                        <Select name="admission_type" defaultValue="inhouse">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inhouse">Inhouse</SelectItem>
                            <SelectItem value="reference">Reference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-4">Share these credentials with the user. They can change their password after signing in.</p>
                  <DialogFooter><Button type="submit" className="w-full md:w-auto bg-gradient-primary text-primary-foreground" disabled={creating}>{creating ? "Creating…" : "Create user"}</Button></DialogFooter>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit User: {editingUser?.email}</DialogTitle></DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Account Info</h3>
                  <div><Label>Full name</Label><Input name="full_name" defaultValue={editingUser.full_name} required /></div>
                  <div>
                    <Label>Role</Label>
                    <Select name="role" defaultValue={roles[editingUser.id]?.[0] || "student"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Mobile No</Label><Input name="mobile_number" defaultValue={editingUser.mobile_number} placeholder="Mobile" /></div>
                    <div><Label>WhatsApp No</Label><Input name="whatsapp_number" defaultValue={editingUser.whatsapp_number} placeholder="WhatsApp" /></div>
                  </div>
                  <div><Label>Joining Date</Label><Input name="joining_date" type="date" defaultValue={editingUser.joining_date} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>City</Label><Input name="city" defaultValue={editingUser.city} placeholder="City" /></div>
                    <div><Label>State</Label><Input name="state" defaultValue={editingUser.state} placeholder="State" /></div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <input type="hidden" name="eligible_for_pp" value={String(editingUser.eligible_for_pp)} />
                    <Checkbox 
                      id="edit-pp" 
                      defaultChecked={editingUser.eligible_for_pp} 
                      onCheckedChange={(v) => setEditingUser({...editingUser, eligible_for_pp: !!v})} 
                    />
                    <Label htmlFor="edit-pp" className="text-xs font-medium cursor-pointer">Eligible for PP Sessions</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Education & Career</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Education Details</Label><Input name="education_details" defaultValue={editingUser.education_details} placeholder="Degree, College, etc." /></div>
                  <div><Label>Designation</Label><Input name="designation" defaultValue={editingUser.designation} placeholder="Job Title" /></div>
                  <div>
                    <Label>Candidate Type</Label>
                    <Select name="experience_type" defaultValue={editingUser.experience_type || "fresher"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">Fresher</SelectItem>
                        <SelectItem value="experienced">Experienced</SelectItem>
                        <SelectItem value="buy_experience">Buy Experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Current Package</Label><Input name="current_package" defaultValue={editingUser.current_package} placeholder="e.g. 5 LPA" /></div>
                  <div>
                    <Label>Admission Type</Label>
                    <Select name="admission_type" defaultValue={editingUser.admission_type || "inhouse"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inhouse">Inhouse</SelectItem>
                        <SelectItem value="reference">Reference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter><Button type="submit" className="w-full md:w-auto bg-gradient-primary text-primary-foreground" disabled={updating}>{updating ? "Updating…" : "Update user"}</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-card overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name or email..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="divide-y">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
              {search ? `No results for "${search}"` : "No users yet."}
            </div>
          ) : filteredUsers.map(u => {
            const userRoles = roles[u.id] || [];
            const userMemberships = memberships[u.id] || [];
            const isOpen = assignOpen === u.id;
            return (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar>
                    {u.avatar_url ? <AvatarImage src={u.avatar_url} className="object-cover" /> : null}
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">{(u.full_name || u.email || "U").slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-bold sm:font-medium truncate">{u.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {userRoles.map(r => <Badge key={r} variant="secondary" className="capitalize text-[10px] h-4">{r}</Badge>)}
                      {userMemberships.map((m: any) => <Badge key={m.batch_id} variant="outline" className="text-[10px] h-4">{m.batches?.name} · {m.role}</Badge>)}
                      {userRoles.includes("student") && (
                        <Badge className={cn(
                          "text-[10px] h-4 border-transparent",
                          invoices[u.id]?.status === "fully_paid" ? "bg-emerald-500 hover:bg-emerald-600" :
                          invoices[u.id]?.status === "partially_paid" ? "bg-amber-500 hover:bg-amber-600" :
                          "bg-slate-500 hover:bg-slate-600"
                        )}>
                          {invoices[u.id]?.status?.replace("_", " ") ?? "Unpaid"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end sm:justify-start">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditingUser(u); setEditOpen(true); }}>
                    <Edit className="h-3.5 w-3.5 mr-2" />Edit
                  </Button>

                  <Dialog open={isOpen} onOpenChange={(o) => setAssignOpen(o ? u.id : null)}>
                    <DialogTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs flex-1 sm:flex-none"><UserPlus className="h-3.5 w-3.5 mr-2" />Batches</Button></DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-md">
                      <DialogHeader><DialogTitle>Assign {u.full_name || u.email} to batches</DialogTitle></DialogHeader>
                      <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
                        {batches.length === 0 && <p className="text-sm text-muted-foreground">No batches yet.</p>}
                        {batches.map(b => {
                          const m = userMemberships.find((x: any) => x.batch_id === b.id);
                          return (
                            <div key={b.id} className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/20">
                              <div className="font-medium text-sm">{b.name}</div>
                              <div className="flex items-center justify-between">
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
                                  <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs text-muted-foreground">{m ? "Assigned" : "Not Assigned"}</Label>
                                  <Checkbox checked={!!m} onCheckedChange={(c) => assignToBatch(u.id, b.id, (m?.role as any) ?? "student", !!c)} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <DialogFooter><Button onClick={() => setAssignOpen(null)} className="w-full sm:w-auto">Done</Button></DialogFooter>
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
        </div>
      </Card>
    </div>
  );
}
