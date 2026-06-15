import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, c as cn, s as supabase } from "./router-Dwu1zVAe.mjs";
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
import { v as ArrowLeft, w as FolderPlus, h as Plus, x as Folder, l as Trash2, V as Video, X, y as Maximize, z as ExternalLink } from "../_libs/lucide-react.mjs";
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
function getYouTubeId(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop() || null;
    }
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1) || null;
    }
  } catch (e) {
  }
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
  return m ? m[1] : null;
}
function getVimeoId(url) {
  const m = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
  return m ? m[1] : null;
}
function VideosPage() {
  const {
    batchId
  } = useParams({
    from: "/app/batches/$batchId/videos"
  });
  const {
    user,
    hasAnyRole,
    isAdmin
  } = useAuth();
  const canAdd = isAdmin || hasAnyRole(["teacher"]);
  const [videos, setVideos] = reactExports.useState([]);
  const [folders, setFolders] = reactExports.useState([]);
  const [currentFolderId, setCurrentFolderId] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [openFolderDialog, setOpenFolderDialog] = reactExports.useState(false);
  const [provider, setProvider] = reactExports.useState("youtube");
  const [fullscreenId, setFullscreenId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const handleFsChange = () => {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (!fsElement) {
        setFullscreenId(null);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);
  const load = async () => {
    const {
      data: videosData
    } = await supabase.from("video_recordings").select("*").eq("batch_id", batchId).order("created_at", {
      ascending: false
    });
    const {
      data: foldersData
    } = await supabase.from("video_folders").select("*").eq("batch_id", batchId).order("created_at", {
      ascending: true
    });
    let eligible = true;
    if (user && !isAdmin && !hasAnyRole(["teacher"])) {
      const {
        data: prof
      } = await supabase.from("profiles").select("eligible_for_pp").eq("id", user.id).single();
      eligible = !!prof?.eligible_for_pp;
    }
    setVideos(videosData ?? []);
    if (!eligible) {
      setFolders((foldersData ?? []).filter((f) => f.name !== "PP Session"));
    } else {
      setFolders(foldersData ?? []);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, [batchId, user?.id]);
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title")?.trim();
    const video_url = fd.get("url")?.trim();
    const description = fd.get("description")?.trim();
    if (!title || !video_url) {
      toast.error("Title and URL required");
      return;
    }
    try {
      new URL(video_url);
    } catch {
      toast.error("Invalid URL");
      return;
    }
    const {
      error
    } = await supabase.from("video_recordings").insert({
      batch_id: batchId,
      title,
      video_url,
      description,
      provider,
      uploaded_by: user?.id,
      folder_id: currentFolderId
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Video added");
    setOpen(false);
    load();
  };
  const remove = async (id) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("video_recordings").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };
  const submitFolder = async (e) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name")?.trim();
    if (!name) return;
    const {
      error
    } = await supabase.from("video_folders").insert({
      batch_id: batchId,
      name,
      created_by: user?.id
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Folder created");
    setOpenFolderDialog(false);
    load();
  };
  const removeFolder = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this folder and ALL videos inside it?")) return;
    await supabase.from("video_folders").delete().eq("id", id);
    toast.success("Folder deleted");
    load();
  };
  const toggleFullscreen = (id, e) => {
    const container = e.currentTarget.closest(".video-wrapper");
    if (!container) return;
    if (fullscreenId === id) {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {
          });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      setFullscreenId(null);
      return;
    }
    if (container.requestFullscreen) {
      container.requestFullscreen().then(() => setFullscreenId(id)).catch(() => {
        setFullscreenId(id);
      });
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
      setFullscreenId(id);
    } else {
      setFullscreenId(id);
    }
  };
  const visibleVideos = videos.filter((v) => v.folder_id === currentFolderId);
  const currentFolderName = folders.find((f) => f.id === currentFolderId)?.name;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: currentFolderId ? `Folder: ${currentFolderName}` : "Video recordings", description: currentFolderId ? "Videos inside this folder." : "Class recordings — organize with folders.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      currentFolderId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setCurrentFolderId(null), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Back"
      ] }),
      canAdd && !currentFolderId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: openFolderDialog, onOpenChange: setOpenFolderDialog, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "h-4 w-4 mr-2" }),
          "New Folder"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Folder" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitFolder, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "folder-name", children: "Folder Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "folder-name", name: "name", required: true, autoFocus: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Create" }) })
          ] })
        ] })
      ] }),
      canAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Add recording"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add recording" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", name: "title", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Provider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: provider, onValueChange: (v) => setProvider(v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "youtube", children: "YouTube" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "vimeo", children: "Vimeo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "url", children: "Video URL (use unlisted videos for privacy)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "url", name: "url", type: "url", required: true, placeholder: "https://youtube.com/watch?v=..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", name: "description", rows: 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Add" }) })
          ] })
        ] })
      ] })
    ] }) }),
    !currentFolderId && folders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Folders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 lg:grid-cols-4 gap-4", children: folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors shadow-sm hover:shadow-md", onClick: () => setCurrentFolderId(f.id), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-5 w-5 text-blue-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: f.name })
        ] }),
        (isAdmin || f.created_by === user?.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 hover:bg-destructive/10", onClick: (e) => removeFolder(f.id, e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] }, f.id)) })
    ] }),
    visibleVideos.length === 0 && !currentFolderId && folders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-12 w-12 mx-auto text-muted-foreground/50 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No recordings or folders yet." })
    ] }) : visibleVideos.length === 0 && currentFolderId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-12 w-12 mx-auto text-muted-foreground/50 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "This folder is empty." })
    ] }) : visibleVideos.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      !currentFolderId && folders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Uncategorized Videos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: visibleVideos.map((v) => {
        const ytId = getYouTubeId(v.video_url);
        const vimeoId = getVimeoId(v.video_url);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden shadow-card hover:shadow-elegant transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("aspect-video bg-black relative overflow-hidden group video-wrapper transition-all duration-300", fullscreenId === v.id && "fixed inset-0 z-[9999] w-screen h-screen aspect-auto flex items-center justify-center"), onContextMenu: (e) => e.preventDefault(), style: {
            WebkitTouchCallout: "none",
            userSelect: "none"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-[15%] min-h-[60px] z-10 bg-transparent", title: "Protected video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-[20%] max-w-[200px] h-[15%] min-h-[80px] z-10 bg-transparent", title: "Protected video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-[25%] max-w-[250px] h-[15%] min-h-[80px] z-10 bg-transparent", title: "Protected video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 z-20 pointer-events-none opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-black/50 text-[10px] text-white border-white/20", children: "DBS IT SECURE" }) }),
            (ytId || vimeoId) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => toggleFullscreen(v.id, e), className: cn("absolute top-4 right-14 z-20 p-2 bg-black/60 text-white rounded-md transition-all hover:bg-black/80", fullscreenId === v.id ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"), title: fullscreenId === v.id ? "Close Fullscreen" : "Toggle Fullscreen", children: fullscreenId === v.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: "w-4 h-4" }) }),
            ytId ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { id: `yt-player-${v.id}`, src: `https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1`, className: cn("w-full h-full pointer-events-auto", fullscreenId === v.id && "max-h-full max-w-full aspect-video shadow-2xl"), title: v.title, sandbox: "allow-scripts allow-same-origin allow-presentation", allowFullScreen: true }) : vimeoId ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`, className: cn("w-full h-full", fullscreenId === v.id && "max-h-full max-w-full aspect-video shadow-2xl"), title: v.title, sandbox: "allow-scripts allow-same-origin allow-presentation", allowFullScreen: true }) : isAdmin || v.uploaded_by === user?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: v.video_url, target: "_blank", rel: "noreferrer", className: "flex items-center justify-center w-full h-full bg-gradient-primary text-primary-foreground hover:opacity-90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-10 w-10 mx-auto mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Open video" })
            ] }) }) : v.video_url?.match(/\.(mp4|webm|ogg)$/i) ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { id: `native-player-${v.id}`, src: v.video_url, controls: true, controlsList: "nodownload", onContextMenu: (e) => e.preventDefault(), className: "w-full h-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-full h-full bg-slate-900 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-10 w-10 mx-auto mb-2 opacity-50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "Video cannot be embedded" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: v.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mr-1", children: "Speed:" }),
                  [0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                    const yt = document.getElementById(`yt-player-${v.id}`);
                    if (yt) {
                      yt.contentWindow?.postMessage(JSON.stringify({
                        event: "command",
                        func: "setPlaybackRate",
                        args: [speed]
                      }), "*");
                    }
                    const native = document.getElementById(`native-player-${v.id}`);
                    if (native) {
                      native.playbackRate = speed;
                    }
                  }, className: "px-1.5 py-0.5 rounded border text-[10px] font-medium hover:bg-primary hover:text-white transition-colors", children: [
                    speed,
                    "x"
                  ] }, speed))
                ] })
              ] }),
              (v.uploaded_by === user?.id || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(v.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
            ] }),
            v.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: v.description }),
            (isAdmin || v.uploaded_by === user?.id) && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: v.video_url, target: "_blank", rel: "noreferrer", className: "text-xs text-primary mt-2 inline-flex items-center gap-1", children: [
              "Open in new tab ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
            ] })
          ] })
        ] }, v.id);
      }) })
    ] }) : null
  ] });
}
export {
  VideosPage as component
};
