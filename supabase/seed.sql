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
