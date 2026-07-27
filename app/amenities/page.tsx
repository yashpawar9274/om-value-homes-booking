import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const amenities = [
  ["01", "Temple", "A peaceful space within the community."],
  ["02", "Landscaped Garden", "Green spaces for relaxed everyday living."],
  ["03", "Kids’ Play Area", "A dedicated activity zone for children."],
  ["04", "Jogging Track", "A convenient route for daily fitness."],
  ["05", "24×7 Security", "CCTV-supported gated community security."],
  ["06", "Modern Lift", "Easy access across the G+7 residential tower."],
  ["07", "Car Parking", "Organised parking within the project."],
  ["08", "Indoor Games", "Leisure and recreation closer to home."],
  ["09", "Shops in Premises", "Daily essentials available nearby."],
  ["10", "Main Road Touch", "Convenient access from the project entrance."],
];

export const metadata: Metadata = {
  title: "Amenities at Fair Township Palghar West",
  description:
    "Explore temple, garden, kids play area, jogging track, security, lift, parking and other amenities at OM Value Homes, Palghar West.",
  alternates: { canonical: "/amenities" },
};

export default function AmenitiesPage() {
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
          {amenities.map(([number, title, copy]) => (
            <article key={title}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
