"use client";

import {
  Check,
  ClockAlert,
  ClockFading,
  GitPullRequestClosed,
  RefreshCcw,
  Search,
  Truck,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
import PopoverContentComponent from "./popoverContainer";
import { parseFallbackField } from "next/dist/lib/fallback";
import { Tooltip } from "../ui/tooltip";

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

const TableContainer = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const router = useRouter();
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [counts, setCount] = useState({
    verified: 0,
    pending: 0,
    notverified: 0,
    parseFallbackField: 0,
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
              <Check size={16} />
              Verified
            </CardTitle>
            <div className="text-4xl text-green-400 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.verified}
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
            Orders successfully verified
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ClockFading size={18} />
              Rules Pending
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
            Pending
          </CardContent>
        </Card>
        <Card className="w-full ">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClockAlert size={18} />
              Not Verified
            </CardTitle>
            <div className="text-4xl text-orange-600 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.notverified}
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
            Not Verified
          </CardContent>
        </Card>
        <Card className="w-full ">
          <CardHeader className="px-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitPullRequestClosed size={18} />
              Failed
            </CardTitle>
            <div className="text-4xl text-red-600 font-semibold leading-none">
              <CountUp
                start={0}
                end={counts.failed}
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
                    <TableHead key={header.id} className={``}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                  <TableHead
                    key={headerGroup.id}
                    className="flex justify-center align-middle items-center"
                  >
                    Add Tags
                  </TableHead>
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
                  <TableRow key={row.id} className="cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          router.push(`/skurules/${row.original.orderid}`);
                        }}
                        className={`${row.original.status === "rules pending" ? "pointer-events-none" : ""}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}

                    <TableCell
                      key={row.id}
                      className="flex gap-2 justify-center align-middle"
                    >
                      {row?.original?.tags ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="rounded-full text-sm p-1 px-3.5 bg-gray-800 flex items-center">
                              T
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {Object.entries(row?.original?.tags)
                              .filter(([key, value]) => value == true)
                              .map(([key, value], index) => (
                                <div key={index}>{key}</div>
                              ))}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <></>
                      )}

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="cursor-pointer"
                          >
                            Add Tags
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverContentComponent
                            orderid={row.original.orderid}
                            is_perishable={
                              row.original.tags?.is_perishable ?? false
                            }
                            is_frozen={row.original.tags?.is_frozen ?? false}
                            is_fragile={row.original.tags?.is_fragile ?? false}
                            is_hazardous={
                              row.original.tags?.is_hazardous ?? false
                            }
                            has_inner_pack={
                              row.original.tags?.has_inner_pack ?? false
                            }
                            has_carton_case={
                              row.original.tags?.has_carton_case ?? false
                            }
                            requires_case_shipping_label={
                              row.original.tags?.requires_case_shipping_label ??
                              false
                            }
                            requires_pallet_shipping_label={
                              row.original.tags
                                ?.requires_pallet_shipping_label ?? false
                            }
                            requires_shipping_documents={
                              row.original.tags?.requires_shipping_documents ??
                              false
                            }
                            requires_barcode_gtin={
                              row.original.tags?.requires_barcode_gtin ?? false
                            }
                            requires_rfid={
                              row.original.tags?.requires_rfid ?? false
                            }
                            palletized_item={
                              row.original.tags?.palletized_item ?? false
                            }
                            retail_ready_display={
                              row.original.tags?.retail_ready_display ?? false
                            }
                            direct_store_delivery={
                              row.original.tags?.direct_store_delivery ?? false
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
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
