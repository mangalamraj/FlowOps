// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderid",
    header: "Order ID",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusStyles: Record<string, string> = {
        verified: "bg-green-400/50 text-white",
        "rules pending": "bg-yellow-400/70 text-white",
        "not verified": "bg-orange-400/70 text-white",
        failed: "bg-red-400/70 text-white",
      };
      return (
        <Badge className={`text-xs font-semibold  ${statusStyles[status]}`}>
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdat",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("createdat") as string;
      return new Date(value).toLocaleString();
    },
  },
  {
    accessorKey: "shippedat",
    header: "Shipped At",
    cell: ({ row }) => {
      const value = row.getValue("shippedat") as string | null;
      return value ? new Date(value).toLocaleString() : "Not shipped";
    },
  },
];
