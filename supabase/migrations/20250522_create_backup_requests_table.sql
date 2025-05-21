
-- Create table for tracking backup requests
CREATE TABLE IF NOT EXISTS public.backup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  status TEXT NOT NULL DEFAULT 'pending',
  include_schema BOOLEAN NOT NULL DEFAULT true,
  tables TEXT[] NULL,
  download_url TEXT NULL,
  file_path TEXT NULL,
  completed_at TIMESTAMPTZ NULL,
  error_message TEXT NULL
);

-- Set up RLS policies for the backup_requests table
ALTER TABLE public.backup_requests ENABLE ROW LEVEL SECURITY;

-- Only super_admins can view backup requests
CREATE POLICY "Super Admin can view backup requests"
ON public.backup_requests
FOR SELECT
TO authenticated
USING ((SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'super_admin');

-- Only super_admins can create backup requests
CREATE POLICY "Super Admin can create backup requests"
ON public.backup_requests
FOR INSERT
TO authenticated
WITH CHECK ((SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'super_admin');
