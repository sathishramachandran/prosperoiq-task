
import useP1Invoice from "@/src/hooks/useBOE.tsx/useP1Invoice";
import useP4LicenseTable from "@/src/hooks/useBOE.tsx/useP4License";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P4License = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages, page, handlePage, total_data } = useP4LicenseTable(job_id);
  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="overflow-x-auto h-[calc(100vh-280px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!isError && !isLoading && !data.length && <p className="text-center text-lg">No data founds</p>}

    </div>
  );
};

export default P4License;
