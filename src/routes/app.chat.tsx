import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Send, Paperclip, X, SmilePlus, Reply, Trash2,
  MessageSquare, Search, ArrowLeft, Users, GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useUnreadCounts } from "@/hooks/useUnreadCounts";

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

// Deterministic color from the app's accent palette
const ACCENT_HUE = ["275", "295", "260", "285", "270", "280", "265", "290"];
function avatarBg(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  const hue = ACCENT_HUE[n % ACCENT_HUE.length];
  return `oklch(0.55 0.22 ${hue})`;
}

function renderContent(content: string, mine: boolean) {
  // Split on URLs first, then handle @mentions within text fragments
  const parts = content.split(/(https?:\/\/[^\s]+)/g);
  // Process each part for @mentions
  const result: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part.match(/^https?:\/\//)) {
      result.push(
        <a key={`url-${i}`} href={part} target="_blank" rel="noopener noreferrer"
          className={cn("underline break-all font-medium", mine ? "text-white/80" : "text-primary")}>
          {part}
        </a>
      );
    } else {
      // Check for @mentions within this text fragment
      const mentionParts = part.split(/(@\w[\w ]*)/g);
      mentionParts.forEach((mp, j) => {
        if (mp.match(/^@\w/)) {
          result.push(
            <span key={`mention-${i}-${j}`}
              className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0 text-[0.8em] font-semibold",
                mine
                  ? "bg-white/20 text-white"
                  : "bg-primary/15 text-primary"
              )}>
              {mp}
            </span>
          );
        } else {
          result.push(mp);
        }
      });
    }
  });
  return result;
}

// Extract @mention query from textarea at cursor position
function getMentionQuery(value: string, cursorPos: number): string | null {
  const textBeforeCursor = value.slice(0, cursorPos);
  const match = textBeforeCursor.match(/@([\w ]*)$/);
  return match ? match[1] : null;
}

/* ─────────────────────────────────────────── */
/*  CHAT PANEL                                */
/* ─────────────────────────────────────────── */
function ChatPanel({ batch, onBack }: { batch: Batch; onBack: () => void }) {
  const { user, isAdmin } = useAuth();
  const { clearUnread } = useUnreadCounts();
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
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  // Mention state
  const [members, setMembers] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const mentionListRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const batchId = batch.id;

  const fetchProfiles = useCallback(async (ids: string[]) => {
    const missing = ids.filter(id => !profiles[id]);
    if (!missing.length) return;
    const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", missing);
    if (data) {
      const map: Record<string, any> = {};
      data.forEach(p => { map[p.id] = p; });
      setProfiles(prev => ({ ...prev, ...map }));
    }
  }, [profiles]);

  // Fetch batch members for mention picker
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("batch_members")
        .select("profiles(id, full_name, email)")
        .eq("batch_id", batchId);
      if (data) {
        const list = data
          .map((row: any) => row.profiles)
          .filter(Boolean)
          .map((p: any) => ({ id: p.id, full_name: p.full_name || "", email: p.email || "" }));
        setMembers(list);
      }
    })();
  }, [batchId]);

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

  // Keep unread count clear while actively looking at this batch
  useEffect(() => {
    if (messages.length >= 0) {
      clearUnread(batchId);
    }
  }, [messages, batchId, clearUnread]);

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
    <div className="flex flex-col h-full bg-gradient-subtle">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-sidebar-border bg-sidebar flex-shrink-0 z-10">
        <button onClick={onBack} className="md:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground mr-1 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-glow"
          style={{ background: avatarBg(batch.id) }}>
          {getInitials(batch.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sidebar-foreground font-semibold text-sm truncate">{batch.name}</div>
          <div className="text-sidebar-foreground/50 text-xs flex items-center gap-1">
            <Users className="h-3 w-3" />
            {batch.batch_members?.[0]?.count ?? 0} members
            {batch.subject && <span className="ml-1">· {batch.subject}</span>}
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-card rounded-2xl p-10 text-center shadow-card">
              <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <MessageSquare className="h-7 w-7 text-primary-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No messages yet. Say hello! 👋</p>
            </div>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center justify-center my-4">
              <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                {formatDay(msgs[0].created_at)}
              </span>
            </div>

            {msgs.map((m, i) => {
              const mine = m.user_id === user?.id;
              const prev = msgs[i - 1];
              const isGroupedWithPrev = prev && prev.user_id === m.user_id &&
                (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60000);
              const showSender = !mine && !isGroupedWithPrev;
              const author = profiles[m.user_id];
              const name = author?.full_name || author?.email || "User";
              const reply = m.reply_to ? messages.find(x => x.id === m.reply_to) : null;
              const replyAuthor = reply ? profiles[reply.user_id] : null;
              const rxList = reactions[m.id] || [];
              const rxGroups = rxList.reduce<Record<string, number>>((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc;
              }, {});

              return (
                <div key={m.id}
                  className={cn("flex items-end gap-2 group", mine ? "justify-end" : "justify-start",
                    isGroupedWithPrev ? "mt-0.5" : "mt-3")}>

                  {/* Avatar for others */}
                  {!mine && (
                    <div className="w-7 flex-shrink-0 self-end mb-1">
                      {!isGroupedWithPrev ? (
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                          style={{ background: avatarBg(m.user_id) }}>
                          {getInitials(name)}
                        </div>
                      ) : <div className="w-7" />}
                    </div>
                  )}

                  <div className={cn("flex flex-col max-w-[72%] md:max-w-[58%]", mine ? "items-end" : "items-start")}>
                    <div className="relative">
                      {/* Bubble */}
                      <div 
                        onClick={() => setActiveMessage(prev => prev === m.id ? null : m.id)}
                        className={cn(
                        "rounded-2xl px-3.5 py-2 shadow-sm relative cursor-pointer md:cursor-default",
                        mine
                          ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                          : "bg-card border border-border text-card-foreground rounded-tl-sm"
                      )}>
                        {/* Sender name */}
                        {showSender && (
                          <div className="text-xs font-semibold mb-1" style={{ color: avatarBg(m.user_id) }}>
                            {name}
                          </div>
                        )}

                        {/* Reply quote */}
                        {reply && (
                          <div className={cn(
                            "rounded-lg mb-2 px-2.5 py-1.5 text-xs border-l-[3px] overflow-hidden",
                            mine ? "bg-white/15 border-white/50" : "bg-muted border-primary"
                          )}>
                            <div className={cn("font-semibold truncate mb-0.5", mine ? "text-white/80" : "text-primary")}>
                              {replyAuthor?.full_name || replyAuthor?.email || "User"}
                            </div>
                            <div className={cn("truncate", mine ? "text-white/60" : "text-muted-foreground")}>
                              {reply.content || "(media)"}
                            </div>
                          </div>
                        )}

                        {/* Media */}
                        {m.media_url && mediaUrls[m.media_url] && (
                          m.media_type?.startsWith("image/") ? (
                            <div className="mb-2 rounded-xl overflow-hidden cursor-pointer"
                              onClick={() => setSelectedImage(mediaUrls[m.media_url!])}>
                              <img src={mediaUrls[m.media_url]} alt="attachment"
                                className="max-w-full max-h-64 object-cover hover:opacity-90 transition-opacity block" />
                            </div>
                          ) : (
                            <a href={mediaUrls[m.media_url]} target="_blank" rel="noreferrer"
                              className={cn("flex items-center gap-2 text-xs mb-2 font-medium underline", mine ? "text-white/80" : "text-primary")}>
                              <Paperclip className="h-3 w-3" /> Download attachment
                            </a>
                          )
                        )}

                        {/* Text + timestamp row */}
                        {m.content && (
                          <div className={cn("whitespace-pre-wrap break-words text-sm leading-relaxed pr-14",
                            mine ? "text-primary-foreground" : "text-card-foreground")}>
                            {renderContent(m.content, mine)}
                          </div>
                        )}

                        {/* Timestamp inside bubble */}
                        <div className={cn(
                          "absolute bottom-1.5 right-2.5 text-[10px] flex items-center gap-0.5",
                          mine ? "text-primary-foreground/50" : "text-muted-foreground"
                        )}>
                          {formatTime(m.created_at)}
                          {mine && <span className="text-primary-foreground/60">✓✓</span>}
                        </div>
                      </div>

                      {/* Hover & Tap actions */}
                      <div className={cn(
                        "absolute top-1 flex items-center gap-0.5 transition-opacity z-10",
                        activeMessage === m.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        mine ? "right-full mr-1.5" : "left-full ml-1.5"
                      )}>
                        <Popover open={emojiOpen === m.id} onOpenChange={(o) => setEmojiOpen(o ? m.id : null)}>
                          <PopoverTrigger asChild>
                            <button className="h-7 w-7 rounded-full flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-colors text-muted-foreground">
                              <SmilePlus className="h-3.5 w-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-1 flex gap-0.5">
                            {EMOJIS.map(e => (
                              <button key={e} onClick={() => toggleReaction(m.id, e)}
                                className="text-lg hover:bg-muted rounded p-1 transition-colors">{e}</button>
                            ))}
                          </PopoverContent>
                        </Popover>
                        <button onClick={() => setReplyTo(m)}
                          className="h-7 w-7 rounded-full flex items-center justify-center bg-card border border-border shadow-sm hover:bg-muted transition-colors text-muted-foreground">
                          <Reply className="h-3.5 w-3.5" />
                        </button>
                        {(mine || isAdmin) && (
                          <button onClick={() => deleteMessage(m.id)}
                            className="h-7 w-7 rounded-full flex items-center justify-center bg-card border border-border shadow-sm hover:bg-destructive/10 transition-colors text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reactions */}
                    {Object.keys(rxGroups).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(rxGroups).map(([e, n]) => {
                          const reacted = rxList.some((r: any) => r.emoji === e && r.user_id === user?.id);
                          return (
                            <button key={e} onClick={() => toggleReaction(m.id, e)}
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded-full border bg-card shadow-sm hover:bg-muted transition-colors",
                                reacted && "border-primary bg-primary/10 text-primary"
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

      {/* ── Input bar ── */}
      <div className="px-4 py-3 border-t border-border bg-card flex-shrink-0">
        {/* Reply preview */}
        {replyTo && (
          <div className="flex items-center justify-between rounded-xl px-3 py-2 mb-2 border-l-4 border-primary bg-accent">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-primary">
                Replying to {profiles[replyTo.user_id]?.full_name || profiles[replyTo.user_id]?.email}
              </div>
              <div className="truncate text-muted-foreground text-xs mt-0.5">{replyTo.content || "(media)"}</div>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground ml-2 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* File preview */}
        {file && (
          <div className="flex items-center justify-between rounded-xl px-3 py-2 mb-2 bg-muted">
            <div className="flex items-center gap-2 truncate text-foreground text-sm">
              <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" /> {file.name}
            </div>
            <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="text-muted-foreground hover:text-destructive ml-2 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input ref={fileInputRef} type="file" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)} />

          <button onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0">
            <Paperclip className="h-4 w-4" />
          </button>

          <div className="relative flex-1">
            {/* @Mention picker */}
            {mentionQuery !== null && (() => {
              const filtered = members.filter(m =>
                (m.full_name || m.email).toLowerCase().includes(mentionQuery.toLowerCase()) &&
                m.id !== user?.id
              );
              if (!filtered.length) return null;
              return (
                <div
                  ref={mentionListRef}
                  className="absolute bottom-full mb-1 left-0 right-0 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                    Members
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filtered.map((m, idx) => (
                      <button
                        key={m.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          // Replace the @query in the textarea with the selected mention
                          const ta = textareaRef.current;
                          if (!ta) return;
                          const cursor = ta.selectionStart ?? text.length;
                          const before = text.slice(0, cursor).replace(/@[\w ]*$/, "");
                          const after = text.slice(cursor);
                          const name = m.full_name || m.email.split("@")[0];
                          const newText = `${before}@${name} ${after}`;
                          setText(newText);
                          setMentionQuery(null);
                          setTimeout(() => {
                            ta.focus();
                            const pos = before.length + name.length + 2;
                            ta.setSelectionRange(pos, pos);
                          }, 0);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-accent transition-colors",
                          idx === mentionIndex && "bg-accent"
                        )}
                      >
                        <div
                          className="h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ background: avatarBg(m.id) }}
                        >
                          {getInitials(m.full_name || m.email)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {m.full_name || m.email.split("@")[0]}
                          </div>
                          {m.full_name && (
                            <div className="text-[10px] text-muted-foreground truncate">{m.email}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="bg-background border border-input rounded-2xl px-4 py-2 flex items-end shadow-sm focus-within:ring-2 focus-within:ring-ring transition-shadow">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  const val = e.target.value;
                  setText(val);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  // Detect @mention
                  const cursor = e.target.selectionStart ?? val.length;
                  const query = getMentionQuery(val, cursor);
                  setMentionQuery(query);
                  setMentionIndex(0);
                }}
                onKeyDown={(e) => {
                  // Handle mention navigation
                  if (mentionQuery !== null) {
                    const filtered = members.filter(m =>
                      (m.full_name || m.email).toLowerCase().includes(mentionQuery.toLowerCase()) &&
                      m.id !== user?.id
                    );
                    if (filtered.length > 0) {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setMentionIndex(i => (i + 1) % filtered.length);
                        return;
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setMentionIndex(i => (i - 1 + filtered.length) % filtered.length);
                        return;
                      }
                      if (e.key === "Enter" || e.key === "Tab") {
                        e.preventDefault();
                        const m = filtered[mentionIndex];
                        const ta = textareaRef.current;
                        if (!ta || !m) return;
                        const cursor = ta.selectionStart ?? text.length;
                        const before = text.slice(0, cursor).replace(/@[\w ]*$/, "");
                        const after = text.slice(cursor);
                        const name = m.full_name || m.email.split("@")[0];
                        const newText = `${before}@${name} ${after}`;
                        setText(newText);
                        setMentionQuery(null);
                        setTimeout(() => {
                          ta.focus();
                          const pos = before.length + name.length + 2;
                          ta.setSelectionRange(pos, pos);
                        }, 0);
                        return;
                      }
                      if (e.key === "Escape") {
                        setMentionQuery(null);
                        return;
                      }
                    }
                  }
                  if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
                    e.preventDefault(); send();
                  }
                }}
                placeholder="Type a message… (@ to mention)"
                rows={1}
                className="flex-1 resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground bg-transparent leading-5 overflow-y-auto"
                style={{ minHeight: "24px", maxHeight: "120px" }}
              />
            </div>
          </div>

          <button onClick={send} disabled={sending || (!text.trim() && !file)}
            className="h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(o) => !o && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <DialogDescription className="sr-only">Full-size view of the chat attachment</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center w-full max-h-[90vh]">
            <img src={selectedImage || ""} alt="full size"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-xl" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  GROUP LIST PANEL                          */
/* ─────────────────────────────────────────── */
function GroupList({ batches, lastMessages, selected, onSelect, unreadCounts }: {
  batches: Batch[];
  lastMessages: Record<string, Msg | null>;
  selected: string | null;
  onSelect: (b: Batch) => void;
  unreadCounts: Record<string, number>;
}) {
  const [search, setSearch] = useState("");
  const filtered = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.subject ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-sidebar-border flex-shrink-0">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sidebar-foreground font-bold text-sm leading-tight">DBS IT</div>
          <div className="text-sidebar-foreground/50 text-[10px]">Chat</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-sidebar-accent/40">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-sidebar-foreground/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search groups…"
            className="flex-1 bg-transparent text-xs outline-none text-sidebar-foreground placeholder:text-sidebar-foreground/40"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-sidebar-foreground/40 text-xs">
            No groups found
          </div>
        )}
        {filtered.map(b => {
          const last = lastMessages[b.id];
          const isActive = selected === b.id;
          return (
            <button key={b.id} onClick={() => onSelect(b)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left border-b border-sidebar-border/50 transition-colors",
                isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )}>
              <div className="h-11 w-11 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-sm"
                style={{ background: avatarBg(b.id) }}>
                {getInitials(b.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn("text-sm font-semibold truncate", isActive ? "text-sidebar-primary" : "text-sidebar-foreground")}>
                    {b.name}
                  </span>
                  {last && (
                    <span className="text-[10px] flex-shrink-0 ml-2 text-sidebar-foreground/40">
                      {formatTime(last.created_at)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs truncate text-sidebar-foreground/50">
                    {last ? (last.content || "(media)") : (b.subject || "No messages yet")}
                  </div>
                  {(unreadCounts[b.id] > 0) && (
                    <span className="flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
                      {unreadCounts[b.id]}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  MAIN PAGE                                 */
/* ─────────────────────────────────────────── */
function WhatsAppChat() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, Msg | null>>({});
  const [selected, setSelected] = useState<Batch | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  
  const { unreadCounts, clearUnread } = useUnreadCounts();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("batches")
        .select("*, batch_members(count)").order("created_at", { ascending: false });
      setBatches(data ?? []);
      if (data?.length) {
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

  // Listen globally for any new message to update the lastMessages preview in real-time
  useEffect(() => {
    const ch = supabase.channel("whatsapp-chat-global")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const m = payload.new as Msg;
          // Update the last message for this batch
          setLastMessages(prev => ({ ...prev, [m.batch_id]: m }));
          // Move this batch to the top
          setBatches(prev => {
            const idx = prev.findIndex(b => b.id === m.batch_id);
            if (idx <= 0) return prev; // already at top or not found
            const next = [...prev];
            const [b] = next.splice(idx, 1);
            next.unshift(b);
            return next;
          });
        })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  const handleSelect = (b: Batch) => {
    setSelected(b);
    setMobileView("chat");
    clearUnread(b.id);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left panel */}
      <div className={cn(
        "flex-shrink-0 border-r border-sidebar-border",
        "w-full md:w-[320px]",
        mobileView === "list" ? "flex" : "hidden md:flex",
        "flex-col"
      )}>
        <GroupList
          batches={batches}
          lastMessages={lastMessages}
          selected={selected?.id ?? null}
          onSelect={handleSelect}
          unreadCounts={unreadCounts}
        />
      </div>

      {/* Right panel */}
      <div className={cn(
        "flex-1 flex-col overflow-hidden",
        mobileView === "chat" ? "flex" : "hidden md:flex",
      )}>
        {selected ? (
          <ChatPanel batch={selected} onBack={() => setMobileView("list")} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-subtle h-full">
            <div className="text-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <MessageSquare className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-foreground">Select a group</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Choose a batch from the left panel to start chatting with your group
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
