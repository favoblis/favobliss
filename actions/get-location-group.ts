// actions/get-location-groups.ts (combined)
import { LocationGroup } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/location-group/route"; // Dynamic [storeId] route
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getLocationGroups = cache(
  async (pincode?: string): Promise<LocationGroup[]> => {
    const url = new URL("http://localhost");
    if (pincode) {
      url.searchParams.set("pincode", pincode);
    }

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      throw new Error("Failed to fetch location groups");
    }

    const data = await response.json();

    // Tag for revalidation (dynamic based on pincode if needed)
    const tag = pincode
      ? `location-groups-pincode-${pincode}`
      : `location-groups-all`;
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", tag);

    return data;
  }
);

import { GET as MYGET } from "@/app/api/admin/[storeId]/location-group/[locationGroupId]/route"; // For by ID

export const getLocationGroupById = cache(
  async (id: string): Promise<LocationGroup> => {
    const url = new URL("http://localhost");
    // Assuming params.id

    const request = new Request(url.toString(), { method: "GET" });

    const response = await MYGET(request, { params: { locationGroupId: id } });

    if (!response.ok) {
      throw new Error("Failed to fetch location group");
    }

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `location-group-id-${id}`);

    return data;
  }
);
