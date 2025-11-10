import { PaginatedBlogs } from "@/types";
import { notFound } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_STORE_URL;

export const getBlogs = async (
  page: number,
  limit: number
): Promise<PaginatedBlogs> => {
  const res = await fetch(`${URL}/api/blogs?page=${page}&limit=${limit}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
};
