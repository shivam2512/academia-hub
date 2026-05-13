-- Phase 1: Expand Profiles Table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS mobile_number TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS joining_date DATE,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS education_details TEXT,
ADD COLUMN IF NOT EXISTS designation TEXT,
ADD COLUMN IF NOT EXISTS experience_type TEXT, -- Fresher, Experienced, Buy Experience
ADD COLUMN IF NOT EXISTS current_package TEXT,
ADD COLUMN IF NOT EXISTS admission_type TEXT, -- Inhouse, Reference
ADD COLUMN IF NOT EXISTS eligible_for_pp BOOLEAN DEFAULT FALSE;

-- Phase 2: Expand Student Invoices Table
ALTER TABLE public.student_invoices
ADD COLUMN IF NOT EXISTS payment_method TEXT, -- Bajaj, Self, Merchant
ADD COLUMN IF NOT EXISTS bajaj_down_payment NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS bajaj_lan_no TEXT,
ADD COLUMN IF NOT EXISTS self_payment_type TEXT, -- UPI, Cash
ADD COLUMN IF NOT EXISTS merchant_payment_type TEXT; -- Cards, Netbanking, etc.

-- Phase 3: Expand Batches Table
ALTER TABLE public.batches
ADD COLUMN IF NOT EXISTS month TEXT; -- e.g. "October 2026"

-- Update existing data if necessary (optional)
COMMENT ON COLUMN public.profiles.experience_type IS 'Fresher, Experienced, or Buy Experience';
COMMENT ON COLUMN public.profiles.admission_type IS 'Inhouse or Reference';
COMMENT ON COLUMN public.student_invoices.payment_method IS 'Bajaj, Self, or Merchant';
