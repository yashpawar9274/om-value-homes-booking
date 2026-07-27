"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContentAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    let refreshTimer: number | null = null;

    try {
      const supabase = createClient();
      const refresh = () => {
        if (refreshTimer) window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => {
          window.dispatchEvent(new Event("om-content-updated"));
          router.refresh();
        }, 250);
      };

      const channel = supabase
        .channel("om-public-content")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "blog_posts" },
          refresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "founder_profiles" },
          refresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "founder_projects" },
          refresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "customer_stories" },
          refresh,
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "flat_tours" },
          refresh,
        )
        .subscribe();

      return () => {
        if (refreshTimer) window.clearTimeout(refreshTimer);
        void supabase.removeChannel(channel);
      };
    } catch {
      // The static website remains usable before Supabase keys are configured.
      return;
    }
  }, [router]);

  return null;
}
