// actions/get-reviews.ts
"use server";

import { Review } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/products/[productId]/reviews/route"; // Dynamic [productId]
import { cache } from "react";

export async function getReviews(productId: string): Promise<Review[]> {
  const url = new URL("http://localhost");
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "100");

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request, { params: { productId: productId } });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const data: Review[] = await response.json();

  // Tag for revalidation (e.g., on review add)
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `reviews-product-${productId}`);

  return data;
}
