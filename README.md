# OM Value Homes — Vercel + Supabase

Production-ready Next.js website for OM Value Homes. Public pages are SEO-ready,
while `/admin` uses Supabase email/password authentication for blog, flat-tour,
founder/project and happy-customer content management.

## 1. Create the Supabase project

1. Create a new project at https://supabase.com/dashboard.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Run `supabase/seed.sql` to load the starter blogs, founder timeline and
   customer placeholders.
4. Open **Authentication → Users** and create:
   `omvaluehomes6@gmail.com`
5. Set its password privately in Supabase. Never put the password in source
   code or Vercel environment variables.

The SQL creates:

- content tables with Row Level Security
- public-read/admin-write policies
- `content-media` and `flat-tours` Storage buckets
- Realtime publication for every managed content table

## 2. Configure local environment

Copy `.env.example` to `.env.local`, then add values from
**Supabase → Project Settings → API**:

```env
ADMIN_EMAIL=omvaluehomes6@gmail.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Only use the publishable key. This project does not need a service-role key.

## 3. Test locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Admin login is at
`http://localhost:3000/admin`.

## 4. Deploy on Vercel

1. Upload this project to GitHub, or import the extracted folder in Vercel.
2. Framework preset: **Next.js**.
3. Add the three environment variables shown above for Production, Preview and
   Development.
4. Deploy.
5. In Supabase **Authentication → URL Configuration**, set:
   - Site URL: your final Vercel/custom-domain URL
   - Redirect URL: `https://YOUR_DOMAIN/**`
6. Add `omgroupofcompanies.com` in Vercel Domains and update the DNS records
   exactly as Vercel shows.

Admin media uploads go directly from the browser to Supabase Storage, so large
flat-tour videos do not pass through a Vercel Function request body.
