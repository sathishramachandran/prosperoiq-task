
import userP2ItemTable from "@/src/hooks/useBOE.tsx/useP2ItemTable";
import userP3ItemTable from "@/src/hooks/useBOE.tsx/useP3ItemDetails";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P3ItemDetails = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages, page, handlePage, total_data } = userP3ItemTable(job_id);
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

export default P3ItemDetails;
