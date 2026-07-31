export const SITE_URL = "https://omgroupofcompanies.com";
export const WHATSAPP_NUMBER = "918828300415";
export const WHATSAPP_DISPLAY = "88283 00415";
export const CALL_NUMBER = "919016446666";
export const CALL_DISPLAY = "90164 46666";
export const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/xeqopcbqMArusGHfA";
export const ENQUIRY_LINK =
  "https://wa.me/918828300415?text=Hello%20OM%20VALUE%20HOMES%2C%20I%20want%20to%20know%20more%20about%20your%20Palghar%20West%20homes.";

export type Property = {
  slug: string;
  number: string;
  bhk: string;
  price: string;
  area: string;
  status: string;
  headline: string;
  overview: string;
  idealFor: string;
  highlights: string[];
  metaTitle: string;
  metaDescription: string;
};

export const properties: Property[] = [
  {
    slug: "1-bhk-flat-palghar-west",
    number: "01",
    bhk: "1 BHK",
    price: "₹19.90 Lakhs*",
    area: "356.50–384.59 sq.ft.",
    status: "Ready-possession options",
    headline: "Affordable 1 BHK flat in Palghar West for practical family living.",
    overview:
      "A thoughtfully planned 1 BHK residence at Fair Township, Palghar West, with access to everyday amenities, security and road connectivity. Current unit, floor and possession availability is confirmed during the site visit.",
    idealFor: "First-time homebuyers, small families and budget-conscious buyers.",
    highlights: [
      "Ready-possession options subject to current inventory",
      "Carpet area from 356.50 to 384.59 sq.ft.",
      "Gated community with CCTV-supported security",
      "Lift, parking, garden and children’s play area",
      "Home-loan assistance subject to eligibility",
      "Free guided site visit available",
    ],
    metaTitle: "1 BHK Flat in Palghar West from ₹19.90 Lakh | OM Value Homes",
    metaDescription:
      "Explore 1 BHK flats in Palghar West at Fair Township by OM Value Homes. Check carpet area, amenities, ready-possession options and book a free site visit.",
  },
  {
    slug: "2-bhk-flat-palghar-west",
    number: "02",
    bhk: "2 BHK",
    price: "₹32 Lakhs*",
    area: "561.45 sq.ft.",
    status: "Under-construction options",
    headline: "A spacious 2 BHK home in Palghar West for growing families.",
    overview:
      "The 2 BHK configuration offers a balanced layout for families who need additional living space. Construction status, floor choice, payment schedule and estimated possession details are verified directly with the project team.",
    idealFor: "Growing families, working couples and long-term end users.",
    highlights: [
      "Approximately 561.45 sq.ft. carpet area",
      "Under-construction options subject to inventory",
      "Temple, garden, jogging track and indoor games",
      "Shops and daily conveniences within the premises",
      "Organised parking and modern lift access",
      "Free project and sample-flat visit",
    ],
    metaTitle: "2 BHK Flat in Palghar West | Fair Township OM Value Homes",
    metaDescription:
      "View 2 BHK flats in Palghar West at Fair Township. Explore carpet area, construction status, amenities and book a free visit with OM Value Homes.",
  },
  {
    slug: "3-bhk-flat-palghar-west",
    number: "03",
    bhk: "3 BHK",
    price: "₹42.56 Lakhs*",
    area: "717.85 sq.ft.",
    status: "Ready-possession options",
    headline: "A well-planned 3 BHK residence for families who need more space.",
    overview:
      "The 3 BHK option is designed for larger families seeking comfortable room sizes and community amenities in Palghar West. Current availability, final price and possession readiness are confirmed during enquiry.",
    idealFor: "Larger families, joint families and buyers upgrading their home.",
    highlights: [
      "Approximately 717.85 sq.ft. carpet area",
      "Ready-possession options subject to availability",
      "Secure G+7 residential community",
      "Garden, play area, jogging track and indoor games",
      "Main-road access and nearby daily conveniences",
      "Guided home tour with a property advisor",
    ],
    metaTitle: "3 BHK Flat in Palghar West | Ready Possession Options",
    metaDescription:
      "Explore 3 BHK flats in Palghar West at OM Value Homes. View carpet area, amenities, possession options and schedule a free guided property tour.",
  },
];

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  keywords: string[];
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ready-possession-flats-palghar-west-buyer-checklist",
    title: "Ready Possession Flats in Palghar West: A Practical Buyer Checklist",
    excerpt:
      "A step-by-step checklist for verifying the flat, documents, costs, amenities and neighbourhood before booking a ready-possession home.",
    category: "Homebuyer Guide",
    publishedAt: "2026-07-27",
    updatedAt: "2026-07-27",
    readTime: "6 min read",
    keywords: [
      "ready possession flats in Palghar West",
      "1 BHK flat in Palghar West",
      "Palghar property site visit",
    ],
    sections: [
      {
        heading: "Why buyers consider ready-possession homes",
        paragraphs: [
          "A ready-possession home lets you inspect the actual space before making a decision. You can check room proportions, natural light, ventilation, lift access, common areas and the approach road instead of depending only on a brochure.",
          "It can also make planning easier for families who want to shift within a shorter timeline. However, ready possession does not remove the need for verification. Availability, final pricing, applicable charges and documentation should still be confirmed in writing.",
        ],
      },
      {
        heading: "What to inspect during the flat visit",
        paragraphs: [
          "Visit during daylight when possible. Open windows, check water points, observe mobile network strength and note the condition of doors, tiles, switches and plumbing fixtures. Walk through the route from the project entrance to the flat.",
        ],
        bullets: [
          "Measure usable room space and furniture placement",
          "Check lift, staircase, parking and security access",
          "Review ventilation, sunlight and surrounding noise",
          "Confirm which fixtures are included in the quoted price",
          "Ask for the exact flat number, floor and carpet area",
        ],
      },
      {
        heading: "Verify the complete cost before booking",
        paragraphs: [
          "A starting price is useful for comparison but it may not be the final payable amount. Ask for a written cost sheet that clearly separates the agreement value, taxes, registration, stamp duty, maintenance, parking and any other applicable charge.",
          "If you need a home loan, obtain an eligibility estimate before paying a major booking amount. Loan approval remains subject to the bank’s policy, your income documents and the property documentation.",
        ],
      },
      {
        heading: "Check the location as a daily routine",
        paragraphs: [
          "Do not evaluate a home only by distance. Test your actual route to the railway station, workplace, school, hospital and market at the time you normally travel. A practical location is one that fits your family’s everyday schedule.",
          "For Fair Township in Palghar West, buyers can use the free guided site visit to inspect the project, available configurations and surrounding access before deciding.",
        ],
      },
    ],
  },
  {
    slug: "1-bhk-flat-palghar-west-price-area-guide",
    title: "1 BHK Flat in Palghar West: Price, Carpet Area and Site-Visit Guide",
    excerpt:
      "Understand what to compare when shortlisting an affordable 1 BHK home in Palghar West, from carpet area to total cost and possession.",
    category: "1 BHK Guide",
    publishedAt: "2026-07-27",
    updatedAt: "2026-07-27",
    readTime: "5 min read",
    keywords: [
      "1 BHK flat in Palghar West",
      "affordable flats in Palghar",
      "1 BHK ready possession Palghar",
    ],
    sections: [
      {
        heading: "Start with carpet area, not only the price",
        paragraphs: [
          "Two 1 BHK flats with a similar price can feel very different because of layout efficiency. Compare the stated carpet area, room width, passage space and placement of doors and windows. A usable layout often matters more than a larger headline number.",
          "At Fair Township, current 1 BHK options list carpet areas from approximately 356.50 to 384.59 sq.ft. Exact unit availability should be confirmed with the project team.",
        ],
      },
      {
        heading: "Compare the full ownership cost",
        paragraphs: [
          "When a project advertises a starting price, ask what is included. Request a complete cost sheet and calculate the amount you must arrange from savings versus the amount that may be financed by a bank.",
        ],
        bullets: [
          "Agreement value and floor-specific pricing",
          "Stamp duty and registration",
          "Applicable taxes and statutory charges",
          "Maintenance, parking and society-related charges",
          "Loan processing and documentation expenses",
        ],
      },
      {
        heading: "Amenities should solve everyday needs",
        paragraphs: [
          "For an affordable home, useful amenities are more valuable than an unnecessarily long feature list. Security, lift access, parking, open space, a children’s play area and nearby shops can directly improve daily convenience.",
          "Visit the actual amenity areas and ask which facilities are operational, under development or planned. This keeps your decision based on the current project condition.",
        ],
      },
      {
        heading: "Use the site visit to make the final comparison",
        paragraphs: [
          "Shortlist two or three suitable units, then compare floor, light, view, carpet area, price and possession status side by side. Carry your questions and note the answers. A clear comparison reduces rushed decisions.",
          "OM Value Homes offers a free guided visit at Fair Township, Palghar West, so buyers can inspect the project and discuss current inventory directly.",
        ],
      },
    ],
  },
  {
    slug: "home-loan-guide-flat-buyers-palghar",
    title: "Home Loan Guide for Flat Buyers in Palghar",
    excerpt:
      "A simple guide to eligibility, down payment, documents and the questions buyers should ask before applying for a home loan.",
    category: "Home Finance",
    publishedAt: "2026-07-27",
    updatedAt: "2026-07-27",
    readTime: "7 min read",
    keywords: [
      "home loan for flat in Palghar",
      "Palghar flat loan eligibility",
      "home loan documents India",
    ],
    sections: [
      {
        heading: "Estimate eligibility before finalising the flat",
        paragraphs: [
          "A home-loan estimate helps you understand the property budget that is realistic for your income. Banks usually consider income stability, current EMIs, credit history, age, employment type and the property documentation.",
          "An eligibility estimate is not the same as final approval. Avoid treating a verbal estimate as a sanctioned loan until the lender completes its checks.",
        ],
      },
      {
        heading: "Plan the down payment and additional costs",
        paragraphs: [
          "The lender may finance only an eligible portion of the property value. You must arrange the remaining contribution as well as costs that may not be covered by the loan.",
        ],
        bullets: [
          "Your contribution or down payment",
          "Stamp duty and registration",
          "Processing, legal and valuation charges",
          "Applicable project and maintenance charges",
          "A safety buffer for shifting and initial expenses",
        ],
      },
      {
        heading: "Keep documents ready",
        paragraphs: [
          "Salaried and self-employed applicants may have different document requirements. Commonly requested documents include identity and address proof, bank statements, income proof, tax records and details of current loans.",
          "Ask the lender for a written checklist and submit accurate information. Missing or inconsistent details can delay processing.",
        ],
      },
      {
        heading: "Compare the total loan, not only the interest rate",
        paragraphs: [
          "Compare the effective rate, tenure, EMI, processing fee, insurance, prepayment rules and whether the rate is fixed or floating. A small change in rate or tenure can affect the total interest paid over the full loan period.",
          "Home-loan assistance may be available for eligible OM Value Homes buyers, but approval and terms remain entirely subject to the lender’s verification and policy.",
        ],
      },
    ],
  },
];

export const founderProjects = [
  {
    label: "Previous",
    title: "Delivered Residential Work",
    status: "Verified project details to be added",
    image: "/om-value-homes-building.png",
    description:
      "This card is reserved for the founder’s previously completed property with its verified name, location and completion details.",
  },
  {
    label: "Latest",
    title: "Fair Township · Palghar West",
    status: "Current flagship residential project",
    image: "/om-value-homes-building.png",
    description:
      "G+7 residential living with 1, 2 and 3 BHK configurations, practical amenities and guided site visits.",
  },
  {
    label: "Upcoming",
    title: "Upcoming Project",
    status: "Official announcement pending",
    image: "/om-value-homes-logo.jpeg",
    description:
      "Verified project name, location, configuration and launch details will be published after the official announcement.",
  },
];

export const customerStories = [
  {
    title: "1 BHK Homebuyer",
    detail: "Booking story and customer photo awaiting approval",
    orientation: "portrait",
  },
  {
    title: "Family Home Booking",
    detail: "Verified handover or booking photo will be added with consent",
    orientation: "landscape",
  },
  {
    title: "3 BHK Homebuyer",
    detail: "Customer experience and project photo awaiting approval",
    orientation: "portrait",
  },
  {
    title: "Site Visit to Booking",
    detail: "Approved customer story will appear here",
    orientation: "landscape",
  },
];

export function getProperty(slug: string) {
  return properties.find((property) => property.slug === slug);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
