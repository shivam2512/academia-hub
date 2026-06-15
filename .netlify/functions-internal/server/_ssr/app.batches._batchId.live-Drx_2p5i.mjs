import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { L as Label } from "./label-C3nympTn.mjs";
import { T as Textarea } from "./textarea-1NvQrV9y.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BsTkSNkg.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-hFrm-Hfv.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as Plus, b as Calendar, V as Video, l as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
function LiveClassesPage() {
  const {
    batchId
  } = useParams({
    from: "/app/batches/$batchId/live"
  });
  const {
    user,
    hasAnyRole,
    isAdmin
  } = useAuth();
  const canAdd = isAdmin || hasAnyRole(["teacher"]);
  const [classes, setClasses] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [provider, setProvider] = reactExports.useState("zoom");
  const load = async () => {
    const {
      data
    } = await supabase.from("live_classes").select("*").eq("batch_id", batchId).order("scheduled_at", {
      ascending: true
    });
    setClasses(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, [batchId]);
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title")?.trim();
    const meeting_url = fd.get("url")?.trim();
    const scheduled_at = fd.get("scheduled_at");
    const duration_minutes = parseInt(fd.get("duration")) || 60;
    const description = fd.get("description")?.trim();
    if (!title || !meeting_url || !scheduled_at) {
      toast.error("Title, link and time required");
      return;
    }
    try {
      new URL(meeting_url);
    } catch {
      toast.error("Invalid URL");
      return;
    }
    const {
      error
    } = await supabase.from("live_classes").insert({
      batch_id: batchId,
      title,
      meeting_url,
      scheduled_at: new Date(scheduled_at).toISOString(),
      duration_minutes,
      description,
      provider,
      created_by: user?.id
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Class scheduled");
    setOpen(false);
    load();
  };
  const remove = async (id) => {
    if (!confirm("Delete this class?")) return;
    await supabase.from("live_classes").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };
  const now = Date.now();
  const upcoming = classes.filter((c) => new Date(c.scheduled_at).getTime() + (c.duration_minutes ?? 60) * 6e4 > now);
  const past = classes.filter((c) => new Date(c.scheduled_at).getTime() + (c.duration_minutes ?? 60) * 6e4 <= now);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Live classes", description: "Scheduled Zoom / Google Meet sessions.", actions: canAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Schedule class"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Schedule live class" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", name: "title", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "scheduled_at", children: "Date & time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "scheduled_at", name: "scheduled_at", type: "datetime-local", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "duration", children: "Duration (min)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "duration", name: "duration", type: "number", defaultValue: 60, min: 5, max: 600 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Provider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: provider, onValueChange: (v) => setProvider(v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "zoom", children: "Zoom" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "meet", children: "Google Meet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "url", children: "Meeting URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "url", name: "url", type: "url", required: true, placeholder: "https://zoom.us/j/..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description / agenda" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", name: "description", rows: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Schedule" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Upcoming", classes: upcoming, userId: user?.id, isAdmin, onDelete: remove, highlight: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Past", classes: past, userId: user?.id, isAdmin, onDelete: remove }) })
  ] });
}
function Section({
  title,
  classes,
  userId,
  isAdmin,
  onDelete,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
      title,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: classes.length })
    ] }),
    classes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center text-sm text-muted-foreground shadow-card", children: [
      "No ",
      title.toLowerCase(),
      " classes."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `p-5 shadow-card ${highlight ? "border-l-4 border-l-primary" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: c.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "capitalize", children: c.provider })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground mt-1", children: [
          new Date(c.scheduled_at).toLocaleString(),
          " · ",
          c.duration_minutes,
          " min"
        ] }),
        c.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: c.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.meeting_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4 mr-2" }),
          "Join"
        ] }) }),
        (c.created_by === userId || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => onDelete(c.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] })
    ] }) }, c.id)) })
  ] });
}
export {
  LiveClassesPage as component
};
