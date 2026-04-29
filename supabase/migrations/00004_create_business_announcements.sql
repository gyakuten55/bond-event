CREATE TYPE announcement_status AS ENUM ('draft', 'pending', 'approved', 'rejected');

CREATE TABLE public.business_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  status announcement_status NOT NULL DEFAULT 'draft',
  admin_note TEXT DEFAULT '',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON public.business_announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.business_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own announcements"
  ON public.business_announcements FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view approved announcements"
  ON public.business_announcements FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins full access to announcements"
  ON public.business_announcements FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
