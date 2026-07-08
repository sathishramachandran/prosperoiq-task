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
import {
  useBOEReports,
  useInvoiceReports,
  useInvoiceReportsMain,
  useItemDetails,
} from "../useReports";
import { useDebounce } from "../useDebounce";

const useItemDetailsTable = (user_id: string, ) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState<string>('');
    const debounceValue = useDebounce(search)
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const filterParams = Object.fromEntries(searchParams.entries());
  // const invoice_no = searchParams.get('')
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const {
    data: uploadsData,
    isPending,
    isError,
  } = useItemDetails(user_id, "json", filterParams, page, limit);

  const handlePage = (page: number) => {
    params.set("page", page.toString());
    router.push(pathname + `?${params.toString()}`);
  };

  const handleLimit = (limit: number) => {
    const totalPages = Math.ceil((uploadsData?.total || 0) / limit);
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

      //   {
      //     header: "ITEM SR NO",
      //     accessorKey: "ITEM SR NO",
      //     cell: (info: any) => {
      //       return <div>{info.getValue() || "-"}</div>;
      //     },
      //   },

      {
        header: "INV NO",
        accessorKey: "INV NO",
        cell: (info: any) => (
          <div className="">
            <p className="">{info.getValue() || "-"}</p>
          </div>
        ),
      },
      {
        header: "CTH NO",
        accessorKey: "CTH",
        cell: (info: any) => (
          <div className="">
            <p className="">{info.getValue() || "-"}</p>
          </div>
        ),
      },
      {
        header: "DESCRIPTION",
        accessorKey: "DESCRIPTION",
        cell: (info: any) => <div className=""> {info.getValue() || "-"} </div>,
      },
      {
        header: "INVOICE DATE",
        accessorKey: "INV_DATE",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "UNIT PRICE",
        accessorKey: "UNIT PRICE",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"}</div>;
        },
      },
      {
        header: "QUANTITY ",
        accessorKey: "QUANTITY",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "UQC",
        accessorKey: "UQC",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "AMOUNT",
        accessorKey: "AMOUNT",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },

      {
        header: "BILL OF ENTRY NUMBER",
        accessorKey: "BILL OF ENTRY NUMBER",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "BILL OF ENTRY DATE",
        accessorKey: "BILL OF ENTRY DATE",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
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
      data: uploadsData?.data || [],
      state: { sorting, rowSelection },
      initialState: {
        columnOrder: [
          "select-col",
          "INV NO",
          "CTH",
          "DESCRIPTION",
          "BILL OF ENTRY NUMBER",
          "BILL OF ENTRY DATE",
          "INV_DATE",
          "UQC",
          "UNIT PRICE",
          "QUANTITY",
          "AMOUNT",
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
      total_pages: uploadsData?.total_pages || 0,
      page: uploadsData?.page || 1,
      limit: uploadsData?.page_size || 20,
      total_data: uploadsData?.total || 0,
      data_length: uploadsData?.data?.length || 0,
    },
    isError: isError,
    setEndDate,
    setStartDate,
    setFilters,
    setSearch,
    search,
    dashboardvalue: uploadsData?.dashboardvalue,
    data: uploadsData?.data || [],
    isLoading: isPending,
  };
};

export default useItemDetailsTable;
