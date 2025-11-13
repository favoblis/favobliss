// actions/get-category-by-id.ts (combined with getCategoryBySlug if in same file)
import { Category } from "@/types";
import { notFound } from "next/navigation";
import { GET } from "@/app/api/admin/[storeId]/categories/[categoryId]/route";
import { cache } from "react";
import { GET as MYGET } from "@/app/api/admin/[storeId]/categories/route";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getCategoryById = cache(async (id: string): Promise<Category> => {
  // For dynamic [id], the route handler uses params.id; no query needed
  // But to mock, we can pass as query or adjust route to use query if preferred
  const url = new URL("http://localhost");
  url.searchParams.set("id", id);

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request, { params: { categoryId: id } });

  if (!response.ok) notFound();

  const data = await response.json();

  // Tag for revalidation
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `category-id-${id}`);

  return data;
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category> => {
    const url = new URL("http://localhost");
    url.searchParams.set("slug", slug);

    const request = new Request(url.toString(), { method: "GET" });

    const response = await MYGET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) notFound();

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `category-slug-${slug}`);

    return data;
  }
);
