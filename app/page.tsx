"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  blogPosts,
  CALL_DISPLAY,
  CALL_NUMBER,
  ENQUIRY_LINK,
  GOOGLE_MAPS_LINK,
  properties,
  WHATSAPP_NUMBER,
} from "@/lib/site-data";

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

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);

  function bookVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello OM VALUE HOMES, I want to book a FREE Site Visit.",
      "",
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Interested in: ${form.get("home")}`,
      `Purpose: ${form.get("purpose")}`,
      `Preferred date: ${form.get("date")}`,
    ].join("\n");

    setIsOpening(true);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    window.setTimeout(() => setIsOpening(false), 1200);
  }

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Ready possession options · Palghar West</p>
          <h1>Your dream home is ready.</h1>
          <p className="hero-lead">
            Own a thoughtfully planned home at Fair Township in Palghar West —
            designed for secure, comfortable family living.
          </p>

          <div className="price-panel" aria-label="Starting price">
            <span className="price-icon" aria-hidden="true">⌂</span>
            <div>
              <span>1 BHK from</span>
              <strong>₹19.90 <small>Lakhs*</small></strong>
            </div>
          </div>

          <div className="hero-actions">
            <Link className="button button-primary" href="/#book">
              Book Your Free Site Visit
              <span aria-hidden="true">→</span>
            </Link>
            <a className="button button-secondary" href={`tel:+${CALL_NUMBER}`}>
              <span aria-hidden="true">☎</span>
              Toll Free {CALL_DISPLAY}
            </a>
          </div>

          <div className="trust-grid" aria-label="Project credentials">
            <div className="trust-card">
              <span className="trust-symbol">RERA</span>
              <p>MahaRERA<strong>P99000055618</strong></p>
            </div>
            <div className="trust-card">
              <span className="trust-symbol">₹</span>
              <p>Home Loan<strong>Available*</strong></p>
            </div>
            <div className="trust-card">
              <span className="trust-symbol">G+7</span>
              <p>Residential<strong>Township</strong></p>
            </div>
          </div>
        </div>

        <div className="hero-visual" role="img" aria-label="OM Value Homes building in Palghar West">
          <div className="image-shade" />

          <form className="booking-card" id="book" onSubmit={bookVisit}>
            <div className="booking-heading">
              <p>Free Site Visit</p>
              <span>01</span>
            </div>
            <h2>Plan your visit</h2>
            <p>Share your preference. Our property advisor will confirm your tour.</p>

            <label>
              <span>Name</span>
              <input name="name" type="text" placeholder="Your full name" autoComplete="name" required />
            </label>

            <label>
              <span>Phone</span>
              <input
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </label>

            <div className="booking-row">
              <label>
                <span>Interested in</span>
                <select name="home" defaultValue="1 BHK" required>
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                </select>
              </label>
              <label>
                <span>Purpose</span>
                <select name="purpose" defaultValue="Self use" required>
                  <option>Self use</option>
                  <option>Investment</option>
                </select>
              </label>
            </div>

            <label>
              <span>Preferred day</span>
              <input name="date" type="date" required />
            </label>

            <button type="submit">
              {isOpening ? "Opening WhatsApp…" : "Check Visit Slots"}
              <span aria-hidden="true">→</span>
            </button>
            <small>Booking enquiry opens securely in WhatsApp.</small>
          </form>

          <div className="visual-facts">
            <span><i aria-hidden="true">01</i> Ready Possession</span>
            <span><i aria-hidden="true">02</i> 1, 2 &amp; 3 BHK</span>
            <span><i aria-hidden="true">03</i> Palghar West</span>
          </div>
        </div>
      </section>

      <section className="overview-section section-shell" id="overview">
        <div className="section-label">
          <span>01</span>
          Project Overview
        </div>
        <div className="overview-grid">
          <div>
            <p className="section-kicker">Fair Township · Palghar West</p>
            <h2>A practical home. A confident decision.</h2>
          </div>
          <div className="overview-copy">
            <p>
              OM Value Homes brings comfortable 1, 2 and 3 BHK residences to a
              connected Palghar West location. Choose from ready-possession and
              under-construction options based on your family’s timeline.
            </p>
            <Link href="/homes">Explore available homes <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="project-stats">
          <article>
            <strong>G+7</strong>
            <span>Residential tower</span>
          </article>
          <article>
            <strong>1, 2 &amp; 3</strong>
            <span>BHK configurations</span>
          </article>
          <article>
            <strong>₹19.90L*</strong>
            <span>Starting price</span>
          </article>
          <article>
            <strong>Free</strong>
            <span>Guided site visit</span>
          </article>
        </div>
      </section>

      <section className="homes-section" id="homes">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <div className="section-label light">
                <span>02</span>
                Homes
              </div>
              <p className="section-kicker">Choose what fits your family</p>
              <h2>Well-planned homes at verified starting prices.</h2>
            </div>
            <p>
              Compare configurations, carpet areas and construction status,
              then watch the sample flat tour before scheduling your visit.
            </p>
          </div>

          <div className="home-grid">
            {properties.map((property) => (
              <article className="home-card" key={property.slug}>
                <div className="home-number">{property.number}</div>
                <p>{property.status}</p>
                <h3>{property.bhk}</h3>
                <div className="home-price">
                  <span>Starting from</span>
                  <strong>{property.price}</strong>
                </div>
                <div className="home-area">
                  <span>Carpet area</span>
                  <strong>{property.area}</strong>
                </div>
                <Link href={`/homes/${property.slug}`}>
                  View flat details <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="amenities-section section-shell" id="amenities">
        <div className="section-heading dark">
          <div>
            <div className="section-label">
              <span>03</span>
              Amenities
            </div>
            <p className="section-kicker">Everything closer to home</p>
            <h2>Daily comfort, safety and convenience built in.</h2>
          </div>
          <p>
            Thoughtful community features help families spend less time
            arranging the basics and more time enjoying their home.
          </p>
        </div>

        <div className="amenities-grid">
          {amenities.map(([number, title, copy]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-showcase section-shell">
        <div className="section-heading dark">
          <div>
            <div className="section-label">
              <span>04</span>
              Property Guides
            </div>
            <p className="section-kicker">Useful information for buyers</p>
            <h2>Latest Palghar homebuyer guides.</h2>
          </div>
          <p>
            Clear, practical articles about ready possession, 1 BHK comparison,
            site visits and home-loan planning.
          </p>
        </div>

        <div className="blog-card-grid">
          {blogPosts.map((post, index) => (
            <article className="blog-card" key={post.slug}>
              <span>0{index + 1} · {post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>
                Read guide <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
        <Link className="section-link" href="/blog">
          View all property guides <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="location-section" id="location">
        <div className="location-art">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3756.481841992919!2d72.7340837!3d19.6920997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be71dae99c2aec1%3A0xd2a5461dd44590bb!2sOM%20VALUE%20HOMES!5e0!3m2!1sen!2sin!4v1785066658919!5m2!1sen!2sin"
            title="OM Value Homes location on Google Maps"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="location-copy">
          <div className="section-label light">
            <span>04</span>
            Location
          </div>
          <p className="section-kicker">Connected Palghar living</p>
          <h2>Close to everyday needs. Easy to reach.</h2>
          <p>
            Fair Township is located at Satpati–Palghar Road, Dhansar,
            Palghar West, Maharashtra 401501.
          </p>
          <div className="connectivity-list">
            <div><span>01</span><p><strong>Palghar Railway Station</strong>Approximately 2.5 km from the project</p></div>
            <div><span>02</span><p><strong>Schools &amp; Colleges</strong>Educational facilities in the surrounding area</p></div>
            <div><span>03</span><p><strong>Hospitals &amp; Essentials</strong>Daily conveniences accessible nearby</p></div>
            <div><span>04</span><p><strong>Main Road Access</strong>Convenient road connectivity from the project</p></div>
          </div>
          <div className="location-actions">
            <a
              className="button button-map"
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">⌖</span>
              Open in Google Maps
            </a>
            <Link className="button button-primary" href="/#book">
              Schedule a Home Tour
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="booking-steps section-shell">
        <div className="section-label">
          <span>05</span>
          How it works
        </div>
        <div className="steps-heading">
          <h2>Your site visit, booked in three simple steps.</h2>
          <Link href="/#book">Start booking <span aria-hidden="true">→</span></Link>
        </div>
        <div className="steps-grid">
          <article><span>01</span><h3>Share your preference</h3><p>Tell us your preferred BHK, purpose and visit date.</p></article>
          <article><span>02</span><h3>Confirm on WhatsApp</h3><p>Your enquiry opens in WhatsApp for quick coordination.</p></article>
          <article><span>03</span><h3>Visit the project</h3><p>Meet our property advisor and explore the project in person.</p></article>
        </div>
      </section>

      <section className="faq-section section-shell">
        <div className="faq-intro">
          <div className="section-label">
            <span>06</span>
            FAQs
          </div>
          <p className="section-kicker">Before you book</p>
          <h2>Useful answers for homebuyers.</h2>
          <p>Need anything else? Speak directly with the OM Value Homes team.</p>
          <a href={ENQUIRY_LINK} target="_blank" rel="noreferrer">Ask on WhatsApp <span aria-hidden="true">→</span></a>
        </div>
        <div className="faq-list">
          <details>
            <summary>Is the site visit really free?<span>+</span></summary>
            <p>Yes. You can schedule a FREE guided site visit with the OM Value Homes property team.</p>
          </details>
          <details>
            <summary>Which configurations are available?<span>+</span></summary>
            <p>OM Value Homes offers 1, 2 and 3 BHK options. Current availability is confirmed during your enquiry.</p>
          </details>
          <details>
            <summary>Is home-loan assistance available?<span>+</span></summary>
            <p>Yes. Home-loan assistance is available from leading banks, subject to eligibility and document verification.</p>
          </details>
          <details>
            <summary>How do I confirm a visit?<span>+</span></summary>
            <p>Complete the booking form and continue on WhatsApp. The property advisor will confirm the date and time.</p>
          </details>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
