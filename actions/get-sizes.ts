// actions/get-sizes.ts
import { Size } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/sizes/route"; // Dynamic [storeId]
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getSizes = cache(async (): Promise<Size[]> => {
  const url = new URL("http://localhost");

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request, { params: { storeId: STORE_ID } });

  const data = await response.json();

  // Tag for revalidation
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `sizes-all`);

  return data;
});
