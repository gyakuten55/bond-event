-- Fix infinite recursion in users RLS policies.
-- The original policies on public.users referenced public.users itself,
-- which re-invoked the same policies. Use a SECURITY DEFINER helper
-- that bypasses RLS to break the cycle.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- users
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- events
DROP POLICY IF EXISTS "Admins full access to events" ON public.events;
CREATE POLICY "Admins full access to events"
  ON public.events FOR ALL
  USING (public.is_admin());

-- event_applications
DROP POLICY IF EXISTS "Admins full access to applications" ON public.event_applications;
CREATE POLICY "Admins full access to applications"
  ON public.event_applications FOR ALL
  USING (public.is_admin());

-- business_announcements
DROP POLICY IF EXISTS "Admins full access to announcements" ON public.business_announcements;
CREATE POLICY "Admins full access to announcements"
  ON public.business_announcements FOR ALL
  USING (public.is_admin());

-- news
DROP POLICY IF EXISTS "Admins full access to news" ON public.news;
CREATE POLICY "Admins full access to news"
  ON public.news FOR ALL
  USING (public.is_admin());

-- contact_messages
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());

-- donations
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;
CREATE POLICY "Admins can manage donations"
  ON public.donations FOR ALL
  USING (public.is_admin());
