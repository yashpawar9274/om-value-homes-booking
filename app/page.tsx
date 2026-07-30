import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  fallbackAmenities,
  fallbackFaqs,
  fallbackManagedBlogs,
  fallbackManagedHomes,
  fallbackSiteSettings,
} from "@/lib/content-store";
import {
  fetchManagedAmenities,
  fetchManagedBlogs,
  fetchManagedFaqs,
  fetchManagedHomes,
  fetchSiteSettings,
} from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, homes, amenities, faqs, blogs] = await Promise.all([
    fetchSiteSettings().catch(() => fallbackSiteSettings),
    fetchManagedHomes().catch(fallbackManagedHomes),
    fetchManagedAmenities().catch(() => fallbackAmenities),
    fetchManagedFaqs().catch(() => fallbackFaqs),
    fetchManagedBlogs().catch(fallbackManagedBlogs),
  ]);
  const enquiryLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hello OM VALUE HOMES, I want to know more about your Palghar West homes.",
  )}`;

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1>{settings.heroTitle}</h1>
          <p className="hero-lead">{settings.heroLead}</p>

          <div className="price-panel" aria-label="Starting price">
            <span className="price-icon" aria-hidden="true">⌂</span>
            <div>
              <span>{settings.priceLabel}</span>
              <strong>{settings.priceValue}</strong>
            </div>
          </div>

          <div className="hero-actions">
            <Link className="button button-primary" href="/#book">
              Book Your Free Site Visit <span aria-hidden="true">→</span>
            </Link>
            <a className="button button-secondary" href={`tel:+${settings.callNumber}`}>
              <span aria-hidden="true">☎</span>
              Toll Free {settings.callDisplay}
            </a>
          </div>

          <div className="trust-grid" aria-label="Project credentials">
            <div className="trust-card"><span className="trust-symbol">RERA</span><p>MahaRERA<strong>{settings.reraNumber}</strong></p></div>
            <div className="trust-card"><span className="trust-symbol">₹</span><p>Home Loan<strong>Available*</strong></p></div>
            <div className="trust-card"><span className="trust-symbol">G+7</span><p>Residential<strong>Township</strong></p></div>
          </div>
        </div>

        <div className="hero-visual" role="img" aria-label="OM Value Homes building in Palghar West">
          <div className="image-shade" />
          <BookingForm whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>

      <section className="project-intro section-shell">
        <div className="section-label"><span>01</span>Project Overview</div>
        <div className="project-intro-grid">
          <div><p className="section-kicker">{settings.projectKicker}</p><h2>{settings.projectTitle}</h2></div>
          <p>{settings.projectDescription}</p>
        </div>
        <div className="project-stats">
          <article><strong>G+7</strong><span>Residential tower</span></article>
          <article><strong>1, 2 &amp; 3</strong><span>BHK configurations</span></article>
          <article><strong>{settings.priceValue}</strong><span>Starting price</span></article>
          <article><strong>Free</strong><span>Guided site visit</span></article>
        </div>
      </section>

      <section className="homes-section" id="homes">
        <div className="section-shell">
          <div className="section-heading">
            <div><div className="section-label light"><span>02</span>Homes</div><p className="section-kicker">Choose what fits your family</p><h2>{settings.homesTitle}</h2></div>
            <p>{settings.homesDescription}</p>
          </div>
          <div className="home-grid">
            {homes.map((home) => (
              <article className="home-card" key={home.slug}>
                <div className="home-number">{home.number}</div>
                <p>{home.status}</p>
                <h3>{home.bhk}</h3>
                <div className="home-price"><span>Starting from</span><strong>{home.price}</strong></div>
                <div className="home-area"><span>Carpet area</span><strong>{home.area}</strong></div>
                <Link href={`/homes/${home.slug}`}>View details &amp; video <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="amenities-section section-shell" id="amenities">
        <div className="section-heading dark">
          <div><div className="section-label"><span>03</span>Amenities</div><p className="section-kicker">Everything closer to home</p><h2>{settings.amenitiesTitle}</h2></div>
          <p>{settings.amenitiesDescription}</p>
        </div>
        <div className="amenities-grid">
          {amenities.map((amenity, index) => (
            <article key={amenity.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{amenity.title}</h3><p>{amenity.description}</p></article>
          ))}
        </div>
      </section>

      <section className="content-showcase section-shell">
        <div className="section-heading dark">
          <div><div className="section-label"><span>04</span>Property Guides</div><p className="section-kicker">Useful information for buyers</p><h2>{settings.blogsTitle}</h2></div>
          <p>{settings.blogsDescription}</p>
        </div>
        <div className="blog-card-grid">
          {blogs.slice(0, 3).map((post, index) => (
            <article className="blog-card" key={post.slug}>
              <span>{String(index + 1).padStart(2, "0")} · {post.category}</span>
              <h3>{post.title}</h3><p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>Read guide <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
        <Link className="section-link" href="/blog">View all property guides <span aria-hidden="true">→</span></Link>
      </section>

      <section className="location-section" id="location">
        <div className="location-art">
          <iframe src={settings.mapEmbedUrl} title="OM Value Homes location on Google Maps" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
        <div className="location-copy">
          <div className="section-label light"><span>05</span>Location</div>
          <p className="section-kicker">Connected Palghar living</p>
          <h2>{settings.locationTitle}</h2><p>{settings.locationDescription}</p>
          <div className="connectivity-list">
            <div><span>01</span><p><strong>Palghar Railway Station</strong>Approximately 2.5 km from the project</p></div>
            <div><span>02</span><p><strong>Schools &amp; Colleges</strong>Educational facilities in the surrounding area</p></div>
            <div><span>03</span><p><strong>Hospitals &amp; Essentials</strong>Daily conveniences accessible nearby</p></div>
            <div><span>04</span><p><strong>Main Road Access</strong>Convenient road connectivity from the project</p></div>
          </div>
          <div className="location-actions">
            <a className="button button-map" href={settings.googleMapsLink} target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span>Open in Google Maps</a>
            <Link className="button button-primary" href="/#book">Schedule a Home Tour <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="booking-steps section-shell">
        <div className="section-label"><span>06</span>How it works</div>
        <div className="steps-heading"><h2>Your site visit, booked in three simple steps.</h2><Link href="/#book">Start booking <span aria-hidden="true">→</span></Link></div>
        <div className="steps-grid">
          <article><span>01</span><h3>Share your preference</h3><p>Tell us your preferred BHK, purpose and visit date.</p></article>
          <article><span>02</span><h3>Confirm on WhatsApp</h3><p>Your enquiry opens in WhatsApp for quick coordination.</p></article>
          <article><span>03</span><h3>Visit the project</h3><p>Meet our property advisor and explore the project in person.</p></article>
        </div>
      </section>

      <section className="faq-section section-shell">
        <div className="faq-intro">
          <div className="section-label"><span>07</span>FAQs</div>
          <p className="section-kicker">Before you book</p><h2>Useful answers for homebuyers.</h2>
          <p>Need anything else? Speak directly with the OM Value Homes team.</p>
          <a href={enquiryLink} target="_blank" rel="noreferrer">Ask on WhatsApp <span aria-hidden="true">→</span></a>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => <details key={faq.id}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
