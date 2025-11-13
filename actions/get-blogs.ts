import { PaginatedBlogs } from "@/types";
import { notFound } from "next/navigation";
import { GET } from "@/app/api/blogs/route";
import { cache } from "react";

export const getBlogs = cache(
  async (page: number, limit: number): Promise<PaginatedBlogs> => {
    const url = new URL("http://localhost");
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request);

    if (!response.ok) notFound();

    const data = await response.json();

    // Tag this specific page
    // Next.js will use this for revalidation
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `blogs-page-${page}`);

    return data;
  }
);
