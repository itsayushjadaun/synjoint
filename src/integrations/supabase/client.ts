// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pdxezczxwgkasisatbwe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeGV6Y3p4d2drYXNpc2F0YndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExODkxMzUsImV4cCI6MjA1Njc2NTEzNX0.ouMcENoGkYkZG69NqphHRp9iaGLrVW28Mbjm5SdiJ6Y";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);