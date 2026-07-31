import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fetchManagedCustomers } from "@/lib/public-content";
import { customerStories as fallbackStories } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Happy Customers | OM Value Homes Booking Stories",
  description:
    "View verified OM Value Homes customer booking and handover moments shared with permission at Fair Township, Palghar West.",
  alternates: { canonical: "/happy-customers" },
};

export default async function HappyCustomersPage() {
  const managedCustomers = await fetchManagedCustomers().catch(() => []);
  const customers =
    managedCustomers.length > 0
      ? managedCustomers
      : fallbackStories.map((story, index) => ({
          id: index + 1,
          name: "OM Value Homes Customer",
          title: story.title,
          story: story.detail,
          orientation: story.orientation as "portrait" | "landscape",
          sortOrder: index + 1,
          updatedAt: "",
          imageUrl: null,
        }));

  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><strong>Happy Customers</strong>
          </nav>
          <p>Booking &amp; Handover Stories</p>
          <h1>Real homebuyer moments, shared responsibly.</h1>
          <span>
            Customer cards support small landscape and vertical photographs.
            Photos and names will appear only after approval and consent.
          </span>
        </div>
      </section>

      <section className="customer-gallery page-section">
        <div className="customer-gallery-grid">
          {customers.map((story, index) => (
            <article className={`customer-story-card ${story.orientation}`} key={story.id}>
              <div className="customer-story-photo">
                {story.imageUrl ? (
                  <Image
                    src={story.imageUrl}
                    alt={`${story.name} — ${story.title}`}
                    width={900}
                    height={story.orientation === "portrait" ? 1200 : 675}
                    unoptimized
                  />
                ) : (
                  <>
                    <span>{story.orientation === "portrait" ? "Vertical" : "Landscape"} photo</span>
                    <small>Add approved photo from admin</small>
                  </>
                )}
              </div>
              <div>
                <span>Customer Story {String(index + 1).padStart(2, "0")}</span>
                <h2>{story.title}</h2>
                <strong>{story.name}</strong>
                <p>{story.story}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="consent-note">
          <strong>Privacy note</strong>
          <p>
            Customer identity, photograph and testimonial should be published
            only after written permission. Placeholder cards prevent unverified
            or fabricated testimonials from appearing on the website.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
