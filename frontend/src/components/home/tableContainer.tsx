"use client";

import {
  ClockAlert,
  ClockFading,
  GitPullRequestClosed,
  Search,
  Truck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { data } from "./data";
import { columns } from "./columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const TableContainer = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Card className="w-full">
          <CardHeader className="md:pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck size={18} />
              Shipped
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            Orders successfully shipped
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="md:pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClockFading size={18} />
              Pending
            </CardTitle>
            <div className="text-2xl text-green-400 font- leading-none">
              <CountUp
                start={0}
                end={counts.pending}
                duration={2.75}
                separator=" "
              >
                {({ countUpRef, start }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>{" "}
            </div>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            Orders Pending
          </CardContent>
        </Card>
        <Card className="w-full ">
          <CardHeader className="md:pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClockAlert size={18} />
              Delayed
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            Orders Delayed
          </CardContent>
        </Card>
        <Card className="w-full ">
          <CardHeader className="md:pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <GitPullRequestClosed size={18} />
              Rejected
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            Orders Rejected
          </CardContent>
        </Card>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex overflow-scroll gap-4">
          <div className="flex flex-col gap-1 md:gap-2 min-w-45">
            <div>Order Id</div>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0"
              placeholder="ORD-1001"
            ></Input>
          </div>
          <div className="flex flex-col gap-1 md:gap-2 min-w-45">
            <div>SKU</div>
            <Input
              placeholder="SKU-AX12"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0"
            ></Input>
          </div>
          <div className="flex flex-col gap-1 md:gap-2 min-w-45">
            <div>Warehouse</div>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0"
              placeholder="DEL-02"
            ></Input>
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <div>Shipped At</div>
            <Input type="date"></Input>
          </div>
        </div>
        <Button className="bg-blue-800 text-white hover:text-black cursor-pointer">
          <Search /> Search
        </Button>
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
              {table.getRowModel().rows.length ? (
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
        </div>{" "}
      </div>
    </div>
  );
};

export default TableContainer;
