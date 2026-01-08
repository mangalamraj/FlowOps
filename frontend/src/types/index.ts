// types.ts
export type Order = {
  orderid: string;
  sku: string;
  warehouse: string;
  status: string;
  createdat: string;
  shippedat: string | null;
};
