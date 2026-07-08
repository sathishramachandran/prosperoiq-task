import { apiGetCustoms } from "@/lib/api_services";
import { uploadsEndPoints } from "@/src/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

export const useGetSBReports = (
  user_id: string,
  report_name: string,
  format: string,
  page: number = 1,
  page_size: number = 20,
  filters: {
    license_no?: string[];
    license_code?: string[];
    be_no?: string[];
  } = {},
  startDate: string | undefined,
  endDate: string | undefined,
  search: string,
) => {
  return useQuery({
    queryKey: [
      "get_sb_reports",
      report_name,
      format,
      page,
      page_size,
      filters,
      startDate,
      endDate,
      search,
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.getShippingBillReport(
          user_id,
          report_name,
          format,
          page,
          page_size,
          filters,
          startDate,
          endDate,
          search,
        ),
      );
      return res;
    },

    // enabled: !!job_id,
    retry: false,
    // refetchOnWindowFocus: false,
  });
};
