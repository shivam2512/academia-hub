import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Users, BookOpen, Video, Calendar, MessageSquare,
  GraduationCap, LogOut, Shield, FileText, Menu, UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; roles: ("superadmin"|"admin"|"teacher"|"student")[] };

const NAV: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, roles: ["superadmin","admin","teacher","student"] },
  { to: "/app/batches", label: "Batches", icon: BookOpen, roles: ["superadmin","admin","teacher","student"] },
  { to: "/app/users", label: "Users", icon: Users, roles: ["superadmin","admin"] },
  { to: "/app/invoices", label: "Invoices", icon: FileText, roles: ["superadmin","admin"] },
  { to: "/app/roles", label: "Roles", icon: Shield, roles: ["superadmin"] },
  { to: "/app/profile", label: "Profile", icon: UserCircle, roles: ["superadmin","admin","teacher","student"] },
];

export function AppLayout() {
  const { user, roles, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        });
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>;
  }

  if (!user) {
    if (typeof window !== "undefined") navigate({ to: "/auth" });
    return null;
  }

  const initials = (user.email ?? "U").slice(0,2).toUpperCase();
  const primaryRole = roles[0] ?? "student";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/app" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">DBS IT</div>
            <div className="text-xs text-sidebar-foreground/60">Learning Hub</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.filter(n => n.roles.some(r => roles.includes(r))).map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.to || (item.to !== "/app" && location.pathname.startsWith(item.to));
          return (
            <Link key={item.to} to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" : "hover:bg-sidebar-accent text-sidebar-foreground/80"
              )}>
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/30">
          <Link to="/app/profile" className="flex items-center gap-3 flex-1 min-w-0" onClick={() => setOpen(false)}>
            <Avatar className="h-9 w-9">
              {avatarUrl ? <AvatarImage src={avatarUrl} className="object-cover" /> : null}
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.email}</div>
              <Badge variant="secondary" className="text-[10px] h-4 mt-0.5 capitalize">{primaryRole}</Badge>
            </div>
          </Link>
          <Button size="icon" variant="ghost" onClick={() => { signOut(); navigate({ to: "/" }); }} className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-subtle">
      {/* Mobile Top Bar */}
      <header className="lg:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">DBS IT</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export const BatchSubNav = ({ batchId }: { batchId: string }) => {
  const location = useLocation();
  const items = [
    { to: `/app/batches/${batchId}`, label: "Overview", icon: LayoutDashboard, exact: true },
    { to: `/app/batches/${batchId}/notes`, label: "Notes", icon: FileText },
    { to: `/app/batches/${batchId}/videos`, label: "Recordings", icon: Video },
    { to: `/app/batches/${batchId}/live`, label: "Live Classes", icon: Calendar },
    { to: `/app/batches/${batchId}/chat`, label: "Chat", icon: MessageSquare },
  ];
  return (
    <div className="border-b bg-card sticky top-0 z-10">
      <div className="flex gap-1 px-6 overflow-x-auto">
        {items.map(it => {
          const active = it.exact ? location.pathname === it.to : location.pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
              <Icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

