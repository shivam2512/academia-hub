
-- ROLES
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'teacher', 'student');
CREATE TYPE public.video_provider AS ENUM ('youtube', 'vimeo', 'other');
CREATE TYPE public.class_provider AS ENUM ('zoom', 'meet', 'other');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES (separate table to avoid privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','superadmin')) $$;

-- BATCHES
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- BATCH MEMBERS
CREATE TABLE public.batch_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (batch_id, user_id)
);
ALTER TABLE public.batch_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_batch_members_user ON public.batch_members(user_id);
CREATE INDEX idx_batch_members_batch ON public.batch_members(batch_id);

-- Helper: is_batch_member
CREATE OR REPLACE FUNCTION public.is_batch_member(_user_id UUID, _batch_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.batch_members WHERE user_id = _user_id AND batch_id = _batch_id) $$;

-- NOTES
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- VIDEO RECORDINGS
CREATE TABLE public.video_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  provider public.video_provider NOT NULL DEFAULT 'youtube',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.video_recordings ENABLE ROW LEVEL SECURITY;

-- LIVE CLASSES
CREATE TABLE public.live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  meeting_url TEXT NOT NULL,
  provider public.class_provider NOT NULL DEFAULT 'zoom',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

-- CHAT MESSAGES
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  reply_to UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  edited_at TIMESTAMPTZ
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_chat_batch_created ON public.chat_messages(batch_id, created_at);

-- REACTIONS
CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- ====== RLS POLICIES ======

-- profiles
CREATE POLICY "view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "view all profiles for admins" ON public.profiles FOR SELECT USING (public.is_admin_or_super(auth.uid()));
CREATE POLICY "view profiles of batch mates" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.batch_members bm1 JOIN public.batch_members bm2 ON bm1.batch_id = bm2.batch_id
          WHERE bm1.user_id = auth.uid() AND bm2.user_id = profiles.id)
);
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles
CREATE POLICY "view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins view all roles" ON public.user_roles FOR SELECT USING (public.is_admin_or_super(auth.uid()));
CREATE POLICY "superadmin manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'superadmin')) WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- batches
CREATE POLICY "members view batch" ON public.batches FOR SELECT USING (public.is_batch_member(auth.uid(), id) OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "admins manage batches" ON public.batches FOR ALL USING (public.is_admin_or_super(auth.uid())) WITH CHECK (public.is_admin_or_super(auth.uid()));

-- batch_members
CREATE POLICY "view own batch memberships" ON public.batch_members FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_super(auth.uid()) OR public.is_batch_member(auth.uid(), batch_id));
CREATE POLICY "admins manage batch members" ON public.batch_members FOR ALL USING (public.is_admin_or_super(auth.uid())) WITH CHECK (public.is_admin_or_super(auth.uid()));

-- notes
CREATE POLICY "batch members view notes" ON public.notes FOR SELECT USING (public.is_batch_member(auth.uid(), batch_id) OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "teachers/admins add notes" ON public.notes FOR INSERT WITH CHECK (
  public.is_admin_or_super(auth.uid()) OR
  (public.has_role(auth.uid(), 'teacher') AND public.is_batch_member(auth.uid(), batch_id))
);
CREATE POLICY "uploader/admin update notes" ON public.notes FOR UPDATE USING (uploaded_by = auth.uid() OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "uploader/admin delete notes" ON public.notes FOR DELETE USING (uploaded_by = auth.uid() OR public.is_admin_or_super(auth.uid()));

-- video_recordings
CREATE POLICY "batch members view videos" ON public.video_recordings FOR SELECT USING (public.is_batch_member(auth.uid(), batch_id) OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "teachers/admins add videos" ON public.video_recordings FOR INSERT WITH CHECK (
  public.is_admin_or_super(auth.uid()) OR
  (public.has_role(auth.uid(), 'teacher') AND public.is_batch_member(auth.uid(), batch_id))
);
CREATE POLICY "uploader/admin update videos" ON public.video_recordings FOR UPDATE USING (uploaded_by = auth.uid() OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "uploader/admin delete videos" ON public.video_recordings FOR DELETE USING (uploaded_by = auth.uid() OR public.is_admin_or_super(auth.uid()));

-- live_classes
CREATE POLICY "batch members view live classes" ON public.live_classes FOR SELECT USING (public.is_batch_member(auth.uid(), batch_id) OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "teachers/admins add live classes" ON public.live_classes FOR INSERT WITH CHECK (
  public.is_admin_or_super(auth.uid()) OR
  (public.has_role(auth.uid(), 'teacher') AND public.is_batch_member(auth.uid(), batch_id))
);
CREATE POLICY "creator/admin update live classes" ON public.live_classes FOR UPDATE USING (created_by = auth.uid() OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "creator/admin delete live classes" ON public.live_classes FOR DELETE USING (created_by = auth.uid() OR public.is_admin_or_super(auth.uid()));

-- chat_messages
CREATE POLICY "batch members view chat" ON public.chat_messages FOR SELECT USING (public.is_batch_member(auth.uid(), batch_id) OR public.is_admin_or_super(auth.uid()));
CREATE POLICY "batch members send chat" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_batch_member(auth.uid(), batch_id));
CREATE POLICY "edit own messages" ON public.chat_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete own messages or admin" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id OR public.is_admin_or_super(auth.uid()));

-- reactions
CREATE POLICY "view reactions in batches" ON public.message_reactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.id = message_reactions.message_id AND (public.is_batch_member(auth.uid(), m.batch_id) OR public.is_admin_or_super(auth.uid())))
);
CREATE POLICY "react in own batches" ON public.message_reactions FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.id = message_id AND public.is_batch_member(auth.uid(), m.batch_id))
);
CREATE POLICY "remove own reaction" ON public.message_reactions FOR DELETE USING (auth.uid() = user_id);

-- ====== TRIGGERS ======

-- updated_at on profiles
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile + default role on signup. First user => superadmin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'superadmin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- Storage policies (notes: batch members read, teachers/admins write)
CREATE POLICY "auth users read notes bucket" ON storage.objects FOR SELECT USING (bucket_id = 'notes' AND auth.uid() IS NOT NULL);
CREATE POLICY "teachers/admins upload notes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes' AND (public.has_role(auth.uid(), 'teacher') OR public.is_admin_or_super(auth.uid())));
CREATE POLICY "owner delete notes" ON storage.objects FOR DELETE USING (bucket_id = 'notes' AND (owner = auth.uid() OR public.is_admin_or_super(auth.uid())));

CREATE POLICY "auth users read chat media" ON storage.objects FOR SELECT USING (bucket_id = 'chat-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "auth users upload chat media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "owner delete chat media" ON storage.objects FOR DELETE USING (bucket_id = 'chat-media' AND (owner = auth.uid() OR public.is_admin_or_super(auth.uid())));

CREATE POLICY "public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "users update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND owner = auth.uid());
