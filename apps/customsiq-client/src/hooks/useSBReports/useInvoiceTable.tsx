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

import { useGetSBReports } from "./useSBReportApi";
import { useDebounce } from "../useDebounce";
// import DownButtons from "./DowloadButtons";

const useInvoiceTable = (user_id: string, format: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const searchValue = useDebounce(search);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetSBReports(
    user_id,
    "p4-invoice-details",
    format,
    page,
    limit,
    filters,
    startDate || "",
    endDate || "",
    searchValue || "",
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
        header: "SNo",
        accessorKey: "SNO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Invoice No",
        accessorKey: "Invice no",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Invoice Amount",
        accessorKey: "Invoice amount",
        /*cell: (info: any) => {
          const row = info.row.original;
          return <p>{row["Invoice amount"]}</p>;
        },
      },*/
        cell: (info: any) => {
          const val = info.getValue();
          const num = parseFloat(String(val).replace(/,/g, ""));

          return (
            <p>
              {isNaN(num)
                ? val
                : num.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
            </p>
          );
        },
      },
      {
        header: "CURRENCY",
        accessorKey: "Currency",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Item SNo",
        accessorKey: "Item Sno",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "HS Code",
        accessorKey: "HS Code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Description",
        accessorKey: "Description",
        cell: (info: any) => (
          <p className="line-clamp-2">{info.getValue() || "-"}</p>
        ),
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
      {
        header: "Rate",
        accessorKey: "Rate",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Value (F/C)",
        accessorKey: "Value(F/C)",
        cell: (info: any) => {
          const val = info.getValue();
          const num = parseFloat(String(val).replace(/,/g, ""));

          return (
            <p>
              {isNaN(num)
                ? val
                : num.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
            </p>
          );
        },
      },

      {
        header: "Freight",
        accessorKey: "Freight",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "Insurance",
        accessorKey: "Insurance",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "Discount",
        accessorKey: "Discount",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "Commission",
        accessorKey: "Commission",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },
      {
        header: "Deductions",
        accessorKey: "Deductions",
        cell: (info: any) => <p>{info.getValue()}</p>,
      },

      {
        header: "ConsigneeName and address",
        accessorKey: "ConsigneeName and address",
        cell: (info: any) => (
          <p className="line-clamp-2">{info.getValue() || "-"}</p>
        ),
      },
      {
        header: "Type",
        accessorKey: "Type",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "AD Code",
        accessorKey: "Ad code",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "CB Name",
        accessorKey: "CB name",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "GSTIN",
        accessorKey: "GSTIN",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      // {
      //   header: "IFSC",
      //   accessorKey: "IFSC",
      //   cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      // },
      {
        header: "SB No",
        accessorKey: "SB No",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "SB Date",
        accessorKey: "SB Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IEC/BR",
        accessorKey: "IEC/BR",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "FOREX BANK A/C NO",
        accessorKey: "FOREX BANK A/C NO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "DBK BAN A/C NO",
        accessorKey: "DBK BAN A/C NO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO No",
        accessorKey: "LEO NO",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Realisation Time",
        accessorKey: "Realisation Time",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "IFSC",
        accessorKey: "IFSC",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "State Of Origin",
        accessorKey: "State Of Origin",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "District Of Origin",
        accessorKey: "District Of Origin",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Invoice paid type ",
        accessorKey: "invoice_paid_type",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "LEO Date",
        accessorKey: "Leo Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "BRC Date",
        accessorKey: "BRC Date",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Port of Loading",
        accessorKey: "Port of Loading",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Country of Final Destination",
        accessorKey: "Country of Final Destination",
        cell: (info: any) => <p>{info.getValue() || "-"}</p>,
      },
      {
        header: "Final Destination",
        accessorKey: "Final Destination",
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
      data: data?.data?.data || [],
      state: { sorting, rowSelection },
      initialState: {
        columnOrder: [
          "select-col",
          "SNO",
          "Invice no",
          "invoice_paid_type",
          "Invoice amount",
          "SB No",
          "SB Date",
          "Currency",
          "Item Sno",
          "HS Code",  
          "Description  ",
          "QTY",
          "UQC",
          "Rate",
          "Value(F/C)",
          "Freight",
          "Insurance",
          "Discount",
          "Commission",
          "Deductions",
          "ConsigneeName and address",
          "District Of Origin",
          "State Of Origin",
          "Type",
          "Ad code",
          "CB name",
          "GSTIN",
          "FOREX BANK A/C NO",
          "DBK BAN A/C NO",
          "IFSC",
          "IEC/BR",
          "LEO NO",
          "Leo Date",
          "BRC Date",
          "Realisation Time",
          "Port of Loading",
          "Country of Final Destination",
          "Final Destination",
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
    setEndDate,
    setStartDate,
    search,
    setSearch,
    setFilters,
    data: data?.data?.data || [],
    dashboardvalue: data?.data?.dashboardvalue || [],
    isLoading: isPending,
  };
};

export default useInvoiceTable;
