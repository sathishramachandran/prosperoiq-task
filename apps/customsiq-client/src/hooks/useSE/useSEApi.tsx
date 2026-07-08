import { apiGetCustoms } from "@/lib/api_services";
import { uploadsEndPoints } from "@/src/constants/endpoints";
import { useQuery } from "@tanstack/react-query";


export const useGetSBReports = (
  user_id: string,
  report_name: string,
  format: string,
) => {
  return useQuery({
    queryKey: ["get_sb_reports", report_name, format],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.getShippingBillReport(user_id ,report_name , format),
      );
      return res;
    },

    // enabled: !!job_id,
    // retry: false,
    // refetchOnWindowFocus: false,
  });
};


export const useGetSBOverview = (
  job_id: string,
  sb_name: string,
  sheet_name: string,
  user_id?: string,
  page: number = 1,
  page_size: number = 20,
) => {
  return useQuery({
    queryKey: ["get_sb_extraction_main", sheet_name, sb_name, user_id, page, page_size],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.getSBOverview(job_id, sheet_name, sb_name, user_id, page, page_size),
      );
      return res;
    },

    // enabled: !!job_id,
    // retry: false,
    // refetchOnWindowFocus: false,
  });
};
