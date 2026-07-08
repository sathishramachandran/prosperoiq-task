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
import { useBOEReports } from "./useReports";
import { useDebounce } from "./useDebounce";

// import DownButtons from "./DowloadButtons";

const useBoeLicenseTable = (user_id: string, format: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const searchValue = useDebounce(search);


  const [filters, setFilters] = useState({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useBOEReports(
    user_id,
    "license",
    page,
    limit,
    filters,
    startDate,
    endDate,
    searchValue,
  );

  const handlePage = (page: number) => {
    params.set("page", page.toString());
    router.push(pathname + `?${params.toString()}`);
  };

  const handleLimit = (limit: number) => {
    const totalPages = Math.ceil((data?.total || 0) / limit);
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
        header: "License SNo",
        accessorKey: "License SNo",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "License No",
        accessorKey: "License No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "License Code",
        accessorKey: "License Code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      {
        header: "BE No",
        accessorKey: "BE No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "BE Date",
        accessorKey: "Be Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 Importer Info

      {
        header: "CB Name",
        accessorKey: "CB Name",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IEC",
        accessorKey: "IEC",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "AD Code",
        accessorKey: "Ad Code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 Invoice
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

      // 🔹 Item
      {
        header: "Inv SNo",
        accessorKey: "INV Sno",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Item SNo",
        accessorKey: "Item Sno",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "CTH No",
        accessorKey: "CTH No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Qty",
        accessorKey: "QTY",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "UQC",
        accessorKey: "UQC",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 License

      {
        header: "License Date",
        accessorKey: "License Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },

      // 🔹 Financial
      {
        header: "Debit Value",
        accessorKey: "Debit Value",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },
      {
        header: "Duty",
        accessorKey: "Duty",
        cell: (info: any) => (
          <div>
            {info.getValue()
              ? Number(info.getValue()).toLocaleString("en-IN")
              : "-"}
          </div>
        ),
      },

      // 🔹 Port
      {
        header: "Port",
        accessorKey: "Port",
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
      data: data?.data || [],
      state: { sorting, rowSelection },
      initialState: {
        columnOrder: [
          "select-col",
          "License No",
          "License SNo",
          "License Date",
          "License Code",
          "Port",
          "BE No",
          "Be Date",
          "Invoice No",
          "Invoice Date",

          "UQC",
          "QTY",
          "INV Sno",
          "Item Sno",
          "CTH No",
          "Debit Value",
          "Duty",
          "CB Name",
          "IEC",

          "AD Code",
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
      total_pages: data?.total_pages || 0,
      page: data?.page || 1,
      limit: data?.page_size || 20,
      total_data: data?.total || 0,
      data_length: data?.data?.length || 0,
    },
    isError: isError,
    // dataUpdatedAt,
    // refetch,
    // isRefetching,
    setStartDate,
    setEndDate,
    setSearch,
    search,
    setFilters,
    data: data?.data || [],
    dashboardvalue: data?.dashboardvalue,
    isLoading: isPending,
  };
};

export default useBoeLicenseTable;
