
-- Create the storage bucket for database backups
INSERT INTO storage.buckets (id, name, public)
VALUES ('database_backups', 'Database Backups', false)
ON CONFLICT (id) DO NOTHING;

-- Set up bucket security policies
CREATE POLICY "Super Admin Access"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'database_backups' AND 
  (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);
