
-- Create job_applications table for storing application details
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow admins to see all applications
CREATE POLICY "Admins can view all job applications" 
ON public.job_applications 
FOR SELECT 
TO authenticated
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Allow users to create job applications
CREATE POLICY "Anyone can submit job applications" 
ON public.job_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to update application status
CREATE POLICY "Admins can update job applications" 
ON public.job_applications 
FOR UPDATE 
TO authenticated
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Create contact_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow admins to see all contact messages
CREATE POLICY "Admins can view all contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Allow anyone to create contact messages
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to update contact message status
CREATE POLICY "Admins can update contact message status" 
ON public.contact_messages 
FOR UPDATE 
TO authenticated
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('blog-images', 'Blog Images', true),
  ('career-resumes', 'Career Resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Set up public access policies for the blog-images bucket
CREATE POLICY "Public Access to Blog Images"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'blog-images');

-- Allow authenticated users to insert into blog-images
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Set up public access policies for the career-resumes bucket
CREATE POLICY "Public Access to Career Resumes"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'career-resumes');

-- Allow anonymous users to upload resumes
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'career-resumes');
