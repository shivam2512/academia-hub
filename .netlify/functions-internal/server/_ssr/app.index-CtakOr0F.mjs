import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase, c as cn } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import "../_libs/sonner.mjs";
import { d as BookOpen, U as Users, T as TrendingUp, G as GraduationCap, b as Calendar, F as FileText, V as Video, e as ArrowRight, f as Clock, P as Presentation } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
function Dashboard() {
  const {
    user,
    roles,
    isAdmin,
    hasRole
  } = useAuth();
  const isTeacher = hasRole("teacher");
  hasRole("student") && !isAdmin && !isTeacher;
  if (isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, { email: user?.email ?? "", roles });
  if (isTeacher) return /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherDashboard, { email: user?.email ?? "", userId: user.id });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StudentDashboard, { email: user?.email ?? "", userId: user.id });
}
function AdminDashboard({
  email,
  roles
}) {
  const [stats, setStats] = reactExports.useState({
    batches: 0,
    users: 0,
    teachers: 0,
    students: 0,
    classes: 0,
    notes: 0,
    videos: 0,
    pendingPayments: 0
  });
  const [upcoming, setUpcoming] = reactExports.useState([]);
  reactExports.useEffect(() => {
    (async () => {
      const [b, u, t, s, c, n, v, up, invs] = await Promise.all([supabase.from("batches").select("id", {
        count: "exact",
        head: true
      }), supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      }), supabase.from("user_roles").select("user_id", {
        count: "exact",
        head: true
      }).eq("role", "teacher"), supabase.from("user_roles").select("user_id", {
        count: "exact",
        head: true
      }).eq("role", "student"), supabase.from("live_classes").select("id", {
        count: "exact",
        head: true
      }), supabase.from("notes").select("id", {
        count: "exact",
        head: true
      }), supabase.from("video_recordings").select("id", {
        count: "exact",
        head: true
      }), supabase.from("live_classes").select("id, title, scheduled_at, batch_id, batches(name)").gte("scheduled_at", (/* @__PURE__ */ new Date()).toISOString()).order("scheduled_at").limit(5), supabase.from("student_invoices").select("total_fee, paid_amount")]);
      const pending = (invs.data ?? []).reduce((acc, curr) => acc + (Number(curr.total_fee) - Number(curr.paid_amount)), 0);
      setStats({
        batches: b.count ?? 0,
        users: u.count ?? 0,
        teachers: t.count ?? 0,
        students: s.count ?? 0,
        classes: c.count ?? 0,
        notes: n.count ?? 0,
        videos: v.count ?? 0,
        pendingPayments: pending
      });
      setUpcoming(up.data ?? []);
    })();
  }, []);
  const tiles = [{
    label: "Batches",
    value: stats.batches,
    icon: BookOpen,
    color: "from-violet-500 to-fuchsia-500"
  }, {
    label: "Total users",
    value: stats.users,
    icon: Users,
    color: "from-blue-500 to-cyan-500"
  }, {
    label: "Pending Fees",
    value: `₹${stats.pendingPayments.toLocaleString()}`,
    icon: TrendingUp,
    color: "from-rose-500 to-orange-500"
  }, {
    label: "Students",
    value: stats.students,
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-500"
  }, {
    label: "Live classes",
    value: stats.classes,
    icon: Calendar,
    color: "from-pink-500 to-rose-500"
  }, {
    label: "Notes",
    value: stats.notes,
    icon: FileText,
    color: "from-indigo-500 to-purple-500"
  }, {
    label: "Recordings",
    value: stats.videos,
    icon: Video,
    color: "from-red-500 to-pink-500"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Admin Console", description: `Signed in as ${roles.join(", ") || "admin"} · ${email}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8", children: tiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 shadow-card hover:shadow-elegant transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-3`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-5 w-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("font-bold truncate", typeof t.value === "string" ? "text-lg" : "text-2xl"), children: t.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.label })
    ] }, t.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold mb-4", children: "Quick actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/invoices", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-between", children: [
            "Manage invoices ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/users", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-between", children: [
            "Manage users ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/batches", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-between", children: [
            "Manage batches ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary" }),
          " Upcoming live classes (all batches)"
        ] }),
        upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm py-8 text-center", children: "No upcoming classes." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: upcoming.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/batches/$batchId/live", params: {
          batchId: c.batch_id
        }, className: "flex items-center justify-between py-3 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: c.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              c.batches?.name,
              " · ",
              new Date(c.scheduled_at).toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-primary" })
        ] }, c.id)) })
      ] })
    ] })
  ] });
}
function TeacherDashboard({
  email,
  userId
}) {
  const [myBatches, setMyBatches] = reactExports.useState([]);
  const [upcoming, setUpcoming] = reactExports.useState([]);
  const [past, setPast] = reactExports.useState([]);
  const [counts, setCounts] = reactExports.useState({
    students: 0,
    notes: 0,
    videos: 0
  });
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: memberships
      } = await supabase.from("batch_members").select("batch_id, batches(id, name, subject)").eq("user_id", userId).eq("role", "teacher");
      const batches = (memberships ?? []).map((m) => m.batches).filter(Boolean);
      setMyBatches(batches);
      const ids = batches.map((b) => b.id);
      if (ids.length === 0) return;
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const [up, pa, st, n, v] = await Promise.all([supabase.from("live_classes").select("id, title, scheduled_at, duration_minutes, meeting_url, batch_id, batches(name)").in("batch_id", ids).gte("scheduled_at", nowIso).order("scheduled_at").limit(5), supabase.from("live_classes").select("id, title, scheduled_at, batch_id, batches(name)").in("batch_id", ids).lt("scheduled_at", nowIso).order("scheduled_at", {
        ascending: false
      }).limit(3), supabase.from("batch_members").select("user_id", {
        count: "exact",
        head: true
      }).in("batch_id", ids).eq("role", "student"), supabase.from("notes").select("id", {
        count: "exact",
        head: true
      }).in("batch_id", ids).eq("uploaded_by", userId), supabase.from("video_recordings").select("id", {
        count: "exact",
        head: true
      }).in("batch_id", ids).eq("uploaded_by", userId)]);
      setUpcoming(up.data ?? []);
      setPast(pa.data ?? []);
      setCounts({
        students: st.count ?? 0,
        notes: n.count ?? 0,
        videos: v.count ?? 0
      });
    })();
  }, [userId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `Welcome, ${email.split("@")[0]}`, description: "Teacher dashboard — manage your batches, schedule classes and share materials." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: BookOpen, label: "My batches", value: myBatches.length, color: "from-violet-500 to-fuchsia-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: GraduationCap, label: "My students", value: counts.students, color: "from-emerald-500 to-teal-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: FileText, label: "Notes I uploaded", value: counts.notes, color: "from-amber-500 to-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: Video, label: "Recordings I added", value: counts.videos, color: "from-pink-500 to-rose-500" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary" }),
          " Your upcoming classes"
        ] }) }),
        upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-10 w-10 mx-auto text-muted-foreground/50 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No classes scheduled. Open a batch to schedule one." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: upcoming.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-card transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: c.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              c.batches?.name,
              " · ",
              new Date(c.scheduled_at).toLocaleString(),
              " · ",
              c.duration_minutes,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.meeting_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4 mr-1" }),
            "Start"
          ] }) })
        ] }, c.id)) }),
        past.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-muted-foreground mt-6 mb-2", children: "Recently taught" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: past.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm py-1.5 px-2 rounded hover:bg-muted/50 flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              c.title,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "— ",
                c.batches?.name
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(c.scheduled_at).toLocaleDateString() })
          ] }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-5 w-5 text-primary" }),
          " My batches"
        ] }),
        myBatches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm py-6 text-center", children: "You haven't been assigned to any batch yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: myBatches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/batches/$batchId", params: {
          batchId: b.id
        }, className: "block p-3 rounded-lg border hover:border-primary hover:shadow-card transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: b.name }),
          b.subject && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "mt-1 text-xs", children: b.subject })
        ] }, b.id)) })
      ] })
    ] })
  ] });
}
function StudentDashboard({
  email,
  userId
}) {
  const [myBatches, setMyBatches] = reactExports.useState([]);
  const [nextClass, setNextClass] = reactExports.useState(null);
  const [upcoming, setUpcoming] = reactExports.useState([]);
  const [recentNotes, setRecentNotes] = reactExports.useState([]);
  const [recentVideos, setRecentVideos] = reactExports.useState([]);
  const [profile, setProfile] = reactExports.useState(null);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: memberships
      } = await supabase.from("batch_members").select("batch_id, batches(id, name, subject, month)").eq("user_id", userId);
      const batches = (memberships ?? []).map((m) => m.batches).filter(Boolean);
      setMyBatches(batches);
      const ids = batches.map((b) => b.id);
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const [up, n, v, prof] = await Promise.all([ids.length ? supabase.from("live_classes").select("id, title, scheduled_at, duration_minutes, meeting_url, batch_id, batches(name)").in("batch_id", ids).gte("scheduled_at", nowIso).order("scheduled_at").limit(5) : Promise.resolve({
        data: []
      }), ids.length ? supabase.from("notes").select("id, title, batch_id, created_at, batches(name)").in("batch_id", ids).order("created_at", {
        ascending: false
      }).limit(5) : Promise.resolve({
        data: []
      }), ids.length ? supabase.from("video_recordings").select("id, title, batch_id, created_at, batches(name)").in("batch_id", ids).order("created_at", {
        ascending: false
      }).limit(5) : Promise.resolve({
        data: []
      }), supabase.from("profiles").select("*").eq("id", userId).single()]);
      const list = up.data ?? [];
      setNextClass(list[0] ?? null);
      setUpcoming(list.slice(1));
      setRecentNotes(n.data ?? []);
      setRecentVideos(v.data ?? []);
      setProfile(prof.data);
    })();
  }, [userId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `Hi ${email.split("@")[0]} 👋`, description: "Your learning hub — join live classes, review notes and watch recordings." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: nextClass ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-0 overflow-hidden shadow-elegant border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-hero text-white p-8 relative flex flex-col justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,oklch(0.85_0.18_310/.4),transparent_60%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/25 text-white border-white/30 mb-2", children: "Next live class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: nextClass.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/85 text-sm mt-1", children: [
            nextClass.batches?.name,
            " · ",
            new Date(nextClass.scheduled_at).toLocaleString(),
            " · ",
            nextClass.duration_minutes,
            " min"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: nextClass.meeting_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", className: "bg-white text-primary hover:bg-white/90 px-8 h-12 rounded-full font-bold shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5 mr-2" }),
          "Join class"
        ] }) })
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 shadow-card flex items-center gap-6 border-dashed border-2 bg-muted/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-muted-foreground/50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-semibold", children: "No upcoming live classes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Check back later or browse your batches below." })
      ] })
    ] }) }),
    profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 mb-6 shadow-card border-l-4 border-l-primary relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-24 h-24" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-6 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-24 w-24 border-4 border-background shadow-elegant", children: [
          profile.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: profile.full_name, className: "object-cover" }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-2xl font-bold", children: (profile.full_name || email).slice(0, 2).toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: profile.full_name || "New Student" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] uppercase tracking-wider", children: [
              profile.admission_type || "Standard",
              " Admission"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", size: "sm", className: "p-0 h-auto text-primary mt-1", children: "Edit Profile" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-4 bg-primary/30 rounded-full" }),
            " Personal"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "Mobile", value: profile.mobile_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "WhatsApp", value: profile.whatsapp_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "City", value: profile.city }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "State", value: profile.state })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-4 bg-primary/30 rounded-full" }),
            " Academic & Career"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "Education", value: profile.education_details }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "Designation", value: profile.designation }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "Current PKG", value: profile.current_package })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-4 bg-primary/30 rounded-full" }),
            " Enrollment"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "Joining Date", value: profile.joining_date ? new Date(profile.joining_date).toLocaleDateString() : null }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "Batch Month", value: myBatches.map((b) => b.month).filter(Boolean).join(", ") || "Not Assigned", className: "text-primary font-semibold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileItem, { label: "PP Eligible", value: profile.eligible_for_pp ? "Yes" : "No" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: BookOpen, label: "Enrolled batches", value: myBatches.length, color: "from-violet-500 to-fuchsia-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: Calendar, label: "Upcoming classes", value: upcoming.length + (nextClass ? 1 : 0), color: "from-emerald-500 to-teal-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: FileText, label: "New notes", value: recentNotes.length, color: "from-amber-500 to-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: Video, label: "New recordings", value: recentVideos.length, color: "from-pink-500 to-rose-500" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-primary" }),
          " My batches"
        ] }),
        myBatches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm py-6 text-center", children: "You haven't been added to a batch yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: myBatches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/batches/$batchId", params: {
          batchId: b.id
        }, className: "block p-3 rounded-lg border hover:border-primary hover:shadow-card transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: b.name }),
          b.subject && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "mt-1 text-xs", children: b.subject })
        ] }, b.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary" }),
          " Latest notes"
        ] }),
        recentNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm py-6 text-center", children: "No notes shared yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: recentNotes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/batches/$batchId/notes", params: {
          batchId: n.batch_id
        }, className: "block py-2.5 hover:bg-muted/50 rounded px-2 -mx-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: n.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            n.batches?.name,
            " · ",
            new Date(n.created_at).toLocaleDateString()
          ] })
        ] }, n.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5 text-primary" }),
          " Latest recordings"
        ] }),
        recentVideos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm py-6 text-center", children: "No recordings yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: recentVideos.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/batches/$batchId/videos", params: {
          batchId: v.batch_id
        }, className: "block py-2.5 hover:bg-muted/50 rounded px-2 -mx-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: v.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            v.batches?.name,
            " · ",
            new Date(v.created_at).toLocaleDateString()
          ] })
        ] }, v.id)) })
      ] })
    ] })
  ] });
}
function ProfileItem({
  label,
  value,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-sm font-medium", !value && "text-muted-foreground italic", className), children: value || "Not provided" })
  ] });
}
function StatTile({
  icon: Icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 shadow-card hover:shadow-elegant transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-white" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("font-bold truncate", typeof value === "string" ? "text-lg" : "text-2xl"), children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
  ] });
}
export {
  Dashboard as component
};
