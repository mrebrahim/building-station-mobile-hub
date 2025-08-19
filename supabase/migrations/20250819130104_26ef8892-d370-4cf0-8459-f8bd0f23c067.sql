-- Enable pg_cron extension for scheduled tasks
SELECT cron.schedule(
  'woocommerce-sync-daily',
  '0 2 * * *', -- Every day at 2 AM
  $$
  SELECT
    net.http_post(
        url:='https://aegclwuugreshufvisax.supabase.co/functions/v1/woocommerce-sync',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZ2Nsd3V1Z3Jlc2h1ZnZpc2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjcxMDYsImV4cCI6MjA2NjQ0MzEwNn0.NvLICz7OeV0SAGL-zBfZ-TcVXDPaUVx8bE2i3gWjJI4"}'::jsonb,
        body:='{"source": "cron", "timestamp": "' || now() || '"}'::jsonb
    ) as request_id;
  $$
);