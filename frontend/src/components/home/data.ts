// data.ts
import { Order } from "@/types";
export const data: Order[] = [
  {
    order_id: "ORD-1001",
    sku: "SKU-AX12",
    warehouse: "BLR-01",
    status: "pending",
    created_at: "2026-01-05T09:15:00",
    shipped_at: "2026-01-05T09:15:00",
  },
  {
    order_id: "ORD-1002",
    sku: "SKU-BX44",
    warehouse: "DEL-02",
    status: "shipped",
    created_at: "2026-01-05T08:30:00",
    shipped_at: "2026-01-05T09:15:00",
  },
  {
    order_id: "ORD-1003",
    sku: "SKU-CM88",
    warehouse: "BLR-02",
    status: "delayed",
    created_at: "2026-01-04T14:10:00",
    shipped_at: "2026-01-05T09:15:00",
  },
  {
    order_id: "ORD-1004",
    sku: "SKU-DK21",
    warehouse: "MUM-01",
    status: "shipped",
    created_at: "2026-01-04T10:00:00",
    shipped_at: "2026-01-05T09:15:00",
  },
  {
    order_id: "ORD-1005",
    sku: "SKU-AX12",
    warehouse: "DEL-01",
    status: "pending",
    created_at: "2026-01-06T07:40:00",
    shipped_at: "2026-01-05T09:15:00",
  },
];
