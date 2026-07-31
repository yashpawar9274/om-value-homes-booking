"use client";

import { useEffect, useState } from "react";
import type { ManagedFlatTour } from "@/lib/content-store";

export default function FlatTourPlayer({
  bhkKey,
  compact = false,
}: {
  bhkKey?: "1-bhk" | "2-bhk" | "3-bhk";
  compact?: boolean;
}) {
  const [tour, setTour] = useState<ManagedFlatTour | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const query = bhkKey ? `?bhk=${encodeURIComponent(bhkKey)}` : "";
    fetch(`/api/flat-tour${query}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { tour: ManagedFlatTour | null; tours?: ManagedFlatTour[] }) => {
        if (!isActive) return;
        setTour(data.tour ?? data.tours?.find((item) => item.embedUrl) ?? null);
      })
      .catch(() => isActive && setTour(null))
      .finally(() => isActive && setIsLoading(false));
    return () => {
      isActive = false;
    };
  }, [bhkKey]);

  if (isLoading) {
    return (
      <div className={`tour-placeholder ${compact ? "compact" : ""}`}>
        <span className="tour-loader" aria-hidden="true" />
        <strong>Loading flat tour…</strong>
      </div>
    );
  }
  if (!tour?.embedUrl) {
    return (
      <div className={`tour-placeholder ${compact ? "compact" : ""}`}>
        <span aria-hidden="true">▶</span>
        <strong>Video coming soon</strong>
        <small>You can still book a guided sample-flat visit.</small>
      </div>
    );
  }
  return (
    <div className={`responsive-tour landscape ${compact ? "compact" : ""}`}>
      <div className="video-stage">
        <iframe
          key={`${tour.bhkKey}-${tour.updatedAt}`}
          src={tour.embedUrl}
          title={tour.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <div className="responsive-tour-meta">
        <strong>{tour.title}</strong>
        <span>{tour.bhkLabel}</span>
      </div>
    </div>
  );
}
