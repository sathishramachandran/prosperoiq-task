import useDifHSNTable from "@/src/hooks/useMaster/useDifHSN";

import Loading from "@/src/ui/Loading";
import { TablePagination, TableContainer } from "prosperoiq-table";
import SearchBar from "@/src/ui/Searchbar";
import DateFilter from "../../DateFilter";

const DiffHSN = ({ user_id, download_func }: { user_id: string; download_func: () => Promise<void> }) => {
  const {
    isLoading,
    isError,
    data,
    table,
    limit,
    total_data,
    total_pages,
    page,
    handlePage,
    setEndDate,
    setStartDate,
    search,
    setSearch,
  } = useDifHSNTable(user_id, "json");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SearchBar onChange={setSearch} value={search} />
        <DateFilter setEDate={setEndDate} setSDate={setStartDate} />
      </div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="overflow-x-auto  h-[calc(100vh-190px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!data.length && <p className="text-center text-lg">No data founds</p>}
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
    </div>
  );
};

export default DiffHSN;
