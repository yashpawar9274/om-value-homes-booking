import { NextRequest, NextResponse } from "next/server";
import {
  getManagedFlatTour,
  listManagedFlatTours,
} from "@/lib/content-store";
import { createClient } from "@/lib/supabase/server";
import { normalizeYoutubeUrl } from "@/lib/youtube";

export const dynamic = "force-dynamic";

const DEFAULT_ADMIN_EMAIL = "omvaluehomes6@gmail.com";
const ALLOWED_LABELS = new Set(["1 BHK", "2 BHK", "3 BHK", "Project Walkthrough"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

async function authorizedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const email = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  if (error || !user || user.email?.toLowerCase() !== email) return null;
  const { data: allowed, error: roleError } = await supabase.rpc("is_content_admin");
  return !roleError && allowed === true ? supabase : null;
}

function json(
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Video update failed.";
  return json({ error: message }, /duplicate|unique/i.test(message) ? 409 : 400);
}

export async function GET(request: NextRequest) {
  try {
    const client = await authorizedClient();
    if (!client) return json({ authorized: false, tours: [], tour: null }, 403);
    const bhkLabel = request.nextUrl.searchParams.get("bhkLabel")?.trim();
    const tours = await listManagedFlatTours(client);
    const tour = bhkLabel
      ? tours.find((item) => item.bhkLabel === bhkLabel) ?? null
      : tours[0] ?? null;
    return json({ authorized: true, tours, tour });
  } catch {
    return json(
      { authorized: false, tours: [], tour: null, error: "Unable to load flat tours." },
      503,
    );
  }
}

export async function POST(request: NextRequest) {
  const client = await authorizedClient();
  if (!client) return json({ error: "Admin access required." }, 403);

  let uploadedPath = "";
  let saveSucceeded = false;
  try {
    const body = (await request.json()) as {
      title?: string;
      bhkLabel?: string;
      source?: string;
      videoPath?: string;
      youtubeInput?: string;
      fileName?: string;
      contentType?: string;
      fileSize?: number;
    };
    const title = body.title?.trim().slice(0, 120) ?? "";
    const bhkLabel = body.bhkLabel?.trim() ?? "";
    const source = body.source === "youtube" ? "youtube" : "storage";
    uploadedPath = body.videoPath?.trim() ?? "";

    if (!title || !ALLOWED_LABELS.has(bhkLabel)) {
      throw new Error("A valid title and flat type are required.");
    }

    const isStorage = source === "storage";
    let videoUrl: string | null = null;
    if (isStorage) {
      if (
        !/^tours\/[a-f0-9-]+\.(?:mp4|webm|mov)$/i.test(uploadedPath) ||
        !body.fileName ||
        !body.contentType ||
        !ALLOWED_VIDEO_TYPES.has(body.contentType) ||
        !body.fileSize ||
        body.fileSize > 500 * 1024 * 1024
      ) {
        throw new Error("Upload an MP4, WebM or MOV video smaller than 500 MB.");
      }
    } else {
      videoUrl = normalizeYoutubeUrl(body.youtubeInput || "");
      if (!videoUrl) throw new Error("A YouTube video is required.");
    }

    const { data: current, error: readError } = await client
      .from("flat_tours")
      .select("id, video_path")
      .eq("bhk_label", bhkLabel)
      .maybeSingle();
    if (readError) throw readError;

    const payload = {
      title,
      bhk_label: bhkLabel,
      video_source: source,
      video_path: isStorage ? uploadedPath : null,
      video_url: isStorage ? null : videoUrl,
      embed_html: null,
      file_name: isStorage ? body.fileName?.slice(0, 255) : null,
      content_type: isStorage ? body.contentType : null,
      file_size: isStorage ? body.fileSize : null,
    };

    const { error } = current?.id
      ? await client.from("flat_tours").update(payload).eq("id", current.id)
      : await client.from("flat_tours").insert(payload);
    if (error) throw error;
    saveSucceeded = true;

    const oldPath = current?.video_path as string | null | undefined;
    if (oldPath && oldPath !== uploadedPath) {
      await client.storage.from("flat-tours").remove([oldPath]);
    }

    return json({ tour: await getManagedFlatTour(bhkLabel, client) });
  } catch (error) {
    if (uploadedPath && !saveSucceeded) {
      await client.storage.from("flat-tours").remove([uploadedPath]);
    }
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  const client = await authorizedClient();
  if (!client) return json({ error: "Admin access required." }, 403);
  try {
    const bhkLabel = request.nextUrl.searchParams.get("bhkLabel")?.trim() ?? "";
    if (!ALLOWED_LABELS.has(bhkLabel)) throw new Error("Select a valid flat type.");
    const { data: current, error: readError } = await client
      .from("flat_tours")
      .select("id, video_path")
      .eq("bhk_label", bhkLabel)
      .maybeSingle();
    if (readError) throw readError;
    if (current?.id) {
      const { error } = await client.from("flat_tours").delete().eq("id", current.id);
      if (error) throw error;
      if (current.video_path) {
        await client.storage.from("flat-tours").remove([current.video_path]);
      }
    }
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
