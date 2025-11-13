// actions/get-product-by-id.ts (combined with others)
import { Product, ProductApiResponse } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/products/[productId]/route";
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getProductById = cache(async (id: string): Promise<Product> => {
  const url = new URL("http://localhost");
  // Assuming params.id

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request, { params: { productId: id } });

  const data = await response.json();

  // Tag for revalidation (e.g., on product update)
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `product-id-${id}`);

  return data;
});

import { notFound } from "next/navigation";
import { GET as MYGET } from "@/app/api/admin/[storeId]/products/route"; // For by slug query

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductApiResponse> => {
    const url = new URL("http://localhost");
    url.searchParams.set("slug", slug);

    const request = new Request(url.toString(), { method: "GET" });

    const response = await MYGET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) notFound();

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `product-slug-${slug}`);

    return data;
  }
);

// import { POST } from "@/app/api/admin/[storeId]/products/recently-viewed/route";

// export const getRecentlyViewedProducts = cache(
//   async (productIds: string[], locationId?: string): Promise<Product[]> => {
//     const url = new URL("http://localhost");
//     // Body for POST
//     const body = JSON.stringify({ productIds, locationId });

//     const request = new Request(url.toString(), {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body,
//     });

//     const response = await POST(request, { params: { storeId: STORE_ID } });

//     if (!response.ok) {
//       throw new Error("Failed to fetch recently viewed products");
//     }

//     const data = await response.json();

//     // Tag if needed (e.g., per user/session, but cache lightly)
//     // @ts-ignore - internal
//     response.headers?.set?.(
//       "x-next-cache-tags",
//       `recently-viewed-${productIds.join("-")}`
//     );

//     return data;
//   }
// );
