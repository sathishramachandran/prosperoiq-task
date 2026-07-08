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
import { useGetSBOverview } from "./useSEApi";

const useP1GeneralTable = (id: string) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 20;

  const { data, isPending, isError } = useGetSBOverview(
    id,
    "shipping_bill",
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
    }

    router.push(pathname + `?${params.toString()}`);
  };

  // ✅ HEADER ARRAY (YOUR SOURCE OF TRUTH)
  const headers = [
    "SB No",
    "SB Type",
    "Mode",
    "Assess",
    "Exmn",
    "Jobbing",
    "MEIS",
    "DBK",
    "RODTP",
    "Licence",
    "DFRC",
    "Re-Exp",
    "LUT",
    "Port of Loading",
    "Country of Final Destination",
    "State of Origin",
    "Port of Final Destination",
    "Port of Discharge",
    "Country of Discharge",
    "Exporter Name",
    "Exporter Address 1",
    "Exporter Address 2",
    "Exporter Address 3",
    "Exporter Type",
    "AD Code",
    "RBI Waiver No",
    "RBI Waiver Date",
    "CB Name",
    "AEO",
    "Consignee Name",
    "Consignee Address 1",
    "Consignee Address 2",
    "Consignee Address 3",
    "Consignee GSTIN",
    "Consignee GSTIN Type",
    "Forex Bank A/C No",
    "DBK Bank A/C No",
    "IFSC No",
    "FOB Value",
    "Freight",
    "Insurance",
    "Discount",
    "Commission",
    "DBK Claim",
    "IGST Amt",
    "Cess Amt",
    "Duty",
    "Cess",
    "Deductions",
    "Packing Charges",
    "IGST Value",
    "RODTEP Amt",
    "ROSCTL Amt",
    "MAWB No",
    "MAWB Date",
    "HAWB No",
    "HAWB Date",
    "CIN No",
    "CIN Date",
    "CIN Site ID",
    "Seal Type",
    "Nature of Cargo",
    "No of Packets",
    "No of Containers",
    "Loose Packets",
    "Marks and Numbers",
    "Submission Date",
    "Submission Time",
    "Assessment Date",
    "Assessment Time",
    "Examination Date",
    "Examination Time",
    "LEO Date",
    "LEO Time",
    "LEO No",
    "LEO 2 99",
    "BRC Realisation Date",
    "Rotn No",
    "Rotn Date",
    "Vessel Name",
    "SEZ Unit Details",
    "Location Info",
  ];

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const headers = data?.data?.columns || [];

    const dynamicColumns = headers.map((header: string) => ({
      header: header === "LEO 2 99" ? "Leo date 2" : header,
      accessorKey: header,
      cell: (info: any) => {
        const value = info.getValue();
        return <div>{value !== null && value !== undefined ? value : "-"}</div>;
      },
    }));

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
      ...dynamicColumns,
    ];
  }, [data?.data?.columns]);

  // ✅ LOADING SKELETON
  const loadingColumns = useMemo<ColumnDef<any>[]>(() => {
    return columns.map((column) => ({
      ...column,
      cell: (info: any) => (
        <div
          className="loading my-0.75 mr-4 h-5 w-full rounded-full"
          style={{ animationDelay: `${info.row.id * 0.2}s` }}
        />
      ),
    }));
  }, [columns]);

  // ✅ TABLE INSTANCE
  const table = useReactTable({
    columns: isPending ? loadingColumns : columns,
    data: data?.data?.data || [],
    state: { sorting, rowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    initialState: {
      columnOrder: ["select-col", ...(data?.data?.columns || [])],
    },

    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return {
    table,
    handleLimit,
    handlePage,
    rowSelection,
    total_pages: data?.data?.total_pages || 0,
    page: data?.data?.page || 1,
    limit: data?.data?.page_size || 20,
    total_data: data?.data?.total || 0,
    data_length: data?.data?.data?.length || 0,
    isError,
    isLoading: isPending,
    data: data?.data?.data || [],
  };
};

export default useP1GeneralTable;
