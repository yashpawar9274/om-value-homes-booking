"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export type FlatTour = {
  bhkKey: "1-bhk" | "2-bhk" | "3-bhk";
  title: string;
  bhkLabel: string;
  embedUrl: string;
  updatedAt: string;
};

const BHK_OPTIONS = [
  { key: "1-bhk", label: "1 BHK Sample Flat" },
  { key: "2-bhk", label: "2 BHK Sample Flat" },
  { key: "3-bhk", label: "3 BHK Sample Flat" },
] as const;

function blankTours(): FlatTour[] {
  return BHK_OPTIONS.map(({ key, label }) => ({
    bhkKey: key,
    title: `${label} Tour`,
    bhkLabel: label,
    embedUrl: "",
    updatedAt: "",
  }));
}

export default function AdminFlatTourForm() {
  const [tours, setTours] = useState<FlatTour[]>(blankTours);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/flat-tour")
      .then(async (response) => {
        const data = (await response.json()) as {
          authorized?: boolean;
          tours?: FlatTour[];
          error?: string;
        };
        if (!response.ok) throw new Error(data.error || "Admin access required.");
        setIsAuthorized(data.authorized ?? true);
        if (data.tours?.length) {
          setTours(
            blankTours().map(
              (fallback) =>
                data.tours?.find((tour) => tour.bhkKey === fallback.bhkKey) ??
                fallback,
            ),
          );
        }
      })
      .catch((error) => {
        setIsAuthorized(false);
        setMessage(
          error instanceof Error
            ? error.message
            : "Admin access could not be verified.",
        );
      });
  }, []);

  function updateTour(index: number, patch: Partial<FlatTour>) {
    setTours((current) =>
      current.map((tour, tourIndex) =>
        tourIndex === index ? { ...tour, ...patch } : tour,
      ),
    );
  }

  async function saveTours(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("Saving BHK-wise videos…");
    try {
      const response = await adminFetch("/api/admin/flat-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tours }),
      });
      const data = (await response.json()) as {
        tours?: FlatTour[];
        error?: string;
      };
      if (!response.ok || !data.tours) {
        throw new Error(data.error || "Video links could not be saved.");
      }
      setTours(data.tours);
      setMessage("All flat videos are live on their matching property pages.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Video links could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isAuthorized === null) {
    return (
      <section className="admin-card admin-loading">
        <span />
        <strong>Checking admin access…</strong>
      </section>
    );
  }

  if (!isAuthorized) {
    return (
      <section className="admin-denied admin-card">
        <h2>Admin access required</h2>
        <p>{message || "Please sign in again with the approved admin account."}</p>
      </section>
    );
  }

  return (
    <form className="admin-card admin-form admin-video-manager" onSubmit={saveTours}>
      <div className="admin-card-heading">
        <span>01</span>
        <div>
          <p>Flat Video Manager</p>
          <h2>Set a separate video for every flat type</h2>
        </div>
      </div>
      <p className="admin-form-note">
        Paste a normal YouTube link, Shorts link, youtu.be link, YouTube embed URL,
        or the complete iframe embed code. The website will convert it automatically.
      </p>

      <div className="admin-tour-list">
        {tours.map((tour, index) => (
          <section className="admin-tour-editor" key={tour.bhkKey}>
            <strong>{tour.bhkLabel}</strong>
            <label>
              <span>Video title</span>
              <input
                value={tour.title}
                onChange={(event) => updateTour(index, { title: event.target.value })}
                maxLength={80}
                required
              />
            </label>
            <label>
              <span>YouTube link or iframe embed code</span>
              <textarea
                value={tour.embedUrl}
                onChange={(event) =>
                  updateTour(index, { embedUrl: event.target.value })
                }
                rows={4}
                placeholder="https://youtu.be/... or <iframe src=&quot;https://www.youtube.com/embed/...&quot; ...></iframe>"
              />
            </label>
          </section>
        ))}
      </div>
      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving…" : "Save All Flat Videos"}
      </button>
      {message && <p className="admin-message" aria-live="polite">{message}</p>}
    </form>
  );
}
