// actions/get-products-home.ts (or your file)
"use server";

import { Product } from "@/types";
import { unstable_cache } from "next/cache";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

interface Query {
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: string;
  page?: string;
  type?: "MEN" | "WOMEN" | "KIDS" | "BEAUTY" | "ELECTRONICS";
  price?: string;
  variantIds?: string;
  pincode?: number;
  rating?: string;
  discount?: string;
  selectFields?: string[];
  // ... other params
}


const buildQueryString = (query: Query): string => {
  const params = new URLSearchParams();
  if (query.categoryId) params.set('categoryId', query.categoryId);
  // ... add other params like subCategoryId, limit, etc.
  return params.toString() ? `?${params.toString()}` : '';
};

export const getProductsHome = unstable_cache(
  async (query: Query = {}): Promise<{ products: Product[]; totalCount: number }> => {
    // Build absolute URL with env fallback (no SSL issues)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.electrax.in'); // Replace 'your-app' with your actual Vercel project name
    const queryString = buildQueryString(query);
    const apiUrl = `${baseUrl}/api/admin/${STORE_ID}/products${queryString}`;

    const response = await fetch(apiUrl, {
      // FIXED: Only revalidate—no cache: 'force-cache'
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.error(`getProductsHome error: ${response.status} ${await response.text()}`);
      return { products: [], totalCount: 0 };
    }

    const data = await response.json(); // Direct json()—safer than text() + parse

    return {
      products: data.products || [],
      totalCount: data.totalCount || 0,
    };
  },
   ["products"], // Static cache key (use tags for dynamic revalidation)
  { 
    revalidate: 600, 
    tags: ["products"] 
  } 

);