import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAllManagedContent } from "@/lib/content-store";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DEFAULT_ADMIN_EMAIL = "omvaluehomes6@gmail.com";

function adminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

async function authorizedClient(request: NextRequest) {
  const supabase = await createClient();
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const {
    data: { user },
    error,
  } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser();

  if (error || !user || user.email?.toLowerCase() !== adminEmail()) {
    return null;
  }
  return supabase;
}

function text(form: FormData, key: string) {
  return String(form.get(key) || "").trim();
}

function recordId(value: string | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function safeImagePath(form: FormData, kind: string) {
  const path = text(form, "imagePath");
  if (!path) return null;
  if (!path.startsWith(`content/${kind}/`)) {
    throw new Error("Invalid uploaded image path.");
  }
  return path;
}

async function removeMedia(client: SupabaseClient, path: string | null) {
  if (!path) return;
  await client.storage.from("content-media").remove([path]);
}

async function currentImage(
  client: SupabaseClient,
  table: string,
  id: number,
) {
  const { data, error } = await client
    .from(table)
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data?.image_path as string | null | undefined) ?? null;
}

async function saveBlog(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id"));
  const slug = text(form, "slug")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const title = text(form, "title");
  const excerpt = text(form, "excerpt");
  const category = text(form, "category");
  const body = text(form, "body");
  const seoTitle = text(form, "seoTitle") || title;
  const seoDescription = text(form, "seoDescription") || excerpt;
  const publishedAt =
    text(form, "publishedAt") || new Date().toISOString().slice(0, 10);
  const imagePath = safeImagePath(form, "blog");

  if (!slug || !title || !excerpt || !category || !body) {
    throw new Error(
      "Blog title, slug, category, excerpt and content are required.",
    );
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
    published_at: publishedAt,
  };
  if (imagePath) payload.cover_path = imagePath;

  if (id) {
    const { data, error: readError } = await client
      .from("blog_posts")
      .select("cover_path")
      .eq("id", id)
      .maybeSingle();
    if (readError) throw readError;
    oldPath = (data?.cover_path as string | null | undefined) ?? null;
    const { error } = await client.from("blog_posts").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client
      .from("blog_posts")
      .insert({ ...payload, cover_path: imagePath });
    if (error) throw error;
  }

  if (imagePath && oldPath && imagePath !== oldPath) {
    await removeMedia(client, oldPath);
  }
}

async function saveFounder(form: FormData, client: SupabaseClient) {
  const name = text(form, "name");
  const role = text(form, "role");
  const headline = text(form, "headline");
  const bio = text(form, "bio");
  const imagePath = safeImagePath(form, "founder");
  if (!name || !role || !headline || !bio) {
    throw new Error(
      "Founder name, role, headline and biography are required.",
    );
  }

  const oldPath = await currentImage(client, "founder_profiles", 1);
  const payload: Record<string, string | number | null> = {
    id: 1,
    name,
    role,
    headline,
    bio,
  };
  if (imagePath) payload.image_path = imagePath;

  const { error } = await client
    .from("founder_profiles")
    .upsert(payload, { onConflict: "id" });
  if (error) throw error;
  if (imagePath && oldPath && imagePath !== oldPath) {
    await removeMedia(client, oldPath);
  }
}

async function saveProject(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id"));
  const stage = text(form, "stage");
  const title = text(form, "title");
  const status = text(form, "status");
  const description = text(form, "description");
  const sortOrder = Math.max(1, Number(text(form, "sortOrder")) || 1);
  const imagePath = safeImagePath(form, "project");
  if (!["Previous", "Latest", "Upcoming"].includes(stage)) {
    throw new Error("Select a valid project stage.");
  }
  if (!title || !status || !description) {
    throw new Error(
      "Project title, status and description are required.",
    );
  }

  let oldPath: string | null = null;
  const payload: Record<string, string | number | null> = {
    stage,
    title,
    status,
    description,
    sort_order: sortOrder,
  };
  if (imagePath) payload.image_path = imagePath;

  if (id) {
    oldPath = await currentImage(client, "founder_projects", id);
    const { error } = await client
      .from("founder_projects")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client
      .from("founder_projects")
      .insert({ ...payload, image_path: imagePath });
    if (error) throw error;
  }

  if (imagePath && oldPath && imagePath !== oldPath) {
    await removeMedia(client, oldPath);
  }
}

async function saveCustomer(form: FormData, client: SupabaseClient) {
  const id = recordId(text(form, "id"));
  const name = text(form, "name");
  const title = text(form, "title");
  const story = text(form, "story");
  const orientation =
    text(form, "orientation") === "portrait" ? "portrait" : "landscape";
  const sortOrder = Math.max(1, Number(text(form, "sortOrder")) || 1);
  const imagePath = safeImagePath(form, "customer");
  if (!name || !title || !story) {
    throw new Error("Customer name, card title and story are required.");
  }

  let oldPath: string | null = null;
  const payload: Record<string, string | number | null> = {
    name,
    title,
    story,
    orientation,
    sort_order: sortOrder,
  };
  if (imagePath) payload.image_path = imagePath;

  if (id) {
    oldPath = await currentImage(client, "customer_stories", id);
    const { error } = await client
      .from("customer_stories")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await client
      .from("customer_stories")
      .insert({ ...payload, image_path: imagePath });
    if (error) throw error;
  }

  if (imagePath && oldPath && imagePath !== oldPath) {
    await removeMedia(client, oldPath);
  }
}

async function deleteRecord(
  request: NextRequest,
  client: SupabaseClient,
) {
  const kind = request.nextUrl.searchParams.get("kind");
  const id = recordId(request.nextUrl.searchParams.get("id"));
  if (!kind || !id) throw new Error("A valid content record is required.");

  const targets: Record<string, string> = {
    blog: "blog_posts",
    project: "founder_projects",
    customer: "customer_stories",
  };
  const table = targets[kind];
  if (!table) throw new Error("Unsupported content type.");

  const imageColumn = kind === "blog" ? "cover_path" : "image_path";
  const { data, error: readError } = await client
    .from(table)
    .select(imageColumn)
    .eq("id", id)
    .maybeSingle();
  if (readError) throw readError;

  const { error } = await client.from(table).delete().eq("id", id);
  if (error) throw error;
  const imagePath =
    kind === "blog"
      ? (data as { cover_path?: string | null } | null)?.cover_path
      : (data as { image_path?: string | null } | null)?.image_path;
  await removeMedia(client, imagePath ?? null);
}

function errorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Content update failed.";
  const status = message.toLowerCase().includes("duplicate") ? 409 : 400;
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const client = await authorizedClient(request);
    if (!client) {
      return NextResponse.json(
        { authorized: false, error: "Admin access required." },
        { status: 403 },
      );
    }
    return NextResponse.json({
      authorized: true,
      ...(await getAllManagedContent(client)),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const client = await authorizedClient(request);
  if (!client) {
    return NextResponse.json(
      { authorized: false, error: "Admin access required." },
      { status: 403 },
    );
  }

  let uploadedPath: string | null = null;
  try {
    const form = await request.formData();
    const kind = text(form, "kind");
    uploadedPath = text(form, "imagePath") || null;

    if (kind === "blog") await saveBlog(form, client);
    else if (kind === "founder") await saveFounder(form, client);
    else if (kind === "project") await saveProject(form, client);
    else if (kind === "customer") await saveCustomer(form, client);
    else throw new Error("Unsupported content type.");

    return NextResponse.json({
      ok: true,
      ...(await getAllManagedContent(client)),
    });
  } catch (error) {
    if (uploadedPath) await removeMedia(client, uploadedPath);
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  const client = await authorizedClient(request);
  if (!client) {
    return NextResponse.json(
      { authorized: false, error: "Admin access required." },
      { status: 403 },
    );
  }

  try {
    await deleteRecord(request, client);
    return NextResponse.json({
      ok: true,
      ...(await getAllManagedContent(client)),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
