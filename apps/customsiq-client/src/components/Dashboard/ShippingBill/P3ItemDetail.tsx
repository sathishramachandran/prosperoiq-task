import useP3ItemDetailsTable from "@/src/hooks/useSE/useP3ItemDetails";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";

const P3ItemDetail = ({ job_id }: { job_id: string }) => {
  const {
    isLoading,
    isError,
    data,
    table,
    total_pages,
    limit,
    page,
    handlePage,
    total_data,
  } = useP3ItemDetailsTable(job_id);

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

export default P3ItemDetail;
