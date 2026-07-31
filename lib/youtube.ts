const YOUTUBE_ID = /^[a-zA-Z0-9_-]{6,20}$/;

function extractIframeSource(value: string) {
  const match = value.match(
    /<iframe\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')[^>]*>/i,
  );
  return (match?.[1] || match?.[2] || "").replaceAll("&amp;", "&");
}

export function normalizeYoutubeUrl(input: string) {
  const value = input.trim();
  if (!value) return null;

  const candidate = value.includes("<")
    ? extractIframeSource(value)
    : value.replaceAll("&amp;", "&");
  if (!candidate) {
    throw new Error("Paste a valid YouTube link or iframe embed code.");
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Paste a valid YouTube link or iframe embed code.");
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  let videoId = "";

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v") || "";
    } else {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0] || "")) {
        videoId = parts[1] || "";
      }
    }
  }

  if (!YOUTUBE_ID.test(videoId)) {
    throw new Error("Only a valid YouTube video link or embed code is allowed.");
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function isSafeYoutubeEmbed(value: string | null | undefined) {
  if (!value) return false;
  try {
    return normalizeYoutubeUrl(value) === value;
  } catch {
    return false;
  }
}
