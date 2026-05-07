
-- ACTIVE SESSIONS (for single-device enforcement)
CREATE TABLE public.active_sessions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own row
CREATE POLICY "users read own session" ON public.active_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert/update their own row
CREATE POLICY "users upsert own session" ON public.active_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own session" ON public.active_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable Realtime so other devices can detect changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;
ALTER TABLE public.active_sessions REPLICA IDENTITY FULL;
