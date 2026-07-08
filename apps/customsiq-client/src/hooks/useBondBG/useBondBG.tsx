"use client";

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
import { useBONDBGReports } from "../useReports";
import HeaderWithFilter from "@/src/ui/Filter";
import { useDebounce } from "../useDebounce";
import IndeterminateCheckbox from "@/src/ui/IndeterminateCheckbox";

const userBONDTable = (user_id: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState<string>('');
  const debounceValue = useDebounce(search)
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useBONDBGReports(
    user_id,
    page,
    limit,
    filters,
    startDate,
    endDate,
    debounceValue
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
        header: () => "Bond No",
        accessorKey: "BOND_NO",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"}</div>;
        },
      },
      {
        header: "Port",
        accessorKey: "PORT",
        cell: (info: any) => (
          <div className="">
            <p className="">{info.getValue() || "-"}</p>
          </div>
        ),
      },
      {
        header: "Bond Code",
        accessorKey: "BOND_CODE",
        cell: (info: any) => <div className=""> {info.getValue() || "-"} </div>,
      },
      {
        header: "No of BOE's",
        accessorKey: "NO_OF_BOES",
        cell: (info: any) => {
          const INVOICE_NO = info.row.original["BOND_NO"];
          return (
            <div
              className="cursor-pointer px-3 py-1 text-sm bg-blue-100 border w-fit text-blue-600 rounded-md hover:bg-blue-100 active:scale-95 transition"
              onClick={() => {
                params.set("bond_no", INVOICE_NO);
                router.push(`${pathname}/bondbg?${params.toString()}`);
              }}
            >
              {info.getValue() || "-"}{" "}
            </div>
          );
        },
      },
      {
        header: "Total Debit Amount",
        accessorKey: "TOTAL_DEBT_AMT",
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
        header: "Total BG Amt",
        accessorKey: "TOTAL_BG_AMT",
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
          "BOND_NO",
          "PORT",
          "BOND_CODE",
          "NO_OF_BOES",
          "TOTAL_DEBT_AMT",
          "TOTAL_BG_AMT",
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
    setEndDate,
    setStartDate,
    setFilters,
    setSearch,
    search,
    dashboardvalue: data?.dashboardvalue,
    filter: data?.filter,
    isLoading: isPending,
  };
};

export default userBONDTable;
