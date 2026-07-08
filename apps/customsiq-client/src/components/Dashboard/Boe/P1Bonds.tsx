import userP1BondsTable from "@/src/hooks/useBOE.tsx/useP1Bonds";
import userP1SummaryTable from "@/src/hooks/useBOE.tsx/useP1SummaryInvoice";

import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P1Invoice = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages, page, handlePage } =
    userP1SummaryTable(job_id);
  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="h-[calc(100vh-280px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!isError && !isLoading && !data.length && <p className="text-center text-lg">No data founds</p>}
      <div className="mt-5">
        {/* <Pagination
          totalPages={total_pages}
          currentPage={Number(page)}
          onPageChange={handlePage}
        /> */}
      </div>
    </div>
  );
};

export default P1Invoice;
