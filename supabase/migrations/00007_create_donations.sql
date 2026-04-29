CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  total_amount INTEGER NOT NULL,
  edeli_amount INTEGER NOT NULL DEFAULT 0,
  befrienders_amount INTEGER NOT NULL DEFAULT 0,
  hitoribocchi_amount INTEGER NOT NULL DEFAULT 0,
  note TEXT DEFAULT '',
  donated_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view donation summaries"
  ON public.donations FOR SELECT USING (true);

CREATE POLICY "Admins can manage donations"
  ON public.donations FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
