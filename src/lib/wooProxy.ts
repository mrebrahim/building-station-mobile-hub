import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://aegclwuugreshufvisax.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ2Nsd3V1Z3Jlc2h1ZnZpc2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjcxMDYsImV4cCI6MjA2NjQ0MzEwNn0.NvLICz7OeV0SAGL-zBfZ-TcVXDPaUVx8bE2i3gWjJI4';

export async function wcFetch<T = any>(
  endpoint: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    searchParams.append(key, String(value));
  }

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const { data, error } = await supabase.functions.invoke('woocommerce-proxy', {
    body: {
      endpoint: path,
      params: searchParams.toString(),
      method: 'GET',
    },
  });

  if (error) throw new Error(`WooCommerce proxy error: ${error.message}`);
  return data as T;
}

export async function edgeFunctionGet<T = any>(
  functionSlug: string,
  query: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${SUPABASE_URL}/functions/v1/${functionSlug}`);
  for (const [k, v] of Object.entries(query)) url.searchParams.append(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Edge function ${functionSlug} error: ${res.status}`);
  return res.json();
}
