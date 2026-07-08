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
import { useGetBOEOverview } from "./useBOEApi";

const userP3ItemTable = (id: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetBOEOverview(
    id,
    "boe",
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
        header: "BE No",
        accessorKey: "be_no",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Inv No",
        accessorKey: "Inv No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Item S No",
        accessorKey: "Item S No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CTH",
        accessorKey: "CTH",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CETH",
        accessorKey: "CETH",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Item Description",
        accessorKey: "Item Description",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "FS",
        accessorKey: "FS",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "PQ",
        accessorKey: "PQ",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "DC",
        accessorKey: "DC",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "WC",
        accessorKey: "WC",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "AQ",
        accessorKey: "AQ",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "UPI",
        accessorKey: "UPI",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "COO",
        accessorKey: "COO",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "C Qty",
        accessorKey: "C Qty",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "C UQC",
        accessorKey: "C UQC",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "S Qty",
        accessorKey: "S Qty",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "S UQC",
        accessorKey: "S UQC",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SCH",
        accessorKey: "SCH",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "STND PR",
        accessorKey: "STND PR",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "RSP",
        accessorKey: "RSP",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Reimp",
        accessorKey: "Reimp",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Prov",
        accessorKey: "Prov",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "End Use",
        accessorKey: "End Use",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Prod",
        accessorKey: "Prod",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Cntrl",
        accessorKey: "Cntrl",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Qualfr",
        accessorKey: "Qualfr",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Contnt",
        accessorKey: "Contnt",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Stmt",
        accessorKey: "Stmt",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Sup Docs",
        accessorKey: "Sup Docs",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Assess Value",
        accessorKey: "Assess Value",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Total Duty",
        accessorKey: "Total Duty",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
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

          "be_no",
          "Inv No",
          "Item S No",
          "CTH",
          "CETH",
          "Item Description",
          "FS",
          "PQ",
          "DC",
          "WC",
          "AQ",
          "UPI",
          "COO",
          "C Qty",
          "C UQC",
          "S Qty",
          "S UQC",
          "SCH",
          "STND PR",
          "RSP",
          "Reimp",
          "Prov",
          "End Use",
          "Prod",
          "Cntrl",
          "Qualfr",
          "Contnt",
          "Stmt",
          "Sup Docs",
          "Assess Value",
          "Total Duty",
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

export default userP3ItemTable;
