import useInvoiceTable from "@/src/hooks/useSE/useP1Invoice";
import useP2InvoiceTable from "@/src/hooks/useSE/useP2Invoice";
import userSBSummaryTable from "@/src/hooks/useSE/useSBSummary";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P2Inovice = ({ job_id }: { job_id: string }) => {
  const {
    isLoading,
    isError,
    data,
    table,
    limit,
    total_pages,
    page,
    handlePage,
    total_data,
  } = useP2InvoiceTable(job_id);

  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="h-[calc(100vh-260px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!isError && !isLoading && !data.length && (
        <p className="text-center text-lg">No data founds</p>
      )}

    </div>
  );
};

export default P2Inovice;
