"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Tour = {
  title: string;
  bhkLabel: string;
  source: "storage" | "youtube";
  videoUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  updatedAt: string;
};

export default function AdminFlatTourForm() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [title, setTitle] = useState("Sample Flat Tour");
  const [bhkLabel, setBhkLabel] = useState("1 BHK");
  const [source, setSource] = useState<"storage" | "youtube">("storage");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const query = bhkLabel
      ? `?bhkLabel=${encodeURIComponent(bhkLabel)}`
      : "";

    fetch(`/api/admin/flat-tour${query}`, { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 403) {
          return { authorized: false, tours: [], tour: null };
        }
        return response.json() as Promise<{
          authorized: boolean;
          tours: Tour[];
          tour: Tour | null;
        }>;
      })
      .then((data) => {
        setIsAuthorized(data.authorized);
        setTour(data.tour);
        if (data.tour) {
          setTitle(data.tour.title);
          setBhkLabel(data.tour.bhkLabel);
          setSource(data.tour.source ?? "storage");
          setYoutubeInput(
            data.tour.source === "youtube"
              ? data.tour.videoUrl || ""
              : "",
          );
        } else {
          setTitle(`${bhkLabel} Flat Tour`);
          setSource("youtube");
          setYoutubeInput("");
        }
      })
      .catch(() => {
        setIsAuthorized(false);
        setMessage("Admin access could not be verified.");
      });
  }, [bhkLabel]);

  async function uploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("video");
    const trimmedYoutubeInput = youtubeInput.trim();

    setIsSaving(true);
    setMessage(source === "storage" ? "Uploading video…" : "Saving embed source…");

    try {
      let payload: Record<string, unknown> = {
        title,
        bhkLabel,
        source,
      };

      if (source === "storage") {
        if (!(file instanceof File) || !file.size) {
          throw new Error("Please select a flat tour video.");
        }
        if (!file.type.startsWith("video/")) {
          throw new Error("Please select a valid video file.");
        }
        if (file.size > 500 * 1024 * 1024) {
          throw new Error("Video must be smaller than 500 MB.");
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
        payload = {
          ...payload,
          videoPath,
          fileName: file.name,
          contentType: file.type || "video/mp4",
          fileSize: file.size,
        };
      } else {
        payload = {
          ...payload,
          youtubeInput: trimmedYoutubeInput,
        };
      }

      const response = await fetch("/api/admin/flat-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { tour?: Tour; error?: string };
      if (!response.ok || !data.tour) {
        throw new Error(data.error || "Upload failed.");
      }

      setTour(data.tour);
      formElement.reset();
      if (data.tour.source === "youtube") {
        setYoutubeInput(trimmedYoutubeInput);
      }
      setMessage(
        data.tour.source === "storage"
          ? "Flat tour video is now live on its dedicated page and property details."
          : "Flat tour embed source is now live on its dedicated page and property details.",
      );
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
      const response = await fetch(
        `/api/admin/flat-tour?bhkLabel=${encodeURIComponent(bhkLabel)}`,
        { method: "DELETE" },
      );
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
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
            <option>Project Walkthrough</option>
          </select>
        </label>

        <label>
          <span>Source</span>
          <select
            value={source}
            onChange={(event) => setSource(event.target.value as "storage" | "youtube")}
            required
          >
            <option value="storage">Upload video file</option>
            <option value="youtube">YouTube / embed source</option>
          </select>
        </label>

        {source === "storage" ? (
          <label>
            <span>Select video</span>
            <input name="video" type="file" accept="video/*" required />
            <small>Upload MP4, WebM or another browser-supported video format.</small>
          </label>
        ) : (
          <label>
            <span>YouTube or embed code</span>
            <textarea
              value={youtubeInput}
              onChange={(event) => setYoutubeInput(event.target.value)}
              placeholder="Paste a YouTube link or embed HTML here"
              rows={4}
              required
            />
            <small>Enter a YouTube link, shorts URL, or iframe embed snippet.</small>
          </label>
        )}

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
              {tour.source === "storage" ? (
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
              ) : (
                <iframe
                  title={tour.title}
                  src={tour.videoUrl || undefined}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
            <div className="admin-video-meta">
              <strong>{tour.title}</strong>
              <span>{tour.bhkLabel}</span>
              {tour.source === "storage" && tour.fileName ? (
                <small>{tour.fileName} · {((tour.fileSize ?? 0) / 1024 / 1024).toFixed(1)} MB</small>
              ) : tour.source === "youtube" ? (
                <small>YouTube / embed source</small>
              ) : null}
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
