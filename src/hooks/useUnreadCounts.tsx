import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type UnreadCounts = Record<string, number>;

type UnreadContextType = {
  unreadCounts: UnreadCounts;
  totalUnread: number;
  clearUnread: (batchId: string) => void;
};

const UnreadCtx = createContext<UnreadContextType | undefined>(undefined);

export function UnreadCountsProvider({ children }: { children: ReactNode }) {
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
      supabase.removeChannel(ch);
    };
  }, [user]);

  const clearUnread = useCallback((batchId: string) => {
    setUnreadCounts(prev => {
      if (!prev[batchId]) return prev;
      const next = { ...prev };
      delete next[batchId];
      try { localStorage.setItem("chat_unread_counts", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const safeCounts = unreadCounts || {};
  const totalUnread = Object.values(safeCounts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return (
    <UnreadCtx.Provider value={{ unreadCounts: safeCounts, totalUnread, clearUnread }}>
      {children}
    </UnreadCtx.Provider>
  );
}

export function useUnreadCounts() {
  const ctx = useContext(UnreadCtx);
  if (!ctx) return { unreadCounts: {}, totalUnread: 0, clearUnread: () => {} };
  return ctx;
}
