# OM Value Homes — Secure Website CMS

Production-ready Next.js website for OM Value Homes with a Supabase-backed
admin panel. The public website remains usable with built-in fallback content
until Supabase is configured.

## What the admin panel controls

- Homepage headings, descriptions, prices, contact numbers, RERA and map links
- 1 BHK, 2 BHK and 3 BHK cards, detail pages, photos and visibility
- A separate uploaded or YouTube video for every BHK
- Blogs, readable article formatting, cover images, SEO and YouTube videos
- Amenities and FAQs
- Happy-customer cards and approved photos
- Multiple founders and previous/latest/upcoming project cards

## 1. Configure Supabase

1. Create or open the Supabase project.
2. Open **Authentication → Users** and create the approved admin:
   `omvaluehomes6@gmail.com`
3. Open **SQL Editor** and run `supabase/schema.sql`.
4. For a new/empty project, run `supabase/seed.sql` once.

For an existing deployment, `schema.sql` works as the migration: it preserves
existing rows, adds the new CMS tables/columns, removes the old single-founder
restriction, and replaces write access with user-ID-based admin authorization.

If the Auth user was created after running the schema, run
`supabase/admin-bootstrap.sql` once.

The schema enables Row Level Security on every CMS table:

- public users receive read-only access to published website content;
- only the approved Auth user UUID can insert, update or delete;
- the admin allow-list table itself is not readable from the browser;
- media uploads are restricted to approved buckets, folders, MIME types and
  size limits.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and add values from
**Supabase → Project Settings → API**:

```env
ADMIN_EMAIL=omvaluehomes6@gmail.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Use only the public/publishable key. Do not add a service-role key or admin
password to this project, GitHub or Vercel.

## 3. Test locally

```bash
npm ci
npm run lint
npm run build
npm run dev
```

Open:

- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## 4. Deploy on Vercel

1. Import this extracted folder or its GitHub repository into Vercel.
2. Keep the framework preset as **Next.js**.
3. Add all three environment variables for Production, Preview and
   Development.
4. Deploy.
5. In Supabase **Authentication → URL Configuration**, set the final Site URL
   and add `https://YOUR_DOMAIN/**` to Redirect URLs.

## Content notes

- For blogs, use `##` for main sections, `###` for smaller headings, blank
  lines between paragraphs, and `-` for bullet points.
- You may paste a YouTube watch link, Shorts link, `youtu.be` link or iframe
  code. The server extracts the video ID and stores only a safe
  `youtube-nocookie.com` embed URL; raw embed HTML is never rendered.
- JPG, PNG, WebP and GIF images up to 10 MB are supported. Flat-tour videos can
  be MP4, WebM or MOV up to 500 MB.
- Publish customer names, photos and testimonials only after receiving consent.
