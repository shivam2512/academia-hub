import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase, c as cn } from "./router-Dwu1zVAe.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { A as Avatar, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogDescription } from "./dialog-hFrm-Hfv.mjs";
import { M as MessageSquare, K as Paperclip, N as SmilePlus, O as Reply, l as Trash2, X, Q as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const EMOJIS = ["👍", "❤️", "😂", "🎉", "🙏", "🔥", "😮", "😢"];
function ChatPage() {
  const {
    batchId
  } = useParams({
    from: "/app/batches/$batchId/chat"
  });
  const {
    user,
    isAdmin
  } = useAuth();
  const [messages, setMessages] = reactExports.useState([]);
  const [profiles, setProfiles] = reactExports.useState({});
  const [reactions, setReactions] = reactExports.useState({});
  const [text, setText] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [replyTo, setReplyTo] = reactExports.useState(null);
  const [sending, setSending] = reactExports.useState(false);
  const [mediaUrls, setMediaUrls] = reactExports.useState({});
  const [selectedImage, setSelectedImage] = reactExports.useState(null);
  const scrollRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data: msgs
      } = await supabase.from("chat_messages").select("*").eq("batch_id", batchId).order("created_at").limit(500);
      setMessages(msgs ?? []);
      const userIds = [...new Set((msgs ?? []).map((m) => m.user_id))];
      if (userIds.length) {
        const {
          data: profs
        } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
        const map = {};
        (profs ?? []).forEach((p) => {
          map[p.id] = p;
        });
        setProfiles(map);
      }
      const ids = (msgs ?? []).map((m) => m.id);
      if (ids.length) {
        const {
          data: rxs
        } = await supabase.from("message_reactions").select("*").in("message_id", ids);
        const rmap = {};
        (rxs ?? []).forEach((r) => {
          (rmap[r.message_id] ||= []).push(r);
        });
        setReactions(rmap);
      }
    })();
  }, [batchId]);
  reactExports.useEffect(() => {
    const ch = supabase.channel(`batch-chat-${batchId}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "chat_messages",
      filter: `batch_id=eq.${batchId}`
    }, async (payload) => {
      const m = payload.new;
      setMessages((prev) => prev.find((x) => x.id === m.id) ? prev : [...prev, m]);
      if (!profiles[m.user_id]) {
        const {
          data
        } = await supabase.from("profiles").select("id, full_name, email").eq("id", m.user_id).single();
        if (data) setProfiles((p) => ({
          ...p,
          [m.user_id]: data
        }));
      }
    }).on("postgres_changes", {
      event: "DELETE",
      schema: "public",
      table: "chat_messages",
      filter: `batch_id=eq.${batchId}`
    }, (payload) => setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "message_reactions"
    }, (payload) => {
      const r = payload.new;
      setReactions((prev) => ({
        ...prev,
        [r.message_id]: [...prev[r.message_id] || [], r]
      }));
    }).on("postgres_changes", {
      event: "DELETE",
      schema: "public",
      table: "message_reactions"
    }, (payload) => {
      const r = payload.old;
      setReactions((prev) => ({
        ...prev,
        [r.message_id]: (prev[r.message_id] || []).filter((x) => x.id !== r.id)
      }));
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [batchId, profiles]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages.length]);
  reactExports.useEffect(() => {
    (async () => {
      const need = messages.filter((m) => m.media_url && !mediaUrls[m.media_url]);
      if (!need.length) return;
      const updates = {};
      await Promise.all(need.map(async (m) => {
        const {
          data
        } = await supabase.storage.from("chat-media").createSignedUrl(m.media_url, 3600);
        if (data) updates[m.media_url] = data.signedUrl;
      }));
      if (Object.keys(updates).length) setMediaUrls((prev) => ({
        ...prev,
        ...updates
      }));
    })();
  }, [messages]);
  const send = async () => {
    if (!text.trim() && !file) return;
    if (!user) return;
    setSending(true);
    let media_url = null;
    let media_type = null;
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Max 20 MB");
        setSending(false);
        return;
      }
      const path = `${batchId}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("chat-media").upload(path, file);
      if (up.error) {
        toast.error(up.error.message);
        setSending(false);
        return;
      }
      media_url = path;
      media_type = file.type;
    }
    const {
      error
    } = await supabase.from("chat_messages").insert({
      batch_id: batchId,
      user_id: user.id,
      content: text.trim() || null,
      media_url,
      media_type,
      reply_to: replyTo?.id ?? null
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setText("");
    setFile(null);
    setReplyTo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const toggleReaction = async (messageId, emoji) => {
    if (!user) return;
    const existing = (reactions[messageId] || []).find((r) => r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({
        message_id: messageId,
        user_id: user.id,
        emoji
      });
    }
  };
  const deleteMessage = async (id) => {
    if (!confirm("Delete message?")) return;
    await supabase.from("chat_messages").delete().eq("id", id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[calc(100vh-3.25rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-3 sm:p-6 space-y-1 bg-gradient-subtle", children: [
      messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-12 w-12 mb-3 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No messages yet. Say hello!" })
      ] }),
      messages.map((m, i) => {
        const mine = m.user_id === user?.id;
        const prev = messages[i - 1];
        const showHeader = !prev || prev.user_id !== m.user_id || new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() > 5 * 6e4;
        const author = profiles[m.user_id];
        const name = author?.full_name || author?.email || "User";
        const reply = m.reply_to ? messages.find((x) => x.id === m.reply_to) : null;
        const replyAuthor = reply ? profiles[reply.user_id] : null;
        const rxList = reactions[m.id] || [];
        const rxGroups = rxList.reduce((acc, r) => {
          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
          return acc;
        }, {});
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex gap-2 group", mine ? "flex-row-reverse" : ""), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 flex-shrink-0", children: showHeader && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-[10px] sm:text-xs", children: name.slice(0, 2).toUpperCase() }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("max-w-[85%] sm:max-w-[70%] flex flex-col", mine ? "items-end" : "items-start"), children: [
            showHeader && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] sm:text-xs text-muted-foreground mb-1 px-1", children: [
              name,
              " · ",
              new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-2xl px-3 py-2 shadow-sm relative w-fit", mine ? "bg-gradient-primary text-primary-foreground rounded-tr-sm self-end" : "bg-card border rounded-tl-sm self-start"), children: [
              reply && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("text-[10px] sm:text-xs px-2 py-1 rounded mb-1 border-l-2", mine ? "bg-white/20 border-white/60" : "bg-muted border-primary"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium opacity-80", children: replyAuthor?.full_name || replyAuthor?.email || "User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70 truncate", children: reply.content || "(media)" })
              ] }),
              m.media_url && mediaUrls[m.media_url] && (m.media_type?.startsWith("image/") ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 rounded-lg overflow-hidden border border-black/5 bg-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: mediaUrls[m.media_url], alt: "attachment", className: "max-w-full h-auto max-h-[250px] sm:max-h-[350px] object-contain cursor-pointer hover:opacity-95 transition-opacity block mx-auto", onClick: () => setSelectedImage(mediaUrls[m.media_url]) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: mediaUrls[m.media_url], target: "_blank", rel: "noreferrer", className: "flex items-center gap-2 underline text-xs sm:text-sm mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }),
                "Download attachment"
              ] })),
              m.content && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap break-words text-xs sm:text-sm", children: m.content })
            ] }),
            Object.keys(rxGroups).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-1 flex-wrap", children: Object.entries(rxGroups).map(([e, n]) => {
              const reacted = rxList.some((r) => r.emoji === e && r.user_id === user?.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleReaction(m.id, e), className: cn("text-[10px] px-1.5 py-0.5 rounded-full border bg-card hover:bg-muted", reacted && "border-primary bg-primary/10"), children: [
                e,
                " ",
                n
              ] }, e);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
            "flex items-center gap-1 self-center transition-opacity",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
            // Visible on mobile, hover on desktop
            mine ? "flex-row-reverse" : ""
          ), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmilePlus, { className: "h-3.5 w-3.5" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-1 flex gap-1", children: EMOJIS.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleReaction(m.id, e), className: "text-xl hover:bg-muted rounded p-1", children: e }, e)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => setReplyTo(m), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-3.5 w-3.5" }) }),
            (mine || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => deleteMessage(m.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-destructive" }) })
          ] })
        ] }, m.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t bg-card p-3", children: [
      replyTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-muted rounded-lg px-3 py-2 mb-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-primary font-medium", children: [
            "Replying to ",
            profiles[replyTo.user_id]?.full_name || profiles[replyTo.user_id]?.email
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-muted-foreground", children: replyTo.content || "(media)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setReplyTo(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      file && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-muted rounded-lg px-3 py-2 mb-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 truncate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" }),
          file.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] || null) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => fileInputRef.current?.click(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: text, onChange: (e) => setText(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }, placeholder: "Type a message…", className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: send, disabled: sending || !text.trim() && !file, className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedImage, onOpenChange: (o) => !o && setSelectedImage(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-5xl p-0 overflow-hidden bg-transparent border-0 shadow-none sm:rounded-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "sr-only", children: "Image Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "sr-only", children: "Full-size view of the chat attachment" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center justify-center w-full h-full max-h-[90vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedImage || "", alt: "full size", className: "max-w-full max-h-full object-contain shadow-2xl rounded-lg" }) })
    ] }) })
  ] });
}
export {
  ChatPage as component
};
