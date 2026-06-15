import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { L as Label } from "./label-C3nympTn.mjs";
import { T as Textarea } from "./textarea-1NvQrV9y.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-hFrm-Hfv.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as Plus, F as FileText, l as Trash2, D as Download } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
function NotesPage() {
  const {
    batchId
  } = useParams({
    from: "/app/batches/$batchId/notes"
  });
  const {
    user,
    hasAnyRole,
    isAdmin
  } = useAuth();
  const canUpload = isAdmin || hasAnyRole(["teacher"]);
  const [notes, setNotes] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const load = async () => {
    const {
      data
    } = await supabase.from("notes").select("*").eq("batch_id", batchId).order("created_at", {
      ascending: false
    });
    setNotes(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, [batchId]);
  const upload = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    const title = fd.get("title")?.trim();
    const description = fd.get("description")?.trim();
    if (!file || !title) {
      toast.error("Title and file required");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File must be under 25 MB");
      return;
    }
    setBusy(true);
    const path = `${batchId}/${Date.now()}-${file.name}`;
    const up = await supabase.storage.from("notes").upload(path, file);
    if (up.error) {
      toast.error(up.error.message);
      setBusy(false);
      return;
    }
    const {
      error
    } = await supabase.from("notes").insert({
      batch_id: batchId,
      title,
      description,
      file_url: path,
      uploaded_by: user?.id
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Note uploaded");
    setOpen(false);
    load();
  };
  const download = async (path, filename) => {
    const {
      data,
      error
    } = await supabase.storage.from("notes").createSignedUrl(path, 60);
    if (error || !data) {
      toast.error("Could not get download link");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };
  const remove = async (id, path) => {
    if (!confirm("Delete this note?")) return;
    await supabase.storage.from("notes").remove([path]);
    await supabase.from("notes").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Notes", description: "Study materials shared with this batch.", actions: canUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Upload note"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Upload note" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: upload, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", name: "title", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", name: "description", rows: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "file", children: "File (PDF, DOCX, etc. — max 25 MB)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "file", name: "file", type: "file", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Uploading…" : "Upload" }) })
        ] })
      ] })
    ] }) }),
    notes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-12 w-12 mx-auto text-muted-foreground/50 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No notes yet." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: notes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 shadow-card hover:shadow-elegant transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary-foreground" }) }),
        (n.uploaded_by === user?.id || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(n.id, n.file_url), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: n.title }),
      n.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: n.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-3", children: new Date(n.created_at).toLocaleDateString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => download(n.file_url, n.title), variant: "outline", size: "sm", className: "mt-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
        "Download"
      ] })
    ] }, n.id)) })
  ] });
}
export {
  NotesPage as component
};
