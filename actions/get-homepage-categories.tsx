// actions/get-homepage-categories.ts
"use server"

import { HomepageCategory } from "@/types";
import { headers } from "next/headers"; // For building absolute URL
import { unstable_cache } from "next/cache"; // Server-side caching (replaces React's cache)
import { GET } from "@/app/api/admin/[storeId]/homepage-categories/route";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

// For the list (unchanged, assuming used in server components)
export const getHomepageCategory = unstable_cache(
  async (): Promise<HomepageCategory[]> => {
    // ... your existing code (direct call works here since server-only)
    const url = new URL("http://localhost");
    const request = new Request(url.toString(), { method: "GET" });
    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      throw new Error("Homepage categories not found");
    }

    const data = await response.json();

    // Tag for revalidation
    response.headers?.set?.("x-next-cache-tags", `homepage-categories-all`);

    return data;
  },
  ["homepage-categories-all"], // Cache key
  { revalidate: 600, tags: ["homepage-categories-all"] } // 10 min, with tags
);
; // ← CRITICAL: Makes this a server action (runs on server only)

// For by ID: Use fetch to API route (avoids bundling)
export const getHomepageCategoryById = unstable_cache(
  async (id: string): Promise<HomepageCategory> => {
    // Build absolute URL for server-side fetch (avoids relative URL parse error)
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const apiUrl = `${baseUrl}/api/admin/${STORE_ID}/homepage-categories/${id}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 600 }, // ISR caching
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch homepage category: ${response.status}`);
    }

    const data = await response.json();

    // For revalidation: Return a tag (call revalidateTag in mutations)
    // Note: Can't set headers on fetch response; use unstable_cache tags instead
    return data;
  },
  ["homepage-category"], // Static cache key
  { revalidate: 600, tags: ["homepage-category"] } // Static tags
);
