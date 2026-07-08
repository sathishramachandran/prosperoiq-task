import useP3ItemDetailsTable from "@/src/hooks/useSE/useP3ItemDetails";
import useP4InvoiceTable from "@/src/hooks/useSE/useP4Invoice";
import useP4LicenseTable from "@/src/hooks/useSE/useP4License";
import userSBSummaryTable from "@/src/hooks/useSE/useSBSummary";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P4License = ({ job_id }: { job_id: string }) => {
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
  } = useP4LicenseTable(job_id);

  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="overflow-x-auto h-[calc(100vh-260px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!isError && !isLoading && !data.length && (
        <p className="text-center text-lg">No data founds</p>
      )}

    </div>
  );
};

export default P4License;
