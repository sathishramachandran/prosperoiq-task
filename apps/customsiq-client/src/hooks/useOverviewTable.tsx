"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGetCustoms } from "@/lib/api_services";
import { uploadsEndPoints } from "@/src/constants/endpoints";
import IndeterminateCheckbox from "@/src/ui/IndeterminateCheckbox";
import LongTextCell from "@/src/components/Dashboard/models/LongText";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const BOE_OVERVIEW_SHEETS = [
  "Summary",
  "P1 General",
  "P1 Manifest",
  "P1 Bonds",
  "P1 Payment",
  "P1 Invoice Summary",
  "P1 Containers",
  "P2 Invoice",
  "P2 Item Details",
  "P3 Item Details",
  "P3 Item Duty",
  "P3 Other Duties",
  "P4 Scheme Notification",
  "P4 License",
  "P4 Certificate",
  "P4 Single Window",
  "P4 Support Docs",
  "P4 Containers",
  "P4 Invoices",
  "P5 Exam Order",
  "P5 Compliance",
  "P5 OOC Details",
  "P6 Declaration",
  "P6 Signatory",
];

const SB_OVERVIEW_SHEETS = [
  "Summary",
  "P1 General",
  "P1 Invoice Summary",
  "P1 Container Details",
  "P2 Invoice",
  "P2 Item Details",
  "P3 Item Details",
  "P4 Drawback",
  "P4 Single Window",
  "P4 Supporting Docs",
  "P4 Invoice Details",
  "P4 License",
  "P4 Container Details",
  "P4 RODTEP",
];

type UseOverviewTableParams = {
  billName: "boe" | "shipping_bill";
  jobIds: string[];
  userId?: string;
  useLongTextCell?: boolean;
};

const useOverviewTable = ({
  billName,
  jobIds: _jobIds,
  userId,
  useLongTextCell = false,
}: UseOverviewTableParams) => {
  const searchParams = useSearchParams();
  const [selectedSheet, setSelectedSheet] = useState<string | null>(
    searchParams.get("sheet_name") || null,
  );
  const [overviewSorting, setOverviewSorting] = useState<SortingState>([]);
  const [overviewRowSelection, setOverviewRowSelection] =
    useState<RowSelectionState>({});
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  const overviewSheets =
    billName === "boe" ? BOE_OVERVIEW_SHEETS : SB_OVERVIEW_SHEETS;

      console.log('testing from bulk')

  const {
    data: overviewResponse,
    isPending: overviewLoading,
    isError: overviewError,
  } = useQuery({
    queryKey: [
      "get_combined_extraction_main",
      selectedSheet,
      billName,
      userId,
      page,
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.getCombinedOverviewByUser(
          userId!,
          selectedSheet!,
          billName,
          page,
          "20",
        ),
      );
      return res;
    },
    enabled: !!selectedSheet && !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const combinedOverviewData = useMemo(
    () => overviewResponse?.data?.data || [],
    [overviewResponse],
  );

  const overviewColumnKey = useMemo(
    () =>
      combinedOverviewData.length > 0
        ? Object.keys(combinedOverviewData[0]).join(",")
        : "",
    [combinedOverviewData],
  );

  const handlePage = (page: number) => {
    params.set("page", page.toString());
    router.push(pathname + `?${params.toString()}`);
  };

  const handleLimit = (limit: number) => {
    const totalPages = Math.ceil(
      (combinedOverviewData?.data?.total || 0) / limit,
    );
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

  const overviewColumns = useMemo<ColumnDef<any>[]>(() => {
    if (combinedOverviewData.length === 0) return [];
    const keys = Object.keys(combinedOverviewData[0]).filter(
      (key) => key !== "id" && key !== "_id",
    );
    return [
      {
        id: "select-col",
        header: ({ table: t }) => (
          <IndeterminateCheckbox
            checked={t.getIsAllRowsSelected()}
            indeterminate={t.getIsSomeRowsSelected()}
            onChange={t.getToggleAllRowsSelectedHandler()}
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
      ...keys.map((key) => ({
        header: key.replaceAll("_", " ").toUpperCase(),
        accessorKey: key,
        cell: (info: any) =>
          useLongTextCell ? (
            <div className="max-w-75">
              <LongTextCell value={info.getValue()} />
            </div>
          ) : (
            <div>{info.getValue() || "-"}</div>
          ),
      })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewColumnKey]);

  const overviewTable = useReactTable({
    columns: overviewColumns,
    data: combinedOverviewData,
    state: { sorting: overviewSorting, rowSelection: overviewRowSelection },
    getRowId: (_row: any, index: number) => String(index),
    onSortingChange: setOverviewSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setOverviewRowSelection,
  });

  return {
    selectedSheet,
    total_pages: overviewResponse?.data?.total_pages || 0,
    page: overviewResponse?.data?.page || 1,
    limit: overviewResponse?.data?.page_size || 20,
    total_data: overviewResponse?.data?.total || 0,
    data_length: overviewResponse?.data?.data?.length || 0,
    setSelectedSheet,
    handleLimit,
    handlePage,
    overviewSheets,
    overviewTable,
    combinedOverviewData,
    overviewLoading,
    overviewError,
  };
};

export default useOverviewTable;
