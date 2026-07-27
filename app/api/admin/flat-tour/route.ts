import { NextRequest, NextResponse } from "next/server";
import { getManagedFlatTour } from "@/lib/content-store";
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

export async function GET() {
  try {
    const client = await authorizedClient();
    if (!client) {
      return NextResponse.json(
        { authorized: false, tour: null },
        { status: 403 },
      );
    }
    return NextResponse.json({
      authorized: true,
      tour: await getManagedFlatTour(client),
    });
  } catch {
    return NextResponse.json(
      { authorized: false, tour: null },
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
      videoPath?: string;
      fileName?: string;
      contentType?: string;
      fileSize?: number;
    };
    const title = body.title?.trim() ?? "";
    const bhkLabel = body.bhkLabel?.trim() ?? "";
    videoPath = body.videoPath?.trim() ?? "";

    if (
      !title ||
      !bhkLabel ||
      !videoPath.startsWith("tours/") ||
      !body.fileName ||
      !body.contentType?.startsWith("video/") ||
      !body.fileSize
    ) {
      throw new Error("Valid video details are required.");
    }

    const { data: current, error: readError } = await client
      .from("flat_tours")
      .select("video_path")
      .eq("id", 1)
      .maybeSingle();
    if (readError) throw readError;

    const { error } = await client.from("flat_tours").upsert(
      {
        id: 1,
        title,
        bhk_label: bhkLabel,
        video_path: videoPath,
        file_name: body.fileName,
        content_type: body.contentType,
        file_size: body.fileSize,
      },
      { onConflict: "id" },
    );
    if (error) throw error;

    const oldPath = current?.video_path as string | null | undefined;
    if (oldPath && oldPath !== videoPath) {
      await client.storage.from("flat-tours").remove([oldPath]);
    }

    return NextResponse.json({
      tour: await getManagedFlatTour(client),
    });
  } catch (error) {
    if (videoPath) {
      await client.storage.from("flat-tours").remove([videoPath]);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Video upload failed.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const client = await authorizedClient();
  if (!client) {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  try {
    const { data, error: readError } = await client
      .from("flat_tours")
      .select("video_path")
      .eq("id", 1)
      .maybeSingle();
    if (readError) throw readError;

    const { error } = await client.from("flat_tours").delete().eq("id", 1);
    if (error) throw error;
    if (data?.video_path) {
      await client.storage.from("flat-tours").remove([data.video_path]);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Remove failed.",
      },
      { status: 400 },
    );
  }
}
