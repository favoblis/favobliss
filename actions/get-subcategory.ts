// actions/get-subcategories.ts (combined)
import { Category } from "@/types";
import { notFound } from "next/navigation";
import { GET } from "@/app/api/admin/[storeId]/subcategories/[subCategoryId]/route";
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getSubCategoryById = cache(
  async (id: string): Promise<Category> => {
    const url = new URL("http://localhost");
    // Assuming params.id

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { subCategoryId: id } });

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `subcategory-id-${id}`);

    return data;
  }
);

import { GET as MYGET } from "@/app/api/admin/[storeId]/categories/[categoryId]/subcategories/route"; //

export const getSubCategories = cache(
  async (id: string): Promise<Category[]> => {
    const url = new URL("http://localhost");
    // Assuming params.id for category

    const request = new Request(url.toString(), { method: "GET" });

    const response = await MYGET(request, {
      params: { categoryId: id, storeId: STORE_ID },
    });

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.(
      "x-next-cache-tags",
      `subcategories-category-${id}`
    );

    return data;
  }
);

import { GET as OGET } from "@/app/api/admin/[storeId]/subcategories/route";

export const getSubCategoryBySlug = cache(
  async (slug: string): Promise<Category> => {
    const cleanSlug = slug.split("?")[0];
    const url = new URL("http://localhost");
    url.searchParams.set("slug", cleanSlug);

    const request = new Request(url.toString(), { method: "GET" });

    const response = await OGET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) notFound();

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.(
      "x-next-cache-tags",
      `subcategory-slug-${cleanSlug}`
    );

    return data;
  }
);
