// actions/get-locations.ts (combined)
import { Location } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/location/route"; 
import { cache } from "react";

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "684315296fa373b59468f387";

export const getLocations = cache(
  async (storeId: string, pincode?: string): Promise<Location[]> => {
    const url = new URL("http://localhost");
    if (pincode) {
      url.searchParams.set("pincode", pincode);
    }
    // storeId handled in route params

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { storeId: STORE_ID } });

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const data = await response.json();

    // Tag for revalidation
    const tag = pincode ? `locations-pincode-${pincode}` : `locations-all`;
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", tag);

    return data;
  }
);

import { GET as MYGET } from "@/app/api/admin/[storeId]/location/[locationId]/route"; // For by ID

export const getLocationById = cache(
  async (id: string): Promise<Location> => {
    const url = new URL("http://localhost");
    // Assuming params.id

    const request = new Request(url.toString(), { method: "GET" });

    const response = await MYGET(request, {params: {locationId: id}});

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    const data = await response.json();

    // Tag for revalidation
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `location-id-${id}`);

    return data;
  }
);