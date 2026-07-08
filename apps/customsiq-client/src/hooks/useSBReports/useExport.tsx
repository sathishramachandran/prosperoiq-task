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

const useExportTable = (user_id: string, format: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState({});
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const searchValue = useDebounce(search);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetSBReports(
    user_id,
    "export-promotion",
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
        header: "SNo",
        accessorKey: "SNO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Invoice No",
        accessorKey: "Invoice No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Invoice Date",
        accessorKey: "Invoice Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 Benefits Section
      {
        header: "DBK Claim",
        accessorKey: "DBK Claim",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "RODTEP",
        accessorKey: "RODTEP",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "ROSCTL",
        accessorKey: "ROSCTL",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "IGST Amt",
        accessorKey: "IGST AMT",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "CESS Amt",
        accessorKey: "Cess Amt",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "IGST Value",
        accessorKey: "IGST Value",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },

      // 🔹 Item
      {
        header: "HS Code",
        accessorKey: "HS Code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 Shipping
      {
        header: "SB No",
        accessorKey: "SBNO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SB Date",
        accessorKey: "SB Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      {
        header: "IEC/BR",
        accessorKey: "IEC/BR",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Status",
        accessorKey: "Status",

        cell: (info: any) => {
          // const row = info.row.original;
          return <p>{info.getValue() || "-"}</p>;
        },
      },
      {
        header: "LEO No",
        accessorKey: "Leo No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO Date",
        accessorKey: "Leo Date",
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
          "SNO",
          "SBNO",
          "SB Date",
          "HS Code",
          "IEC/BR",
          "Invoice No",
          "Invoice Date",
          "DBK Claim",
          "RODTEP",
          "ROSCTL",
          "IGST AMT",
          "Cess Amt",
          "IGST Value",
          "Status",
          "Leo No",
          "Leo Date",
          "BRC Date",
          "Port Of Loading",
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
    setFilters,
    setEndDate,
    setStartDate,
    search,
    setSearch,
    data: data?.data?.data || [],
    dashboardvalue: data?.data?.dashboardvalue,
    isLoading: isPending,
  };
};

export default useExportTable;
