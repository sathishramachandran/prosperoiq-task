import { apiGetCustoms, axiosFileBlob } from "@/lib/api_services";
import { uploadsEndPoints } from "@/src/constants/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBOEReports = (
  user_id: string,
  report_name: string,
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
      "boe-reports-only",
      user_id,
      report_name,
      page,
      page_size,
      filters,
      startDate,
      endDate,
      search,
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_reports_get(
          user_id,
          report_name,
          page,
          page_size,
          filters,
          startDate,
          endDate,
          search,
        ),
      );
      return res.data?.[report_name];
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useInvoiceReports = (
  user_id: string,
  svb_no: string,
  page: number = 1,
  page_size: number = 20,
) => {
  return useQuery({
    queryKey: ["boe-invoice-details", user_id, page, page_size],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_invoice_get(user_id, svb_no, page, page_size),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useInvoiceReportsMain = (
  user_id: string,
  invoice_no: string,
  page: number = 1,
  page_size: number = 20,
) => {
  return useQuery({
    queryKey: ["boe-invoice-list-main", user_id, page, page_size],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_invoice_main_get(
          user_id,
          invoice_no,
          page,
          page_size,
        ),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useItemDetails = (
  user_id: string,
  report_name: string,
  filters: any,
  page: number = 1,
  page_size: number = 20,
) => {
  return useQuery({
    queryKey: [
      "boe-item-details-main",
      user_id,
      report_name,
      filters,
      page,
      page_size,
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_item_details(
          user_id,
          report_name,
          filters,
          page,
          page_size,
        ),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};

export const useBONDBGReports = (
  user_id: string,
  page: number = 1,
  page_size: number = 20,
  filters: any,
  start_date: string | undefined,
  end_date: string | undefined,
  search: string,
) => {
  return useQuery({
    queryKey: [
      "boe-bond-bg-report",
      user_id,
      page,
      page_size,
      filters,
      start_date,
      end_date,
      search,
    ],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_get_bond_bg(
          user_id,
          page,
          page_size,
          filters,
          start_date,
          end_date,
          search,
        ),
      );
      return res.data;
    },

    retry: false,
    enabled: !!user_id,
  });
};
export const useBONDBGReportFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["boe-bond-bg-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_bondbg_filter(user_id),
      );
      return res.data;
    },

    retry: false,
    enabled: !!user_id,
  });
};
export const useItemDetailsFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["boe-item-details-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_item_details_filter(user_id),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useExportReportFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["sb-export-promotion-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.sb_export_filter(user_id),
      );
      const wrapped = res.data?.filters;
      // Some backend endpoints wrap the filter map under a `filters` key
      // (like the master-export endpoint does). Unwrap it if present so
      // FilterPanel receives the flat { key: string[] } shape it expects.
      if (
        wrapped &&
        typeof wrapped === "object" &&
        !Array.isArray(wrapped)
      ) {
        return wrapped;
      }
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useMasterReportFilter = (user_id: string, reportName: string) => {
  return useQuery({
    queryKey: ["master-reports-filter", user_id, reportName],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.master_export_filter(user_id, reportName),
      );
      return res.data.filters;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useSBIFilter = (user_id: string, report_name: string) => {
  return useQuery({
    queryKey: ["sb-report-filter-get", user_id, report_name],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.sb_filter(user_id, report_name),
      );
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,

    enabled: !!user_id,
  });
};
export const useBOELicenseFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["boe-license-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_license_filter(user_id),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};

export const useBOESVBFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["boe-svb-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(uploadsEndPoints.boe_svb_filter(user_id));
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useBOEInvoiceFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["boe-invoice-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_invoice_filter(user_id),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};

export const useBOECertificateFilter = (user_id: string) => {
  return useQuery({
    queryKey: ["boe-certificate-report-filter", user_id],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_certificte_filter(user_id),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};
export const useBONDBGMainReports = (
  user_id: string,
  bond_no: string,
  page: number = 1,
  page_size: number = 20,
) => {
  return useQuery({
    queryKey: ["boe-bond-bg-report-main", user_id, bond_no, page, page_size],
    queryFn: async () => {
      const res = await apiGetCustoms(
        uploadsEndPoints.boe_get_bond_bg_main(
          user_id,
          bond_no,
          page,
          page_size,
        ),
      );
      return res.data;
    },
    retry: false,
    enabled: !!user_id,
  });
};

export const useDownloadSBReport = () => {
  return useMutation({
    mutationFn: async (data: {
      formart: string;
      user_id: string;
      report_name: string;
      page: string;
      page_size: string;
      filters: any;
      start_date: string | undefined;
      end_date: string | undefined;
      search: string;
    }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.getShippingBillReport(
          data.user_id,
          data.report_name,
          data.formart,
          Number(data.page),
          Number(data.page_size),
          data.filters,
          data.start_date,
          data.end_date,
          data.search,
        ),
      );
      return res;
    },
    onSuccess: (response) => {
      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // file name
      const disposition = response.headers["content-disposition"];

      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
export const useDownloadMasterReport = () => {
  return useMutation({
    mutationFn: async (data: {
      formart: string;
      user_id: string;
      report_name: string;
      filters: any;

      search: string;
    }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.getMasterReport(
          data.user_id,
          data.report_name,
          data.formart,
          1,
          20,
          data.filters,
          data.search,
        ),
      );
      return res;
    },
    onSuccess: (response) => {
      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const disposition = response.headers["content-disposition"];

      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";

      // file name
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
export const useDownloadBOEReport = () => {
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      report_name: string;
      filters: any;
    }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.boe_excel_reports_get(
          data.user_id,
          data.report_name,
          data.filters,
        ),
      );
      return res;
    },
    onSuccess: (response) => {
      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const disposition = response.headers["content-disposition"];
      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";

      // file name
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};

export const useDownloadBondBgReport = () => {
  return useMutation({
    mutationFn: async (data: { user_id: string; report_name: string }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.boe_get_bond_bg_main_excel(
          data.user_id,
          data.report_name,
        ),
      );
      return res;
    },
    onSuccess: (response) => {
      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // file name
      const disposition = response.headers["content-disposition"];

      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
export const useDownloadBondBgMainReport = () => {
  return useMutation({
    mutationFn: async (data: { user_id: string; filter: any }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.boe_get_bond_bg_report(data.user_id, data.filter),
      );
      return res;
    },
    onSuccess: (response) => {
      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // file name
      //link.setAttribute("download", "BOE-report.xlsx");
      const disposition = response.headers["content-disposition"];
      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";

      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
export const useDownloadInvoiceList = () => {
  return useMutation({
    mutationFn: async (data: { user_id: string; svb_no: string }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.boe_invoice_get_Report(data.user_id, data.svb_no),
      );
      return res;
    },
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const disposition = response.headers["content-disposition"];

      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";

      // file name
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
export const useDownloadInvoiceMain = () => {
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      invoice_no: string;
      type: string;
    }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.boe_invoice_main_get_report(
          data.user_id,
          data.invoice_no,
          data.type,
        ),
      );
      return res;
    },
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // file name
      //link.setAttribute("download", fileName);
      const disposition = response.headers["content-disposition"];

      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";

      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};

export const useDownloadItemDetails = () => {
  return useMutation({
    mutationFn: async (data: { user_id: string; filter: any }) => {
      const res = await axiosFileBlob(
        uploadsEndPoints.boe_item_details(data.user_id, "excel", data.filter),
      );
      return res;
    },
    onSuccess: (response) => {
      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const disposition = response.headers["content-disposition"];

      const fileName = disposition
        ? disposition.match(/filename="?([^"]+)"?/)?.[1] || "download.xlsx"
        : "download.xlsx";

      // file name
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
