"use client";

import {
  useBOEBulkDownloads,
  useBOESingleUpload,
  useBulkDelete,
} from "@/src/hooks/useBOE.tsx/useBOEApi";
import userSETable from "@/src/hooks/useSE/userSETable";
import useOverviewTable from "@/src/hooks/useOverviewTable";
import { useUserStore } from "@/src/store/user";
import Loading from "@/src/ui/Loading";
import Pagination from "@/src/ui/pagination";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { useBulkExportStart } from "@/src/hooks/useDownloads";
import UploadModal from "./UploadMain";
import DateFilter from "./DateFilter";
import DeleteModel from "./DeleteModel";
import ExtractionTabs from "./ExtractionTabs";
import { ReextractRodtepPageButton } from "./ReextractRodtep";
import Image from "next/image";
import { Upload } from "lucide-react";
import { TablePagination ,TableContainer } from "prosperoiq-table";

type Props = {};

const SBExtraction = () => {
  const pathname = usePathname();
  const { setSbUploadOpen, sbOpen } = useUserStore((state) => state);
  const [sheetName, setSheetName] = useState("");
  const pathValue = pathname.split("/").pop();
  const router = useRouter();
  const { isPending: downloadPending, mutateAsync: mutateAsyncDownload } =
    useBOEBulkDownloads();
  const pathValidate = pathValue === "sbextraction" ? "shipping_bill" : "";
  const { data: filedata, mutateAsync, isPending } = useBOESingleUpload();

  const userData = useUserStore((state) => state.user);
  const {
    data,
    table,
    isLoading,
    isError,
    limit,
    total_pages,
    page,
    total_data,
    setEndDate,
    setStartDate,
    handlePage,
  } = userSETable(userData?.id || "");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const start_date = params.get("start_date") || "";
  const end_date = params.get("end_date") || "";

  const sheet_name = params.get("sheet_name") || "";
  const { mutateAsync: DeleteSync, isPending: deletePending } = useBulkDelete();

  const jobIds = useMemo(
    () => data?.map((row: any) => row.job_id) || [],
    [data],
  );
  const {
    selectedSheet,
    setSelectedSheet,
    overviewSheets,
    overviewTable,
    handleLimit: overviewHandleLimit,
    handlePage: overviewHandlepage,
    limit: overviewLimit,
    total_pages: overview_total_page,
    page: overview_page,
    total_data: overview_total_data,
    combinedOverviewData,
    overviewLoading,
    overviewError,
  } = useOverviewTable({
    billName: "shipping_bill",
    jobIds,
    userId: userData?.id,
  });

  const BulkDelete = async () => {
    const filter = table
      ?.getSelectedRowModel()
      ?.rows.map((value) => value.original.job_id);

    await DeleteSync({
      job_ids: filter,
      bill_name: "shipping_bill",
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

  const BulkDownload = async () => {
    const filter = table
      ?.getSelectedRowModel()
      ?.rows.map((value) => value.original.job_id);

    const response = await mutateAsyncDownload({
      job_ids: filter,
      bill_name: "shipping_bill",
      user_id: userData?.id,
    });
    // if (response.status === 200) {
    //   const url = window.URL.createObjectURL(response.data);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `Extracted_file.xlsx`;
    //   document.body.appendChild(a);
    //   a.click();

    //   a.remove();
    //   window.URL.revokeObjectURL(url);
    //   toast.success("Downloaded Successfully");
    // }
  };

  const { mutateAsync: exportMutateSync, isPending: pendingExport } =
    useBulkExportStart();

  const handleExport = async () => {
    await exportMutateSync({
      bill_name: "shipping_bill",
      user_id: userData?.id || "",
      select_all: true,
      start_date,
      end_date,
      excluded_job_ids: [],
    });
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
      router.push(`${pathname}?${params.toString()}`);
      setSelectedSheet(tab);
    }
  };
  const isEmpty = !isPending && !isError && !selectedSheet && data.length === 0;

  return (
    <div>
      <div className="pt-5 px-8 min-h-[calc(100vh-124px)]">
        {isEmpty && !isLoading ? (
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
              It looks like there’s no data available yet. Upload your Shipping
              Bill file to get started.
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSbUploadOpen(true)}
                // onClick={onUpload}
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
            {/* TABS */}
            {!isPending && (
              <ExtractionTabs
                tabs={overviewSheets}
                activeTab={sheetName}
                onTabChange={handleSheets}
                onBack={handleBack}
                showBack={!!sheet_name}
              />
            )}

            {/* DATE FILTER */}
            {!selectedSheet && (
              <div className="mt-4 flex justify-between">
                   {!selectedSheet && <ReextractRodtepPageButton />}
                <DateFilter setEDate={setEndDate} setSDate={setStartDate} />
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-5">
              <div className="flex gap-3 justify-end items-start">
             
                <DeleteModel
                  billName="Bill of Entry"
                  mutateAsync={BulkDelete}
                  isPending={deletePending}
                >
                  {table?.getSelectedRowModel()?.rows?.length !== 0 && (
                    <div
                      className={clsx(
                        "bg-red-600 cursor-pointer rounded-sm text-white px-6 py-2",
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
                      "bg-ciq-primary cursor-pointer rounded-sm text-white px-6 py-2",
                      downloadPending && "cursor-auto!",
                    )}
                  >
                    {downloadPending
                      ? "Downloading..."
                      : "Download Selected Rows"}
                  </button>
                )}
              </div>

              {/* TABLE SECTION */}
              {!selectedSheet ? (
                <div>
                  {isLoading && (
                    <div className=" h-[calc(100vh-260px)]">
                      {" "}
                      <Loading />
                    </div>
                  )}
                  {isError && (
                    <p className="text-center text-lg">Error Occurred</p>
                  )}

                  {!isPending && !isError && data.length > 0 && (
                    <div className="overflow-x-auto custom-scrollbar h-[calc(100vh-260px)]">
                      <TableContainer table={table} data={data} />
                    </div>
                  )}

                  <div>
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

                  <div className="">
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
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      <UploadModal
        bill_label="Shipping Bill"
        billName="shipping_bill"
        userId={userData?.id || ""}
        open={sbOpen}
        setOpen={setSbUploadOpen}
      />
    </div>
  );
};

export default SBExtraction;
