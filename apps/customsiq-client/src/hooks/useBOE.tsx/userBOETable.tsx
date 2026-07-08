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
import { useBoeSbDelete, useGetUploadsById } from "./useBOEApi";
import DownButtons from "./DowloadButtons";
import clsx from "clsx";
import DeleteModel from "@/src/components/Dashboard/DeleteModel";

const userBOETable = (id: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const router = useRouter();
  const [search, setSearch] = useState("");
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
  } = useGetUploadsById(
    id,
    "boe",
    page,
    limit,
    startDate || "",
    endDate || "",
    search || "",
  );

  const { data, isPending: deletePending, mutateAsync } = useBoeSbDelete();

  const handlePage = (page: number) => {
    params.set("page", page.toString());
    router.push(pathname + `?${params.toString()}`);
  };

  const handleLimit = (limit: number) => {
    const totalPages = Math.ceil((uploadsData?.data?.total || 0) / limit);
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
        header: "BOE Number ",
        accessorKey: "boe_no",
        cell: (info: any) => (
          <div className="">
            <p className="">{info.getValue() || "-"}</p>
          </div>
        ),
      },
      {
        header: "BOE Date",
        accessorKey: "boe_date",
        cell: (info: any) => <div className=""> {info.getValue() || "-"} </div>,
      },
      {
        header: "Port Code ",
        accessorKey: "port_code",
        cell: (info: any) => {
          return <div>{info.getValue() || "-"}</div>;
        },
      },
      {
        header: "Status ",
        accessorKey: "status",
        cell: (info: any) => {
          return (
            <div>
              {info.getValue() === "queued" || info.getValue() === "processing"
                ? "Processing"
                : "Completed"}{" "}
            </div>
          );
        },
      },
      {
        header: "Download",
        accessorKey: "download",

        cell: (info) => {
          const boe_no = info.row.original["boe_no"];
          return (
            <DownButtons
              file={boe_no}
              job_id={info.row.original.job_id}
              status={info.row.original.status}
              bill_name="boe"
              user_id={id}
            />
          );
        },
      },
      {
        header: "Delete",
        accessorKey: "delete",

        cell: (info) => {
          return (
            <div>
              <DeleteModel
                no={info.row.original.boe_no}
                billName="Bill of Entry"
                mutateAsync={async () => {
                  await mutateAsync({
                    user_id: id,
                    job_id: info.row.original.job_id,
                    bill_name: "boe",
                  });
                }}
                isPending={deletePending}
              >
                <span className=" bg-red-600 cursor-pointer rounded-xl text-white px-4 py-1">
                  Delete
                </span>
              </DeleteModel>
            </div>
          );
        },
      },
      {
        header: "View",
        id: "View",

        cell: (info) => {
          const job_id = info.row.original["job_id"];
          const status = info.row.original["status"];
          const boe_no = info.row.original["boe_no"];
          return (
            <button
              disabled={status === "queued" || status === "processing"}
              onClick={() => {
                params.set("job_id", job_id);
                params.set("boe_no", boe_no);
                params.set("sheet_name", "Summary");
                params.set("bill_name", "boe");
                router.push(
                  `${pathname}/extractiondetails?${params.toString()}`,
                );
              }}
              className={clsx(
                "cursor-pointer px-3 py-1 text-xs bg-blue-100 border w-fit text-blue-600 rounded-md hover:bg-blue-100 active:scale-95 transition",
                info.getValue() === "queued" ||
                  (info.getValue() === "processing" && "cursor-default"),
              )}
            >
              Overview
            </button>
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
      data: uploadsData?.data?.data || [],
      state: { sorting, rowSelection },
      initialState: {
        columnOrder: [
          "select-col",
          "job_id",
          "boe_no",
          "boe_date",
          "port_code",
          "status",
          "View",
          "download",
        ],
      },
      getRowId: (row) => row.id,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
      autoResetPageIndex: false,
    }),
    handleLimit,
    handlePage,
    rowSelection,
    ...{
      total_pages: uploadsData?.data?.total_pages || 0,
      page: uploadsData?.data?.page || 1,
      limit: uploadsData?.data?.page_size || 20,
      total_data: uploadsData?.data?.total || 0,
      data_length: uploadsData?.data?.data?.length || 0,
    },
    isError: isError,
    // dataUpdatedAt,
    // refetch,
    setSearch,
    setEndDate,
    setStartDate,
    // isRefetching,
    data: uploadsData?.data?.data || [],
    isLoading: isPending,
  };
};

export default userBOETable;
