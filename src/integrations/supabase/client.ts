import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://aegclwuugreshufvisax.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ2Nsd3V1Z3Jlc2h1ZnZpc2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjcxMDYsImV4cCI6MjA2NjQ0MzEwNn0.NvLICz7OeV0SAGL-zBfZ-TcVXDPaUVx8bE2i3gWjJI4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
