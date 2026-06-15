import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/chat")({ component: ChatGroupsList });

function ChatGroupsList() {
  const { isAdmin } = useAuth();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("batches").select("*, batch_members(count)").order("created_at", { ascending: false });
    setBatches(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Chat Groups"
        description="Select a batch to join the chat."
      />

      {batches.length === 0 ? (
        <Card className="p-12 text-center shadow-card">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">You haven't been added to any batches yet.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map(b => (
            <Card key={b.id} className="relative shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 h-full group overflow-hidden">
              <Link to="/app/batches/$batchId/chat" params={{ batchId: b.id }} className="block p-6 h-full">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-3 shadow-glow">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg pr-8">{b.name}</h3>
                {b.subject && <Badge variant="secondary" className="mt-1">{b.subject}</Badge>}
                {b.description && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{b.description}</p>}
                <div className="text-xs text-muted-foreground mt-4">{b.batch_members?.[0]?.count ?? 0} members</div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
