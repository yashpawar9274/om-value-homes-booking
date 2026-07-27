import { NextResponse } from "next/server";
import { getManagedFlatTour } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ tour: await getManagedFlatTour() });
  } catch {
    return NextResponse.json({ tour: null });
  }
}
