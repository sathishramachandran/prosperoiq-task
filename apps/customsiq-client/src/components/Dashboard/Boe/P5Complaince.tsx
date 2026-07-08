
import useP1Invoice from "@/src/hooks/useBOE.tsx/useP1Invoice";
import userP4SupportTable from "@/src/hooks/useBOE.tsx/useP4Support";
import useComplaince from "@/src/hooks/useBOE.tsx/useP5Complaince";
import useP5ExamOrder from "@/src/hooks/useBOE.tsx/useP5ExamOrder";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";
import { useSearchParams } from "next/navigation";

const P5Complaince = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages, page, handlePage, total_data } = useComplaince(job_id);
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

export default P5Complaince;
