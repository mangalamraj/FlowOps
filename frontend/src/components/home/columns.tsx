// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_id",
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

      // const color =
      //   status === "shipped"
      //     ? "text-green-600"
      //     : status === "pending"
      //       ? "text-yellow-600"
      //       : "text-red-600";

      const statusStyles: Record<string, string> = {
        shipped: "bg-green-400/50 text-white",
        pending: "bg-yellow-400/70 text-white",
        delayed: "bg-red-400/50 text-white",
      };
      return (
        <Badge className={`font-medium ${statusStyles[status]}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString(),
  },
  {
    accessorKey: "shipped_at",
    header: "Shipped At",
    cell: ({ row }) => new Date(row.getValue("shipped_at")).toLocaleString(),
  },
];
