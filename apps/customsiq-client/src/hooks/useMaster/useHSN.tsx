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
import { useGetSBMaster } from "./useMasterApi";
import { useDebounce } from "../useDebounce";

// import DownButtons from "./DowloadButtons";

const useHSNTable = (user_id: string, format: string) => {
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

  const { data, isPending, isError } = useGetSBMaster(
    user_id,
    "hsn-master",
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
        header: "Sl No",
        accessorKey: "Sl No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "CTH",
        accessorKey: "CTH",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Description",
        accessorKey: "Description",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "BCD Rate",
        accessorKey: "BCD Rate",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "BCD",
        accessorKey: "BCD",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
      },
      {
        header: "SWS Rate",
        accessorKey: "SWS Rate",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SWS",
        accessorKey: "SWS",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
      },
      {
        header: "Value in FC",
        accessorKey: "Value in FC",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
      },
      {
        header: "Exc Rate",
        accessorKey: "Exc Rate",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
      },
      {
        header: "IGST Rate",
        accessorKey: "IGST Rate",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IGST",
        accessorKey: "IGST",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
      },
      {
        header: "Total Import Duty",
        accessorKey: "Total Import Duty",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
      },
      {
        header: "BOE Nos",
        accessorKey: "BOE Nos",
        cell: ({ getValue }: any) => {
          const value = getValue();

          if (!value) {
            return <span className="text-muted-foreground">-</span>;
          }

          const boes = value.split(",").map((b: string) => b.trim());

          return (
            <div
              title={boes.join(", ")}
              className="inline-flex items-center gap-2 cursor-pointer group"
            >
              {/* Preview Badge */}
              <div className="px-2.5 py-1 rounded-md bg-slate-100 border text-xs font-medium text-slate-700 group-hover:bg-slate-200 transition-colors">
                {boes[0]}
              </div>

              {/* More Count */}
              {boes.length > 1 && (
                <div className="text-xs text-muted-foreground font-medium">
                  +{boes.length - 1} more
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Total Assessable Values (INR)",
        accessorKey: "Total Assessable Values",
        cell: (info: any) => (
          <div>{info.getValue().toLocaleString("en-IN") || "-"} </div>
        ),
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
          "Sl No",
          "CTH",
          "Description",
          "BCD Rate",
          "BCD",
          "SWS Rate",
          "SWS",
          "IGST Rate",
          "IGST",
          "Value in FC",
          "Exc Rate",
          "BOE Nos",
          "Total Import Duty",
          "Total Assessable Values",
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

export default useHSNTable;
