import type { Metadata } from "next";
import Link from "next/link";
import FlatTourPlayer from "@/components/FlatTourPlayer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Sample Flat Tour | OM Value Homes Palghar West",
  description:
    "Watch the OM Value Homes sample flat tour in vertical or landscape format, explore 1, 2 and 3 BHK details and book a free Palghar West site visit.",
  alternates: { canonical: "/flat-tour" },
};

export default function FlatTourPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero video-page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><strong>Flat Tour</strong>
          </nav>
          <p>OM Value Homes · Sample Flat</p>
          <h1>See the space before your visit.</h1>
          <span>
            The player automatically displays landscape videos wide and
            vertical videos in a comfortable portrait frame.
          </span>
        </div>
      </section>

      <section className="flat-tour-page page-section">
        <div className="flat-tour-stage">
          <FlatTourPlayer />
        </div>
        <aside>
          <p className="section-kicker">What to notice</p>
          <h2>Use the video to prepare your questions.</h2>
          <ul className="highlight-list">
            <li>Room proportions and possible furniture placement</li>
            <li>Natural light, windows and ventilation</li>
            <li>Kitchen and bathroom layout</li>
            <li>Passage space, doors and storage possibilities</li>
            <li>Features to verify during the physical visit</li>
          </ul>
          <Link className="button button-primary" href="/homes">
            Explore Flat Details <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
