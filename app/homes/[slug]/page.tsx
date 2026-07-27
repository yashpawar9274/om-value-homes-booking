import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FlatTourPlayer from "@/components/FlatTourPlayer";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getProperty, properties, SITE_URL } from "@/lib/site-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};

  return {
    title: { absolute: property.metaTitle },
    description: property.metaDescription,
    keywords: [
      property.bhk,
      `${property.bhk} flat in Palghar West`,
      "OM Value Homes",
      "Fair Township Palghar",
    ],
    alternates: { canonical: `/homes/${property.slug}` },
    openGraph: {
      title: property.metaTitle,
      description: property.metaDescription,
      url: `/homes/${property.slug}`,
      images: ["/om-value-homes-building.png"],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const pageUrl = `${SITE_URL}/homes/${property.slug}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Apartment",
          name: `${property.bhk} at Fair Township, Palghar West`,
          description: property.metaDescription,
          url: pageUrl,
          image: `${SITE_URL}/om-value-homes-building.png`,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Fair Township, Satpati–Palghar Road, Dhansar",
            addressLocality: "Palghar West",
            addressRegion: "Maharashtra",
            postalCode: "401501",
            addressCountry: "IN",
          },
          numberOfRooms: property.bhk.replace(" BHK", ""),
          floorSize: {
            "@type": "QuantitativeValue",
            value: property.area,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: "Homes",
              item: `${SITE_URL}/homes`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: property.bhk,
              item: pageUrl,
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="property-detail-hero">
        <div className="property-detail-copy">
          <nav className="breadcrumb light-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/homes">Homes</Link><span>/</span>
            <strong>{property.bhk}</strong>
          </nav>
          <p>{property.status}</p>
          <h1>{property.bhk} Flat in Palghar West</h1>
          <span>{property.headline}</span>
          <div className="property-hero-facts">
            <div><small>Starting from</small><strong>{property.price}</strong></div>
            <div><small>Carpet area</small><strong>{property.area}</strong></div>
          </div>
          <Link className="button button-primary" href="/#book">
            Book Free Site Visit <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Image
          src="/om-value-homes-building.png"
          alt={`${property.bhk} residential building at Fair Township, Palghar West`}
          width={1254}
          height={1254}
          priority
        />
      </section>

      <section className="property-detail-body page-section">
        <article>
          <p className="section-kicker">Property overview</p>
          <h2>{property.headline}</h2>
          <p>{property.overview}</p>
          <div className="ideal-for">
            <span>Suitable for</span>
            <strong>{property.idealFor}</strong>
          </div>
          <h3>Key details</h3>
          <ul className="highlight-list">
            {property.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>

        <aside className="detail-video-card">
          <p className="section-kicker">Sample flat video</p>
          <h2>Watch the flat tour.</h2>
          <p>
            The player automatically adjusts for vertical and landscape videos.
          </p>
          <FlatTourPlayer />
        </aside>
      </section>

      <section className="final-cta">
        <div>
          <p>Photos and video help you shortlist.</p>
          <h2>The final decision starts with an actual site visit.</h2>
        </div>
        <Link className="button button-white" href="/#book">
          Schedule Visit <span aria-hidden="true">→</span>
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
