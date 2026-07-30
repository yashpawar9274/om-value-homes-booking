import { NextRequest, NextResponse } from "next/server";
import {
  getManagedBlog,
  getManagedSiteSettings,
  listManagedAmenities,
  listManagedBlogs,
  listManagedCustomers,
  listManagedFaqs,
  listManagedFounderProjects,
  listManagedFounders,
  listManagedHomes,
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
      const [founders, projects] = await Promise.all([
        listManagedFounders(),
        listManagedFounderProjects(),
      ]);
      return NextResponse.json({ founders, founder: founders[0] ?? null, projects });
    }

    if (view === "customers") {
      return NextResponse.json({
        customers: await listManagedCustomers(),
      });
    }

    if (view === "homepage") {
      const [siteSettings, homes, amenities, faqs, blogs] = await Promise.all([
        getManagedSiteSettings(),
        listManagedHomes(),
        listManagedAmenities(),
        listManagedFaqs(),
        listManagedBlogs(),
      ]);
      return NextResponse.json({ siteSettings, homes, amenities, faqs, blogs });
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
