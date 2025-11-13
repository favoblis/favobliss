// actions/get-invoice.ts
import { InvoiceData } from "@/types";
import { GET } from "@/app/api/admin/[storeId]/orders/invoice/[orderId]/route"; // Dynamic [id]
import { cache } from "react";
;

export const getInvoice = cache(
  async (id: string): Promise<InvoiceData> => {
    const url = new URL("http://localhost");
    // Assuming route uses params.id

    const request = new Request(url.toString(), { method: "GET" });

    const response = await GET(request, { params: { orderId: id } });

    const data = await response.json();

    // Tag for revalidation (e.g., on order update)
    // @ts-ignore - internal
    response.headers?.set?.("x-next-cache-tags", `invoice-id-${id}`);

    return data;
  }
);