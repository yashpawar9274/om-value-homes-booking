import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fallbackManagedHomes } from "@/lib/content-store";
import { fetchManagedHomes } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "1, 2 & 3 BHK Flats in Palghar West",
  description:
    "Compare 1, 2 and 3 BHK flats at Fair Township, Palghar West. View carpet areas, possession status, starting prices and detailed property pages.",
  alternates: { canonical: "/homes" },
};

export default async function HomesPage() {
  const homes = await fetchManagedHomes().catch(fallbackManagedHomes);
  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><strong>Homes</strong>
          </nav>
          <p>Fair Township · Palghar West</p>
          <h1>Find the home that fits your family.</h1>
          <span>
            Compare price, carpet area and possession status, then open the
            detailed page to watch the sample flat tour.
          </span>
        </div>
      </section>

      <section className="page-section">
        <div className="property-listing-grid">
          {homes.map((property) => (
            <article className="property-listing-card" key={property.slug}>
              <Image
                src={property.imageUrl ?? "/om-value-homes-building.png"}
                alt={`${property.bhk} flats at OM Value Homes, Palghar West`}
                width={1254}
                height={1254}
                unoptimized={Boolean(property.imageUrl)}
              />
              <div>
                <span>{property.status}</span>
                <h2>{property.bhk}</h2>
                <p>{property.headline}</p>
                <dl>
                  <div><dt>Starting from</dt><dd>{property.price}</dd></div>
                  <div><dt>Carpet area</dt><dd>{property.area}</dd></div>
                </dl>
                <Link href={`/homes/${property.slug}`}>
                  View details &amp; video <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <p>Need help choosing a configuration?</p>
          <h2>Compare the available homes during a FREE visit.</h2>
        </div>
        <Link className="button button-white" href="/#book">
          Book a Visit <span aria-hidden="true">→</span>
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
