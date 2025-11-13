// actions/get-products.ts (for lists, hot deals)
import { Product } from "@/types";
import qs from "query-string";
import { GET } from "@/app/api/admin/[storeId]/products/route"; // Dynamic [storeId]
import { cache } from "react";

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

export const getProducts = cache(
  async (
    query: Query = {}
  ): Promise<{ products: Product[]; totalCount: number }> => {
    const url = new URL("http://localhost");
    // Build query params same as before
    const params: Record<string, any> = {
      ...(query?.colorId && { colorId: query.colorId }),
      ...(query?.sizeId && { sizeId: query.sizeId }),
      ...(query?.categoryId && { categoryId: query.categoryId }),
      ...(query?.brandId && { brandId: query.brandId }),
      ...(query?.isFeatured && { isFeatured: query.isFeatured }),
      ...(query?.limit && { limit: query.limit }),
      ...(query?.type && { type: query.type }),
      ...(query?.price && { price: query.price }),
      ...(query?.page && { page: query.page }),
      ...(query?.variantIds && { variantIds: query.variantIds }),
      ...(query?.pincode && { pincode: query.pincode }),
      ...(query?.subCategoryId && { subCategoryId: query.subCategoryId }),
      ...(query?.rating && { rating: query.rating }),
      ...(query?.discount && { discount: query.discount }),
      ...(query?.selectFields && { select: query.selectFields.join(",") }),
    };
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value.toString());
    });

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      console.error(
        `getProducts fetch error: ${response.status} ${response.statusText}`
      );
      return { products: [], totalCount: 0 };
    }

    const text = await response.text();
    if (!text) {
      console.warn("getProducts: empty response");
      return { products: [], totalCount: 0 };
    }

    const data = JSON.parse(text);
    if (!data?.products) {
      console.warn("getProducts: no products in response");
      return { products: [], totalCount: 0 };
    }

    // Tag based on key params (e.g., page, category)
    const tag = query.page
      ? `products-page-${query.page}`
      : `products-${query.categoryId || "all"}`;
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", tag);

    return {
      products: data.products,
      totalCount: data.totalCount || 0,
    };
  }
);

interface HotDealsQuery extends Query {
  timeFrame?: "7 days" | "30 days" | "90 days" | "all time";
}

export const getHotDeals = cache(
  async (query: HotDealsQuery): Promise<Product[]> => {
    const url = new URL("http://localhost/hot-deals"); // Assuming separate route or same with flag
    // Or use /api/admin/[storeId]/products?hotDeals=true if unified
    const params = {
      categoryId: query.categoryId,
      limit: query.limit,
      page: query.page,
      timeFrame: query.timeFrame,
    };
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value.toString());
    });

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      console.error(
        `getHotDeals fetch error: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const text = await response.text();
    if (!text) {
      console.warn("getHotDeals: empty response");
      return [];
    }

    const data = JSON.parse(text);

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.(
      "x-next-cache-tags",
      `hot-deals-${query.timeFrame || "all"}`
    );

    return data || [];
  }
);
