import userP1BondsTable from "@/src/hooks/useBOE.tsx/useP1Bonds";
import useP1GeneralTable from "@/src/hooks/useBOE.tsx/useP1GeneralTable";
import useP1Invoice from "@/src/hooks/useBOE.tsx/useP1Invoice";
import userP1PaymentTable from "@/src/hooks/useBOE.tsx/useP1Payment";
import userP4Container from "@/src/hooks/useBOE.tsx/useP4Container";
import userP4SupportTable from "@/src/hooks/useBOE.tsx/useP4Support";
import Loading from "@/src/ui/Loading";
import { TableContainer } from "prosperoiq-table";
import { useSearchParams } from "next/navigation";

const P4Container = ({ job_id }: { job_id: string }) => {
  const { isLoading, isError, data, table, total_pages, page, handlePage, total_data } = userP4Container(job_id);
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

export default P4Container;
