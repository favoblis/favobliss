import { Category } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/categories/route";
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";
export const getCategories = cache(
  async (storeId?: string): Promise<Category[]> => {
    const url = new URL("http://localhost");
    // No query params; storeId handled in route params if needed

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      console.error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    // Tag for revalidation (e.g., on category create/update/delete)
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `categories-all`);

    return Array.isArray(data) ? data : [];
  }
);
