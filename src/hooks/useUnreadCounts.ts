import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type UnreadCounts = Record<string, number>;

export function useUnreadCounts() {
  const { user } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>(() => {
    if (typeof window === "undefined") return {};
    try {
      const parsed = JSON.parse(localStorage.getItem("chat_unread_counts") || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "chat_unread_counts" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === "object") setUnreadCounts(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    const ch = supabase.channel("global-chat-unreads")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const msg = payload.new as any;
          if (msg.user_id !== user.id) {
            setUnreadCounts(prev => {
              const batchId = msg.batch_id;
              const next = { ...prev, [batchId]: (prev[batchId] || 0) + 1 };
              try { localStorage.setItem("chat_unread_counts", JSON.stringify(next)); } catch {}
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
      try { localStorage.setItem("chat_unread_counts", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const safeCounts = unreadCounts || {};
  const totalUnread = Object.values(safeCounts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return { unreadCounts: safeCounts, totalUnread, clearUnread };
}
