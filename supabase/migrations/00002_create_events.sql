CREATE TYPE event_venue AS ENUM ('north', 'south');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  venue_type event_venue NOT NULL,
  venue_name TEXT NOT NULL DEFAULT '',
  venue_address TEXT DEFAULT '',
  capacity INTEGER DEFAULT 30,
  participation_fee INTEGER NOT NULL DEFAULT 3000,
  status event_status NOT NULL DEFAULT 'draft',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR status = 'completed');

CREATE POLICY "Admins full access to events"
  ON public.events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
