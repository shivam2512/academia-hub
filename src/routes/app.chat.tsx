import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Send, Paperclip, X, SmilePlus, Reply, Trash2,
  MessageSquare, Search, ArrowLeft, Users
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";

export const Route = createFileRoute("/app/chat")({ component: WhatsAppChat });

const EMOJIS = ["👍", "❤️", "😂", "🎉", "🙏", "🔥", "😮", "😢"];

type Msg = {
  id: string; batch_id: string; user_id: string; content: string | null;
  media_url: string | null; media_type: string | null; reply_to: string | null;
  created_at: string; edited_at: string | null;
};

type Batch = {
  id: string; name: string; subject: string | null; description: string | null;
  created_at: string; batch_members: { count: number }[];
};

const WA_BG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5ddd5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='50' cy='10' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='70' cy='30' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='10' cy='50' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='50' cy='50' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='30' cy='70' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3Ccircle cx='70' cy='70' r='2' fill='%23d4c9bf' opacity='0.5'/%3E%3C/svg%3E`;

function formatTime(dt: string) {
  return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDay(dt: string) {
  const d = new Date(dt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name: string) {
  return name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#059669",
  "#db2777", "#2563eb", "#65a30d", "#9333ea", "#f59e0b"
];
function avatarColor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

function renderContent(content: string, mine: boolean) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\//)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          className={cn("underline break-all font-medium", mine ? "text-[#dcf8c6]" : "text-blue-600")}>
          {part}
        </a>
      );
    }
    return part;
  });
}

/* ────────────────────────────────────────────────────────── */
/*  CHAT PANEL                                               */
/* ────────────────────────────────────────────────────────── */
function ChatPanel({ batch, onBack }: { batch: Batch; onBack: () => void }) {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [reactions, setReactions] = useState<Record<string, any[]>>({});
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const [sending, setSending] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const batchId = batch.id;

  const fetchProfiles = useCallback(async (userIds: string[]) => {
    const missing = userIds.filter(id => !profiles[id]);
    if (!missing.length) return;
    const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", missing);
    if (data) {
      const map: Record<string, any> = {};
      data.forEach(p => { map[p.id] = p; });
      setProfiles(prev => ({ ...prev, ...map }));
    }
  }, [profiles]);

  useEffect(() => {
    setMessages([]); setProfiles({}); setReactions({}); setMediaUrls({});
    (async () => {
      const { data: msgs } = await supabase.from("chat_messages").select("*")
        .eq("batch_id", batchId).order("created_at").limit(500);
      setMessages(msgs ?? []);
      const userIds = [...new Set((msgs ?? []).map(m => m.user_id))];
      if (userIds.length) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
        const map: Record<string, any> = {};
        (profs ?? []).forEach(p => { map[p.id] = p; });
        setProfiles(map);
      }
      const ids = (msgs ?? []).map(m => m.id);
      if (ids.length) {
        const { data: rxs } = await supabase.from("message_reactions").select("*").in("message_id", ids);
        const rmap: Record<string, any[]> = {};
        (rxs ?? []).forEach(r => { (rmap[r.message_id] ||= []).push(r); });
        setReactions(rmap);
      }
    })();
  }, [batchId]);

  useEffect(() => {
    const ch = supabase.channel(`wa-chat-${batchId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `batch_id=eq.${batchId}` },
        async (payload) => {
          const m = payload.new as Msg;
          setMessages(prev => prev.find(x => x.id === m.id) ? prev : [...prev, m]);
          fetchProfiles([m.user_id]);
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages", filter: `batch_id=eq.${batchId}` },
        (payload) => setMessages(prev => prev.filter(m => m.id !== (payload.old as any).id)))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "message_reactions" },
        (payload) => {
          const r = payload.new as any;
          setReactions(prev => ({ ...prev, [r.message_id]: [...(prev[r.message_id] || []), r] }));
        })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "message_reactions" },
        (payload) => {
          const r = payload.old as any;
          setReactions(prev => ({ ...prev, [r.message_id]: (prev[r.message_id] || []).filter((x: any) => x.id !== r.id) }));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [batchId, fetchProfiles]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    (async () => {
      const need = messages.filter(m => m.media_url && !mediaUrls[m.media_url]);
      if (!need.length) return;
      const updates: Record<string, string> = {};
      await Promise.all(need.map(async m => {
        const { data } = await supabase.storage.from("chat-media").createSignedUrl(m.media_url!, 3600);
        if (data) updates[m.media_url!] = data.signedUrl;
      }));
      if (Object.keys(updates).length) setMediaUrls(prev => ({ ...prev, ...updates }));
    })();
  }, [messages, mediaUrls]);

  const send = async () => {
    if (!text.trim() && !file) return;
    if (!user) return;
    setSending(true);
    let media_url: string | null = null;
    let media_type: string | null = null;
    if (file) {
      if (file.size > 20 * 1024 * 1024) { toast.error("Max 20 MB"); setSending(false); return; }
      const path = `${batchId}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("chat-media").upload(path, file);
      if (up.error) { toast.error(up.error.message); setSending(false); return; }
      media_url = path; media_type = file.type;
    }
    const { error } = await supabase.from("chat_messages").insert({
      batch_id: batchId, user_id: user.id,
      content: text.trim() || null, media_url, media_type,
      reply_to: replyTo?.id ?? null,
    });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    setText(""); setFile(null); setReplyTo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const existing = (reactions[messageId] || []).find((r: any) => r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({ message_id: messageId, user_id: user.id, emoji });
    }
    setEmojiOpen(null);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("chat_messages").delete().eq("id", id);
  };

  // Group messages by date
  const grouped: { date: string; msgs: Msg[] }[] = [];
  messages.forEach(m => {
    const day = new Date(m.created_at).toDateString();
    const last = grouped[grouped.length - 1];
    if (!last || last.date !== day) grouped.push({ date: day, msgs: [m] });
    else last.msgs.push(m);
  });

  return (
    <div className="flex flex-col h-full" style={{ background: `url("${WA_BG}")` }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 z-10"
        style={{ background: "#075e54" }}>
        <button onClick={onBack} className="md:hidden text-white/80 hover:text-white mr-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: avatarColor(batch.id) }}>
          {getInitials(batch.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">{batch.name}</div>
          <div className="text-[#b2dfdb] text-xs truncate flex items-center gap-1">
            <Users className="h-3 w-3" />
            {batch.batch_members?.[0]?.count ?? 0} members
            {batch.subject && <span className="ml-1">· {batch.subject}</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1"
        style={{ backgroundImage: `url("${WA_BG}")`, backgroundSize: "80px 80px" }}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white/80 rounded-2xl p-8 text-center shadow-sm">
              <MessageSquare className="h-12 w-12 mx-auto text-[#075e54] opacity-40 mb-3" />
              <p className="text-[#667781] text-sm">No messages yet. Say hello! 👋</p>
            </div>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center justify-center my-3">
              <span className="bg-[#e1f3fb] text-[#54656f] text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                {formatDay(msgs[0].created_at)}
              </span>
            </div>

            {msgs.map((m, i) => {
              const mine = m.user_id === user?.id;
              const prev = msgs[i - 1];
              const showSender = !mine && (!prev || prev.user_id !== m.user_id);
              const author = profiles[m.user_id];
              const name = author?.full_name || author?.email || "User";
              const reply = m.reply_to ? messages.find(x => x.id === m.reply_to) : null;
              const replyAuthor = reply ? profiles[reply.user_id] : null;
              const rxList = reactions[m.id] || [];
              const rxGroups = rxList.reduce<Record<string, number>>((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc;
              }, {});
              const isGroupedWithPrev = prev && prev.user_id === m.user_id &&
                (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60000);

              return (
                <div key={m.id}
                  className={cn("flex items-end gap-1 group", mine ? "justify-end" : "justify-start",
                    isGroupedWithPrev ? "mt-0.5" : "mt-2")}>

                  {/* Sender avatar */}
                  {!mine && (
                    <div className="w-7 flex-shrink-0 mb-1">
                      {!isGroupedWithPrev && (
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ background: avatarColor(m.user_id) }}>
                          {getInitials(name)}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn("flex flex-col max-w-[72%] md:max-w-[60%]", mine ? "items-end" : "items-start")}>
                    {/* Bubble */}
                    <div className="relative">
                      <div className={cn(
                        "rounded-lg px-3 py-1.5 shadow-sm text-sm relative",
                        mine ? "rounded-tr-none" : "rounded-tl-none"
                      )}
                        style={{
                          background: mine ? "#dcf8c6" : "#ffffff",
                          color: "#111b21",
                        }}>

                        {/* Bubble tail */}
                        {!isGroupedWithPrev && (
                          <div className={cn(
                            "absolute top-0 w-2 h-2 overflow-hidden",
                            mine ? "-right-2" : "-left-2"
                          )}>
                            <div className={cn(
                              "w-4 h-4 rotate-45 absolute top-0",
                              mine ? "-left-2" : "-right-2"
                            )}
                              style={{ background: mine ? "#dcf8c6" : "#ffffff" }} />
                          </div>
                        )}

                        {/* Sender name for groups */}
                        {showSender && (
                          <div className="text-xs font-semibold mb-0.5"
                            style={{ color: avatarColor(m.user_id) }}>
                            {name}
                          </div>
                        )}

                        {/* Reply quote */}
                        {reply && (
                          <div className="rounded mb-1.5 pl-2 pr-2 py-1 text-xs border-l-4 overflow-hidden"
                            style={{ background: mine ? "#b7e4a0" : "#f0f2f5", borderColor: avatarColor(reply.user_id) }}>
                            <div className="font-semibold truncate" style={{ color: avatarColor(reply.user_id) }}>
                              {replyAuthor?.full_name || replyAuthor?.email || "User"}
                            </div>
                            <div className="text-[#667781] truncate">{reply.content || "(media)"}</div>
                          </div>
                        )}

                        {/* Media */}
                        {m.media_url && mediaUrls[m.media_url] && (
                          m.media_type?.startsWith("image/") ? (
                            <div className="mb-1 rounded-md overflow-hidden cursor-pointer"
                              onClick={() => setSelectedImage(mediaUrls[m.media_url!])}>
                              <img src={mediaUrls[m.media_url]} alt="attachment"
                                className="max-w-full max-h-60 object-cover rounded-md hover:opacity-95 transition-opacity block" />
                            </div>
                          ) : (
                            <a href={mediaUrls[m.media_url]} target="_blank" rel="noreferrer"
                              className="flex items-center gap-2 text-[#007bfc] text-xs mb-1 font-medium">
                              <Paperclip className="h-3 w-3" /> Download attachment
                            </a>
                          )
                        )}

                        {/* Text */}
                        {m.content && (
                          <div className="whitespace-pre-wrap break-words leading-[1.4] pr-12">
                            {renderContent(m.content, mine)}
                          </div>
                        )}

                        {/* Timestamp (inside bubble, bottom right) */}
                        <div className={cn("text-[10px] float-right ml-3 -mb-0.5 mt-0.5", mine ? "text-[#667781]" : "text-[#667781]")}>
                          {formatTime(m.created_at)}
                          {mine && <span className="ml-0.5 text-[#53bdeb]">✓✓</span>}
                        </div>
                      </div>

                      {/* Action buttons — hover */}
                      <div className={cn(
                        "absolute top-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10",
                        mine ? "right-full mr-1" : "left-full ml-1"
                      )}>
                        {/* Emoji picker */}
                        <Popover open={emojiOpen === m.id} onOpenChange={(o) => setEmojiOpen(o ? m.id : null)}>
                          <PopoverTrigger asChild>
                            <button className="h-7 w-7 rounded-full flex items-center justify-center bg-white/90 shadow hover:bg-white text-[#667781]">
                              <SmilePlus className="h-3.5 w-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-1 flex gap-0.5">
                            {EMOJIS.map(e => (
                              <button key={e} onClick={() => toggleReaction(m.id, e)}
                                className="text-lg hover:bg-muted rounded p-1">{e}</button>
                            ))}
                          </PopoverContent>
                        </Popover>
                        <button className="h-7 w-7 rounded-full flex items-center justify-center bg-white/90 shadow hover:bg-white text-[#667781]"
                          onClick={() => setReplyTo(m)}>
                          <Reply className="h-3.5 w-3.5" />
                        </button>
                        {(mine || isAdmin) && (
                          <button className="h-7 w-7 rounded-full flex items-center justify-center bg-white/90 shadow hover:bg-white text-red-500"
                            onClick={() => deleteMessage(m.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reactions */}
                    {Object.keys(rxGroups).length > 0 && (
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {Object.entries(rxGroups).map(([e, n]) => {
                          const reacted = rxList.some((r: any) => r.emoji === e && r.user_id === user?.id);
                          return (
                            <button key={e} onClick={() => toggleReaction(m.id, e)}
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded-full border bg-white shadow-sm hover:bg-[#f0f2f5] transition-colors",
                                reacted && "border-[#25d366] bg-[#e9fbe5]"
                              )}>
                              {e} {n}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-3 py-2" style={{ background: "#f0f2f5" }}>
        {/* Reply preview */}
        {replyTo && (
          <div className="flex items-center justify-between rounded-lg px-3 py-2 mb-2 text-sm border-l-4"
            style={{ background: "#fff", borderColor: "#25d366" }}>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold" style={{ color: "#075e54" }}>
                Replying to {profiles[replyTo.user_id]?.full_name || profiles[replyTo.user_id]?.email}
              </div>
              <div className="truncate text-[#667781] text-xs">{replyTo.content || "(media)"}</div>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-[#667781] ml-2 hover:text-[#111b21]">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* File preview */}
        {file && (
          <div className="flex items-center justify-between rounded-lg px-3 py-2 mb-2 text-sm bg-white shadow-sm">
            <div className="flex items-center gap-2 truncate text-[#111b21]">
              <Paperclip className="h-4 w-4 text-[#667781]" /> {file.name}
            </div>
            <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="text-[#667781] hover:text-red-500 ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input ref={fileInputRef} type="file" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button onClick={() => fileInputRef.current?.click()}
            className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 text-[#54656f] hover:bg-[#d9dde1] transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>

          <div className="flex-1 bg-white rounded-3xl px-4 flex items-end py-2 shadow-sm">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
                  e.preventDefault(); send();
                }
              }}
              placeholder="Type a message"
              rows={1}
              className="flex-1 resize-none outline-none text-sm text-[#111b21] placeholder:text-[#8696a0] bg-transparent leading-5 overflow-y-auto"
              style={{ minHeight: "24px", maxHeight: "120px" }}
            />
          </div>

          <button onClick={send} disabled={sending || (!text.trim() && !file)}
            className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-all disabled:opacity-50"
            style={{ background: "#25d366" }}>
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(o) => !o && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-0 shadow-none sm:rounded-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <DialogDescription className="sr-only">Full-size view of the chat attachment</DialogDescription>
          </DialogHeader>
          <div className="relative flex items-center justify-center w-full max-h-[90vh]">
            <img src={selectedImage || ""} alt="full size"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  GROUP LIST PANEL                                         */
/* ────────────────────────────────────────────────────────── */
function GroupList({ batches, lastMessages, selected, onSelect }: {
  batches: Batch[];
  lastMessages: Record<string, Msg | null>;
  selected: string | null;
  onSelect: (b: Batch) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.subject ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ background: "#111b21" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "#202c33" }}>
        <div className="text-white font-semibold text-base">Chats</div>
        <div className="flex items-center gap-1 text-[#aebac1]">
          <MessageSquare className="h-5 w-5" />
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2" style={{ background: "#111b21" }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "#202c33" }}>
          <Search className="h-4 w-4 flex-shrink-0" style={{ color: "#aebac1" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search or start new chat"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#d1d7db", caretColor: "#00a884" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "#aebac1" }}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#aebac1] text-sm">
            No groups found
          </div>
        )}
        {filtered.map(b => {
          const last = lastMessages[b.id];
          const isActive = selected === b.id;
          return (
            <button key={b.id} onClick={() => onSelect(b)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b"
              style={{
                background: isActive ? "#2a3942" : "transparent",
                borderColor: "#2a3942"
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#202c33"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div className="h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center text-white text-base font-bold"
                style={{ background: avatarColor(b.id) }}>
                {getInitials(b.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold truncate" style={{ color: "#e9edef" }}>{b.name}</span>
                  {last && (
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: "#aebac1" }}>
                      {formatTime(last.created_at)}
                    </span>
                  )}
                </div>
                <div className="text-xs truncate mt-0.5" style={{ color: "#aebac1" }}>
                  {last ? (last.content || "(media)") : (b.subject || "No messages yet")}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                */
/* ────────────────────────────────────────────────────────── */
function WhatsAppChat() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, Msg | null>>({});
  const [selected, setSelected] = useState<Batch | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("batches")
        .select("*, batch_members(count)").order("created_at", { ascending: false });
      setBatches(data ?? []);

      // Fetch last message for each batch
      if (data && data.length) {
        const map: Record<string, Msg | null> = {};
        await Promise.all(data.map(async (b: Batch) => {
          const { data: msgs } = await supabase.from("chat_messages").select("*")
            .eq("batch_id", b.id).order("created_at", { ascending: false }).limit(1);
          map[b.id] = msgs?.[0] ?? null;
        }));
        setLastMessages(map);
      }
    })();
  }, []);

  const handleSelect = (b: Batch) => {
    setSelected(b);
    setMobileView("chat");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]" style={{ background: "#111b21" }}>
      {/* Left panel — always visible on desktop, toggled on mobile */}
      <div className={cn(
        "flex-shrink-0 border-r",
        "w-full md:w-[360px]",
        "md:flex",
        mobileView === "list" ? "flex" : "hidden md:flex",
      )} style={{ borderColor: "#2a3942" }}>
        <div className="w-full">
          <GroupList
            batches={batches}
            lastMessages={lastMessages}
            selected={selected?.id ?? null}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Right panel — placeholder or chat */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        "md:flex",
        mobileView === "chat" ? "flex" : "hidden md:flex",
      )}>
        {selected ? (
          <ChatPanel batch={selected} onBack={() => setMobileView("list")} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center"
            style={{ background: "#222e35" }}>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "#2a3942" }}>
                <MessageSquare className="h-10 w-10" style={{ color: "#aebac1" }} />
              </div>
              <h2 className="text-2xl font-light mb-2" style={{ color: "#e9edef" }}>DBS IT Chat</h2>
              <p className="text-sm" style={{ color: "#8696a0" }}>
                Select a group from the left to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
