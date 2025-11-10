import { HomepageCategory } from "@/types";

const URL = process.env.NEXT_PUBLIC_STORE_URL;
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

export const getHomepageCategory = async (): Promise<HomepageCategory[]> => {
  const res = await fetch(`${URL}/api/admin/${STORE_ID}/homepage-categories`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    throw new Error("Brands not found");
  }
  return res.json();
};

export const getHomepageCategoryById = async (
  id: string
): Promise<HomepageCategory> => {
  const res = await fetch(
    `${URL}/api/admin/${STORE_ID}/homepage-categories/${id}`,
    {
      next: { revalidate: 600 },
    }
  );
  return res.json();
};
