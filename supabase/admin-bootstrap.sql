-- Run this after creating or changing the approved Supabase Auth admin user.
-- It stores only the Auth user UUID; the public website cannot read this table.
insert into public.content_admins (user_id)
select id
from auth.users
where lower(email) = 'omvaluehomes6@gmail.com'
on conflict (user_id) do nothing;
