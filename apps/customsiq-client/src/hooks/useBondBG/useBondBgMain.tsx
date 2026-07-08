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
import { useBONDBGMainReports } from "../useReports";

const useBondBgMain = (user_id: string, bond_no: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useBONDBGMainReports(
    user_id,
    bond_no,
    page,
    limit,
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
        header: "BILL OF ENTRY NUMBER",
        accessorKey: "BILL OF ENTRY NUMBER",
        cell: (info: any) => {
          return <div>{info.getValue()}</div>;
        },
      },
      {
        header: "BILL OF ENTRY DATE",
        accessorKey: "BILL OF ENTRY DATE",
        cell: (info: any) => (
          <div className="">
            <p className="">{info.getValue() || "-"}</p>
          </div>
        ),
      },
      {
        header: "IEC/BR",
        accessorKey: "IEC/BR",
        cell: (info: any) => <div className=""> {info.getValue() || "-"} </div>,
      },

      {
        header: "CB NAME",
        accessorKey: "CB NAME",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "AD CODE",
        accessorKey: "AD CODE",
        cell: (info: any) => {
          return <div>{info.getValue()} </div>;
        },
      },
      {
        header: "INVOICE NO",
        accessorKey: "INVOICE NO",
        cell: (info: any) => {
          return <div>{info.getValue()} </div>;
        },
      },
      {
        header: "INV AMT",
        accessorKey: "INVAMT",
        cell: (info: any) => {
          const value = info.getValue();
          const currency = info.row.original["INV CUR"];

          if (!value) return <div>-</div>;

          const formatted = Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <div>
              {formatted} {currency || ""}
            </div>
          );
        },
      },

      {
        header: "BOND NO",
        accessorKey: "BOND NO",
        cell: (info: any) => {
          return <div>{info.getValue()} </div>;
        },
      },
      {
        header: "PORT",
        accessorKey: "PORT",
        cell: (info: any) => {
          return <div>{info.getValue()} </div>;
        },
      },
      {
        header: "BOND CODE",
        accessorKey: "BOND CODE",
        cell: (info: any) => {
          return <div>{info.getValue()} </div>;
        },
      },
      {
        header: "DEBIT AMT",
        accessorKey: "DEBT AMT",
        cell: (info: any) => {
          return (
            <div>
              {info.getValue()
                ? Number(info.getValue()).toLocaleString("en-IN")
                : "-"}
            </div>
          );
        },
      },
      {
        header: "BG AMT",
        accessorKey: "BG AMT",
        cell: (info: any) => {
          return (
            <div>
              {info.getValue()
                ? Number(info.getValue()).toLocaleString("en-IN")
                : "-"}
            </div>
          );
        },
      },
      {
        header: "ASS VALUE (INR)",
        accessorKey: "ASS VALUE",
        cell: (info: any) => {
          return (
            <div>
              {info.getValue()
                ? Number(info.getValue()).toLocaleString("en-IN")
                : "-"}
            </div>
          );
        },
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
          "BOND NO",
          "BILL OF ENTRY NUMBER",
          "BILL OF ENTRY DATE",
          "IEC/BR",
          "PORT",
          "BOND CODE",
          "BG AMT",
          "CB NAME",
          "AD CODE",
          "INVOICE NO",
          "DEBT AMT",
          "INVAMT",
          "ASS VALUE",
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
    data: data?.data || [],
    isLoading: isPending,
  };
};

export default useBondBgMain;
