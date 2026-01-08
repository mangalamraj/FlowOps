"use client";

import {
  ClockAlert,
  ClockFading,
  GitPullRequestClosed,
  RefreshCcw,
  Search,
  Truck,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  // ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertToCSV } from "./csvHelper";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

const TableContainer = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [counts, setCount] = useState({
    shipped: 0,
    pending: 0,
    delayed: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState({
    orderid: "",
    sku: "",
    warehouse: "",
    shippedat: "",
  });
  const handleChange =
    (key: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/table/all`,
        {
          params: {
            orderid: filters.orderid || undefined,
            sku: filters.sku || undefined,
            warehouse: filters.warehouse || undefined,
            shippedat: filters.shippedat || undefined,
          },
        },
      );

      setTableData(res.data.rows);
      setCount(res.data.counts);
      setPageIndex(0);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
    },
  });
  const downloadCSV = () => {
    if (!tableData.length) return;

    const csv = convertToCSV(tableData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        <Card className="w-full">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Truck size={16} />
              Shipped
            </CardTitle>
            <div className="text-4xl text-green-400 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.shipped}
                duration={2.75}
                separator=" "
              >
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
            Orders successfully shipped
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ClockFading size={18} />
              Pending
            </CardTitle>
            <div className="text-4xl text-yellow-400 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.pending}
                duration={2.75}
                separator=" "
              >
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>{" "}
            </div>
          </CardHeader>

          <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
            Orders Pending
          </CardContent>
        </Card>
        <Card className="w-full ">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClockAlert size={18} />
              Delayed
            </CardTitle>
            <div className="text-4xl text-orange-600 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.delayed}
                duration={2.75}
                separator=" "
              >
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>{" "}
            </div>
          </CardHeader>

          <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
            Orders Delayed
          </CardContent>
        </Card>
        <Card className="w-full ">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitPullRequestClosed size={18} />
              Rejected
            </CardTitle>
            <div className="text-4xl text-red-600 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.rejected}
                duration={2.75}
                separator=" "
              >
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>{" "}
            </div>
          </CardHeader>

          <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
            Orders Rejected
          </CardContent>
        </Card>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex overflow-scroll gap-4">
          <div className="flex flex-col gap-1 md:gap-2 min-w-45">
            <div className="text-sm md:text-base">Order Id</div>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0 text-sm md:text-base"
              placeholder="ORD-1001"
              value={filters.orderid}
              onChange={handleChange("orderid")}
            ></Input>
          </div>
          <div className="flex flex-col gap-1 md:gap-2 min-w-45">
            <div className="text-sm md:text-base">SKU</div>
            <Input
              placeholder="SKU-AX12"
              value={filters.sku}
              onChange={handleChange("sku")}
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0 text-sm md:text-base"
            ></Input>
          </div>
          <div className="flex flex-col gap-1 md:gap-2 min-w-45">
            <div className="text-sm md:text-base">Warehouse</div>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0 text-sm md:text-base"
              placeholder="DEL-02"
              value={filters.warehouse}
              onChange={handleChange("warehouse")}
            ></Input>
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="text-sm md:text-base">Shipped At</div>
            <Input
              type="date"
              className="text-sm md:text-base"
              value={filters.shippedat}
              onChange={handleChange("shippedat")}
            ></Input>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={downloadCSV}
            disabled={!tableData.length}
          >
            <Upload />
            <div className="hidden md:block">Export to CSV</div>
          </Button>

          <Button
            className="bg-blue-800 text-white hover:text-black cursor-pointer"
            onClick={fetchOrders}
          >
            <Search /> Search
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              window.location.reload();
            }}
          >
            <RefreshCcw />
          </Button>
        </div>
      </div>
      <div>
        <div className="overflow-hidden rounded-md border">
          <Table className="overflow-scroll">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex w-full items-center justify-between px-2 py-3 text-sm">
            <div>
              Page {pageIndex + 1} of {table.getPageCount()}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default TableContainer;
