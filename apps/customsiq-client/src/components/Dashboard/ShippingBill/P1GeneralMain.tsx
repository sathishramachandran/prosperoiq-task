import useP1GeneralTable from "@/src/hooks/useSE/useSBP1General";
import userSBSummaryTable from "@/src/hooks/useSE/useSBSummary";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P1General = ({ job_id }: { job_id: string }) => {
  const {
    isLoading,
    isError,
    data,
    limit,
    table,
    total_pages,
    page,
    handlePage,
    total_data,
  } = useP1GeneralTable(job_id);

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

export default P1General;
