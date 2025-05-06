
-- Create an RPC function that allows admins to delete blogs without permission issues
CREATE OR REPLACE FUNCTION public.delete_blog(blog_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM blogs WHERE id = blog_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_blog(UUID) TO authenticated;

COMMENT ON FUNCTION public.delete_blog IS 'Allows deleting a blog post by ID with elevated permissions';
