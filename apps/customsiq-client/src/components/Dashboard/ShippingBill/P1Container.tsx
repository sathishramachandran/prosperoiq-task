import useP1ContainerTable from "@/src/hooks/useSE/useP1Container";
import useInvoiceTable from "@/src/hooks/useSE/useP1Invoice";
import userSBSummaryTable from "@/src/hooks/useSE/useSBSummary";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P1Container = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages,total_data,limit, page, handlePage } =
    useP1ContainerTable(job_id);

  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="h-[calc(100vh-260px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!data.length && <p className="text-center text-lg">No data founds</p>}

    </div>
  );
};

export default P1Container;
