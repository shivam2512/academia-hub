import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type UnreadCounts = Record<string, number>;

export function useUnreadCounts() {
  const { user } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>(() => {
    try {
      return JSON.parse(localStorage.getItem("chat_unread_counts") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!user) return;
    
    // Listen to storage events to sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "chat_unread_counts" && e.newValue) {
        setUnreadCounts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);

    // Subscribe to new messages
    const ch = supabase.channel("global-chat-unreads")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as any;
          if (msg.user_id !== user.id) {
            setUnreadCounts(prev => {
              // If the user is currently looking at this batch's chat, don't increment
              // (We'll check window.location to see if they are active on it)
              // Actually, better to just increment and let the active component clear it.
              const batchId = msg.batch_id;
              const next = { ...prev, [batchId]: (prev[batchId] || 0) + 1 };
              localStorage.setItem("chat_unread_counts", JSON.stringify(next));
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("storage", handleStorage);
      supabase.removeChannel(ch);
    };
  }, [user]);

  const clearUnread = (batchId: string) => {
    setUnreadCounts(prev => {
      if (!prev[batchId]) return prev;
      const next = { ...prev };
      delete next[batchId];
      localStorage.setItem("chat_unread_counts", JSON.stringify(next));
      return next;
    });
  };

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return { unreadCounts, totalUnread, clearUnread };
}
