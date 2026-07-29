import { NextRequest, NextResponse } from "next/server";
import { getManagedFlatTour } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const bhkLabel = request.nextUrl.searchParams.get("bhkLabel")?.trim() || undefined;
    return NextResponse.json({ tour: await getManagedFlatTour(bhkLabel) });
  } catch {
    return NextResponse.json({ tour: null });
  }
}
