"use client";

import useInvoice2Table from "@/src/hooks/useInvoice/useInvoice2";
import useInvoiceMainTable from "@/src/hooks/useInvoice/useInvoiceMain";
import { useDownloadInvoiceMain } from "@/src/hooks/useReports";
import { useUserStore } from "@/src/store/user";
import Pagination from "@/src/ui/pagination";
import { TablePagination, TableContainer } from "prosperoiq-table";
import { useRouter, useSearchParams } from "next/navigation";

const InvoiceMain = () => {
  const userData = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = useDownloadInvoiceMain();
  const invoice_no = searchParams.get("invoice_no") || "";
  const svb_no = searchParams.get("svb_no") || "";
  const {
    data,
    table,
    isLoading,
    limit,
    isError,
    total_data,
    total_pages,
    page,
    handlePage,
  } = useInvoiceMainTable(userData?.id || "", invoice_no);
  const {
    data: data2,
    limit: limit2,
    table: table2,
    total_data: total_data2,
    isLoading: isLoading2,
    isError: isError2,
    total_pages: total_pages2,
    page: page2,
    handlePage: handlePage2,
  } = useInvoice2Table(userData?.id || "", invoice_no);
  const handleReports = async () => {
    const res = await mutateAsync({
      user_id: userData?.id || "",
      type: svb_no ? "2" : "1",
      invoice_no,
    });
  };
  return (
    <div className="pt-3 px-6 bg-white">
      {!svb_no ? (
        <div className="">
          {isError2 && <p className="text-center text-lg"> Error Occured</p>}
          {!isError2 && !isLoading2 && !!data2.length && (
            <div className="overflow-x-auto h-[calc(100vh-140px)] ">
              <TableContainer table={table2} data={data2} />
            </div>
          )}
          {!data2.length && (
            <p className="text-center text-lg">No data founds</p>
          )}
          <div className="">
            <TablePagination
              product="customiq"
              table={table}
              data={data}
              // isPending={pendingExport}
              // downloadFunc={handleExport}
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
          {isError && <p className="text-center text-lg"> Error Occured</p>}
          {!isError && !isLoading && !!data.length && (
            <div className="overflow-x-auto h-[calc(100vh-140px)] ">
              <TableContainer table={table} data={data} />
            </div>
          )}
          {!data.length && (
            <p className="text-center text-lg">No data founds</p>
          )}
          <div className="">
            <Pagination
              table={table}
              pageSize={limit}
              totalPages={total_pages}
              totalItems={total_data}
              currentPage={Number(page)}
              onPageChange={handlePage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceMain;
