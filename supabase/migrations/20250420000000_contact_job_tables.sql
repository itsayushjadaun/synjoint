
-- Create contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    position TEXT NOT NULL,
    message TEXT NOT NULL,
    resume_url TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_messages
CREATE POLICY "Admin users can do all operations on contact_messages" 
ON public.contact_messages 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Create policies for job_applications
CREATE POLICY "Admin users can do all operations on job_applications" 
ON public.job_applications 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

-- Allow anonymous users to insert into contact_messages
CREATE POLICY "Anonymous users can insert into contact_messages" 
ON public.contact_messages 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anonymous users to insert into job_applications
CREATE POLICY "Anonymous users can insert into job_applications" 
ON public.job_applications 
FOR INSERT 
TO anon 
WITH CHECK (true);
