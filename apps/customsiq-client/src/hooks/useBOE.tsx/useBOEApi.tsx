"use client";
import {
  apiDeleteCustoms,
  apiGetBlob,
  apiGetCustoms,
  apiPostBlob,
  apiPostCustoms,
  apiPostFile,
} from "@/lib/api_services";
import { uploadsEndPoints } from "@/src/constants/endpoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type downloadsType = {
  job_ids: string[];
  bill_name: "boe" | "shipping_bill";
  user_id?: string;
};

export const useBOESingleUpload = () => {
  return useMutation({
    mutationKey: ["single_upload"],
    mutationFn: async (file: FormData) => {
      const res = await apiPostFile(uploadsEndPoints.singleUpload, file);
      return res;
    },

    onSuccess: (success) => {
      toast.success("Processing your uploaded file. Please wait…");
    },

    onError: (error: any) => {

      const message =
        error?.response?.data?.detail ||
        "An error occurred while uploading the file.";

      toast.error(message);
    },
  });
};
export const useBOEBulkUpload = () => {
  return useMutation({
    mutationKey: ["bulk_upload"],
    mutationFn: async (file: FormData) => {
      const res = await apiPostFile(uploadsEndPoints.bulkUpload, file);
      return res;
    },

    onSuccess: (success) => {
      toast.success("Process Started");
    },

    onError: (error) => {
      toast.error("Error Occured While Bulk Upload Process");
    },
  });
};
export const useBOEBulkDownloads = () => {
  return useMutation({
    mutationKey: ["bulk_downloads"],
    mutationFn: async (downloadData: downloadsType) => {
      toast.success("Downloading Process has been Started");
      const res = await apiPostBlob(
        uploadsEndPoints.bulkDownload,
        downloadData,
      );
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Extracted_file.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    },

    onSuccess: (success) => {
      toast.success("Downloaded Successfully");
    },

    onError: (error) => {
      toast.error("Error Occured While Bulk Upload Process");
    },
  });
};

type reports = {
  user_id: string;
  format: "json" | "excel";
  reports: string[];
};

export const useReports = () => {
  return useMutation({
    mutationKey: ["report_details"],
    mutationFn: async (downloadData: reports) => {
      toast.success("Downloading Process has been Started");
      const res = await apiPostBlob(uploadsEndPoints.reports, downloadData);
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = ` Shipping Bill Reports.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    },

    onSuccess: (success) => {
      toast.success("Downloaded Successfully");
    },

    onError: (error) => {
      toast.error("Error while Reports Generating");
    },
  });
};
export const useBOEReports = () => {
  return useMutation({
    mutationKey: ["boe_report_details"],
    mutationFn: async (downloadData: reports) => {
      toast.success("Downloading Process has been Started");
      const res = await apiPostBlob(uploadsEndPoints.boe_reports, downloadData);
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bill of Entry Reports.xlsx`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    },

    onSuccess: (success) => {
      toast.success("Downloaded Successfully");
    },

    onError: (error) => {
      toast.error("Error while Reports Generating");
    },
  });
};
export const useBOEDownload = (
  id: string,
  fileType: string,
  bill_name: string,
  status?: boolean,
  user_id?: string,
) => {
  return useQuery({
    queryKey: ["file_download", id, fileType, bill_name, user_id],
    queryFn: async () => {
      const res = await apiGetBlob(
        uploadsEndPoints.dowload(id, fileType, bill_name, user_id),
      );
      return res.data;
    },

    enabled: !!id && !!fileType,
  });
};
export const useBOEStatus = (
  id: string,
  user_id?: string,
  bill_name?: string,
) => {
  return useQuery({
    queryKey: ["upload_status", id, user_id, bill_name],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.status(id, user_id, bill_name),
      );
      return res;
    },

    enabled: !!id,
    refetchInterval: (data: any) => {
      if (!data) return 2000;
      return data?.state?.data?.data?.status === "PENDING" ||
        data?.state?.data?.data?.status === "PROGRESS"
        ? 2000
        : false; // stop polling
    },
  });
};
export const useGetUploadsById = (
  id: string,
  bill_name: string,
  page: number = 1,
  page_size: number = 20,
  start_date: any,
  end_date: any,
  search:string
) => {
  return useQuery({
    queryKey: [
      "get_all_uploads_by_id",
      id,
      bill_name,
      page,
      page_size,
      start_date,
      end_date,
      search
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.getAllUploads(
          id,
          bill_name,
          page,
          page_size,
          start_date,
          end_date,
          search,
        ),
      );
      return res;
    },
    refetchInterval: (query) => {
      if (query.state.status === "error") {
        return false;
      }
      return 3000;
    },
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetBOEOverview = (
  job_id: string,
  bill_name: string,
  sheet_name: string,
  user_id?: string,
  page: number = 1,
  page_size: number = 20,
) => {
  return useQuery({
    queryKey: [
      "get_boe_extraction_main",
      sheet_name,
      bill_name,
      user_id,
      page,
      page_size,
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.getBoeOverview(
          job_id,
          sheet_name,
          bill_name,
          user_id,
          page,
          page_size,
        ),
      );
      return res;
    },

    // enabled: !!job_id,
    // retry: false,
    // refetchOnWindowFocus: false,
  });
};

// export const useGetBOEBatchOverview = (
//   jobIds: string[],
//   sheetName: string | null,
//   billName: string = "boe",
//   userId?: string,
// ) => {
//   return useQuery({
//     queryKey: ["get_boe_batch_overview", jobIds, sheetName, billName, userId],
//     queryFn: async () => {
//       const res = await apiPostCustoms(uploadsEndPoints.batchSheetJson, {
//         job_ids: jobIds,
//         sheet_name: sheetName,
//         bill_name: billName,
//         user_id: userId,
//       });
//       return res;
//     },
//     enabled: !!sheetName && jobIds.length > 0,
//     retry: false,
//     refetchOnWindowFocus: false,
//   });
// };

export const useBoeSbDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deletePost: {
      user_id: string;
      job_id: string;
      bill_name: string;
    }) => {
      const res = await apiDeleteCustoms(
        uploadsEndPoints.deleteBoeSb(
          deletePost.job_id,
          deletePost.user_id,
          deletePost.bill_name,
        ),
      );
    },

    onSuccess: (success) => {
      toast.success("Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["get_all_uploads_by_id"],
      });
    },

    onError: (error) => {
      toast.error("Error while Deleting");
    },
  });
};

export type ReextractRodtepCounters = {
  updated: number;
  skipped: number;
  error: number;
  rows_added: number;
};

export type ReextractRodtepProgress = {
  msg?: string;
  current: number;
  total: number;
  percent: number;
  counters: ReextractRodtepCounters;
};

export type ReextractRodtepFailure = {
  sb_no: string;
  reason: string;
};

export type ReextractRodtepResult = {
  status: string;
  total: number;
  counters: ReextractRodtepCounters;
  failures: ReextractRodtepFailure[];
};

export type ReextractRodtepStatus =
  | "PENDING"
  | "STARTED"
  | "PROGRESS"
  | "SUCCESS"
  | "FAILURE"
  | "REVOKED";

export type ReextractRodtepStatusResponse = {
  task_id: string;
  status: ReextractRodtepStatus;
  progress?: ReextractRodtepProgress;
  result?: ReextractRodtepResult;
  error?: string;
};

export const useReextractRodtepStart = () => {
  return useMutation({
    mutationKey: ["reextract_rodtep_start"],
    mutationFn: async (sb_nos?: string[]) => {
      const body =
        sb_nos && sb_nos.length > 0 ? { sb_nos } : {};
      const res = await apiPostCustoms(
        uploadsEndPoints.reextractRodtep,
        body,
      );
      return res.data as { task_id: string; status: string };
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      // 401 is handled by the auth-refresh interceptor; 403 by install403Handler
      // for permission-denied payloads. We still surface a friendly toast for
      // the SB-ownership 403 detail string the backend may return.
      const detail = error?.response?.data?.detail;
      if (status === 403 && typeof detail === "string") {
        toast.error("You don't own those SBs");
      } else if (status !== 401 && status !== 403) {
        toast.error("Failed to start RoDTEP re-extraction");
      }
    },
  });
};

export const useReextractRodtepStatus = (taskId: string | null) => {
  return useQuery({
    queryKey: ["reextract_rodtep_status", taskId],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.reextractRodtepStatus(taskId!),
      );
      return res.data as ReextractRodtepStatusResponse;
    },
    enabled: !!taskId,
    refetchInterval: (query: any) => {
      const status = query?.state?.data?.status as ReextractRodtepStatus | undefined;
      if (
        status === "SUCCESS" ||
        status === "FAILURE" ||
        status === "REVOKED"
      ) {
        return false;
      }
      return 2000;
    },
    retry: 6,
    retryDelay: (attempt) => Math.min(5000, 1000 * 2 ** attempt),
    refetchOnWindowFocus: false,
  });
};

export const useBulkDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      job_ids: string[];
      bill_name: string;
      user_id: string;
    }) => {
      const res = await apiPostCustoms(uploadsEndPoints.bulk_delete, data);
      return res;
    },

    onSuccess: (success) => {
      toast.success("Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["get_all_uploads_by_id"],
      });
    },

    onError: (error) => {
      toast.error("Error while Deleting");
    },
  });
};
