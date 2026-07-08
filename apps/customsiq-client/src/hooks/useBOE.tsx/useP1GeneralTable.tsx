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

const useP1GeneralTable = (id: string) => {
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
    "P1 General",
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
        accessorKey: "BE No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Be Status",
        accessorKey: "Be Status",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Mode",
        accessorKey: "Mode",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Def Be",
        accessorKey: "Def Be",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Kacha",
        accessorKey: "Kacha",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Sec_48",
        accessorKey: "Sec_48",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Reimp",
        accessorKey: "Reimp",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Advance",
        accessorKey: "Advance",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Assess",
        accessorKey: "Assess",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Exam",
        accessorKey: "Exam",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Hss",
        accessorKey: "Hss",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "First Check",
        accessorKey: "First Check",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Prov Final",
        accessorKey: "Prov Final",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Country of Origin",
        accessorKey: "Country of Origin",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Country of Consignment",
        accessorKey: "Country of Consignment",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Port of Loading",
        accessorKey: "Port of Loading",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Port of Shipment",
        accessorKey: "Port of Shipment",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "ImporterName",
        accessorKey: "ImporterName",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Importer Address 1",
        accessorKey: "Importer Address 1",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Importer Address 2",
        accessorKey: "Importer Address 2",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Importer Address 3",
        accessorKey: "Importer Address 3",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Importer Address 4",
        accessorKey: "Importer Address 4",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Cb_Name",
        accessorKey: "Cb_Name",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Aeo",
        accessorKey: "Aeo",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Ucr",
        accessorKey: "Ucr",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Ad Code",
        accessorKey: "Ad Code",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Bcd",
        accessorKey: "Bcd",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Acd",
        accessorKey: "Acd",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Sws",
        accessorKey: "Sws",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Nccd",
        accessorKey: "Nccd",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Add",
        accessorKey: "Add",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Cvd",
        accessorKey: "Cvd",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Igst",
        accessorKey: "Igst",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "G cess",
        accessorKey: "G cess",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },

      {
        header: "Total Assessable Value",
        accessorKey: "Total Assessable Value",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Sg",
        accessorKey: "Sg",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Saed",
        accessorKey: "Saed",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Gsia",
        accessorKey: "Gsia",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Tta",
        accessorKey: "Tta",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Health",
        accessorKey: "Health",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Total Duty",
        accessorKey: "Total Duty",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Interest",
        accessorKey: "Interest",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Penalty",
        accessorKey: "Penalty",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Fine",
        accessorKey: "Fine",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },
      {
        header: "Total Amount",
        accessorKey: "Total Amount",
        cell: (i: any) => <p>{i.getValue()}</p>,
      },

      {
        header: "Wbe No",
        accessorKey: "Wbe No",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Wbe Date",
        accessorKey: "Wbe Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Wbe Site",
        accessorKey: "Wbe Site",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Wh Code",
        accessorKey: "Wh Code",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Submission Date",
        accessorKey: "Submission Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Submission Time",
        accessorKey: "Submission Time",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Assessment Date",
        accessorKey: "Assessment Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Assessment Time",
        accessorKey: "Assessment Time",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Exam Date",
        accessorKey: "Exam Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Exam Time",
        accessorKey: "Exam Time",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Ooc h Date",
        accessorKey: "Ooc h Date",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Ooc h Time",
        accessorKey: "Ooc h Time",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },

      {
        header: "Exchange Rate Amount",
        accessorKey: "Exchange Rate Amount",
        cell: (i: any) => <p>{i.getValue() || "-"}</p>,
      },
      {
        header: "Exchange Rate Currency",
        accessorKey: "Exchange Rate Currency",
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
          "BE No",
          "Be Status",
          "Mode",
          "Def Be",
          "Kacha",
          "Sec_48",
          "Reimp",
          "Advance",
          "Assess",
          "Exam",
          "Hss",
          "First Check",
          "Prov Final",
          "Country of Origin",
          "Country of Consignment",
          "Port of Loading",
          "Port of Shipment",
          "ImporterName",
          "Importer Address 1",
          "Importer Address 2",
          "Importer Address 3",
          "Importer Address 4",
          "Cb_Name",
          "Aeo",
          "Ucr",
          "Ad Code",
          "Bcd",
          "Acd",
          "Sws",
          "Nccd",
          "Add",
          "Cvd",
          "Igst",
          "G cess",
          "Total Assessable Value",
          "Sg",
          "Saed",
          "Gsia",
          "Tta",
          "Health",
          "Total Duty",
          "Interest",
          "Penalty",
          "Fine",
          "Total Amount",
          "Wbe No",
          "Wbe Date",
          "Wbe Site",
          "Wh Code",
          "Submission Date",
          "Submission Time",
          "Assessment Date",
          "Assessment Time",
          "Exam Date",
          "Exam Time",
          "Ooc h Date",
          "Ooc h Time",
          "Exchange Rate Amount",
          "Exchange Rate Currency",
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

export default useP1GeneralTable;
