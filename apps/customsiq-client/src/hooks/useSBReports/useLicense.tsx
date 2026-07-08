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

const useLicenseTable = (user_id: string, format: string) => {
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
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
    "aa-license",
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
        header: "License No",
        accessorKey: "License No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "INV S.No",
        accessorKey: "INV_S_No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Item Sno",
        accessorKey: "Item Sno",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Export Desc",
        accessorKey: "Export  Desc",
        cell: (info: any) => (
          <p className="line-clamp-2">{info.getValue() || "-"}</p>
        ),
      },
      {
        header: "Exp SNo",
        accessorKey: "EXP SNo",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Exp Qty",
        accessorKey: "EXP Qty",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "EXP UQC",
        accessorKey: "EXP Uqc",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "FOB Value (INR)",
        accessorKey: "FOB Value",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "SION",
        accessorKey: "Sion",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Type",
        accessorKey: "Status",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Import Desc",
        accessorKey: "Imprt Desc",
        cell: (info: any) => (
          <p className="line-clamp-2">{info.getValue() || "-"}</p>
        ),
      },
      {
        header: "Imp SNo",
        accessorKey: "IMP SNo",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Imp Qty",
        accessorKey: "IMP Qty",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "Imp UQC",
        accessorKey: "IMP Uqc",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IMP Type",
        accessorKey: "IMP Type",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "HS Code",
        accessorKey: "HS Code",
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
        accessorKey: "IEC/BR",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO No",
        accessorKey: "LEO No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO Date",
        accessorKey: "Leo Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Value(F/C)",
        accessorKey: "Value(F/C)",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "BRC Date",
        accessorKey: "BRC Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      {
        header: "Port Of loading",
        accessorKey: "Port Of loading",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      {
        header: "Final Destination",
        accessorKey: "Port of Final Destination",
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
          "License No",
          "Status",
          "INV_S_No",
          "Item Sno",
          "IEC/BR",
          "SB No",
          "SB Date",
          "Value(F/C)",
          "FOB Value",
          "Export  Desc",
          "EXP SNo",
          "EXP Qty",
          "EXP Uqc",
          "Imprt Desc",
          "IMP SNo",
          "IMP Qty",
          "IMP Uqc",
          "IMP Type",
          "HS Code",

          "LEO No",
          "Leo Date",
          "BRC Date",
          "Port Of loading",
      
          "Port of Final Destination",
          "Sion",
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

export default useLicenseTable;
