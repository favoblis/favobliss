import { Blog } from "@/types";
import { notFound } from "next/navigation";
import { GET } from "@/app/api/blogs/route";
import { cache } from "react";

export const getBlogBySlug = cache(async (slug: string): Promise<Blog> => {
  const url = new URL("http://localhost");
  url.searchParams.set("slug", slug);

  const request = new Request(url.toString(), { method: "GET" });

  const response = await GET(request);

  if (!response.ok) notFound();

  const data = await response.json();

  // Tag for revalidation (e.g., on blog update)
  // @ts-ignore - internal
  response.headers?.set?.("x-next-cache-tags", `blog-slug-${slug}`);

  return data;
});
