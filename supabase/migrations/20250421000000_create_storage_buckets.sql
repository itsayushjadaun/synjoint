
-- Create storage buckets for blog images and resume uploads if they don't exist
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
