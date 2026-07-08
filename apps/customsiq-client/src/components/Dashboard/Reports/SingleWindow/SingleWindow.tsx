import { title } from "process";
import { useMemo } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";

import { Search } from "lucide-react";
import { useUserStore } from "@/src/store/user";
import { TablePagination, TableContainer } from "prosperoiq-table";
import BondMenu from "../BondBg/Model/Common";
import useInvoiceTable from "@/src/hooks/useInvoice/useInvoice";
import userSingleWindowTable from "@/src/hooks/useSingleWindow/useSingleWindow";
import { FaDownload } from "react-icons/fa";
import { useBOEReports } from "@/src/hooks/useBOE.tsx/useBOEApi";

const SingleWindow = ({ report_name }: { report_name: string }) => {
  const userData = useUserStore((state) => state.user);
   const { mutateAsync: boeMutateAsync, isPending: boePending } =
    useBOEReports();
  const { data, table, isLoading, isError, limit , total_data, total_pages, page, handlePage } = userSingleWindowTable(
    userData?.id || "",
    report_name,
  );
  
  const handleReports = async () => {
    await boeMutateAsync({
      user_id: userData?.id || "",
      format: "excel",
      reports: [report_name],
    });
  };

  const details = useMemo(() => {
    const deatilsList = [
      {
        title: "BOE Date",
        rate: "24 Oct 2023",
      },
      {
        title: "IEC / BR",
        rate: "0512049382 / BR-92",
      },
      {
        title: "Importer Details",
        rate: "Global Logistics Pvt Ltd",
      },
      {
        title: "CB Name",
        rate: "Secure Customs Brokers",
      },
    ];
    return deatilsList;
  }, []);


  return (
    <div className="bg-[#F8FAFC]">
      <div className="flex gap-6 mt-6">
        {details.map((detail, index) => {
          return (
            <div
              key={index}
              className="border-2 bg-white   space-y-2 py-3 w-68 px-5 rounded-md"
            >
              <h4 className="text-sm text-slate-700">{detail.title} </h4>
              <h3 className="font-medium text-slate-00 text-base">
                {detail.rate}{" "}
              </h3>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex gap-5">
        <div className="w-full max-w-xs">
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg   focus-within:ring-gray-300 transition">
            {/* Icon */}
            <Search className="text-gray-400 w-5 h-5" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search BOE NO / BOND NO"
              className="w-full bg-transparent outline-none text-gray-600 text-sm placeholder-gray-400"
            />
          </div>
        </div>
        <BondMenu>
          <button className="flex items-center gap-5 text-sm text-slate-500 border rounded-lg px-3 py-0.5 cursor-pointer">
            <span>Period:</span>{" "}
            <div className="flex items-center gap-2">
              <span className="text-slate-800">All</span> <IoIosArrowDown />
            </div>
          </button>
        </BondMenu>

        <BondMenu>
          <button className="flex items-center gap-5 text-sm text-slate-500 border rounded-lg px-3 py-0.5 cursor-pointer">
            <span>Port select</span>{" "}
            <div className="flex items-center gap-2">
              <span className="text-slate-800">Mundra Port((INMUN1))</span>{" "}
              <IoIosArrowDown />
            </div>
          </button>
        </BondMenu>
        <div className="flex gap-3 text-ciq-primary items-center">
          <IoFilterSharp />
          More Filters
        </div>
      </div>
      <div className="mt-7">
        <div className="mb-6 flex justify-between">
          <div className="font-semibold mb-3 text-xl text-slate-800">
            Single Window (COO)
          </div>
          <button onClick={handleReports} className="bg-ciq-primary cursor-pointer px-4 text-sm text-white py-2 rounded-sm flex items-center gap-2">
            <FaDownload /> Export Excel
          </button>
        </div>

        {isError && <p className="text-center text-lg"> Error Occured</p>}
        {!isError && !isLoading && !!data.length && (
          <div className="overflow-x-auto">
            <TableContainer table={table} data={data} />
          </div>
        )}
        {!data.length && <p className="text-center text-lg">No data founds</p>}
      </div>
      <div className="mt-5">
        <TablePagination
          product="customiq"
          table={table}
          data={data}
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

export default SingleWindow;
