import { NextRequest, NextResponse } from "next/server";
import {
  getManagedFlatTour,
  listManagedFlatTours,
} from "@/lib/content-store";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DEFAULT_ADMIN_EMAIL = "omvaluehomes6@gmail.com";

async function authorizedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const allowed = (
    process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
  ).toLowerCase();

  if (error || !user || user.email?.toLowerCase() !== allowed) return null;
  return supabase;
}

function errorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Video upload failed.";
  const status = message.toLowerCase().includes("duplicate") ? 409 : 400;
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const client = await authorizedClient();
    if (!client) {
      return NextResponse.json(
        { authorized: false, tours: [], tour: null },
        { status: 403 },
      );
    }

    const bhkLabel = request.nextUrl.searchParams.get("bhkLabel")?.trim();
    const tours = await listManagedFlatTours(client);
    const tour = bhkLabel
      ? tours.find((item) => item.bhkLabel === bhkLabel) ?? null
      : tours[0] ?? null;

    return NextResponse.json({ authorized: true, tours, tour });
  } catch (error) {
    return NextResponse.json(
      { authorized: false, tours: [], tour: null, error: "Unable to load flat tours." },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const client = await authorizedClient();
  if (!client) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  let videoPath = "";
  try {
    const body = (await request.json()) as {
      title?: string;
      bhkLabel?: string;
      source?: string;
      videoPath?: string;
      videoUrl?: string | null;
      embedHtml?: string | null;
      fileName?: string | null;
      contentType?: string | null;
      fileSize?: number | null;
    };
    const title = body.title?.trim() ?? "";
    const bhkLabel = body.bhkLabel?.trim() ?? "";
    const source = body.source === "youtube" ? "youtube" : "storage";
    videoPath = body.videoPath?.trim() ?? "";
    const videoUrl = body.videoUrl?.trim() || null;
    const embedHtml = body.embedHtml?.trim() || null;

    if (!title || !bhkLabel) {
      throw new Error("Title and BHK label are required.");
    }

    const isStorage = source === "storage";
    if (isStorage) {
      if (!videoPath.startsWith("tours/") || !body.fileName || !body.contentType?.startsWith("video/") || !body.fileSize) {
        throw new Error("Valid video details are required.");
      }
    } else {
      if (!videoUrl && !embedHtml) {
        throw new Error("A YouTube or embed source is required.");
      }
    }

    const { data: current, error: readError } = await client
      .from("flat_tours")
      .select("id, video_path")
      .eq("bhk_label", bhkLabel)
      .maybeSingle();
    if (readError) throw readError;

    const payload: Record<string, unknown> = {
      title,
      bhk_label: bhkLabel,
      video_source: source,
      video_path: isStorage ? videoPath : null,
      video_url: isStorage ? null : videoUrl,
      embed_html: isStorage ? null : embedHtml,
      file_name: isStorage ? body.fileName : null,
      content_type: isStorage ? body.contentType : null,
      file_size: isStorage ? body.fileSize : null,
    };

    let error;
    if (current?.id) {
      ({ error } = await client
        .from("flat_tours")
        .update(payload)
        .eq("id", current.id));
    } else {
      ({ error } = await client.from("flat_tours").insert(payload));
    }

    if (error) throw error;

    const oldPath = current?.video_path as string | null | undefined;
    if (oldPath && oldPath !== videoPath) {
      await client.storage.from("flat-tours").remove([oldPath]);
    }

    const tours = await listManagedFlatTours(client);
    return NextResponse.json({
      tours,
      tour: await getManagedFlatTour(bhkLabel, client),
    });
  } catch (error) {
    if (videoPath) {
      await client.storage.from("flat-tours").remove([videoPath]);
    }
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  const client = await authorizedClient();
  if (!client) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  try {
    const bhkLabel = request.nextUrl.searchParams.get("bhkLabel")?.trim();
    if (!bhkLabel) {
      throw new Error("Valid flat tour label is required.");
    }

    const { data, error: readError } = await client
      .from("flat_tours")
      .select("id, video_path")
      .eq("bhk_label", bhkLabel)
      .maybeSingle();
    if (readError) throw readError;

    if (!data?.id) {
      throw new Error("Flat tour record not found.");
    }

    const { error } = await client.from("flat_tours").delete().eq("id", data.id);
    if (error) throw error;
    if (data.video_path) {
      await client.storage.from("flat-tours").remove([data.video_path]);
    }

    const tours = await listManagedFlatTours(client);
    return NextResponse.json({
      tours,
      tour: tours[0] ?? null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
