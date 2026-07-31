import Link from "next/link";
import Image from "next/image";
import {
  CALL_DISPLAY,
  CALL_NUMBER,
  ENQUIRY_LINK,
  GOOGLE_MAPS_LINK,
  WHATSAPP_DISPLAY,
} from "@/lib/site-data";

export default function SiteFooter() {
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
          <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer">
            Fair Township, Satpati–Palghar Road, Dhansar, Palghar West,
            Maharashtra 401501.
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
          <span>MahaRERA: P99000055618</span>
          <a href={`tel:+${CALL_NUMBER}`}>Toll Free Call: {CALL_DISPLAY}</a>
          <a href={ENQUIRY_LINK} target="_blank" rel="noreferrer">
            WhatsApp Chat: {WHATSAPP_DISPLAY}
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
        href={ENQUIRY_LINK}
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
