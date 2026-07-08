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

const useP3OtherDetails = (id: string) => {
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
    "P3 Other Duties",
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

      // SP EXD
      {
        header: "SP EXD Notn No",
        accessorKey: "SP EXD Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SP EXD Notn SNo",
        accessorKey: "SP EXD Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SP EXD Rate",
        accessorKey: "SP EXD Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SP EXD Amount",
        accessorKey: "SP EXD Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "SP EXD Duty Fg",
        accessorKey: "SP EXD Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // ChCess
      {
        header: "ChCess Notn No",
        accessorKey: "ChCess Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ChCess Notn SNo",
        accessorKey: "ChCess Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ChCess Rate",
        accessorKey: "ChCess Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ChCess Amount",
        accessorKey: "ChCess Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "ChCess Duty Fg",
        accessorKey: "ChCess Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // TTA
      {
        header: "TTA Notn No",
        accessorKey: "TTA Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "TTA Notn SNo",
        accessorKey: "TTA Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "TTA Rate",
        accessorKey: "TTA Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "TTA Amount",
        accessorKey: "TTA Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "TTA Duty Fg",
        accessorKey: "TTA Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // Cess
      {
        header: "Cess Notn No",
        accessorKey: "Cess Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Cess Notn SNo",
        accessorKey: "Cess Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Cess Rate",
        accessorKey: "Cess Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Cess Amount",
        accessorKey: "Cess Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Cess Duty Fg",
        accessorKey: "Cess Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // CAIDC
      {
        header: "CAIDC Notn No",
        accessorKey: "CAIDC Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CAIDC Notn SNo",
        accessorKey: "CAIDC Notn SNo",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CAIDC Rate",
        accessorKey: "CAIDC Rate",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CAIDC Amount",
        accessorKey: "CAIDC Amount",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CAIDC Duty Fg",
        accessorKey: "CAIDC Duty Fg",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },

      // EAIDC
      {
        header: "EAIDC Notn No",
        accessorKey: "EAIDC Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "EAIDC Notn SNo",
        accessorKey: "EAIDC Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "EAIDC Rate",
        accessorKey: "EAIDC Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "EAIDC Amount",
        accessorKey: "EAIDC Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "EAIDC Duty Fg",
        accessorKey: "EAIDC Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // CUS EDC
      {
        header: "CUS EDC Notn No",
        accessorKey: "CUS EDC Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CUS EDC Notn SNo",
        accessorKey: "CUS EDC Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CUS EDC Rate",
        accessorKey: "CUS EDC Rate",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CUS EDC Amount",
        accessorKey: "CUS EDC Amount",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CUS EDC Duty Fg",
        accessorKey: "CUS EDC Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // CUS HEC
      {
        header: "CUS HEC Notn No",
        accessorKey: "CUS HEC Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CUS HEC Notn SNo",
        accessorKey: "CUS HEC Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "CUS HEC Rate",
        accessorKey: "CUS HEC Rate",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CUS HEC Amount",
        accessorKey: "CUS HEC Amount",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "CUS HEC Duty Fg",
        accessorKey: "CUS HEC Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // NCD
      {
        header: "NCD Notn No",
        accessorKey: "NCD Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "NCD Notn SNo",
        accessorKey: "NCD Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "NCD Rate",
        accessorKey: "NCD Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "NCD Amount",
        accessorKey: "NCD Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "NCD Duty Fg",
        accessorKey: "NCD Duty Fg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      // AGGR
      {
        header: "AGGR Notn No",
        accessorKey: "AGGR Notn No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "AGGR Notn SNo",
        accessorKey: "AGGR Notn SNo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "AGGR Rate",
        accessorKey: "AGGR Rate",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "AGGR Amount",
        accessorKey: "AGGR Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "AGGR Duty Fg",
        accessorKey: "AGGR Duty Fg",
        cell: (i: any) => <p>{i.getValue()}</p>,
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

          "SP EXD Notn No",
          "SP EXD Notn SNo",
          "SP EXD Rate",
          "SP EXD Amount",
          "SP EXD Duty Fg",

          "ChCess Notn No",
          "ChCess Notn SNo",
          "ChCess Rate",
          "ChCess Amount",
          "ChCess Duty Fg",

          "TTA Notn No",
          "TTA Notn SNo",
          "TTA Rate",
          "TTA Amount",
          "TTA Duty Fg",

          "Cess Notn No",
          "Cess Notn SNo",
          "Cess Rate",
          "Cess Amount",
          "Cess Duty Fg",

          "CAIDC Notn No",
          "CAIDC Notn SNo",
          "CAIDC Rate",
          "CAIDC Amount",
          "CAIDC Duty Fg",

          "EAIDC Notn No",
          "EAIDC Notn SNo",
          "EAIDC Rate",
          "EAIDC Amount",
          "EAIDC Duty Fg",

          "CUS EDC Notn No",
          "CUS EDC Notn SNo",
          "CUS EDC Rate",
          "CUS EDC Amount",
          "CUS EDC Duty Fg",

          "CUS HEC Notn No",
          "CUS HEC Notn SNo",
          "CUS HEC Rate",
          "CUS HEC Amount",
          "CUS HEC Duty Fg",

          "NCD Notn No",
          "NCD Notn SNo",
          "NCD Rate",
          "NCD Amount",
          "NCD Duty Fg",

          "AGGR Notn No",
          "AGGR Notn SNo",
          "AGGR Rate",
          "AGGR Amount",
          "AGGR Duty Fg",
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

export default useP3OtherDetails;
