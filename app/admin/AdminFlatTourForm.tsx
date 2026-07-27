"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Tour = {
  title: string;
  bhkLabel: string;
  fileName: string;
  fileSize: number;
  updatedAt: string;
  videoUrl: string;
};

export default function AdminFlatTourForm() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [title, setTitle] = useState("Sample Flat Tour");
  const [bhkLabel, setBhkLabel] = useState("1 BHK Sample Flat");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/flat-tour", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 403) {
          return { authorized: false, tour: null };
        }
        return response.json() as Promise<{ authorized: boolean; tour: Tour | null }>;
      })
      .then((data) => {
        setIsAuthorized(data.authorized);
        setTour(data.tour);
        if (data.tour) {
          setTitle(data.tour.title);
          setBhkLabel(data.tour.bhkLabel);
        }
      })
      .catch(() => {
        setIsAuthorized(false);
        setMessage("Admin access could not be verified.");
      });
  }, []);

  async function uploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("video");

    if (!(file instanceof File) || !file.size) {
      setMessage("Please select a flat tour video.");
      return;
    }

    setIsSaving(true);
    setMessage("Uploading video…");

    try {
      if (!file.type.startsWith("video/")) {
        throw new Error("Please select a valid video file.");
      }
      const extension =
        file.name
          .split(".")
          .pop()
          ?.replace(/[^a-z0-9]/gi, "")
          .toLowerCase() || "mp4";
      const videoPath = `tours/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await createClient()
        .storage.from("flat-tours")
        .upload(videoPath, file, {
          cacheControl: "3600",
          contentType: file.type || "video/mp4",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const response = await fetch("/api/admin/flat-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          bhkLabel,
          videoPath,
          fileName: file.name,
          contentType: file.type || "video/mp4",
          fileSize: file.size,
        }),
      });
      const data = (await response.json()) as { tour?: Tour; error?: string };
      if (!response.ok || !data.tour) {
        throw new Error(data.error || "Upload failed.");
      }

      setTour(data.tour);
      formElement.reset();
      setMessage("Flat tour video is now live on its dedicated page and property details.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeVideo() {
    if (!window.confirm("Remove the current flat tour video from the website?")) {
      return;
    }

    setIsSaving(true);
    setMessage("Removing video…");
    try {
      const response = await fetch("/api/admin/flat-tour", { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Remove failed.");
      }
      setTour(null);
      setMessage("Flat tour video has been removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Remove failed.");
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
        <p>This account does not have permission to manage flat tour videos.</p>
      </section>
    );
  }

  return (
    <div className="admin-grid">
      <form className="admin-card admin-form" onSubmit={uploadVideo}>
        <div className="admin-card-heading">
          <span>01</span>
          <div>
            <p>Flat Tour Manager</p>
            <h2>Add or replace video</h2>
          </div>
        </div>

        <label>
          <span>Video title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={80}
            required
          />
        </label>

        <label>
          <span>Flat type</span>
          <select
            value={bhkLabel}
            onChange={(event) => setBhkLabel(event.target.value)}
            required
          >
            <option>1 BHK Sample Flat</option>
            <option>2 BHK Sample Flat</option>
            <option>3 BHK Sample Flat</option>
            <option>Project Walkthrough</option>
          </select>
        </label>

        <label>
          <span>Select video</span>
          <input name="video" type="file" accept="video/*" required />
          <small>Upload MP4, WebM or another browser-supported video format.</small>
        </label>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Please wait…" : tour ? "Replace Flat Tour" : "Publish Flat Tour"}
        </button>
        {message && <p className="admin-message" aria-live="polite">{message}</p>}
      </form>

      <section className="admin-card admin-preview">
        <div className="admin-card-heading">
          <span>02</span>
          <div>
            <p>Website Preview</p>
            <h2>Current flat tour</h2>
          </div>
        </div>

        {tour ? (
          <>
            <div className={`admin-video-stage ${orientation}`}>
              <video
                key={tour.updatedAt}
                controls
                preload="metadata"
                src={`${tour.videoUrl}?v=${encodeURIComponent(tour.updatedAt)}`}
                onLoadedMetadata={(event) => {
                  const video = event.currentTarget;
                  setOrientation(
                    video.videoHeight > video.videoWidth
                      ? "portrait"
                      : "landscape",
                  );
                }}
              />
            </div>
            <div className="admin-video-meta">
              <strong>{tour.title}</strong>
              <span>{tour.bhkLabel}</span>
              <small>{tour.fileName} · {(tour.fileSize / 1024 / 1024).toFixed(1)} MB</small>
            </div>
            <button
              className="admin-remove"
              type="button"
              onClick={removeVideo}
              disabled={isSaving}
            >
              Remove Current Video
            </button>
          </>
        ) : (
          <div className="admin-empty">
            <span aria-hidden="true">▶</span>
            <strong>No flat tour uploaded</strong>
            <p>Your uploaded video will appear here, on Flat Tour and property detail pages.</p>
          </div>
        )}
      </section>
    </div>
  );
}
