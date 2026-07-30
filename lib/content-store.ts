import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { blogPosts, properties } from "@/lib/site-data";

export type ManagedBlog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  updatedAt: string;
  coverImageUrl: string | null;
  imageAlt: string;
  videoUrl: string | null;
};

export type ManagedFounder = {
  id: number;
  name: string;
  role: string;
  headline: string;
  bio: string;
  sortOrder: number;
  updatedAt: string;
  imageUrl: string | null;
};

export type ManagedFounderProject = {
  id: number;
  stage: string;
  title: string;
  status: string;
  description: string;
  sortOrder: number;
  updatedAt: string;
  imageUrl: string | null;
};

export type ManagedCustomerStory = {
  id: number;
  name: string;
  title: string;
  story: string;
  orientation: "portrait" | "landscape";
  sortOrder: number;
  updatedAt: string;
  imageUrl: string | null;
};

export type ManagedFlatTour = {
  title: string;
  bhkLabel: string;
  source: "storage" | "youtube";
  videoUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  updatedAt: string;
  videoPath: string | null;
};

export type ManagedHome = {
  id: number;
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
  sortOrder: number;
  isVisible: boolean;
  updatedAt: string;
  imageUrl: string | null;
};

export type ManagedAmenity = {
  id: number;
  title: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
};

export type ManagedFaq = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isVisible: boolean;
};

export type ManagedSiteSettings = {
  id: number;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  priceLabel: string;
  priceValue: string;
  projectKicker: string;
  projectTitle: string;
  projectDescription: string;
  homesTitle: string;
  homesDescription: string;
  amenitiesTitle: string;
  amenitiesDescription: string;
  blogsTitle: string;
  blogsDescription: string;
  locationTitle: string;
  locationDescription: string;
  address: string;
  mapEmbedUrl: string;
  googleMapsLink: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  callNumber: string;
  callDisplay: string;
  reraNumber: string;
  updatedAt: string;
};

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  seo_title: string;
  seo_description: string;
  cover_path: string | null;
  image_alt: string | null;
  video_url: string | null;
  published_at: string;
  updated_at: string;
};

type FounderRow = {
  id: number;
  name: string;
  role: string;
  headline: string;
  bio: string;
  image_path: string | null;
  sort_order: number;
  updated_at: string;
};

type ProjectRow = {
  id: number;
  stage: string;
  title: string;
  status: string;
  description: string;
  image_path: string | null;
  sort_order: number;
  updated_at: string;
};

type CustomerRow = {
  id: number;
  name: string;
  title: string;
  story: string;
  orientation: string;
  image_path: string | null;
  sort_order: number;
  updated_at: string;
};

type FlatTourRow = {
  title: string;
  bhk_label: string;
  video_source: string;
  video_path: string | null;
  video_url: string | null;
  file_name: string | null;
  file_size: number | null;
  updated_at: string;
};

type HomeRow = {
  id: number;
  slug: string;
  display_number: string;
  bhk_label: string;
  price: string;
  area: string;
  status: string;
  headline: string;
  overview: string;
  ideal_for: string;
  highlights: string;
  meta_title: string;
  meta_description: string;
  image_path: string | null;
  sort_order: number;
  is_visible: boolean;
  updated_at: string;
};

type AmenityRow = {
  id: number;
  title: string;
  description: string;
  sort_order: number;
  is_visible: boolean;
};

type FaqRow = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
};

type SiteSettingsRow = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_lead: string;
  price_label: string;
  price_value: string;
  project_kicker: string;
  project_title: string;
  project_description: string;
  homes_title: string;
  homes_description: string;
  amenities_title: string;
  amenities_description: string;
  blogs_title: string;
  blogs_description: string;
  location_title: string;
  location_description: string;
  address: string;
  map_embed_url: string;
  google_maps_link: string;
  whatsapp_number: string;
  whatsapp_display: string;
  call_number: string;
  call_display: string;
  rera_number: string;
  updated_at: string;
};

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are missing.");
  }
  return createSupabaseClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function mediaUrl(
  client: SupabaseClient,
  bucket: "content-media" | "flat-tours",
  path: string | null,
) {
  if (!path) return null;
  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function blogBody(post: (typeof blogPosts)[number]) {
  return post.sections
    .map((section) => {
      const paragraphs = section.paragraphs.join("\n\n");
      const bullets = section.bullets?.map((bullet) => `- ${bullet}`).join("\n");
      return [`## ${section.heading}`, paragraphs, bullets]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n");
}

export const fallbackSiteSettings: ManagedSiteSettings = {
  id: 1,
  heroEyebrow: "Ready possession options · Palghar West",
  heroTitle: "Your dream home is ready.",
  heroLead:
    "Own a thoughtfully planned home at Fair Township in Palghar West — designed for secure, comfortable family living.",
  priceLabel: "1 BHK from",
  priceValue: "₹19.90 Lakhs*",
  projectKicker: "A home for today and tomorrow",
  projectTitle: "Welcome to Fair Township, Palghar West.",
  projectDescription:
    "OM Value Homes brings practical layouts, everyday amenities and guided site visits together in a G+7 residential community.",
  homesTitle: "Well-planned homes at verified starting prices.",
  homesDescription:
    "Compare configurations, carpet areas and construction status, then watch each flat tour before scheduling your visit.",
  amenitiesTitle: "Daily comfort, safety and convenience built in.",
  amenitiesDescription:
    "Thoughtful community features help families enjoy a more convenient daily routine.",
  blogsTitle: "Latest Palghar homebuyer guides.",
  blogsDescription:
    "Clear, practical articles about possession, comparison, site visits and home-loan planning.",
  locationTitle: "Close to everyday needs. Easy to reach.",
  locationDescription:
    "Fair Township is located at Satpati–Palghar Road, Dhansar, Palghar West, Maharashtra 401501.",
  address:
    "Fair Township, Satpati–Palghar Road, Dhansar, Palghar West, Maharashtra 401501",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.481841992919!2d72.7340837!3d19.6920997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be71dae99c2aec1%3A0xd2a5461dd44590bb!2sOM%20VALUE%20HOMES!5e0!3m2!1sen!2sin!4v1785066658919!5m2!1sen!2sin",
  googleMapsLink: "https://maps.app.goo.gl/xeqopcbqMArusGHfA",
  whatsappNumber: "918828300415",
  whatsappDisplay: "88283 00415",
  callNumber: "919016446666",
  callDisplay: "90164 46666",
  reraNumber: "P99000055618",
  updatedAt: "",
};

export const fallbackAmenities: ManagedAmenity[] = [
  ["Temple", "A peaceful space within the community."],
  ["Landscaped Garden", "Green spaces for relaxed everyday living."],
  ["Kids’ Play Area", "A dedicated activity zone for children."],
  ["Jogging Track", "A convenient route for daily fitness."],
  ["24×7 Security", "CCTV-supported gated community security."],
  ["Modern Lift", "Easy access across the G+7 residential tower."],
  ["Car Parking", "Organised parking within the project."],
  ["Indoor Games", "Leisure and recreation closer to home."],
  ["Shops in Premises", "Daily essentials available nearby."],
  ["Main Road Touch", "Convenient access from the project entrance."],
].map(([title, description], index) => ({
  id: index + 1,
  title,
  description,
  sortOrder: index + 1,
  isVisible: true,
}));

export const fallbackFaqs: ManagedFaq[] = [
  ["Is the site visit really free?", "Yes. You can schedule a free guided site visit with the OM Value Homes property team."],
  ["Which configurations are available?", "OM Value Homes offers 1, 2 and 3 BHK options. Current availability is confirmed during your enquiry."],
  ["Is home-loan assistance available?", "Yes. Home-loan assistance is available subject to lender eligibility and document verification."],
  ["How do I confirm a visit?", "Complete the booking form and continue on WhatsApp. The property advisor will confirm the date and time."],
].map(([question, answer], index) => ({
  id: index + 1,
  question,
  answer,
  sortOrder: index + 1,
  isVisible: true,
}));

export function fallbackManagedBlogs(): ManagedBlog[] {
  return blogPosts.map((post, index) => ({
    id: index + 1,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    body: blogBody(post),
    seoTitle: post.title,
    seoDescription: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    coverImageUrl: null,
    imageAlt: `${post.title} — OM Value Homes`,
    videoUrl: null,
  }));
}

export function fallbackManagedBlog(slug: string) {
  return fallbackManagedBlogs().find((post) => post.slug === slug) ?? null;
}

export function fallbackManagedHomes(): ManagedHome[] {
  return properties.map((property, index) => ({
    id: index + 1,
    ...property,
    sortOrder: index + 1,
    isVisible: true,
    updatedAt: "",
    imageUrl: null,
  }));
}

export function fallbackManagedHome(slug: string) {
  return fallbackManagedHomes().find((home) => home.slug === slug) ?? null;
}

function mapBlog(client: SupabaseClient, row: BlogRow): ManagedBlog {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    body: row.body,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    coverImageUrl: mediaUrl(client, "content-media", row.cover_path),
    imageAlt: row.image_alt || `${row.title} — OM Value Homes`,
    videoUrl: row.video_url,
  };
}

function mapFounder(client: SupabaseClient, row: FounderRow): ManagedFounder {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    headline: row.headline,
    bio: row.bio,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
    imageUrl: mediaUrl(client, "content-media", row.image_path),
  };
}

function mapProject(client: SupabaseClient, row: ProjectRow): ManagedFounderProject {
  return {
    id: row.id,
    stage: row.stage,
    title: row.title,
    status: row.status,
    description: row.description,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
    imageUrl: mediaUrl(client, "content-media", row.image_path),
  };
}

function mapCustomer(client: SupabaseClient, row: CustomerRow): ManagedCustomerStory {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    story: row.story,
    orientation: row.orientation === "portrait" ? "portrait" : "landscape",
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
    imageUrl: mediaUrl(client, "content-media", row.image_path),
  };
}

function mapHome(client: SupabaseClient, row: HomeRow): ManagedHome {
  return {
    id: row.id,
    slug: row.slug,
    number: row.display_number,
    bhk: row.bhk_label,
    price: row.price,
    area: row.area,
    status: row.status,
    headline: row.headline,
    overview: row.overview,
    idealFor: row.ideal_for,
    highlights: row.highlights.split("\n").map((item) => item.trim()).filter(Boolean),
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
    updatedAt: row.updated_at,
    imageUrl: mediaUrl(client, "content-media", row.image_path),
  };
}

function mapSiteSettings(row: SiteSettingsRow): ManagedSiteSettings {
  return {
    id: row.id,
    heroEyebrow: row.hero_eyebrow,
    heroTitle: row.hero_title,
    heroLead: row.hero_lead,
    priceLabel: row.price_label,
    priceValue: row.price_value,
    projectKicker: row.project_kicker,
    projectTitle: row.project_title,
    projectDescription: row.project_description,
    homesTitle: row.homes_title,
    homesDescription: row.homes_description,
    amenitiesTitle: row.amenities_title,
    amenitiesDescription: row.amenities_description,
    blogsTitle: row.blogs_title,
    blogsDescription: row.blogs_description,
    locationTitle: row.location_title,
    locationDescription: row.location_description,
    address: row.address,
    mapEmbedUrl: row.map_embed_url,
    googleMapsLink: row.google_maps_link,
    whatsappNumber: row.whatsapp_number,
    whatsappDisplay: row.whatsapp_display,
    callNumber: row.call_number,
    callDisplay: row.call_display,
    reraNumber: row.rera_number,
    updatedAt: row.updated_at,
  };
}

export async function listManagedBlogs(client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("blog_posts").select("*")
    .order("published_at", { ascending: false }).order("id", { ascending: false });
  if (error) throw error;
  return (data as BlogRow[]).map((row) => mapBlog(client, row));
}

export async function getManagedBlog(slug: string, client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? mapBlog(client, data as BlogRow) : null;
}

export async function listManagedFounders(client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("founder_profiles").select("*")
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return (data as FounderRow[]).map((row) => mapFounder(client, row));
}

export async function getManagedFounder(client: SupabaseClient = publicClient()) {
  return (await listManagedFounders(client))[0] ?? null;
}

export async function listManagedFounderProjects(client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("founder_projects").select("*")
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return (data as ProjectRow[]).map((row) => mapProject(client, row));
}

export async function listManagedCustomers(client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("customer_stories").select("*")
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return (data as CustomerRow[]).map((row) => mapCustomer(client, row));
}

function mapFlatTour(client: SupabaseClient, row: FlatTourRow): ManagedFlatTour {
  return {
    title: row.title,
    bhkLabel: row.bhk_label,
    source: row.video_source === "youtube" ? "youtube" : "storage",
    fileName: row.file_name,
    fileSize: row.file_size,
    updatedAt: row.updated_at,
    videoUrl: row.video_source === "storage"
      ? mediaUrl(client, "flat-tours", row.video_path)
      : row.video_url,
    videoPath: row.video_path,
  };
}

export async function listManagedFlatTours(client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("flat_tours")
    .select("title,bhk_label,video_source,video_path,video_url,file_name,file_size,updated_at")
    .order("bhk_label", { ascending: true });
  if (error) throw error;
  return (data as FlatTourRow[]).map((row) => mapFlatTour(client, row));
}

export async function getManagedFlatTour(
  bhkLabel?: string,
  client: SupabaseClient = publicClient(),
) {
  let query = client.from("flat_tours")
    .select("title,bhk_label,video_source,video_path,video_url,file_name,file_size,updated_at");
  query = bhkLabel
    ? query.eq("bhk_label", bhkLabel)
    : query.order("id", { ascending: true }).limit(1);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? mapFlatTour(client, data as FlatTourRow) : null;
}

export async function listManagedHomes(
  client: SupabaseClient = publicClient(),
  includeHidden = false,
) {
  let query = client.from("property_types").select("*")
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (!includeHidden) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as HomeRow[]).map((row) => mapHome(client, row));
}

export async function getManagedHome(
  slug: string,
  client: SupabaseClient = publicClient(),
) {
  const { data, error } = await client.from("property_types").select("*")
    .eq("slug", slug).eq("is_visible", true).maybeSingle();
  if (error) throw error;
  return data ? mapHome(client, data as HomeRow) : null;
}

export async function listManagedAmenities(
  client: SupabaseClient = publicClient(),
  includeHidden = false,
) {
  let query = client.from("amenities").select("*").order("sort_order", { ascending: true });
  if (!includeHidden) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as AmenityRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
  }));
}

export async function listManagedFaqs(
  client: SupabaseClient = publicClient(),
  includeHidden = false,
) {
  let query = client.from("faqs").select("*").order("sort_order", { ascending: true });
  if (!includeHidden) query = query.eq("is_visible", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data as FaqRow[]).map((row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
    isVisible: row.is_visible,
  }));
}

export async function getManagedSiteSettings(client: SupabaseClient = publicClient()) {
  const { data, error } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data ? mapSiteSettings(data as SiteSettingsRow) : fallbackSiteSettings;
}

export async function getAllManagedContent(client: SupabaseClient) {
  const [blogs, founders, projects, customers, homes, amenities, faqs, siteSettings] =
    await Promise.all([
      listManagedBlogs(client),
      listManagedFounders(client),
      listManagedFounderProjects(client),
      listManagedCustomers(client),
      listManagedHomes(client, true),
      listManagedAmenities(client, true),
      listManagedFaqs(client, true),
      getManagedSiteSettings(client),
    ]);
  return { blogs, founders, projects, customers, homes, amenities, faqs, siteSettings };
}
