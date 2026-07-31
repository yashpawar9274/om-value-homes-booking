import { NextRequest, NextResponse } from "next/server";
import {
  getManagedBlog,
  getManagedFounder,
  listManagedBlogs,
  listManagedCustomers,
  listManagedFounderProjects,
} from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const view = request.nextUrl.searchParams.get("view");

  try {
    if (view === "blogs") {
      return NextResponse.json({ blogs: await listManagedBlogs() });
    }

    if (view === "blog") {
      const slug = request.nextUrl.searchParams.get("slug")?.trim() ?? "";
      return NextResponse.json({
        blog: slug ? await getManagedBlog(slug) : null,
      });
    }

    if (view === "founder") {
      const [founder, projects] = await Promise.all([
        getManagedFounder(),
        listManagedFounderProjects(),
      ]);
      return NextResponse.json({ founder, projects });
    }

    if (view === "customers") {
      return NextResponse.json({
        customers: await listManagedCustomers(),
      });
    }

    return NextResponse.json(
      { error: "Unsupported content view." },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { error: "Content is temporarily unavailable." },
      { status: 503 },
    );
  }
}
