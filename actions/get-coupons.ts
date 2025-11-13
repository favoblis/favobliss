// actions/get-coupons.ts
import { Coupons } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/coupons/route"; // Dynamic [storeId] route
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getCoupons = cache(async (): Promise<Coupons[]> => {
  const url = new URL("http://localhost");

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request, { params: { storeId: STORE_ID } });

  const data = await response.json();

  // Tag for revalidation (e.g., on coupon create/update)
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `coupons-all`);

  return data;
});
