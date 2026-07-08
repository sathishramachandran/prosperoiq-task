"use client";

import IndeterminateCheckbox from "@/src/ui/IndeterminateCheckbox";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { useGetSBReports } from "./useSBReportApi";
import { useDebounce } from "../useDebounce";

const useDrawBackTable = (user_id: string, format: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const searchValue = useDebounce(search);
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetSBReports(
    user_id,
    "drawback-report",
    format,
    page,
    limit,
    filters,
    startDate || "",
    endDate || "",
    searchValue || "",
  );

  const handlePage = (page: number) => {
    params.set("page", page.toString());
    router.push(pathname + `?${params.toString()}`);
  };

  const handleLimit = (limit: number) => {
    const totalPages = Math.ceil((data?.data?.total || 0) / limit);
    params.set("limit", limit.toString());
    if (Number(params.get("page")) > totalPages) {
      params.set("page", "1");
    } else {
      params.set(
        "page",
        Number(params.get("page")) <= totalPages
          ? (params.get("page") as string)
          : "1",
      );
    }
    router.push(pathname + `?${params.toString()}`);
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return [
      {
        id: "select-col",
        header: ({ table }) => (
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },

      {
        header: "Inv SNo",
        accessorKey: "INV_S_No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Item S.No",
        accessorKey: "Item_S_No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      {
        header: "DBK SNo",
        accessorKey: "DBK SNO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Qty/Wt",
        accessorKey: "QTY/WT",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Value",
        accessorKey: "Value",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "Rate",
        accessorKey: "Rate",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "DBK Amount",
        accessorKey: "DBK Amount",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "State Lev",
        accessorKey: "State Lev",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "Central Lev",
        accessorKey: "Central Lev",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      // {
      //   header: "ROSCTL Amt",
      //   accessorKey: "Rosctl Amt",
      //   cell: (info: any) => <p>{info.getValue()}</p>,
      // },
      {
        header: "HS Code",
        accessorKey: "HS Code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Export Description",
        accessorKey: "Export Description",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SB No",
        accessorKey: "SB No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SB Date",
        accessorKey: "SB Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IEC/BR",
        accessorKey: "Iec/BR",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO No",
        accessorKey: "LEO No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO Date",
        accessorKey: "LEO Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "BRC Date",
        accessorKey: "BRC Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Port of Loading",
        accessorKey: "Port Of Loading",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Final Destination",
        accessorKey: "Final Destination",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadingColumns = useMemo<ColumnDef<any>[]>(() => {
    return columns.map((column) => {
      return {
        ...column,
        cell(info: any) {
          if (info.column.id === "action")
            return (
              <div
                className="loading2 ml-auto size-6 rounded-full"
                style={{ animationDelay: `${info.row.id * 0.2}s` }}
              ></div>
            );
          if (info.column.id === "assignee")
            return (
              <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div
                  className="loading2 aspect-square size-8 rounded-full"
                  style={{ animationDelay: `${info.row.id * 0.2}s` }}
                ></div>
                <div
                  className="loading h-5 w-full rounded-full"
                  style={{ animationDelay: `${info.row.id * 0.2}s` }}
                ></div>
              </div>
            );
          return (
            <div
              className="loading my-0.75 mr-4 h-5 w-full rounded-full"
              style={{ animationDelay: `${info.row.id * 0.2}s` }}
            ></div>
          );
        },
      };
    });
  }, [columns]);
  return {
    table: useReactTable({
      columns: isPending ? loadingColumns : columns,
      data: data?.data?.data || [],
      state: { sorting, rowSelection },
      initialState: {
        columnOrder: [
          "select-col",
          "INV_S_No",
          "Item_S_No",
          "SB No",
          "SB Date",
          "Iec/BR",
          "DBK SNO",
          "HS Code",
          'Export Description',
          "QTY/WT",
          "Value",
          "Rate",
          "DBK Amount",
          "LEO No",
          "LEO Date",
          "BRC Date",
          "Port Of Loading",
          "Final Destination",
          "State Lev",
          "Central Lev",
        ],
      },
      getRowId: (row) => row.id,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
      //  getPaginationRowModel: getPaginationRowModel(),
    }),
    handleLimit,
    handlePage,
    rowSelection,
    ...{
      total_pages: data?.data?.total_pages || 0,
      page: data?.data?.page || 1,
      limit: data?.data?.page_size || 20,
      total_data: data?.data?.total || 0,
      data_length: data?.data?.data?.length || 0,
    },

    isError: isError,
    // dataUpdatedAt,
    // refetch,
    setFilters,
    setEndDate,
    setStartDate,
    search,
    setSearch,
    // isRefetching,
    data: data?.data?.data || [],
    dashboardvalue: data?.data?.dashboardvalue || [],
    isLoading: isPending,
  };
};

export default useDrawBackTable;
