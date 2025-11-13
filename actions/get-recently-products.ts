// actions/get-product.ts (or wherever getRecentlyViewedProducts lives)
"use server";

import { Product } from "@/types";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getRecentlyViewedProducts = unstable_cache(
  async (productIds: string[], locationId?: string): Promise<Product[]> => {
    // Build absolute internal URL for POSTn
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const apiUrl = `${baseUrl}/api/admin/${STORE_ID}/products/recently-viewed`;

    const body = JSON.stringify({ productIds, locationId });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      next: { revalidate: 600 }, 
    });

    if (!response.ok) {
      console.error(`getRecentlyViewedProducts error: ${response.status} ${response.statusText}`);
      throw new Error("Failed to fetch recently viewed products");
    }

    const data = await response.json();

    // For revalidation: Use cache tags via unstable_cache (optional for viewed)
    const sortedIds = productIds.sort().join("-");
    const tag = `recently-viewed-${sortedIds}`;

    return data || [];
  },
  [`recently-viewed`], // Static key
  { 
    revalidate: 600, 
    tags: [`recently-viewed`] // Static tag for cache invalidation
  }
);