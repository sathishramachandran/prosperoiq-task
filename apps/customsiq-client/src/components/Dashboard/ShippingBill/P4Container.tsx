import useP4ContainerTable from "@/src/hooks/useSE/useP4Container";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P4Container = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table,limit,total_data, total_pages, page, handlePage } =
    useP4ContainerTable(job_id);

  return (
    <div>
      {isLoading && <Loading />}
      {isError && <p className="text-center text-lg"> Error Occured</p>}
      {!isError && !isLoading && !!data.length && (
        <div className="overflow-x-auto h-[calc(100vh-260px)]">
          <TableContainer table={table} data={data} />
        </div>
      )}
      {!data.length && <p className="text-center text-lg">No data founds</p>}

    </div>
  );
};

export default P4Container;
