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
// import DownButtons from "./DowloadButtons";
const formatINR = (val: any) => {
  const num = parseFloat(String(val).replace(/,/g, ""));
  return isNaN(num)
    ? val
    : num.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      });
};

const useRodtepTable = (user_id: string, format: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

   const [filters, setFilters] = useState({});
     const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const searchValue = useDebounce(search);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetSBReports(
    user_id,
    "rodtep-report",
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
        accessorKey: "INV SNO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Item SNo",
        accessorKey: "Item SNO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 Unit Level
      // {
      //   header: "Quantity",
      //   accessorKey: "Quantity",
      //   cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      // },
      // {
      //   header: "UQC",
      //   accessorKey: "UQC",
      //   cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      // },
      // {
      //   header: "No of Units",
      //   accessorKey: "No of units",
      //   cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      // },
      {
        header: "Rodtep Value",
        accessorKey: "Rodtep Value",
        cell: (info: any) => <p>{formatINR(info.getValue())}</p>,
      },

      // 🔹 Item Level
      // {
      //   header: "Item SNo (Alt)",
      //   accessorKey: "ITEM SNO",
      //   cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      // },
      {
        header: "HS Code",
        accessorKey: "HS Code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Description",
        accessorKey: "Description",
        cell: (info: any) => (
          <p className="line-clamp-2">{info.getValue() || "-"}</p>
        ),
      },
      {
        header: "Item Qty",
        accessorKey: "Item QTY",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Item UQC",
        accessorKey: "Item UQC",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Rate",
        accessorKey: "Rate",
        cell: (info: any) => <p>{formatINR(info.getValue())}</p>,
      },
      {
        header: "Total Value (F/C)",
        accessorKey: "Total Value(F/C)",
        cell: (info: any) => <p>{formatINR(info.getValue())}</p>,
      },

      // 🔹 Currency
      {
        header: "Exchange Rate",
        accessorKey: "Exchange rate",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "FOB",
        accessorKey: "FOB",
        cell: (info: any) => {
          const row = info.row.original;
          return <p>{formatINR(row["FOB"])} INR</p>;
        },
      },

      // 🔹 Shipping
      {
        header: "CURRENCY",
        accessorKey: "Currency",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SB No",
        accessorKey: "SB NO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SB Date",
        accessorKey: "SB Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IEC/BR",
        accessorKey: "IEC/Br",
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
        header: "Realisation Time",
        accessorKey: "Realisation Time",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Port of Loading",
        accessorKey: "Port of Loading",
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
          "INV SNO",
          "Item SNO",
          "SB NO",
          "SB Date",
          "IEC/Br",
          "HS Code",
          "Description",
            // "Quantity",
            // "UQC",
            "No of units",
          "Rodtep Value",
          
          
          "Item QTY",
          "Item UQC",
          "Rate",
          "Total Value(F/C)",
          "Currency",
          "Exchange rate",
          "FOB",

          "LEO No",
          "LEO Date",
          "BRC Date",
          "Realisation Time",
          "Port of Loading",
          "Final Destination",
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
    // isRefetching,
        setEndDate,
    setStartDate,
    search,
    setSearch,
    setFilters,
    data: data?.data?.data || [],
    dashboardvalue: data?.data?.dashboardvalue || [],
    isLoading: isPending,
  };
};

export default useRodtepTable;
