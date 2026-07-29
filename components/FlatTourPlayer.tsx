"use client";

import { useEffect, useState } from "react";

type FlatTour = {
  title: string;
  bhkLabel: string;
  source: "storage" | "youtube";
  videoUrl: string | null;
  embedHtml: string | null;
  fileName: string | null;
  fileSize: number | null;
  updatedAt: string;
};

export default function FlatTourPlayer({
  compact = false,
  bhkLabel,
}: {
  compact?: boolean;
  bhkLabel?: string;
}) {
  const [tour, setTour] = useState<FlatTour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape",
  );

  useEffect(() => {
    let isActive = true;

    function loadTour() {
      const query = bhkLabel
        ? `?bhkLabel=${encodeURIComponent(bhkLabel)}`
        : "";

      fetch(`/api/flat-tour${query}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data: { tour: FlatTour | null }) => {
          if (isActive) setTour(data.tour);
        })
        .catch(() => {
          if (isActive) setTour(null);
        })
        .finally(() => {
          if (isActive) setIsLoading(false);
        });
    }

    loadTour();
    window.addEventListener("om-content-updated", loadTour);
    return () => {
      isActive = false;
      window.removeEventListener("om-content-updated", loadTour);
    };
  }, [bhkLabel]);

  if (isLoading) {
    return (
      <div className={`tour-placeholder ${compact ? "compact" : ""}`}>
        <span className="tour-loader" aria-hidden="true" />
        <strong>Loading flat tour…</strong>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className={`tour-placeholder ${compact ? "compact" : ""}`}>
        <span aria-hidden="true">▶</span>
        <strong>Video coming soon</strong>
        <small>You can still book a guided sample-flat visit.</small>
      </div>
    );
  }

  return (
    <div
      className={`responsive-tour ${orientation} ${compact ? "compact" : ""}`}
    >
      <div className="video-stage">
        {tour.source === "storage" ? (
          <video
            key={tour.updatedAt}
            controls
            playsInline
            preload="metadata"
            src={`${tour.videoUrl}?v=${encodeURIComponent(tour.updatedAt)}`}
            aria-label={tour.title}
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;
              setOrientation(
                video.videoHeight > video.videoWidth ? "portrait" : "landscape",
              );
            }}
          />
        ) : tour.embedHtml ? (
          <div className="embed-player" dangerouslySetInnerHTML={{ __html: tour.embedHtml }} />
        ) : (
          <iframe
            title={tour.title}
            src={tour.videoUrl || undefined}
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
      <div className="responsive-tour-meta">
        <strong>{tour.title}</strong>
        <span>{tour.bhkLabel}</span>
      </div>
    </div>
  );
}
