import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

let currentSubscription: RealtimeChannel | null = null;
const currentSessionId = Math.random().toString(36).substring(2, 15);

/**
 * Registers the current session in the database and listens for session changes.
 * If another session becomes active for this user, logs out the current session.
 */
export async function registerSession(userId: string, onLogout: () => void) {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }

  // Upsert the active session for this user
  const { error } = await supabase
    .from("active_sessions")
    .upsert({ 
      user_id: userId, 
      session_id: currentSessionId,
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error("Failed to register session:", error);
    return;
  }

  // Subscribe to changes in active_sessions for this user
  currentSubscription = supabase
    .channel("active_session_check")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "active_sessions",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const newSessionId = payload.new.session_id;
        if (newSessionId !== currentSessionId) {
          toast.error("You have been logged in on another device. Logging out here.");
          onLogout();
        }
      }
    )
    .subscribe();
}

export function cleanupSessionGuard() {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }
}
