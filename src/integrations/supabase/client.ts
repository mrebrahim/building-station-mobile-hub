import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ✅ الـ Supabase project الصح
const SUPABASE_URL = "https://cyyeydswwbbqhehbhhbw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eWV5ZHN3d2JicWhlaGJoaGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTMxODQsImV4cCI6MjA4OTI2OTE4NH0.6qt4-bYdMAmIdnWqJ1x4AWeYnj_DFO0Ugn34ROTnRwc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
