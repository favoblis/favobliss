import { Blog } from "@/types";
import { notFound } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_STORE_URL;

export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const res = await fetch(`${URL}/api/blogs?slug=${slug}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    notFound();
  }
  return res.json();
};
