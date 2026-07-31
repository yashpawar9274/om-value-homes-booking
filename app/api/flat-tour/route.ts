import { NextResponse } from "next/server";
import { getManagedFlatTours } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const key = new URL(request.url).searchParams.get("bhk");
    const tours = await getManagedFlatTours();
    return NextResponse.json({
      tour: tours.find((tour) => tour.bhkKey === key) ?? null,
      tours,
    });
  } catch {
    return NextResponse.json({ tour: null, tours: [] });
  }
}
