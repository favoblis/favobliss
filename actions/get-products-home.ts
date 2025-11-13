// actions/get-products.ts (for lists, hot deals)
"use server";

import { Product } from "@/types";
import { headers } from "next/headers";
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
}


// Build query string helper
const buildQueryString = (query: Query): string => {
  const params: Record<string, string> = {};
  if (query.colorId) params.colorId = query.colorId;
  if (query.sizeId) params.sizeId = query.sizeId;
  if (query.categoryId) params.categoryId = query.categoryId;
  if (query.brandId) params.brandId = query.brandId;
  if (query.isFeatured !== undefined) params.isFeatured = query.isFeatured.toString();
  if (query.limit) params.limit = query.limit;
  if (query.type) params.type = query.type;
  if (query.price) params.price = query.price;
  if (query.page) params.page = query.page;
  if (query.variantIds) params.variantIds = query.variantIds;
  if (query.pincode) params.pincode = query.pincode.toString();
  if (query.subCategoryId) params.subCategoryId = query.subCategoryId;
  if (query.rating) params.rating = query.rating;
  if (query.discount) params.discount = query.discount;
  if (query.selectFields?.length) params.select = query.selectFields.join(",");

  const searchParams = new URLSearchParams(params).toString();
  return searchParams ? `?${searchParams}` : "";
};

export const getProductsHome = unstable_cache(
  async (query: Query = {}): Promise<{ products: Product[]; totalCount: number }> => {
    // Build absolute internal URL
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const queryString = buildQueryString(query);
    const apiUrl = `${baseUrl}/api/admin/${STORE_ID}/products${queryString}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 600 }, // ISR caching
    });

    if (!response.ok) {
      console.error(`getProducts fetch error: ${response.status} ${response.statusText}`);
      return { products: [], totalCount: 0 };
    }

    const text = await response.text();
    if (!text) {
      console.warn("getProducts: empty response");
      return { products: [], totalCount: 0 };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("getProducts: JSON parse error", parseError);
      return { products: [], totalCount: 0 };
    }

    if (!data?.products) {
      console.warn("getProducts: no products in response");
      return { products: [], totalCount: 0 };
    }

    // For revalidation: Use cache tags via unstable_cache
    const tag = query.page ? `products-page-${query.page}` : `products-${query.categoryId || "all"}`;
    // Note: Tags are set in unstable_cache options below

    return {
      products: data.products,
      totalCount: data.totalCount || 0,
    };
  },
  ["products"], // Static cache key (use tags for dynamic revalidation)
  { 
    revalidate: 600, 
    tags: ["products"] 
  } // 10 min cache
);

interface HotDealsQuery extends Query {
  timeFrame?: "7 days" | "30 days" | "90 days" | "all time";
}

export const getHotDeals = unstable_cache(
  async (query: HotDealsQuery): Promise<Product[]> => {
    // Build absolute internal URL (assuming ?hotDeals=true or separate endpoint)
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const params: Record<string, string> = {};
    if (query.categoryId) params.categoryId = query.categoryId;
    if (query.limit) params.limit = query.limit;
    if (query.page) params.page = query.page;
    if (query.timeFrame) params.timeFrame = query.timeFrame;
    params.hotDeals = "true"; // Assuming flag for hot deals

    const searchParams = new URLSearchParams(params).toString();
    const apiUrl = `${baseUrl}/api/admin/${STORE_ID}/products?${searchParams}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.error(`getHotDeals fetch error: ${response.status} ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    if (!text) {
      console.warn("getHotDeals: empty response");
      return [];
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("getHotDeals: JSON parse error", parseError);
      return [];
    }

    // For revalidation: Use cache tags
    const tag = `hot-deals-${query.timeFrame || "all"}`;

  return data || [];
  },
  ["hot-deals"],
  { 
    revalidate: 600, 
    tags: ["hot-deals"] 
  }
);