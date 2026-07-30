import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAllManagedContent } from "@/lib/content-store";
import { createClient } from "@/lib/supabase/server";
import { normalizeYoutubeUrl } from "@/lib/youtube";

export const dynamic = "force-dynamic";

const DEFAULT_ADMIN_EMAIL = "omvaluehomes6@gmail.com";
const IMAGE_KINDS = new Set(["blog", "founder", "project", "customer", "home"]);

function adminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

async function authorizedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user || user.email?.toLowerCase() !== adminEmail()) return null;

  const { data: allowed, error: roleError } = await supabase.rpc(
    "is_content_admin",
  );
  if (roleError || allowed !== true) return null;
  return supabase;
}

function text(form: FormData, key: string, max = 10_000) {
  const value = String(form.get(key) || "").trim();
  if (value.length > max) throw new Error(`${key} is too long.`);
  return value;
}

function required(form: FormData, key: string, max = 10_000) {
  const value = text(form, key, max);
  if (!value) throw new Error(`${key} is required.`);
  return value;
}

function recordId(value: string | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function positiveInteger(form: FormData, key: string, fallback = 1) {
  const value = Number(text(form, key, 10));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function isChecked(form: FormData, key: string) {
  return ["true", "on", "1"].includes(text(form, key, 10).toLowerCase());
}

function safeImagePath(form: FormData, kind: string) {
  const path = text(form, "imagePath", 300);
  if (!path) return null;
  if (
    !IMAGE_KINDS.has(kind) ||
    !new RegExp(`^content/${kind}/[a-f0-9-]+\\.(?:jpe?g|png|webp|gif)$`, "i").test(path)
  ) {
    throw new Error("Invalid uploaded image path.");
  }
  return path;
}

function safeHttpsUrl(value: string, label: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`${label} must use HTTPS.`);
  }
  return url.toString();
}

function safeMapEmbed(value: string) {
  const url = safeHttpsUrl(value, "Map embed URL");
  const parsed = new URL(url);
  if (
    !["www.google.com", "google.com", "maps.google.com"].includes(
      parsed.hostname.toLowerCase(),
    ) ||
    !parsed.pathname.startsWith("/maps/embed")
  ) {
    throw new Error("Only a Google Maps embed URL is allowed.");
  }
  return url;
}

async function removeMedia(client: SupabaseClient, path: string | null) {
  if (!path) return;
  const { error } = await client.storage.from("content-media").remove([path]);
  if (error) throw error;
}

async function currentMedia(
  client: SupabaseClient,
  table: string,
  id: number,
  column: "cover_path" | "image_path",
) {
  const { data, error } = await client
    .from(table)
    .select(column)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return ((data as Record<string, string | null> | null)?.[column] ?? null);
}

async function finishImageUpdate(
  client: SupabaseClient,
  oldPath: string | null,
  newPath: string | null,
  removeImage: boolean,
) {
  if (oldPath && (removeImage || (newPath && newPath !== oldPath))) {
    await removeMedia(client, oldPath);
  }
}

async function saveBlog(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const slug = required(form, "slug", 120)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const title = required(form, "title", 180);
  const excerpt = required(form, "excerpt", 500);
  const category = required(form, "category", 80);
  const body = required(form, "body", 50_000);
  const seoTitle = text(form, "seoTitle", 180) || title;
  const seoDescription = text(form, "seoDescription", 320) || excerpt;
  const publishedAt = text(form, "publishedAt", 10) || new Date().toISOString().slice(0, 10);
  const imageAlt = text(form, "imageAlt", 180) || `${title} — OM Value Homes`;
  const youtubeInput = text(form, "youtubeInput", 2_000);
  const videoUrl = youtubeInput ? normalizeYoutubeUrl(youtubeInput) : null;
  const imagePath = safeImagePath(form, "blog");
  const removeImage = isChecked(form, "removeImage") && !imagePath;

  if (!slug) throw new Error("A valid URL slug is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    throw new Error("Publish date is invalid.");
  }

  let oldPath: string | null = null;
  const payload: Record<string, string | null> = {
    slug,
    title,
    excerpt,
    category,
    body,
    seo_title: seoTitle,
    seo_description: seoDescription,
    image_alt: imageAlt,
    video_url: videoUrl,
    published_at: publishedAt,
  };
  if (imagePath || removeImage) payload.cover_path = removeImage ? null : imagePath;

  if (id) {
    oldPath = await currentMedia(client, "blog_posts", id, "cover_path");
    const { error } = await client.from("blog_posts").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client.from("blog_posts").insert({
      ...payload,
      cover_path: imagePath,
    });
    if (error) throw error;
  }
  await finishImageUpdate(client, oldPath, imagePath, removeImage);
}

async function saveFounder(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const imagePath = safeImagePath(form, "founder");
  const removeImage = isChecked(form, "removeImage") && !imagePath;
  const payload: Record<string, string | number | null> = {
    name: required(form, "name", 120),
    role: required(form, "role", 160),
    headline: required(form, "headline", 220),
    bio: required(form, "bio", 5_000),
    sort_order: positiveInteger(form, "sortOrder"),
  };
  if (imagePath || removeImage) payload.image_path = removeImage ? null : imagePath;

  let oldPath: string | null = null;
  if (id) {
    oldPath = await currentMedia(client, "founder_profiles", id, "image_path");
    const { error } = await client.from("founder_profiles").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client.from("founder_profiles").insert({
      ...payload,
      image_path: imagePath,
    });
    if (error) throw error;
  }
  await finishImageUpdate(client, oldPath, imagePath, removeImage);
}

async function saveProject(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const stage = required(form, "stage", 20);
  if (!["Previous", "Latest", "Upcoming"].includes(stage)) {
    throw new Error("Select a valid project stage.");
  }
  const imagePath = safeImagePath(form, "project");
  const removeImage = isChecked(form, "removeImage") && !imagePath;
  const payload: Record<string, string | number | null> = {
    stage,
    title: required(form, "title", 180),
    status: required(form, "status", 220),
    description: required(form, "description", 3_000),
    sort_order: positiveInteger(form, "sortOrder"),
  };
  if (imagePath || removeImage) payload.image_path = removeImage ? null : imagePath;

  let oldPath: string | null = null;
  if (id) {
    oldPath = await currentMedia(client, "founder_projects", id, "image_path");
    const { error } = await client.from("founder_projects").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client.from("founder_projects").insert({
      ...payload,
      image_path: imagePath,
    });
    if (error) throw error;
  }
  await finishImageUpdate(client, oldPath, imagePath, removeImage);
}

async function saveCustomer(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const imagePath = safeImagePath(form, "customer");
  const removeImage = isChecked(form, "removeImage") && !imagePath;
  const payload: Record<string, string | number | null> = {
    name: required(form, "name", 120),
    title: required(form, "title", 180),
    story: required(form, "story", 3_000),
    orientation: text(form, "orientation", 20) === "portrait" ? "portrait" : "landscape",
    sort_order: positiveInteger(form, "sortOrder"),
  };
  if (imagePath || removeImage) payload.image_path = removeImage ? null : imagePath;

  let oldPath: string | null = null;
  if (id) {
    oldPath = await currentMedia(client, "customer_stories", id, "image_path");
    const { error } = await client.from("customer_stories").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client.from("customer_stories").insert({
      ...payload,
      image_path: imagePath,
    });
    if (error) throw error;
  }
  await finishImageUpdate(client, oldPath, imagePath, removeImage);
}

async function saveHome(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const slug = required(form, "slug", 120).toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error("A valid home URL slug is required.");
  const title = required(form, "bhk", 60);
  const imagePath = safeImagePath(form, "home");
  const removeImage = isChecked(form, "removeImage") && !imagePath;
  const payload: Record<string, string | number | boolean | null> = {
    slug,
    display_number: required(form, "number", 10),
    bhk_label: title,
    price: required(form, "price", 80),
    area: required(form, "area", 100),
    status: required(form, "status", 160),
    headline: required(form, "headline", 240),
    overview: required(form, "overview", 4_000),
    ideal_for: required(form, "idealFor", 500),
    highlights: required(form, "highlights", 5_000),
    meta_title: text(form, "metaTitle", 180) || `${title} in Palghar West`,
    meta_description: text(form, "metaDescription", 320) || required(form, "headline", 240),
    sort_order: positiveInteger(form, "sortOrder"),
    is_visible: isChecked(form, "isVisible"),
  };
  if (imagePath || removeImage) payload.image_path = removeImage ? null : imagePath;

  let oldPath: string | null = null;
  if (id) {
    oldPath = await currentMedia(client, "property_types", id, "image_path");
    const { error } = await client.from("property_types").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client.from("property_types").insert({
      ...payload,
      image_path: imagePath,
    });
    if (error) throw error;
  }
  await finishImageUpdate(client, oldPath, imagePath, removeImage);
}

async function saveAmenity(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const payload = {
    title: required(form, "title", 120),
    description: required(form, "description", 500),
    sort_order: positiveInteger(form, "sortOrder"),
    is_visible: isChecked(form, "isVisible"),
  };
  const { error } = id
    ? await client.from("amenities").update(payload).eq("id", id)
    : await client.from("amenities").insert(payload);
  if (error) throw error;
}

async function saveFaq(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id", 20));
  const payload = {
    question: required(form, "question", 240),
    answer: required(form, "answer", 2_000),
    sort_order: positiveInteger(form, "sortOrder"),
    is_visible: isChecked(form, "isVisible"),
  };
  const { error } = id
    ? await client.from("faqs").update(payload).eq("id", id)
    : await client.from("faqs").insert(payload);
  if (error) throw error;
}

async function saveSiteSettings(form: FormData, client: SupabaseClient) {
  const payload = {
    id: 1,
    hero_eyebrow: required(form, "heroEyebrow", 180),
    hero_title: required(form, "heroTitle", 180),
    hero_lead: required(form, "heroLead", 600),
    price_label: required(form, "priceLabel", 80),
    price_value: required(form, "priceValue", 80),
    project_kicker: required(form, "projectKicker", 160),
    project_title: required(form, "projectTitle", 220),
    project_description: required(form, "projectDescription", 1_000),
    homes_title: required(form, "homesTitle", 220),
    homes_description: required(form, "homesDescription", 1_000),
    amenities_title: required(form, "amenitiesTitle", 220),
    amenities_description: required(form, "amenitiesDescription", 1_000),
    blogs_title: required(form, "blogsTitle", 220),
    blogs_description: required(form, "blogsDescription", 1_000),
    location_title: required(form, "locationTitle", 220),
    location_description: required(form, "locationDescription", 1_000),
    address: required(form, "address", 500),
    map_embed_url: safeMapEmbed(required(form, "mapEmbedUrl", 2_000)),
    google_maps_link: safeHttpsUrl(required(form, "googleMapsLink", 500), "Google Maps link"),
    whatsapp_number: required(form, "whatsappNumber", 20).replace(/\D/g, ""),
    whatsapp_display: required(form, "whatsappDisplay", 40),
    call_number: required(form, "callNumber", 20).replace(/\D/g, ""),
    call_display: required(form, "callDisplay", 40),
    rera_number: required(form, "reraNumber", 80),
  };
  if (payload.whatsapp_number.length < 10 || payload.call_number.length < 10) {
    throw new Error("Call and WhatsApp numbers must include a valid country code.");
  }
  const { error } = await client.from("site_settings").upsert(payload, { onConflict: "id" });
  if (error) throw error;
}

async function deleteRecord(request: NextRequest, client: SupabaseClient) {
  const kind = request.nextUrl.searchParams.get("kind");
  const id = recordId(request.nextUrl.searchParams.get("id"));
  if (!kind || !id) throw new Error("A valid content record is required.");

  const targets: Record<string, { table: string; image?: "cover_path" | "image_path" }> = {
    blog: { table: "blog_posts", image: "cover_path" },
    founder: { table: "founder_profiles", image: "image_path" },
    project: { table: "founder_projects", image: "image_path" },
    customer: { table: "customer_stories", image: "image_path" },
    home: { table: "property_types", image: "image_path" },
    amenity: { table: "amenities" },
    faq: { table: "faqs" },
  };
  const target = targets[kind];
  if (!target) throw new Error("Unsupported content type.");

  const path = target.image
    ? await currentMedia(client, target.table, id, target.image)
    : null;
  const { error } = await client.from(target.table).delete().eq("id", id);
  if (error) throw error;
  await removeMedia(client, path);
}

function errorResponse(error: unknown) {
  const raw = error instanceof Error ? error.message : "Content update failed.";
  const duplicate = /duplicate|unique/i.test(raw);
  const message = duplicate
    ? "That slug, BHK label or other unique value is already in use."
    : raw;
  const unavailable = /supabase is not configured|environment variables/i.test(raw);
  return NextResponse.json(
    { error: message },
    {
      status: unavailable ? 503 : duplicate ? 409 : 400,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function GET() {
  try {
    const client = await authorizedClient();
    if (!client) {
      return NextResponse.json(
        { authorized: false, error: "Admin access required." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
    return NextResponse.json(
      { authorized: true, ...(await getAllManagedContent(client)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const client = await authorizedClient();
  if (!client) {
    return NextResponse.json(
      { authorized: false, error: "Admin access required." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  let uploadedPath: string | null = null;
  try {
    const form = await request.formData();
    const kind = text(form, "kind", 30);
    uploadedPath = text(form, "imagePath", 300) || null;

    if (kind === "blog") await saveBlog(form, client);
    else if (kind === "founder") await saveFounder(form, client);
    else if (kind === "project") await saveProject(form, client);
    else if (kind === "customer") await saveCustomer(form, client);
    else if (kind === "home") await saveHome(form, client);
    else if (kind === "amenity") await saveAmenity(form, client);
    else if (kind === "faq") await saveFaq(form, client);
    else if (kind === "site") await saveSiteSettings(form, client);
    else throw new Error("Unsupported content type.");

    return NextResponse.json(
      { ok: true, ...(await getAllManagedContent(client)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (uploadedPath) {
      try {
        await removeMedia(client, uploadedPath);
      } catch {
        // Preserve the original validation/database error.
      }
    }
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  const client = await authorizedClient();
  if (!client) {
    return NextResponse.json(
      { authorized: false, error: "Admin access required." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    await deleteRecord(request, client);
    return NextResponse.json(
      { ok: true, ...(await getAllManagedContent(client)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
