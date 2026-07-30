-- Optional starter content for OM Value Homes.
-- Run after schema.sql. The statements are safe to run again.

insert into public.blog_posts
  (
    slug,
    title,
    excerpt,
    category,
    body,
    seo_title,
    seo_description,
    published_at
  )
values
  (
    'ready-possession-flats-palghar-west-buyer-checklist',
    'Ready Possession Flats in Palghar West: A Practical Buyer Checklist',
    'A step-by-step checklist for verifying the flat, documents, costs, amenities and neighbourhood before booking a ready-possession home.',
    'Homebuyer Guide',
    $body$
## Why buyers consider ready-possession homes

A ready-possession home lets you inspect the actual space before making a decision. Check room proportions, natural light, ventilation, lift access, common areas and the approach road instead of depending only on a brochure.

## What to inspect during the flat visit

- Measure usable room space and furniture placement
- Check lift, staircase, parking and security access
- Review ventilation, sunlight and surrounding noise
- Confirm which fixtures are included in the quoted price
- Ask for the exact flat number, floor and carpet area

## Verify the complete cost before booking

Ask for a written cost sheet that separates the agreement value, taxes, registration, stamp duty, maintenance, parking and other applicable charges. Loan approval remains subject to the lender's policy and verification.

## Check the location as a daily routine

Test your real route to the railway station, workplace, school, hospital and market. OM Value Homes offers a free guided visit at Fair Township, Palghar West.
$body$,
    'Ready Possession Flats in Palghar West: Buyer Checklist',
    'Check ready-possession flats in Palghar West with this practical guide covering flat inspection, total cost, documents and site visits.',
    '2026-07-27'
  ),
  (
    '1-bhk-flat-palghar-west-price-area-guide',
    '1 BHK Flat in Palghar West: Price, Carpet Area and Site-Visit Guide',
    'Understand what to compare when shortlisting an affordable 1 BHK home in Palghar West, from carpet area to total cost and possession.',
    '1 BHK Guide',
    $body$
## Start with carpet area, not only the price

Compare carpet area, room width, passage space and the placement of doors and windows. At Fair Township, current 1 BHK options list carpet areas from approximately 356.50 to 384.59 sq.ft.

## Compare the full ownership cost

- Agreement value and floor-specific pricing
- Stamp duty and registration
- Applicable taxes and statutory charges
- Maintenance, parking and society-related charges
- Loan processing and documentation expenses

## Amenities should solve everyday needs

Security, lift access, parking, open space, a children's play area and nearby shops can directly improve daily convenience.

## Use the site visit to make the final comparison

Compare floor, light, view, carpet area, price and possession status side by side. OM Value Homes offers a free guided site visit in Palghar West.
$body$,
    '1 BHK Flat in Palghar West: Price and Carpet Area Guide',
    'Compare 1 BHK flat prices, carpet area, amenities and possession options in Palghar West before booking a site visit.',
    '2026-07-27'
  ),
  (
    'home-loan-guide-flat-buyers-palghar',
    'Home Loan Guide for Flat Buyers in Palghar',
    'A simple guide to eligibility, down payment, documents and the questions buyers should ask before applying for a home loan.',
    'Home Finance',
    $body$
## Estimate eligibility before finalising the flat

Banks usually consider income stability, current EMIs, credit history, age, employment type and property documentation. An eligibility estimate is not final loan approval.

## Plan the down payment and additional costs

- Your contribution or down payment
- Stamp duty and registration
- Processing, legal and valuation charges
- Applicable project and maintenance charges
- A safety buffer for shifting and initial expenses

## Keep documents ready

Common documents include identity and address proof, bank statements, income proof, tax records and details of current loans.

## Compare the total loan

Compare the effective rate, tenure, EMI, processing fee, insurance, prepayment rules and whether the rate is fixed or floating.
$body$,
    'Home Loan Guide for Flat Buyers in Palghar',
    'Understand home-loan eligibility, down payment, documents and lender comparisons when buying a flat in Palghar.',
    '2026-07-27'
  )
on conflict (slug) do nothing;

insert into public.founder_profiles
  (id, name, role, headline, bio)
values
  (
    1,
    'Founder name',
    'Founder · OM Group of Companies',
    'Homes should be understood before they are purchased.',
    'OM Value Homes focuses on practical configurations, clear project information and guided site visits so families can inspect the home before making a decision. Replace this text with the verified founder biography from the admin panel.'
  )
on conflict (id) do nothing;

insert into public.founder_projects
  (stage, title, status, description, sort_order)
select
  'Previous',
  'Delivered Residential Work',
  'Verified project details to be added',
  'Add the founder''s previously completed property with its verified name, location and completion details.',
  1
where not exists (
  select 1 from public.founder_projects
  where title = 'Delivered Residential Work'
);

insert into public.founder_projects
  (stage, title, status, description, sort_order)
select
  'Latest',
  'Fair Township · Palghar West',
  'Current flagship residential project',
  'G+7 residential living with 1, 2 and 3 BHK configurations, practical amenities and guided site visits.',
  2
where not exists (
  select 1 from public.founder_projects
  where title = 'Fair Township · Palghar West'
);

insert into public.founder_projects
  (stage, title, status, description, sort_order)
select
  'Upcoming',
  'Upcoming Project',
  'Official announcement pending',
  'Verified project name, location, configuration and launch details will be published after the official announcement.',
  3
where not exists (
  select 1 from public.founder_projects
  where title = 'Upcoming Project'
);

insert into public.customer_stories
  (name, title, story, orientation, sort_order)
select
  'Customer name',
  '1 BHK Homebuyer',
  'Booking story and customer photo awaiting approval.',
  'portrait',
  1
where not exists (
  select 1 from public.customer_stories
  where title = '1 BHK Homebuyer'
);

insert into public.customer_stories
  (name, title, story, orientation, sort_order)
select
  'Customer name',
  'Family Home Booking',
  'Verified handover or booking photo will be added with consent.',
  'landscape',
  2
where not exists (
  select 1 from public.customer_stories
  where title = 'Family Home Booking'
);

insert into public.site_settings (
  id,
  hero_eyebrow,
  hero_title,
  hero_lead,
  price_label,
  price_value,
  project_kicker,
  project_title,
  project_description,
  homes_title,
  homes_description,
  amenities_title,
  amenities_description,
  blogs_title,
  blogs_description,
  location_title,
  location_description,
  address,
  map_embed_url,
  google_maps_link,
  whatsapp_number,
  whatsapp_display,
  call_number,
  call_display,
  rera_number
)
values (
  1,
  'Ready possession options · Palghar West',
  'Your dream home is ready.',
  'Own a thoughtfully planned home at Fair Township in Palghar West — designed for secure, comfortable family living.',
  '1 BHK from',
  '₹19.90 Lakhs*',
  'A home for today and tomorrow',
  'Welcome to Fair Township, Palghar West.',
  'OM Value Homes brings practical layouts, everyday amenities and guided site visits together in a G+7 residential community.',
  'Well-planned homes at verified starting prices.',
  'Compare configurations, carpet areas and construction status, then watch each flat tour before scheduling your visit.',
  'Daily comfort, safety and convenience built in.',
  'Thoughtful community features help families enjoy a more convenient daily routine.',
  'Latest Palghar homebuyer guides.',
  'Clear, practical articles about possession, comparison, site visits and home-loan planning.',
  'Close to everyday needs. Easy to reach.',
  'Fair Township is located at Satpati–Palghar Road, Dhansar, Palghar West, Maharashtra 401501.',
  'Fair Township, Satpati–Palghar Road, Dhansar, Palghar West, Maharashtra 401501',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.481841992919!2d72.7340837!3d19.6920997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be71dae99c2aec1%3A0xd2a5461dd44590bb!2sOM%20VALUE%20HOMES!5e0!3m2!1sen!2sin!4v1785066658919!5m2!1sen!2sin',
  'https://maps.app.goo.gl/xeqopcbqMArusGHfA',
  '918828300415',
  '88283 00415',
  '919016446666',
  '90164 46666',
  'P99000055618'
)
on conflict (id) do nothing;

insert into public.property_types (
  slug, display_number, bhk_label, price, area, status, headline, overview,
  ideal_for, highlights, meta_title, meta_description, sort_order
)
values
  (
    '1-bhk-flat-palghar-west',
    '01',
    '1 BHK',
    '₹19.90 Lakhs*',
    '356.50–384.59 sq.ft.',
    'Ready-possession options',
    'Affordable 1 BHK flat in Palghar West for practical family living.',
    'A thoughtfully planned 1 BHK residence at Fair Township, Palghar West, with access to everyday amenities, security and road connectivity.',
    'First-time homebuyers, small families and budget-conscious buyers.',
    E'Ready-possession options subject to current inventory\nCarpet area from 356.50 to 384.59 sq.ft.\nGated community with CCTV-supported security\nLift, parking, garden and children''s play area\nHome-loan assistance subject to eligibility\nFree guided site visit available',
    '1 BHK Flat in Palghar West from ₹19.90 Lakh | OM Value Homes',
    'Explore 1 BHK flats in Palghar West at Fair Township by OM Value Homes. Check carpet area, amenities and ready-possession options.',
    1
  ),
  (
    '2-bhk-flat-palghar-west',
    '02',
    '2 BHK',
    '₹32 Lakhs*',
    '561.45 sq.ft.',
    'Under-construction options',
    'A spacious 2 BHK home in Palghar West for growing families.',
    'The 2 BHK configuration offers a balanced layout for families who need additional living space.',
    'Growing families, working couples and long-term end users.',
    E'Approximately 561.45 sq.ft. carpet area\nUnder-construction options subject to inventory\nTemple, garden, jogging track and indoor games\nShops and daily conveniences within the premises\nOrganised parking and modern lift access\nFree project and sample-flat visit',
    '2 BHK Flat in Palghar West | Fair Township OM Value Homes',
    'View 2 BHK flats in Palghar West at Fair Township. Explore carpet area, construction status and amenities.',
    2
  ),
  (
    '3-bhk-flat-palghar-west',
    '03',
    '3 BHK',
    '₹42.56 Lakhs*',
    '717.85 sq.ft.',
    'Ready-possession options',
    'A well-planned 3 BHK residence for families who need more space.',
    'The 3 BHK option is designed for larger families seeking comfortable room sizes and community amenities in Palghar West.',
    'Larger families, joint families and buyers upgrading their home.',
    E'Approximately 717.85 sq.ft. carpet area\nReady-possession options subject to availability\nSecure G+7 residential community\nGarden, play area, jogging track and indoor games\nMain-road access and nearby daily conveniences\nGuided home tour with a property advisor',
    '3 BHK Flat in Palghar West | Ready Possession Options',
    'Explore 3 BHK flats in Palghar West at OM Value Homes. View carpet area, amenities and possession options.',
    3
  )
on conflict (slug) do nothing;

insert into public.amenities (title, description, sort_order)
values
  ('Temple', 'A peaceful space within the community.', 1),
  ('Landscaped Garden', 'Green spaces for relaxed everyday living.', 2),
  ('Kids’ Play Area', 'A dedicated activity zone for children.', 3),
  ('Jogging Track', 'A convenient route for daily fitness.', 4),
  ('24×7 Security', 'CCTV-supported gated community security.', 5),
  ('Modern Lift', 'Easy access across the G+7 residential tower.', 6),
  ('Car Parking', 'Organised parking within the project.', 7),
  ('Indoor Games', 'Leisure and recreation closer to home.', 8),
  ('Shops in Premises', 'Daily essentials available nearby.', 9),
  ('Main Road Touch', 'Convenient access from the project entrance.', 10)
on conflict do nothing;

insert into public.faqs (question, answer, sort_order)
values
  ('Is the site visit really free?', 'Yes. You can schedule a free guided site visit with the OM Value Homes property team.', 1),
  ('Which configurations are available?', 'OM Value Homes offers 1, 2 and 3 BHK options. Current availability is confirmed during your enquiry.', 2),
  ('Is home-loan assistance available?', 'Yes. Home-loan assistance is available subject to lender eligibility and document verification.', 3),
  ('How do I confirm a visit?', 'Complete the booking form and continue on WhatsApp. The property advisor will confirm the date and time.', 4)
on conflict do nothing;
