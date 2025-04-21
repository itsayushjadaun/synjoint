
-- Add status column and updated_at trigger to job_applications if it doesn't exist
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Create or replace function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for job_applications if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'set_job_applications_updated_at' 
        AND tgrelid = 'public.job_applications'::regclass
    ) THEN
        CREATE TRIGGER set_job_applications_updated_at
        BEFORE UPDATE ON public.job_applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Ensure proper policies are set for admin access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE polname = 'Admin users can do all operations on job_applications'
    ) THEN
        CREATE POLICY "Admin users can do all operations on job_applications" 
        ON public.job_applications 
        FOR ALL 
        TO authenticated 
        USING (auth.jwt() ->> 'role' = 'admin');
    END IF;
END
$$;

-- Allow anonymous users to insert into job_applications
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE polname = 'Anonymous users can insert into job_applications'
    ) THEN
        CREATE POLICY "Anonymous users can insert into job_applications" 
        ON public.job_applications 
        FOR INSERT 
        TO anon 
        WITH CHECK (true);
    END IF;
END
$$;
