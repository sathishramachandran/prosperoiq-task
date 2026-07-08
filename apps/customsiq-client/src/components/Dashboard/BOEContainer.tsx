"use client";

import {
  useBOEBulkDownloads,
  useBulkDelete,
} from "@/src/hooks/useBOE.tsx/useBOEApi";
import userBOETable from "@/src/hooks/useBOE.tsx/userBOETable";
import useOverviewTable from "@/src/hooks/useOverviewTable";
import Loading from "@/src/ui/Loading";
import Pagination from "@/src/ui/pagination";
// import TableContainer from "@/src/ui/TableContainer";
import React, { useMemo, useState } from "react";
import { useUserStore } from "@/src/store/user";
import { TableContainer, TablePagination } from "prosperoiq-table";
import clsx from "clsx";

import { useBulkExportStart } from "@/src/hooks/useDownloads";
import UploadModal from "./UploadMain";
import DateFilter from "./DateFilter";
import ExtractionTabs from "./ExtractionTabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DeleteModel from "./DeleteModel";
import { Download, Upload } from "lucide-react";
import Image from "next/image";

type Props = {};

const BOEContainer = (props: Props) => {
  const userData = useUserStore((state) => state.user);
  const { setBoeUploadOpen, BoeOpen } = useUserStore((state) => state);

  const {
    data,
    table,
    isLoading,
    isError,
    limit,
    setEndDate,
    setStartDate,
    total_pages,
    page,
    setSearch,
    handlePage,
    total_data,
  } = userBOETable(userData?.id || "");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  const { mutateAsync: DeleteSync, isPending: deletePending } = useBulkDelete();

  const start_date = params.get("start_date") || "";
  const sheet_name = params.get("sheet_name") || "";
  const end_date = params.get("end_date") || "";

  const jobIds = useMemo(
    () => data?.map((row: any) => row.job_id) || [],
    [data],
  );
  const {
    selectedSheet,
    setSelectedSheet,
    overviewSheets,
    overviewTable,
    combinedOverviewData,
    handlePage: overviewHandlepage,
    limit: overviewLimit,
    total_pages: overview_total_page,
    page: overview_page,
    total_data: overview_total_data,
    overviewLoading,
    overviewError,
  } = useOverviewTable({
    billName: "boe",
    jobIds,
    userId: userData?.id,
    useLongTextCell: true,
  });

  const { isPending: downloadPending, mutateAsync: mutateAsyncDownload } =
    useBOEBulkDownloads();

  const [sheetName, setSheetName] = useState("");

  const { mutateAsync: exportMutateSync, isPending: pendingExport } =
    useBulkExportStart();

  const handleExport = async () => {
    await exportMutateSync({
      bill_name: "boe",
      user_id: userData?.id || "",
      select_all: true,
      start_date,
      end_date,
      excluded_job_ids: [],
    });
  };

  const BulkDownload = async () => {
    const filter = table
      ?.getSelectedRowModel()
      ?.rows.map((value) => value.original.job_id);

    const response = await mutateAsyncDownload({
      job_ids: filter,
      bill_name: "boe",
      user_id: userData?.id,
    });
  };
  const BulkDelete = async () => {
    const filter = table
      ?.getSelectedRowModel()
      ?.rows.map((value) => value.original.job_id);

    const response = await DeleteSync({
      job_ids: filter,
      bill_name: "boe",
      user_id: userData?.id || "",
    });
    table.resetRowSelection();
  };

  const handleBack = () => {
    setSheetName("");
    params.delete("page");
    params.delete("sheet_name");
    router.push(`${pathname}?${params.toString()}`);
    setSelectedSheet("");
  };

  const handleSheets = (tab: string) => {
    if (sheetName === tab) {
      setSheetName("");
      params.delete("page");
      params.delete("sheet_name");
      router.push(`${pathname}?${params.toString()}`);
      setSelectedSheet("");
    } else {
      setSheetName(tab);
      params.set("sheet_name", tab);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
      setSelectedSheet(tab);
    }
  };

  const isEmpty = !isLoading && !isError && data.length === 0 && !selectedSheet;

  return (
    <div>
      <div className="pt-5 px-8">
        {isEmpty ? (
          <div className="w-full flex flex-col items-center justify-center py-16 px-4">
            {/* IMAGE */}
            <div className="max-w-md w-full">
              <Image
                src="/empty_upload.png"
                alt="No data"
                width={500}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* TEXT */}
            <h2 className="mt-6 text-2xl font-semibold text-gray-800">
              No data found
            </h2>

            <p className="mt-2 text-gray-500 text-center max-w-md">
              It looks like there’s no data available yet. Upload your Bill of
              Entry file to get started.
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                // onClick={onUpload}
                onClick={() => setBoeUploadOpen(true)}
                className="flex items-center text-sm justify-center gap-2 bg-ciq-primary text-white px-6 py-2.5 rounded-md shadow hover:opacity-90 transition"
              >
                <Upload size={18} />
                Upload File
              </button>

              {/* <button
                // onClick={onDownloadTemplate}
                className="flex items-center justify-center gap-2 border px-6 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                <Download size={18} />
                Download Template
              </button> */}
            </div>

            {/* FOOTER NOTE */}
            <p className="mt-4 text-sm text-gray-400 text-center">
              Supported format: ZIP (.zip)
              <br />
              Upload single or multiple files
            </p>
          </div>
        ) : (
          <>
            {/* HEADER (Tabs + Back) */}
            <ExtractionTabs
              tabs={overviewSheets}
              activeTab={sheetName}
              onTabChange={handleSheets}
              onBack={handleBack}
              showBack={!!sheet_name}
            />

            {/* DATE FILTER */}
            {!selectedSheet && (
              <div className="mt-4">
                <DateFilter setEDate={setEndDate} setSDate={setStartDate} />
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-5">
              <div className="flex justify-end items-center">
                <div className="flex gap-3">
                  <DeleteModel
                    billName="Bill of Entry"
                    mutateAsync={BulkDelete}
                    isPending={deletePending}
                  >
                    {table?.getSelectedRowModel()?.rows?.length !== 0 && (
                      <div
                        className={clsx(
                          "bg-red-600 mb-3 cursor-pointer rounded-sm text-white px-6 py-2",
                          deletePending && "cursor-auto!",
                        )}
                      >
                        {deletePending ? "Deleting..." : "Delete Selected Rows"}
                      </div>
                    )}
                  </DeleteModel>

                  {table?.getSelectedRowModel()?.rows?.length !== 0 && (
                    <button
                      onClick={BulkDownload}
                      disabled={downloadPending}
                      className={clsx(
                        "bg-ciq-primary mb-3 cursor-pointer rounded-sm text-white px-6 py-2",
                        downloadPending && "cursor-auto!",
                      )}
                    >
                      {downloadPending
                        ? "Downloading..."
                        : "Download Selected Rows"}
                    </button>
                  )}
                </div>
              </div>

              {/* TABLE SECTION */}
              {!selectedSheet ? (
                <div>
                  {isLoading && <div className=" h-[calc(100vh-260px)]">
                    {" "}
                    <Loading />
                  </div>}
                  {isError && (
                    <p className="text-center text-lg">Error Occurred</p>
                  )}

                  {!isLoading && !isError && data.length > 0 && (
                    <div className="overflow-x-auto custom-scrollbar  h-[calc(100vh-260px)]">
                      <TableContainer table={table} data={data} />
                    </div>
                  )}

                  <div className="">
                    <TablePagination
                      product="customiq"
                      table={table}
                      data={data}
                      isPending={pendingExport}
                      downloadFunc={handleExport}
                      totalRows={total_data}
                      totalPages={total_pages}
                      currentPage={Number(page)}
                      canPrev={Number(page) > 1}
                      canNext={Number(page) < total_pages}
                      onFirstPage={() => handlePage(1)}
                      onPrevPage={() => handlePage(Number(page) - 1)}
                      onNextPage={() => handlePage(Number(page) + 1)}
                      onLastPage={() => handlePage(total_pages)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {overviewLoading && (
                    <div className=" h-[calc(100vh-210px)]">
                      {" "}
                      <Loading />
                    </div>
                  )}
                  {overviewError && (
                    <p className="text-center text-lg">Error Occurred</p>
                  )}

                  {!overviewLoading &&
                    !overviewError &&
                    combinedOverviewData.length > 0 && (
                      <div className="overflow-x-auto custom-scrollbar  h-[calc(100vh-212px)]">
                        <TableContainer
                          table={overviewTable}
                          data={combinedOverviewData}
                        />
                      </div>
                    )}

                  <TablePagination
                    product="customiq"
                    table={overviewTable}
                    data={combinedOverviewData}
                    totalRows={overview_total_data}
                    totalPages={overview_total_page}
                    currentPage={Number(overview_page)}
                    canPrev={Number(overview_page) > 1}
                    canNext={Number(overview_page) < overview_total_page}
                    onFirstPage={() => overviewHandlepage(1)}
                    onPrevPage={() =>
                      overviewHandlepage(Number(overview_page) - 1)
                    }
                    onNextPage={() =>
                      overviewHandlepage(Number(overview_page) + 1)
                    }
                    onLastPage={() => overviewHandlepage(overview_total_page)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* UPLOAD MODAL */}
      <UploadModal
        bill_label="Bill Of Entry"
        billName="boe"
        userId={userData?.id || ""}
        open={BoeOpen}
        setOpen={setBoeUploadOpen}
      />
    </div>
  );
};

export default BOEContainer;
