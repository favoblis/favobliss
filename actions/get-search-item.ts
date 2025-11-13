// actions/get-search-item.ts
import { GET } from "@/app/api/admin/[storeId]/search-item/route"; // Dynamic [storeId]

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getSearchItem = async (
  params: Record<string, any>,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  // Note: Original uses cache: "no-store" - keeping no-cache for search (fresh results)
  // If you want caching, wrap with cache() and add tags like `search-${queryKey}`
  const url = new URL("http://localhost");
  const queryParams = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, encodeURIComponent(v)])
    ),
    page: page.toString(),
    limit: limit.toString(),
  });
  url.search = queryParams.toString();

  const request = new Request(url.toString(), {
    method: "GET",
    cache: "no-store", // Preserve original no-cache for dynamic search
  });

  const response = await GET(request, { params: { storeId: STORE_ID } });

  if (!response.ok) {
    console.error("API Error:", response.status, await response.text());
    throw new Error("Failed to fetch search results");
  }

  const data = await response.json();
  return data;
};
