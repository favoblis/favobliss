"use server";

import { Review } from "@/types";

const URL = process.env.NEXT_PUBLIC_STORE_URL;
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

export async function getReviews(productId: string): Promise<Review[]> {
  try {
    const res = await fetch(
      `${URL}/api/admin/${STORE_ID}/products/${productId}/reviews?page=1&limit=100`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const data: Review[] = await res.json();
    return data;
  } catch (error) {
    console.error("[GET_REVIEWS_ACTION]", error);
    throw error;
  }
}
