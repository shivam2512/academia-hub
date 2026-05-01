import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, Paperclip, X, SmilePlus, Reply, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/batches/$batchId/chat")({ component: ChatPage });

const EMOJIS = ["👍","❤️","😂","🎉","🙏","🔥","😮","😢"];

type Msg = {
  id: string; batch_id: string; user_id: string; content: string | null;
  media_url: string | null; media_type: string | null; reply_to: string | null;
  created_at: string; edited_at: string | null;
};

function ChatPage() {
  const { batchId } = useParams({ from: "/app/batches/$batchId/chat" });
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [reactions, setReactions] = useState<Record<string, any[]>>({});
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const [sending, setSending] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial load
  useEffect(() => {
    (async () => {
      const { data: msgs } = await supabase.from("chat_messages").select("*").eq("batch_id", batchId).order("created_at").limit(500);
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

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`batch-chat-${batchId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `batch_id=eq.${batchId}` },
        async (payload) => {
          const m = payload.new as Msg;
          setMessages(prev => prev.find(x => x.id === m.id) ? prev : [...prev, m]);
          if (!profiles[m.user_id]) {
            const { data } = await supabase.from("profiles").select("id, full_name, email").eq("id", m.user_id).single();
            if (data) setProfiles(p => ({ ...p, [m.user_id]: data }));
          }
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
          setReactions(prev => ({ ...prev, [r.message_id]: (prev[r.message_id] || []).filter(x => x.id !== r.id) }));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [batchId, profiles]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Resolve media signed URLs
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
  }, [messages]);

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
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const existing = (reactions[messageId] || []).find(r => r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({ message_id: messageId, user_id: user.id, emoji });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete message?")) return;
    await supabase.from("chat_messages").delete().eq("id", id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.25rem)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-1 bg-gradient-subtle">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-3 opacity-40" />
            <p>No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((m, i) => {
          const mine = m.user_id === user?.id;
          const prev = messages[i - 1];
          const showHeader = !prev || prev.user_id !== m.user_id || (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() > 5 * 60000);
          const author = profiles[m.user_id];
          const name = author?.full_name || author?.email || "User";
          const reply = m.reply_to ? messages.find(x => x.id === m.reply_to) : null;
          const replyAuthor = reply ? profiles[reply.user_id] : null;
          const rxList = reactions[m.id] || [];
          const rxGroups = rxList.reduce<Record<string, number>>((acc, r) => { acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc; }, {});
          return (
            <div key={m.id} className={cn("flex gap-2 group", mine ? "flex-row-reverse" : "")}>
              <div className="w-8 flex-shrink-0">
                {showHeader && (
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">{name.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
                )}
              </div>
              <div className={cn("max-w-[70%] flex flex-col", mine ? "items-end" : "items-start")}>
                {showHeader && <div className="text-xs text-muted-foreground mb-1 px-1">{name} · {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>}
                <div className={cn(
                  "rounded-2xl px-3 py-2 shadow-sm relative",
                  mine ? "bg-gradient-primary text-primary-foreground rounded-tr-sm" : "bg-card border rounded-tl-sm"
                )}>
                  {reply && (
                    <div className={cn("text-xs px-2 py-1 rounded mb-1 border-l-2", mine ? "bg-white/20 border-white/60" : "bg-muted border-primary")}>
                      <div className="font-medium opacity-80">{replyAuthor?.full_name || replyAuthor?.email || "User"}</div>
                      <div className="opacity-70 truncate">{reply.content || "(media)"}</div>
                    </div>
                  )}
                  {m.media_url && mediaUrls[m.media_url] && (
                    m.media_type?.startsWith("image/") ? (
                      <img src={mediaUrls[m.media_url]} alt="attachment" className="rounded-lg max-w-xs max-h-64 mb-1" />
                    ) : (
                      <a href={mediaUrls[m.media_url]} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-sm mb-1"><Paperclip className="h-3 w-3" />Download attachment</a>
                    )
                  )}
                  {m.content && <div className="whitespace-pre-wrap break-words text-sm">{m.content}</div>}
                </div>
                {Object.keys(rxGroups).length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {Object.entries(rxGroups).map(([e, n]) => {
                      const reacted = rxList.some(r => r.emoji === e && r.user_id === user?.id);
                      return (
                        <button key={e} onClick={() => toggleReaction(m.id, e)} className={cn("text-xs px-2 py-0.5 rounded-full border bg-card hover:bg-muted", reacted && "border-primary bg-primary/10")}>
                          {e} {n}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={cn("opacity-0 group-hover:opacity-100 flex items-center gap-1 self-center transition-opacity", mine ? "flex-row-reverse" : "")}>
                <Popover>
                  <PopoverTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7"><SmilePlus className="h-3.5 w-3.5" /></Button></PopoverTrigger>
                  <PopoverContent className="w-auto p-1 flex gap-1">
                    {EMOJIS.map(e => <button key={e} onClick={() => toggleReaction(m.id, e)} className="text-xl hover:bg-muted rounded p-1">{e}</button>)}
                  </PopoverContent>
                </Popover>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setReplyTo(m)}><Reply className="h-3.5 w-3.5" /></Button>
                {(mine || isAdmin) && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteMessage(m.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t bg-card p-3">
        {replyTo && (
          <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 mb-2 text-sm">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-primary font-medium">Replying to {profiles[replyTo.user_id]?.full_name || profiles[replyTo.user_id]?.email}</div>
              <div className="truncate text-muted-foreground">{replyTo.content || "(media)"}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setReplyTo(null)}><X className="h-4 w-4" /></Button>
          </div>
        )}
        {file && (
          <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 mb-2 text-sm">
            <div className="flex items-center gap-2 truncate"><Paperclip className="h-4 w-4" />{file.name}</div>
            <Button size="icon" variant="ghost" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}><X className="h-4 w-4" /></Button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-4 w-4" /></Button>
          <Input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type a message…" className="flex-1" />
          <Button onClick={send} disabled={sending || (!text.trim() && !file)} className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
