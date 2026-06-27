-- Seed file — run after migration in dev only
-- Usage: supabase db reset (runs migrations then seed.sql)

-- Insert sample categories (used as reference in tasks)
-- Real users are created via auth — these are example tasks seeded with a placeholder UUID
-- Replace '00000000-0000-0000-0000-000000000001' with a real user ID from your auth.users table

do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001';
begin
  -- Only seed if profiles table is empty
  if not exists (select 1 from public.profiles limit 1) then
    raise notice 'No users found — skipping task seed. Create a user via /auth/register first.';
    return;
  end if;

  -- Use the first user as demo poster
  select id into demo_user_id from public.profiles limit 1;

  insert into public.tasks (title, description, status, priority, price, currency, poster_id, category)
  values
    ('Design a logo for my startup', 'Need a clean, modern logo in SVG format', 'open', 'high', 150.00, 'USD', demo_user_id, 'Design'),
    ('Translate document EN→MY', '5-page business document, professional tone', 'open', 'medium', 50.00, 'USD', demo_user_id, 'Translation'),
    ('Build a landing page', 'Next.js + Tailwind, responsive, SEO-ready', 'open', 'high', 300.00, 'USD', demo_user_id, 'Development'),
    ('Data entry — 200 rows', 'Copy data from PDF to Google Sheets', 'open', 'low', 30.00, 'USD', demo_user_id, 'Admin');
end;
$$;
