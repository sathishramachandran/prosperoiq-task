
import useP4CertificateTable from "@/src/hooks/useBOE.tsx/useP4Certificate";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P4Certificate = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages, page, handlePage, total_data } = useP4CertificateTable(job_id);
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
        {/* <Pagination totalPages={total_pages} currentPage={Number(page)} onPageChange={handlePage} totalItems={total_data} /> */}
      </div>
    </div>
  );
};

export default P4Certificate;
