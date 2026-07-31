import { NextRequest, NextResponse } from "next/server";
import {
  getManagedFlatTours,
  normalizeYouTubeEmbed,
  type ManagedFlatTour,
} from "@/lib/content-store";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const DEFAULT_ADMIN_EMAIL = "omvaluehomes6@gmail.com";
const VALID_KEYS = new Set(["1-bhk", "2-bhk", "3-bhk"]);

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
  const allowed = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
  if (error || !user || user.email?.toLowerCase() !== allowed) return null;
  return supabase;
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
      tours: await getManagedFlatTours(client),
    });
  } catch (error) {
    return NextResponse.json(
      {
        authorized: false,
        error: error instanceof Error ? error.message : "Admin access failed.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const client = await authorizedClient(request);
  if (!client) {
    return NextResponse.json(
      { error: "Admin access required. Please sign in again." },
      { status: 403 },
    );
  }
  try {
    const body = (await request.json()) as { tours?: ManagedFlatTour[] };
    if (!Array.isArray(body.tours) || body.tours.length !== 3) {
      throw new Error("Add one video setting for each 1, 2 and 3 BHK flat.");
    }
    const now = new Date().toISOString();
    const tours = body.tours.map((tour) => {
      if (!VALID_KEYS.has(tour.bhkKey)) throw new Error("Invalid flat type.");
      const embedUrl = tour.embedUrl.trim()
        ? normalizeYouTubeEmbed(tour.embedUrl)
        : "";
      return {
        bhkKey: tour.bhkKey,
        bhkLabel: tour.bhkLabel.trim(),
        title: tour.title.trim(),
        embedUrl,
        updatedAt: now,
      };
    });
    if (new Set(tours.map((tour) => tour.bhkKey)).size !== 3) {
      throw new Error("Each flat type must be included once.");
    }
    if (tours.some((tour) => !tour.title || !tour.bhkLabel)) {
      throw new Error("Every flat type needs a title and label.");
    }

    const encoded = JSON.stringify(tours);
    const { error } = await client.from("flat_tours").upsert(
      {
        id: 1,
        title: "BHK-wise YouTube flat tours",
        bhk_label: "1 BHK, 2 BHK and 3 BHK",
        video_path: encoded,
        file_name: "youtube-embeds.json",
        content_type: "application/json",
        file_size: encoded.length,
      },
      { onConflict: "id" },
    );
    if (error) throw error;
    return NextResponse.json({ tours });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Video links could not be saved.",
      },
      { status: 400 },
    );
  }
}
