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
import DownButtons from "./DowloadButtons";

const userP2InvoiceTable = (id: string) => {
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
    "P2 Invoice",
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
        header: "Part2 Inv S No",
        accessorKey: "Part2 Inv S No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Invoice No",
        accessorKey: "Part 2 Invoice No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Invoice Date",
        accessorKey: "Part 2 Invoice Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Purchase Order No",
        accessorKey: "Part 2 Purchase Order No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Purchase order Date",
        accessorKey: "Part 2 Purchase order Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Lc No",
        accessorKey: "Part 2 Lc No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Lc Date",
        accessorKey: "Part 2 Lc Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Contract No",
        accessorKey: "Part 2 Contract No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Part 2 Contract Date",
        accessorKey: "Part 2 Contract Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Buyer Name",
        accessorKey: "Buyer Name",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Buyer Address 1",
        accessorKey: "Buyer Address 1",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Buyer Address 2",
        accessorKey: "Buyer Address 2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Buyer Address 3",
        accessorKey: "Buyer Address 3",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Buyer Address 4",
        accessorKey: "Buyer Address 4",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Seller Name",
        accessorKey: "Seller Name",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Seller Address 1",
        accessorKey: "Seller Address 1",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Seller Address 2",
        accessorKey: "Seller Address 2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Seller Address 3",
        accessorKey: "Seller Address 3",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Seller Address 4",
        accessorKey: "Seller Address 4",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Supplier Name",
        accessorKey: "Supplier Name",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Supplier Address 1",
        accessorKey: "Supplier Address 1",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Supplier Address 2",
        accessorKey: "Supplier Address 2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Supplier Address 3",
        accessorKey: "Supplier Address 3",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Supplier Address 4",
        accessorKey: "Supplier Address 4",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Third Party Name",
        accessorKey: "Third Party Name",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Third Party Address 1",
        accessorKey: "Third Party Address 1",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Third Party Address 2",
        accessorKey: "Third Party Address 2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Third Party Address 3",
        accessorKey: "Third Party Address 3",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Third Party Address 4",
        accessorKey: "Third Party Address 4",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Aeo P2",
        accessorKey: "Aeo P2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Ad Code P2",
        accessorKey: "Ad Code P2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Inv Value",
        accessorKey: "Inv Value",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Freight",
        accessorKey: "Freight",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Insurance",
        accessorKey: "Insurance",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Hss",
        accessorKey: "Hss",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Loading",
        accessorKey: "Loading",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Commn",
        accessorKey: "Commn",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Pay Terms",
        accessorKey: "Pay Terms",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Valuation Method",
        accessorKey: "Valuation Method",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Reltd",
        accessorKey: "Reltd",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Svb Ch",
        accessorKey: "Svb Ch",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Svb No",
        accessorKey: "Svb No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Svb Dt",
        accessorKey: "Svb Dt",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Loa",
        accessorKey: "Loa",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Valuation Cur",
        accessorKey: "Valuation Cur",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Valuation Term",
        accessorKey: "Valuation Term",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Cb",
        accessorKey: "Cb",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Coc",
        accessorKey: "Coc",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Cop",
        accessorKey: "Cop",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Hnd Chg",
        accessorKey: "Hnd Chg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Gs",
        accessorKey: "Gs",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Doc Ch",
        accessorKey: "Doc Ch",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Coo",
        accessorKey: "Coo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "R Lf",
        accessorKey: "R Lf",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Oth Cost",
        accessorKey: "Oth Cost",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Ld Uld",
        accessorKey: "Ld Uld",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Ws",
        accessorKey: "Ws",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Otc",
        accessorKey: "Otc",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Misc Charge",
        accessorKey: "Misc Charge",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Ass Value",
        accessorKey: "Ass Value",
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
          "Part2 Inv S No",
          "Part 2 Invoice No",
          "Part 2 Invoice Date",
          "Part 2 Purchase Order No",
          "Part 2 Purchase order Date",
          "Part 2 Lc No",
          "Part 2 Lc Date",
          "Part 2 Contract No",
          "Part 2 Contract Date",
          "Buyer Name",
          "Buyer Address 1",
          "Buyer Address 2",
          "Buyer Address 3",
          "Buyer Address 4",
          "Seller Name",
          "Seller Address 1",
          "Seller Address 2",
          "Seller Address 3",
          "Seller Address 4",
          "Supplier Name",
          "Supplier Address 1",
          "Supplier Address 2",
          "Supplier Address 3",
          "Supplier Address 4",
          "Third Party Name",
          "Third Party Address 1",
          "Third Party Address 2",
          "Third Party Address 3",
          "Third Party Address 4",
          "Aeo P2",
          "Ad Code P2",
          "Inv Value",
          "Freight",
          "Insurance",
          "Hss",
          "Loading",
          "Commn",
          "Pay Terms",
          "Valuation Method",
          "Reltd",
          "Svb Ch",
          "Svb No",
          "Svb Dt",
          "Loa",
          "Valuation Cur",
          "Valuation Term",
          "Cb",
          "Coc",
          "Cop",
          "Hnd Chg",
          "Gs",
          "Doc Ch",
          "Coo",
          "R Lf",
          "Oth Cost",
          "Ld Uld",
          "Ws",
          "Otc",
          "Misc Charge",
          "Ass Value",
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

export default userP2InvoiceTable;
