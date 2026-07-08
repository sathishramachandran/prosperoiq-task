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

const useP4LicenseTable = (id: string) => {
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
    "P4 License",
    undefined,
    page,
    limit
  );

  // ✅ Pagination handlers
  const handlePage = (page: number) => {
    params.set("page", page.toString());
    router.push(pathname + `?${params.toString()}`);
  };

  const handleLimit = (limit: number) => {
    const totalPages = Math.ceil((data?.data?.total || 0) / limit);
    params.set("limit", limit.toString());

    if (Number(params.get("page")) > totalPages) {
      params.set("page", "1");
    }

    router.push(pathname + `?${params.toString()}`);
  };

  // ✅ Columns (UPDATED ORDER)
  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = [
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

      { header: "SB No", accessorKey: "SB No" },
      { header: "Inv SNo", accessorKey: "Inv SNo" },
      { header: "Item SNo", accessorKey: "Item SNo" },
      { header: "Licence No", accessorKey: "Licence No" },
      { header: "Description", accessorKey: "Description" },
      { header: "Exp SNo", accessorKey: "Exp SNo" },
      { header: "Exp Qty", accessorKey: "Exp Qty" },
      { header: "UQC", accessorKey: "UQC" },
      { header: "FOB Value", accessorKey: "FOB Value" },
      { header: "SION", accessorKey: "SION" },
      { header: "Descn Import Item", accessorKey: "Descn Import Item" },
      { header: "Imp SNo", accessorKey: "Imp SNo" },
      { header: "Imp Qty", accessorKey: "Imp Qty" },
      { header: "Imp UQC", accessorKey: "Imp UQC" },
      { header: "Indig Imp", accessorKey: "Indig Imp" },
    ];

    return baseColumns.map((col: any) => ({
      ...col,
      cell:
        col.cell ||
        ((info: any) => <div>{info.getValue?.() ?? "-"}</div>),
    }));
  }, []);

  // ✅ Loading skeleton columns
  const loadingColumns = useMemo<ColumnDef<any>[]>(() => {
    return columns.map((column) => ({
      ...column,
      cell: (info: any) => (
        <div
          className="loading my-0.75 mr-4 h-5 w-full rounded-full"
          style={{ animationDelay: `${info.row.id * 0.2}s` }}
        />
      ),
    }));
  }, [columns]);

  // ✅ Table instance
  const table = useReactTable({
    columns: isPending ? loadingColumns : columns,
    data: data?.data?.data || [],
    state: { sorting, rowSelection },

    initialState: {
      columnOrder: [
        "select-col",
        "SB No",
        "Inv SNo",
        "Item SNo",
        "Licence No",
        "Description",
        "Exp SNo",
        "Exp Qty",
        "UQC",
        "FOB Value",
        "SION",
        "Descn Import Item",
        "Imp SNo",
        "Imp Qty",
        "Imp UQC",
        "Indig Imp",
      ],
    },

    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  return {
    table,
    handleLimit,
    handlePage,
    rowSelection,

    total_pages: data?.data?.total_pages || 0,
    page: data?.data?.page || 1,
    limit: data?.data?.page_size || 20,
    total_data: data?.data?.total || 0,
    data_length: data?.data?.data?.length || 0,

    isError,
    data: data?.data?.data || [],
    isLoading: isPending,
  };
};

export default useP4LicenseTable;