
-- STUDENT INVOICES
CREATE TABLE public.student_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  emi_opted BOOLEAN NOT NULL DEFAULT false,
  emi_details JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'unpaid', -- 'fully_paid', 'partially_paid', 'unpaid'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.student_invoices ENABLE ROW LEVEL SECURITY;

-- RLS
CREATE POLICY "admins manage invoices" ON public.student_invoices FOR ALL USING (public.is_admin_or_super(auth.uid())) WITH CHECK (public.is_admin_or_super(auth.uid()));
CREATE POLICY "students view own invoice" ON public.student_invoices FOR SELECT USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER trg_student_invoices_updated_at BEFORE UPDATE ON public.student_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add a default invoice record when a student is created? 
-- Or just create it on demand. On demand is better.
