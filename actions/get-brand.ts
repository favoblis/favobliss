import { Brand } from "@/types";
import { notFound } from "next/navigation";
import { GET } from "@/app/api/admin/[storeId]/brands/route";
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getBrandBySlug = cache(async (slug: string): Promise<Brand> => {
  const url = new URL("http://localhost");
  url.searchParams.set("slug", slug);

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request, { params: { storeId: STORE_ID } });

  if (!response.ok) notFound();

  const data = await response.json();

  // Tag for revalidation (e.g., on brand update)
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `brand-slug-${slug}`);

  return data;
});
