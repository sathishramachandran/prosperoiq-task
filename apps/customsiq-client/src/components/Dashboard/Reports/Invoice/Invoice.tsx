import { title } from "process";
import { useEffect, useMemo, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoFilterSharp } from "react-icons/io5";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import { useUserStore } from "@/src/store/user";
import { TablePagination, TableContainer } from "prosperoiq-table";
import useInvoiceTable from "@/src/hooks/useInvoice/useInvoice";
import { FaDownload } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import useInvoiceDetailsTable from "@/src/hooks/useInvoice/useInvoiceDetails";
import Loading from "@/src/ui/Loading";
import Pagination from "@/src/ui/pagination";
import {
  useBOEInvoiceFilter,
  useDownloadBOEReport,
  useDownloadInvoiceList,
} from "@/src/hooks/useReports";
import FilterPanel from "../filters/FilterPannel";
import { IoIosClose } from "react-icons/io";
import SearchBar from "@/src/ui/Searchbar";
import DateFilter from "../../DateFilter";
import clsx from "clsx";

type DashboardMeta = {
  formula: string;
  source_field: string;
  record_count: number;
  dedup_key?: string;
};
type DashboardEntry = { value: number | string; meta?: DashboardMeta };

const Invoice = ({ report_name }: { report_name: string }) => {
  const userData = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const { data: filter } = useBOEInvoiceFilter(userData?.id || "");
  const svb_no = searchParams.get("svb_no") || "";
  const params = Object.fromEntries(searchParams.entries());

  const report_type = searchParams.get("report_type") || "";
  const { mutateAsync: invoiceMutateSync, isPending: invoicePending } =
    useDownloadInvoiceList();
  const { mutateAsync, isPending } = useDownloadBOEReport();
  const {
    data: dataFiler,
    table: tableFilter,
    isLoading: filterLoading,
    limit: filter_limit,
    total_data: total_data_Filter,
    isError: filterError,
    total_pages: filterTotalPages,
    page: filterPage,
    handlePage: filterHandlePage,
  } = useInvoiceTable(userData?.id || "", svb_no);
  const {
    data,
    table,
    dashboardvalue,
    total_data,
    setFilters,
    limit,
    setEndDate,
    setSearch,
    search,
    setStartDate,
    total_pages,
    handlePage,
    page,
    isLoading,
    isError,
  } = useInvoiceDetailsTable(userData?.id || "", report_type);

  const handleReports = async () => {
    if (svb_no) {
      await invoiceMutateSync({
        user_id: userData?.id || "",
        svb_no,
      });
    } else {
      await mutateAsync({
        user_id: userData?.id || "",
        report_name: report_type,
        filters: params,
      });
    }
  };

  const filters = useMemo(() => {
    const obj: Record<string, string[]> = {};

    Object.keys(filter || {}).forEach((key) => {
      const values = searchParams.getAll(key);

      if (values.length > 0) {
        obj[key] = values;
      }
    });

    return obj;
  }, [searchParams, filter]);

  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  const updateQueryParams = (updatedFilters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.keys(filter || {}).forEach((key) => {
      params.delete(key);
    });

    Object.entries(updatedFilters).forEach(([key, values]) => {
      params.delete(key); // important

      values.forEach((val) => {
        params.append(key, val);
      });
    });

    // reset page
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleFiltersChange = (updatedFilters: Record<string, string[]>) => {
    updateQueryParams(updatedFilters);
  };

  const handleRemoveFilter = (key: string, value: string) => {
    const updated = { ...filters };

    updated[key] = updated[key].filter((v) => v !== value);

    if (updated[key].length === 0) {
      delete updated[key];
    }

    updateQueryParams(updated);
  };
  return (
    <div className="bg-white">
      <div className="">
        {!svb_no && (
          <div className="flex gap-4 mb-4">
            {dashboardvalue &&
              Object.entries(dashboardvalue).map(([key, raw], index) => {
                const entry: DashboardEntry = isDashboardEntry(raw)
                  ? raw
                  : { value: raw as number | string, meta: undefined };
                const num = Number(entry.value);
                return (
                  <div
                    key={key}
                    className="bg-white flex-1 shadow-md  rounded-xl p-3 border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs text-gray-500">{key}</h3>
                      {entry.meta && (
                        <CalcInfoButton meta={entry.meta} index={index} />
                      )}
                    </div>
                    <p className="text-sm text-slate-900 font-semibold mt-2">
                      {isNaN(num)
                        ? "—"
                        : num.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                    </p>
                  </div>
                );
              })}
          </div>
        )}

        {!svb_no ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="px-3  text-ciq-primary rounded-sm text-xl cursor-pointer  flex items-center gap-2 font-semibold"
                >
                  <IoFilterSharp />
                  {showFilter ? "Hide Filters" : "Show Filters"}
                </button>
                {!showFilter && (
                  <SearchBar onChange={setSearch} value={search} />
                )}
              </div>
              <DateFilter setEDate={setEndDate} setSDate={setStartDate} />
            </div>

            <div className="flex mt-4">
              {/* FILTER PANEL */}
              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-r"
                  >
                    <div className="overflow-auto h-[calc(100vh-230px)] rounded-sm py-3 px-4 bg-white w-65">
                      {filter && (
                        <FilterPanel
                          value={filters}
                          onChange={handleFiltersChange}
                          filterData={filter}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TABLE SECTION */}
              <motion.div className="flex-1 overflow-auto ">
                {Object.keys(filters).length > 0 && (
                  <div className="flex flex-wrap gap-2  p-2">
                    {Object.entries(filters).map(([key, values]) =>
                      values.map((val) => (
                        <div
                          key={`${key}-${val}`}
                          className="flex items-center capitalize gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
                        >
                          <span>
                            {key.replaceAll("_", " ")}: {val}
                          </span>

                          <button
                            onClick={() => handleRemoveFilter(key, val)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <IoIosClose size={20} />
                          </button>
                        </div>
                      )),
                    )}
                  </div>
                )}
                {/* FILTER CHIPS */}

                <div className="overflow-x-auto  h-[calc(100vh-290px)]">
                  {/* STATES */}
                  {isError && (
                    <p className="text-center text-lg">Error Occurred</p>
                  )}

                  {!isError && !isLoading && !!data.length && (
                    <TableContainer table={table} data={data} />
                  )}

                  {!isLoading && !data.length && (
                    <p className="text-center text-lg">No data found</p>
                  )}
                </div>

                {/* PAGINATION */}
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
              </motion.div>
            </div>
          </>
        ) : (
          <>
            {filterError && (
              <p className="text-center text-lg"> Error Occured</p>
            )}
            {!filterError && !filterLoading && !!dataFiler.length && (
              <div>
                <div className="overflow-x-auto  h-[calc(100vh-140px)] ">
                  <TableContainer table={tableFilter} data={dataFiler} />
                </div>
              </div>
            )}
            {!dataFiler.length && (
              <p className="text-center text-lg">No data founds</p>
            )}
            <div className="">
              <Pagination
                downloadFunc={handleReports}
                table={table}
                pageSize={limit}
                totalPages={total_pages}
                totalItems={total_data}
                currentPage={Number(page)}
                onPageChange={handlePage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoice;

function CalcInfoButton({
  meta,
  index,
}: {
  meta: DashboardMeta;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="How is this calculated?"
        className="text-gray-400 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 110 2 1 1 0 010-2zm-1 4h2v6H9V9z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            className={clsx(
              "absolute right-0 z-100 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white p-3 text-left text-xs shadow-xl backdrop-blur-sm",
              index !== 0 ? "right-0" : "left-0",
            )}
          >
            <p className="mb-2 text-sm font-semibold text-gray-800">
              How is this calculated?
            </p>

            <p className="leading-relaxed text-gray-700">{meta.formula}</p>

            <dl className="mt-3 space-y-2 text-gray-500">
              <div className="flex justify-between gap-2">
                <dt>Records used</dt>
                <dd className="text-gray-700">
                  {meta.record_count.toLocaleString("en-IN")}
                </dd>
              </div>

              {meta.dedup_key && (
                <div className="flex justify-between gap-2">
                  <dt>Deduplicated by</dt>
                  <dd className="font-mono text-[11px] text-gray-700">
                    {meta.dedup_key}
                  </dd>
                </div>
              )}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function isDashboardEntry(v: unknown): v is DashboardEntry {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return (
    "value" in obj &&
    (typeof obj.value === "number" || typeof obj.value === "string")
  );
}

// vidhyaiq.prosperoiq.com
