
import useDrawBackTable from "@/src/hooks/useSBReports/useDrawBack";
import useInvoiceTable from "@/src/hooks/useSBReports/useInvoiceTable";
import useSingleWindowTable from "@/src/hooks/useSBReports/useSingleWindow";
import Loading from "@/src/ui/Loading";
import { TablePagination, TableContainer } from "prosperoiq-table";

const Window = ({ user_id }: { user_id: string }) => {
  const { isLoading, isError, data, table, total_pages,limit , total_data, page, handlePage } = useSingleWindowTable(user_id , 'json' );
  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="overflow-x-auto">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!data.length && <p className="text-center text-lg">No data founds</p>}
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

export default Window;
