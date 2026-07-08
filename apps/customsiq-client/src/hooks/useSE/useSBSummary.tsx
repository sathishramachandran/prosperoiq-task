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
import { useMemo, useState } from "react";
import { useGetSBOverview } from "./useSEApi";

const userSBSummaryTable = (id: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetSBOverview(
    id,
    "shipping_bill",
    "Summary",
    undefined,
    page,
    limit,
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
            onChange={table.getToggleAllRowsSelectedHandler()}
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
        header: "SB Number",
        accessorKey: "sb_no",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "SB Date",
        accessorKey: "sb_date",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Port Code",
        accessorKey: "port_code",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "SB Type",
        accessorKey: "sb_type",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "IEC",
        accessorKey: "iec",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Branch",
        accessorKey: "branch",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Doc Type",
        accessorKey: "doc_type",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "GSTIN",
        accessorKey: "gstin",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "GSTIN Type",
        accessorKey: "gstin_type",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "CB Code",
        accessorKey: "cb_code",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Invoice Nos",
        accessorKey: "invoice_nos",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Item Nos",
        accessorKey: "item_nos",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Container Nos",
        accessorKey: "container_nos",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Package Nos",
        accessorKey: "package_nos",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Gross Weight",
        accessorKey: "gross_weight",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "FOB Value",
        accessorKey: "FOB Value",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "DBK CLaim",
        accessorKey: "DBK CLaim",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "RODTEP Amount",
        accessorKey: "RODTEP Amount",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "IGST AMT",
        accessorKey: "IGST AMT",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "IGST Value",
        accessorKey: "IGST Value",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
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
          "filename",
          "document_type",
          "status",
          "error_msg",
          "sb_no",
          "sb_date",
          "port_code",
          "sb_type",
          "iec",
          "branch",
          "doc_type",
          "gstin",
          "gstin_type",
          "cb_code",
          "invoice_nos",
          "item_nos",
          "container_nos",
          "package_nos",
          "gross_weight",
          "FOB Value",
          "DBK CLaim",
          "RODTEP Amount",
          "IGST AMT",
          "IGST Value",
        ],
      },
      getRowId: (row) => row.id,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
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
    data: data?.data?.data || [],
    isLoading: isPending,
  };
};

export default userSBSummaryTable;
