// types.ts
export type Order = {
  order_id: string;
  sku: string;
  warehouse: string;
  status: "pending" | "shipped" | "delayed";
  created_at: string;
  shipped_at: string;
};
