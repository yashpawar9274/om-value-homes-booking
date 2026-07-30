import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fallbackSiteSettings } from "@/lib/content-store";
import { fetchSiteSettings } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OM Value Homes Location | Fair Township Palghar West",
  description:
    "Find OM Value Homes at Fair Township, Satpati–Palghar Road, Dhansar, Palghar West. Open the map and plan a free property visit.",
  alternates: { canonical: "/location" },
};

export default async function LocationPage() {
  const settings = await fetchSiteSettings().catch(() => fallbackSiteSettings);
  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><strong>Location</strong>
          </nav>
          <p>Connected Palghar Living</p>
          <h1>Fair Township, Palghar West.</h1>
          <span>
            {settings.address}.
          </span>
        </div>
      </section>

      <section className="location-page-grid">
        <div>
          <iframe
            src={settings.mapEmbedUrl}
            title="OM Value Homes location on Google Maps"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <article>
          <p className="section-kicker">Plan your route</p>
          <h2>Test the location with your real daily routine.</h2>
          <p>
            Check travel time to the railway station, workplace, school,
            hospital and market at the time you normally travel.
          </p>
          <ul className="highlight-list">
            <li>Palghar Railway Station approximately 2.5 km</li>
            <li>Schools and colleges in the surrounding area</li>
            <li>Hospitals and daily conveniences accessible nearby</li>
            <li>Convenient access from the main road</li>
          </ul>
          <a className="button button-primary" href={settings.googleMapsLink} target="_blank" rel="noreferrer">
            Open Google Maps <span aria-hidden="true">→</span>
          </a>
        </article>
      </section>
      <SiteFooter settings={settings} />
    </main>
  );
}
