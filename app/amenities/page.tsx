import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fallbackAmenities } from "@/lib/content-store";
import { fetchManagedAmenities } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Amenities at Fair Township Palghar West",
  description:
    "Explore temple, garden, kids play area, jogging track, security, lift, parking and other amenities at OM Value Homes, Palghar West.",
  alternates: { canonical: "/amenities" },
};

export default async function AmenitiesPage() {
  const amenities = await fetchManagedAmenities().catch(() => fallbackAmenities);
  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><strong>Amenities</strong>
          </nav>
          <p>Fair Township · Palghar West</p>
          <h1>Everyday comfort, safety and convenience.</h1>
          <span>
            Review the community features, then verify their current operational
            status during your site visit.
          </span>
        </div>
      </section>
      <section className="page-section">
        <div className="amenities-grid page-amenities-grid">
          {amenities.map((amenity, index) => (
            <article key={amenity.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{amenity.title}</h2>
              <p>{amenity.description}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
