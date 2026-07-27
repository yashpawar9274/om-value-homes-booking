import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { blogPosts } from "@/lib/site-data";

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
};

export type ManagedFounder = {
  id: number;
  name: string;
  role: string;
  headline: string;
  bio: string;
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
  fileName: string;
  fileSize: number;
  updatedAt: string;
  videoUrl: string;
  videoPath: string;
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
  video_path: string;
  file_name: string;
  file_size: number;
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
      const bullets = section.bullets
        ?.map((bullet) => `- ${bullet}`)
        .join("\n");
      return [`## ${section.heading}`, paragraphs, bullets]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n");
}

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
  }));
}

export function fallbackManagedBlog(slug: string) {
  return fallbackManagedBlogs().find((post) => post.slug === slug) ?? null;
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
  };
}

function mapFounder(
  client: SupabaseClient,
  row: FounderRow,
): ManagedFounder {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    headline: row.headline,
    bio: row.bio,
    updatedAt: row.updated_at,
    imageUrl: mediaUrl(client, "content-media", row.image_path),
  };
}

function mapProject(
  client: SupabaseClient,
  row: ProjectRow,
): ManagedFounderProject {
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

function mapCustomer(
  client: SupabaseClient,
  row: CustomerRow,
): ManagedCustomerStory {
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

export async function listManagedBlogs(
  client: SupabaseClient = publicClient(),
) {
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) throw error;
  return (data as BlogRow[]).map((row) => mapBlog(client, row));
}

export async function getManagedBlog(
  slug: string,
  client: SupabaseClient = publicClient(),
) {
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapBlog(client, data as BlogRow) : null;
}

export async function getManagedFounder(
  client: SupabaseClient = publicClient(),
) {
  const { data, error } = await client
    .from("founder_profiles")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapFounder(client, data as FounderRow) : null;
}

export async function listManagedFounderProjects(
  client: SupabaseClient = publicClient(),
) {
  const { data, error } = await client
    .from("founder_projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data as ProjectRow[]).map((row) => mapProject(client, row));
}

export async function listManagedCustomers(
  client: SupabaseClient = publicClient(),
) {
  const { data, error } = await client
    .from("customer_stories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data as CustomerRow[]).map((row) => mapCustomer(client, row));
}

export async function getManagedFlatTour(
  client: SupabaseClient = publicClient(),
): Promise<ManagedFlatTour | null> {
  const { data, error } = await client
    .from("flat_tours")
    .select("title,bhk_label,video_path,file_name,file_size,updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as FlatTourRow;
  return {
    title: row.title,
    bhkLabel: row.bhk_label,
    fileName: row.file_name,
    fileSize: row.file_size,
    updatedAt: row.updated_at,
    videoUrl: mediaUrl(client, "flat-tours", row.video_path) ?? "",
    videoPath: row.video_path,
  };
}

export async function getAllManagedContent(client: SupabaseClient) {
  const [blogs, founder, projects, customers] = await Promise.all([
    listManagedBlogs(client),
    getManagedFounder(client),
    listManagedFounderProjects(client),
    listManagedCustomers(client),
  ]);
  return { blogs, founder, projects, customers };
}
