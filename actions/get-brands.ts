import { Brand } from "@/types";
import { notFound } from "next/navigation";

const URL = process.env.NEXT_PUBLIC_STORE_URL;
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

export const getBrands = async (): Promise<Brand[]> => {
  const res = await fetch(`${URL}/api/admin/${STORE_ID}/brands`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
};
