import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { GOOGLE_MAPS_LINK } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "OM Value Homes Location | Fair Township Palghar West",
  description:
    "Find OM Value Homes at Fair Township, Satpati–Palghar Road, Dhansar, Palghar West. Open the map and plan a free property visit.",
  alternates: { canonical: "/location" },
};

export default function LocationPage() {
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
            Satpati–Palghar Road, Dhansar, Palghar West, Maharashtra 401501.
          </span>
        </div>
      </section>

      <section className="location-page-grid">
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.481841992919!2d72.7340837!3d19.6920997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be71dae99c2aec1%3A0xd2a5461dd44590bb!2sOM%20VALUE%20HOMES!5e0!3m2!1sen!2sin!4v1785066658919!5m2!1sen!2sin"
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
          <a className="button button-primary" href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer">
            Open Google Maps <span aria-hidden="true">→</span>
          </a>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
