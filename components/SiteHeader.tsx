"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  ["Home", "/"],
  ["Blog", "/blog"],
  ["Founder", "/founder"],
  ["Customers", "/happy-customers"],
];

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="OM Value Homes home">
        <Image
          className="brand-logo"
          src="/om-value-homes-logo.jpeg"
          alt="OM Value Homes — Dream Home at Dream Price"
          width={831}
          height={206}
          priority
        />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
        <b>Menu</b>
      </button>

      <nav
        id="primary-navigation"
        className={isOpen ? "is-open" : ""}
        aria-label="Primary navigation"
      >
        {navigation.map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setIsOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>

      <Link className="header-cta" href="/#book">
        <span aria-hidden="true">◷</span>
        Book Free Site Visit
      </Link>
    </header>
  );
}
