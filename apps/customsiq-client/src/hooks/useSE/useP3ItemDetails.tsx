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

const useP3ItemDetailsTable = (id: string) => {
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
    "P3 Item Details",
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
        header: "SB No",
        accessorKey: "SB No",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Inv SNo",
        accessorKey: "Inv SNo",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Item SNo",
        accessorKey: "Item SNo",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "HS Code",
        accessorKey: "HS Code",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Description",
        accessorKey: "Description",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Quantity",
        accessorKey: "Quantity",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "UQC",
        accessorKey: "UQC",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Rate",
        accessorKey: "Rate",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Value FC",
        accessorKey: "Value FC",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "FOB INR",
        accessorKey: "FOB INR",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "PMV",
        accessorKey: "PMV",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Duty Amt",
        accessorKey: "Duty Amt",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Cess Rate",
        accessorKey: "Cess Rate",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Cess Amt",
        accessorKey: "Cess Amt",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "DBK Claimed",
        accessorKey: "DBK Claimed",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "IGST Stat",
        accessorKey: "IGST Stat",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "IGST Value",
        accessorKey: "IGST Value",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "IGST Amount",
        accessorKey: "IGST Amount",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Sch Code",
        accessorKey: "Sch Code",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Scheme Description",
        accessorKey: "Scheme Description",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "SQC MSR",
        accessorKey: "SQC MSR",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "SQC UQC",
        accessorKey: "SQC UQC",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "State of Origin",
        accessorKey: "State of Origin",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "District of Origin",
        accessorKey: "District of Origin",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "PT Abroad",
        accessorKey: "PT Abroad",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Comp Cess",
        accessorKey: "Comp Cess",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "End Use",
        accessorKey: "End Use",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "FTA Benefit",
        accessorKey: "FTA Benefit",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Reward Benefit",
        accessorKey: "Reward Benefit",
        cell: (info: any) => <div>{info.getValue() || "-"}</div>,
      },
      {
        header: "Third Party Item",
        accessorKey: "Third Party Item",
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
          "SB No",
          "Inv SNo",
          "Item SNo",
          "HS Code",
          "Description",
          "Quantity",
          "UQC",
          "Rate",
          "Value FC",
          "FOB INR",
          "PMV",
          "Duty Amt",
          "Cess Rate",
          "Cess Amt",
          "DBK Claimed",
          "IGST Stat",
          "IGST Value",
          "IGST Amount",
          "Sch Code",
          "Scheme Description",
          "SQC MSR",
          "SQC UQC",
          "State of Origin",
          "District of Origin",
          "PT Abroad",
          "Comp Cess",
          "End Use",
          "FTA Benefit",
          "Reward Benefit",
          "Third Party Item",
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

export default useP3ItemDetailsTable;
