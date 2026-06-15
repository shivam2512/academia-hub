import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./router-Dwu1zVAe.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { A as Avatar, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import "../_libs/sonner.mjs";
import { d as BookOpen, F as FileText, V as Video, b as Calendar, U as Users, M as MessageSquare } from "../_libs/lucide-react.mjs";
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
function BatchOverview() {
  const {
    batchId
  } = useParams({
    from: "/app/batches/$batchId/"
  });
  const [batch, setBatch] = reactExports.useState(null);
  const [members, setMembers] = reactExports.useState([]);
  const [counts, setCounts] = reactExports.useState({
    notes: 0,
    videos: 0,
    classes: 0
  });
  reactExports.useEffect(() => {
    (async () => {
      const [b, m, n, v, c] = await Promise.all([supabase.from("batches").select("*").eq("id", batchId).single(), supabase.from("batch_members").select("role, profiles(id, full_name, email)").eq("batch_id", batchId), supabase.from("notes").select("id", {
        count: "exact",
        head: true
      }).eq("batch_id", batchId), supabase.from("video_recordings").select("id", {
        count: "exact",
        head: true
      }).eq("batch_id", batchId), supabase.from("live_classes").select("id", {
        count: "exact",
        head: true
      }).eq("batch_id", batchId)]);
      setBatch(b.data);
      setMembers(m.data ?? []);
      setCounts({
        notes: n.count ?? 0,
        videos: v.count ?? 0,
        classes: c.count ?? 0
      });
    })();
  }, [batchId]);
  if (!batch) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-muted-foreground", children: "Loading…" });
  const teachers = members.filter((m) => m.role === "teacher");
  const students = members.filter((m) => m.role === "student");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-hero p-8 text-white shadow-elegant relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,oklch(0.85_0.18_310/.4),transparent_60%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/80 text-sm", children: "Batch" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: batch.name }),
        batch.subject && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-2 bg-white/20 text-white border-white/30 hover:bg-white/30", children: batch.subject }),
        batch.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/85 max-w-2xl", children: batch.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/batches/$batchId/notes", params: {
        batchId
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 shadow-card hover:shadow-elegant transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-primary mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: counts.notes }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Notes" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/batches/$batchId/videos", params: {
        batchId
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 shadow-card hover:shadow-elegant transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-6 w-6 text-primary mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: counts.videos }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Recordings" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/batches/$batchId/live", params: {
        batchId
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 shadow-card hover:shadow-elegant transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-primary mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: counts.classes }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Live classes" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
          " Teachers (",
          teachers.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          teachers.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No teachers assigned." }),
          teachers.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MemberRow, { m }, m.profiles?.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
          " Students (",
          students.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-h-80 overflow-auto", children: [
          students.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No students yet." }),
          students.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MemberRow, { m }, m.profiles?.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/batches/$batchId/chat", params: {
      batchId
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-card hover:shadow-elegant transition-all flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-6 w-6 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Open batch chat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "WhatsApp-style realtime chat for this batch" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary font-medium", children: "Open →" })
    ] }) })
  ] });
}
function MemberRow({
  m
}) {
  const name = m.profiles?.full_name || m.profiles?.email || "Unknown";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-xs", children: name.slice(0, 2).toUpperCase() }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: m.profiles?.email })
    ] })
  ] });
}
export {
  BatchOverview as component
};
