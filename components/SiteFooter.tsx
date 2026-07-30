import Link from "next/link";
import Image from "next/image";
import type { ManagedSiteSettings } from "@/lib/content-store";
import { fallbackSiteSettings } from "@/lib/content-store";
import { fetchSiteSettings } from "@/lib/public-content";

export default async function SiteFooter({
  settings: suppliedSettings,
}: {
  settings?: ManagedSiteSettings;
} = {}) {
  const settings =
    suppliedSettings ??
    (await fetchSiteSettings().catch(() => fallbackSiteSettings));
  const enquiryLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hello OM VALUE HOMES, I want to know more about your Palghar West homes.",
  )}`;

  return (
    <>
      <footer>
        <Link className="brand footer-brand" href="/" aria-label="OM Value Homes home">
          <Image
            className="footer-logo"
            src="/om-value-homes-logo.jpeg"
            alt="OM Value Homes — Dream Home at Dream Price"
            width={831}
            height={206}
          />
        </Link>
        <p>
          <a href={settings.googleMapsLink} target="_blank" rel="noreferrer">
            {settings.address}.
          </a>
        </p>
        <div className="footer-links" aria-label="Footer navigation">
          <Link href="/homes">Homes</Link>
          <Link href="/flat-tour">Flat Tour</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/founder">Founder</Link>
          <Link href="/happy-customers">Happy Customers</Link>
          <Link href="/amenities">Amenities</Link>
          <Link href="/location">Location</Link>
        </div>
        <div className="footer-meta">
          <span>MahaRERA: {settings.reraNumber}</span>
          <a href={`tel:+${settings.callNumber}`}>Toll Free Call: {settings.callDisplay}</a>
          <a href={enquiryLink} target="_blank" rel="noreferrer">
            WhatsApp Chat: {settings.whatsappDisplay}
          </a>
          <Link href="/admin">Admin · Content</Link>
        </div>
        <small>
          *Prices are starting prices and are subject to current availability
          and applicable charges. Images are for project presentation; verify
          current details during your site visit.
        </small>
      </footer>

      <a
        className="whatsapp-float"
        href={enquiryLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with OM Value Homes on WhatsApp"
      >
        <span>WA</span>
        Enquire
      </a>
    </>
  );
}
