"use client";

import { useUserStore } from "@/src/store/user";
import { TablePagination ,TableContainer } from "prosperoiq-table";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/src/ui/pagination";
import useBondBgMain from "@/src/hooks/useBondBG/useBondBgMain";
import { FaDownload } from "react-icons/fa";
import { useDownloadBondBgReport } from "@/src/hooks/useReports";
import { IoArrowBack } from "react-icons/io5";

const BondBgMain = () => {
  const userData = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = useDownloadBondBgReport();
  const bond_no = searchParams.get("bond_no") || "";
  const router = useRouter();

  const {
    data,
    table,
    total_data,
    isLoading,
    isError,
    limit,
    total_pages,
    page,
    handlePage,
  } = useBondBgMain(userData?.id || "", bond_no);

  return (
    <div className=" bg-white px-6">
      <div className="flex justify-between items-center mb-4">

      </div>
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="overflow-x-auto   h-[calc(100vh-150px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!data.length && <p className="text-center text-lg">No data founds</p>}
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
  );
};

export default BondBgMain;
