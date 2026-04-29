CREATE TYPE application_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');

CREATE TABLE public.event_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  guest_company TEXT,
  number_of_guests INTEGER NOT NULL DEFAULT 1,
  message TEXT DEFAULT '',
  status application_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_unique_member_application
  ON public.event_applications(event_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX idx_unique_guest_application
  ON public.event_applications(event_id, guest_email)
  WHERE user_id IS NULL AND guest_email IS NOT NULL;

ALTER TABLE public.event_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create applications"
  ON public.event_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own applications"
  ON public.event_applications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins full access to applications"
  ON public.event_applications FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
