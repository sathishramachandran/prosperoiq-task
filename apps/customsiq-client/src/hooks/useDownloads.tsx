import {
  apiGet,
  apiGetBlob,
  apiGetCustoms,
  apiPostCustoms,
} from "@/lib/api_services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadsEndPoints } from "../constants/endpoints";
import toast from "react-hot-toast";

export const useDownloadList = (user_id: string) => {
  return useQuery({
    queryKey: ["download_list", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.bulk_download_list(user_id),
      );
      return res;
    },
    refetchInterval: 3000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const useBulkDownload = () => {
  return useMutation({
    mutationFn: async (data: { token: string; user_id: string }) => {
      const res = await apiGetBlob(
        uploadsEndPoints.bulk_excel_download(data.token, data.user_id),
      );
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Consolidated.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success("Downloaded Successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Download Failed");
    },
  });
};
export const useBulkExportStart = () => {
  return useMutation({
    mutationFn: async (data: {
      bill_name: string;
      user_id: string;
      select_all: boolean;
      start_date:string,
      end_date:string,
      excluded_job_ids: string[];
    }) => {
      const res = await apiPostCustoms(uploadsEndPoints.bulk_excel_start() ,data);
    },
    onSuccess: () => {
      toast.success("Export started , You will Notified");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Export Failed");
    },
  });
};
