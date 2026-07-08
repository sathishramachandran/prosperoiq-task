import useItemDetailTable from "@/src/hooks/useSBReports/useItemDetail";
import Loading from "@/src/ui/Loading";
import { TablePagination, TableContainer } from "prosperoiq-table";
import { useEffect, useMemo, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import FilterPanel from "../filters/FilterPannel";
import { IoFilterOutline, IoFilterSharp } from "react-icons/io5";
import { useSBIFilter } from "@/src/hooks/useReports";
import SearchBar from "@/src/ui/Searchbar";
import DateFilter from "../../DateFilter";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

type DashboardMeta = {
  formula: string;
  source_field: string;
  record_count: number;
  dedup_key?: string;
};
type DashboardEntry = { value: number | string; meta?: DashboardMeta };

const ItemDetail = ({ user_id, download_func }: { user_id: string; download_func: () => Promise<void> }) => {
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: filter } = useSBIFilter(user_id || "", "item-details");
  const {
    isLoading,
    isError,
    data,
    limit,
    total_data,
    setEndDate,
    setStartDate,
    search,
    setSearch,
    table,
    dashboardvalue,
    total_pages,
    setFilters,
    page,
    handlePage,
  } = useItemDetailTable(user_id, "json");

  const filters = useMemo(() => {
    const obj: Record<string, string[]> = {};

    searchParams.forEach((value, key) => {
      if (filter?.[key]) {
        obj[key] = value.split(",");
      }
    });

    return obj;
  }, [searchParams, filter]);

  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  const updateQueryParams = (updatedFilters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    // remove old filter keys
    Object.keys(filter || {}).forEach((key) => {
      params.delete(key);
    });

    // set new filters
    Object.entries(updatedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(","));
      }
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
  // bug fixed in Common formatter
  const formatINR = (val: number) =>
    Number(val).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const formatValue = (key: string, value: number) => {
    // Days
    if (key.includes("Days")) {
      return Math.round(value);
    }

    // Currency (INR)
    if (key.includes("FOB")) {
      return value.toLocaleString("en-IN", {
        // style: "currency",
        currency: "INR",
      });
    }

    return value.toLocaleString("en-IN");
  };

  type ForexDetails = {
    value: number;
    display: string;
  };

  type ForexValue = Record<string, ForexDetails>;
  return (
    <div>
      <div className="flex gap-4 mb-4">
        {dashboardvalue &&
          Object.entries(dashboardvalue).map(([key, raw], index) => {
            if (
              key === "Total Forex Value" &&
              typeof raw === "object" &&
              raw !== null &&
              !isDashboardEntry(raw)
            ) {
              return (
                <div
                  key={key}
                  className="bg-white flex-1 shadow-md rounded-xl p-3 border"
                >
                  <h3 className="text-xs text-gray-500">{key}</h3>
                  <div className="mt-2">
                    {Object.entries(raw as ForexValue).map(
                      ([currency, details]) => (
                        <p key={currency} className="text-sm font-semibold">
                          {details.display}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              );
            }

            const entry: DashboardEntry = isDashboardEntry(raw)
              ? raw
              : { value: Number(raw), meta: undefined };

            return (
              <div
                key={key}
                className="bg-white flex-1 shadow-md rounded-xl p-3 border"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs text-gray-500">{key}</h3>
                  {entry.meta && (
                    <CalcInfoButton meta={entry.meta} index={index} />
                  )}
                </div>
                <p className="text-sm text-slate-900 font-semibold mt-2">
                  {formatValue(key, Number(entry.value))}
                </p>
              </div>
            );
          })}
      </div>
      {isLoading && <Loading />}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="px-3 py-2 text-ciq-primary rounded-sm text-xl cursor-pointer  flex items-center gap-2 font-semibold"
          >
            <IoFilterSharp />
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
          {!showFilter && <SearchBar onChange={setSearch} value={search} />}
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
              <div className="overflow-auto h-[calc(100vh-235px)]  rounded-sm py-3 px-4 bg-white w-65">
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

          {/* STATES */}
          {isError && <p className="text-center text-lg">Error Occurred</p>}

          {!isError && !isLoading && !!data.length && (
            <div className="overflow-x-auto h-[calc(100vh-305px)] ">
              <TableContainer table={table} data={data} />
            </div>
          )}

          {!isLoading && !data.length && (
            <p className="text-center text-lg">No data found</p>
          )}

          {/* PAGINATION */}
          <div className="">
            <TablePagination
              product="customiq"
              table={table}
              data={data}
              downloadFunc={download_func}
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
    </div>
  );
};

export default ItemDetail;

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
