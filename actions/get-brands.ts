// actions/get-brands.ts
import { Brand } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/brands/route"; // Dynamic [storeId] route
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getBrands = cache(
  async (): Promise<Brand[]> => {
    const url = new URL("http://localhost");
    // No query params needed for full list

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    // Tag for revalidation (e.g., on brand create/update/delete)
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `brands-all`);

    return data;
  }
);