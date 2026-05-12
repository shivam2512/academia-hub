import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Shield, X, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/app/roles")({ component: RolesPage });

const ALL_ROLES: ("superadmin"|"admin"|"teacher"|"student")[] = ["superadmin","admin","teacher","student"];

function RolesPage() {
  const { hasRole, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const load = async () => {
    const [u, r] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setUsers(u.data ?? []);
    const rmap: Record<string, string[]> = {};
    (r.data ?? []).forEach(x => { (rmap[x.user_id] ||= []).push(x.role); });
    setRoles(rmap);
  };
  useEffect(() => { if (hasRole("superadmin")) load(); }, [hasRole]);

  if (!hasRole("superadmin")) return (
    <div className="p-8"><Card className="p-12 text-center shadow-card"><Lock className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" /><p>Superadmins only.</p></Card></div>
  );

  const addRole = async (uid: string, role: any) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role });
    if (error) toast.error(error.message); else { toast.success("Role added"); load(); }
  };
  const removeRole = async (uid: string, role: string) => {
    if (uid === user?.id && role === "superadmin") { toast.error("You can't remove your own superadmin role"); return; }
    const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role as any);
    if (error) toast.error(error.message); else { toast.success("Role removed"); load(); }
  };
  
  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <PageHeader title="Roles & Permissions" description="Assign roles. Only superadmins can manage roles." />
      <Card className="shadow-card overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="divide-y">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Shield className="h-10 w-10 mx-auto mb-2 opacity-40" />
              {search ? `No results for "${search}"` : "No users found."}
            </div>
          ) : filteredUsers.map(u => {
            const userRoles = roles[u.id] || [];
            const available = ALL_ROLES.filter(r => !userRoles.includes(r));
            return (
              <div key={u.id} className="p-4 flex items-center gap-4 flex-wrap">
                <Avatar><AvatarFallback className="bg-gradient-primary text-primary-foreground">{(u.full_name || u.email || "U").slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-medium">{u.full_name || "—"}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex gap-1 flex-wrap items-center">
                  {userRoles.map(r => (
                    <Badge key={r} variant="secondary" className="capitalize gap-1 pr-1">
                      <Shield className="h-3 w-3" /> {r}
                      <button onClick={() => removeRole(u.id, r)} className="hover:bg-destructive/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                  {available.length > 0 && (
                    <Select onValueChange={(v) => addRole(u.id, v)}>
                      <SelectTrigger className="w-32 h-7 text-xs"><SelectValue placeholder="+ Add role" /></SelectTrigger>
                      <SelectContent>{available.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
                    </Select>
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
