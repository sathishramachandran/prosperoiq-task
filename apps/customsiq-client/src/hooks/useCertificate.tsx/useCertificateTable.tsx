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
import { useBOEReports } from "../useReports";
import { useDebounce } from "../useDebounce";

const userCertificateTable = (user_id: string, report_name: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const debounceValue = useDebounce(search);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const {
    data: uploadsData,
    isPending,
    isError,
  } = useBOEReports(
    user_id,
    report_name,
    page,
    limit,
    filters,
    startDate,
    endDate,
    debounceValue,
  );

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

      {
        header: "ID",
        id: "Id",
        cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        header: "BOE NUMBER",
        accessorKey: "BOE No",
        cell: (info: any) => (
          <div className="">
            <p className="">{info.getValue() || "-"}</p>
          </div>
        ),
      },
      {
        header: "CERTIFICATE NUMBER",
        accessorKey: "Certificate No",
        cell: (info: any) => <div className=""> {info.getValue() || "-"} </div>,
      },
      {
        header: "DATE ",
        accessorKey: "Date",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"}</div>;
        },
      },
      {
        header: "AD CODE ",
        accessorKey: "Ad Code",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "TYPE ",
        accessorKey: "Type",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"} </div>;
        },
      },
      {
        header: "COUNTRY OF ORIGIN",
        accessorKey: "COUNTRY OF ORIGIN",
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
          "Id",
          "BOE No",
          "Certificate No",
          "Date",
          "Ad Code",
          "Type",
          "COUNTRY OF ORIGIN",
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
    // dataUpdatedAt,
    // refetch,
    // isRefetching,
    setEndDate,
    setStartDate,
    setFilters,
    setSearch,
    search,
    data: uploadsData?.data || [],
    dashboardvalue: uploadsData?.dashboardvalue,
    isLoading: isPending,
  };
};

export default userCertificateTable;
