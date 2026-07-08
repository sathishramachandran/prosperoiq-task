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

const userP2ItemDutyTable = (id: string) => {
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
    "P3 Item Duty",
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

      // BCD
      {
        header: "BCD Notn No",
        accessorKey: "BCD Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "BCD Notn SNo",
        accessorKey: "BCD Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "BCD Rate",
        accessorKey: "BCD Rate",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "BCD Amount",
        accessorKey: "BCD Amount",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "BCD Duty Fg",
        accessorKey: "BCD Duty Fg",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },

      // ACD
      {
        header: "ACD Notn No",
        accessorKey: "ACD Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ACD Notn SNo",
        accessorKey: "ACD Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ACD Rate",
        accessorKey: "ACD Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ACD Amount",
        accessorKey: "ACD Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ACD Duty Fg",
        accessorKey: "ACD Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // SWS
      {
        header: "SWS Notn No",
        accessorKey: "SWS Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SWS Notn SNo",
        accessorKey: "SWS Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SWS Rate",
        accessorKey: "SWS Rate",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "SWS Amount",
        accessorKey: "SWS Amount",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "SWS Duty Fg",
        accessorKey: "SWS Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // IGST
      {
        header: "IGST Notn No",
        accessorKey: "IGST Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "IGST Notn SNo",
        accessorKey: "IGST Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "IGST Rate",
        accessorKey: "IGST Rate",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "IGST Amount",
        accessorKey: "IGST Amount",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "IGST Duty Fg",
        accessorKey: "IGST Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // G.Cess
      {
        header: "G.Cess Notn No",
        accessorKey: "G.Cess Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "G.Cess Notn SNo",
        accessorKey: "G.Cess Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "G.Cess Rate",
        accessorKey: "G.Cess Rate",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "G.Cess Amount",
        accessorKey: "G.Cess Amount",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "G.Cess Duty Fg",
        accessorKey: "G.Cess Duty Fg",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },

      // ADD
      {
        header: "ADD Notn No",
        accessorKey: "ADD Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ADD Notn SNo",
        accessorKey: "ADD Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ADD Rate",
        accessorKey: "ADD Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ADD Amount",
        accessorKey: "ADD Amount",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "ADD Duty Fg",
        accessorKey: "ADD Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // CVD
      {
        header: "CVD Notn No",
        accessorKey: "CVD Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CVD Notn SNo",
        accessorKey: "CVD Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CVD Rate",
        accessorKey: "CVD Rate",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "CVD Amount",
        accessorKey: "CVD Amount",
        cell: (i: any) => <p>{i.getValue() }</p>,
      },
      {
        header: "CVD Duty Fg",
        accessorKey: "CVD Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // SG
      {
        header: "SG Notn No",
        accessorKey: "SG Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SG Notn SNo",
        accessorKey: "SG Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SG Rate",
        accessorKey: "SG Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SG Amount",
        accessorKey: "SG Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SG Duty Fg",
        accessorKey: "SG Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // T.Value
      {
        header: "T.Value Notn No",
        accessorKey: "T.Value Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "T.Value Notn SNo",
        accessorKey: "T.Value Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "T.Value Rate",
        accessorKey: "T.Value Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "T.Value Amount",
        accessorKey: "T.Value Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "T.Value Duty Fg",
        accessorKey: "T.Value Duty Fg",
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

          "BCD Notn No",
          "BCD Notn SNo",
          "BCD Rate",
          "BCD Amount",
          "BCD Duty Fg",

          "ACD Notn No",
          "ACD Notn SNo",
          "ACD Rate",
          "ACD Amount",
          "ACD Duty Fg",

          "SWS Notn No",
          "SWS Notn SNo",
          "SWS Rate",
          "SWS Amount",
          "SWS Duty Fg",

          "SAD Notn No",
          "SAD Notn SNo",
          "SAD Rate",
          "SAD Amount",
          "SAD Duty Fg",

          "IGST Notn No",
          "IGST Notn SNo",
          "IGST Rate",
          "IGST Amount",
          "IGST Duty Fg",

          "G.Cess Notn No",
          "G.Cess Notn SNo",
          "G.Cess Rate",
          "G.Cess Amount",
          "G.Cess Duty Fg",

          "ADD Notn No",
          "ADD Notn SNo",
          "ADD Rate",
          "ADD Amount",
          "ADD Duty Fg",

          "CVD Notn No",
          "CVD Notn SNo",
          "CVD Rate",
          "CVD Amount",
          "CVD Duty Fg",

          "SG Notn No",
          "SG Notn SNo",
          "SG Rate",
          "SG Amount",
          "SG Duty Fg",

          "T.Value Notn No",
          "T.Value Notn SNo",
          "T.Value Rate",
          "T.Value Amount",
          "T.Value Duty Fg",
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

export default userP2ItemDutyTable;
