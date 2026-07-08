export const authEndPoints = {
  createSubUser: `/create_user`,
  listSubUsers: `/admin/users`,
};

export const adminEndPoints = {
  resources: `/admin/resources`,
  roles: `/admin/roles`,
  role: (role: string) => `/admin/roles/${encodeURIComponent(role)}`,
  userRoles: (user_id: string) =>
    `/admin/users/${encodeURIComponent(user_id)}/roles`,
  userRole: (user_id: string, role: string) =>
    `/admin/users/${encodeURIComponent(user_id)}/roles/${encodeURIComponent(role)}`,
};

export const uploadsEndPoints = {
  singleUpload: `/files/upload`,
  bulkUpload: `/files/bulk/upload`,
  reports: `/reports/generate`,
  deleteBoeSb: (job_id: string, user_id: string, bill_name: string) =>
    `/files/uploads/${job_id}?user_id=${user_id}&bill_name=${bill_name}`,
  boe_reports: `/reports/generate-boe`,
  bulk_delete: `/files/uploads/bulk-delete`,
  boe_reports_get: (
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
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    if (endDate) {
      params.append("start_date", endDate);
    }
    if (startDate) {
      params.append("end_date", startDate);
    }

    // mandatory params
    params.append("user_id", user_id);
    params.append("reports", report_name);
    params.append("page", String(page));
    params.append("page_size", String(page_size));

    // 🔥 dynamic filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.append(key, values.join(",")); // convert array → comma string
      }
    });
    return `/reports/generate-boe?${params.toString()}`;
  },
  boe_excel_reports_get: (
    user_id: string,
    report_name: string,
    filters: any,
    page: number = 1,
    page_size: number = 20,
  ) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
      if (key === "report_type") return;

      if (values) {
        if (Array.isArray(values) && values.length > 0) {
          params.append(key, values.join(","));
        } else if (!Array.isArray(values)) {
          params.append(key, String(values));
        }
      }
    });
    return `/reports/generate-boe?user_id=${user_id}&format=excel&reports=${report_name}&${params.toString()}`;
  },
  boe_bondbg_filter: (user_id: string) =>
    `/reports/generate-boe/bond-bg/filters?user_id=${user_id}`,
  boe_item_details_filter: (user_id: string) =>
    `/reports/generate-boe/invoice-details/filters?user_id=${user_id}`,
  boe_license_filter: (user_id: string) =>
    `/reports/generate-boe/license/filters?user_id=${user_id}`,
  boe_certificte_filter: (user_id: string) =>
    `/reports/generate-boe/certificate/filters?user_id=${user_id}`,
  boe_svb_filter: (user_id: string) =>
    `/reports/generate-boe/svb/filters?user_id=${user_id}`,
  boe_invoice_filter: (user_id: string) =>
    `/reports/generate-boe/invoice-details/filters?user_id=${user_id}`,
  sb_export_filter: (user_id: string) =>
    `/reports/sb-reports/export-promotion/filters?user_id=${user_id}`,
  master_export_filter: (user_id: string, reportName: string) =>
    `/reports/filters?report_name=${reportName}&user_id=${user_id}`,
  sb_filter: (user_id: string, report_name: string) =>
    `/reports/sb-reports/${report_name}/filters?user_id=${user_id}`,
  boe_get_bond_bg: (
    user_id: string,
    page: number = 1,
    page_size: number = 20,
    filters: {
      bond_no?: string[];
      bond_code?: string[];
      port?: string[];
    } = {},
    start_date: string | undefined,
    end_date: string | undefined,
    search: string,
  ) => {
    const params = new URLSearchParams();

    // mandatory params
    params.append("user_id", user_id);
    if (end_date) {
      params.append("end_date", end_date);
    }
    if (search) {
      params.append("search", search);
    }
    if (start_date) {
      params.append("start_date", start_date);
    }
    params.append("page", String(page));
    params.append("page_size", String(page_size));

    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.append(key, values.join(","));
      }
    });

    return `/reports/generate-boe/bond-bg/list?${params.toString()}`;
  },
  boe_get_bond_bg_report: (
    user_id: string,
    filters: {
      license_no?: string[];
      license_code?: string[];
      be_no?: string[];
    } = {},
    // search: string,
    // start_date:string,
    // end_date:string
  ) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
      if (key === "report_type") return;

      if (values) {
        if (Array.isArray(values) && values.length > 0) {
          params.append(key, values.join(","));
        } else if (!Array.isArray(values)) {
          params.append(key, String(values));
        }
      }
    });
    return `/reports/generate-boe/bond-bg/list?user_id=${user_id}&format=excel&${params.toString()}`;
  },

  boe_get_bond_bg_main: (
    user_id: string,
    bond_no: string,
    page: number = 1,
    page_size: number = 20,
  ) =>
    `/reports/generate-boe/bond-bg?user_id=${user_id}&format=json&bond_no=${bond_no}&page=${page}&page_size=${page_size}`,
  boe_get_bond_bg_main_excel: (
    user_id: string,
    bond_no: string,
    page: number = 1,
    page_size: number = 20,
  ) =>
    `/reports/generate-boe/bond-bg?user_id=${user_id}&format=excel&bond_no=${bond_no}&page=${page}&page_size=${page_size}`,
  boe_invoice_get: (
    user_id: string,
    svb_no: string,
    page: number = 1,
    page_size: number = 20,
  ) =>
    `/reports/boe/svb/invoice-list?user_id=${user_id}&svb_no=${svb_no}&page=${page}&page_size=${page_size}`,
  boe_invoice_get_Report: (user_id: string, svb_no: string) =>
    `/reports/boe/svb/invoice-list?user_id=${user_id}&svb_no=${svb_no}&format=excel`,
  boe_invoice_main_get: (
    user_id: string,
    invoice_no: string,
    page: number = 1,
    page_size: number = 20,
  ) =>
    `/reports/boe/svb/invoice-details?user_id=${user_id}&invoice_no=${invoice_no}&page=${page}&page_size=${page_size}`,
  boe_item_details: (
    user_id: string,
    format: string,

    filters: any,
    page: number = 1,
    page_size: number = 20,
  ) => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("format", format);
    params.append("page_size", String(page_size));

    Object.entries(filters).forEach(([key, values]) => {
      if (key === "report_type") return;

      if (values) {
        if (Array.isArray(values) && values.length > 0) {
          params.append(key, values.join(","));
        } else if (!Array.isArray(values)) {
          params.append(key, String(values));
        }
      }
    });
    return `/reports/boe/invoice-details?user_id=${user_id}&${params.toString()}`;
  },
  boe_invoice_main_get_report: (
    user_id: string,
    invoice_no: string,
    type: string,
  ) =>
    `/reports/boe/svb/invoice-details?user_id=${user_id}&invoice_no=${invoice_no}&format=excel&type=${type}`,
  bulk_download_list: (user_id: string) =>
    `/files/bulk/exports?user_id=${user_id}`,
  bulk_excel_download: (token: string, user_id: string) =>
    `/files/bulk/download/file/${token}?user_id=${user_id}`,
  bulk_excel_start: () => `/files/bulk/export`,
  bulkDownload: `/files/bulk/download`,
  getAllUploads: (
    user_id: string,
    bill_name: string,
    page: number = 1,
    page_size: number = 20,
    start_date: string,
    end_date: string,
    search: string,
  ) => {
    const params = new URLSearchParams({
      user_id,
      bill_name,
      page: String(page),
      page_size: String(page_size),
    });

    if (start_date) params.append("start_date", start_date);
    if (search) params.append("search", search);
    if (end_date) params.append("end_date", end_date);

    return `/files/uploads?${params.toString()}`;
  },
  getCombinedOverviewByUser: (
    user_id: string,
    sheet_name: string,
    bill_name: string,
    page: string,
    page_size: string,
  ) => {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("page_size", String(page_size));
    return `/files/extractedvalue/json?user_id=${user_id}&sheet_name=${sheet_name}&bill_name=${bill_name}&${params.toString()}`;
  },
  getBoeOverview: (
    job_id: string,
    sheet_name: string,
    bill_name: string,
    user_id?: string,
    page: number = 1,
    page_size: number = 20,
  ) =>
    `/files/boeextractedvalue/${job_id}/json?bill_name=${bill_name}&sheet_name=${sheet_name}${user_id ? `&user_id=${user_id}` : ""}&page=${page}&page_size=${page_size}`,
  getSBOverview: (
    job_id: string,
    sheet_name: string,
    bill_name: string,
    user_id?: string,
    page: number = 1,
    page_size: number = 20,
  ) =>
    `/files/sbextractedvalue/${job_id}/json?bill_name=${bill_name}&sheet_name=${sheet_name}${user_id ? `&user_id=${user_id}` : ""}&page=${page}&page_size=${page_size}`,
  getShippingBillReport: (
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
    start_date?: string | undefined,
    end_date?: string | undefined,
    search?: string,
  ) => {
    const params = new URLSearchParams();

    // mandatory params
    params.append("user_id", user_id);
    if (start_date) params.append("start_date", start_date);
    if (search) params.append("search", search);
    if (end_date) params.append("end_date", end_date);
    params.append("report_name", report_name);
    params.append("format", format);
    params.append("page", String(page));
    params.append("page_size", String(page_size));

    Object.entries(filters).forEach(([key, values]) => {
      if (key === "report_type") return;

      if (values) {
        if (Array.isArray(values) && values.length > 0) {
          params.append(key, values.join(","));
        } else if (!Array.isArray(values)) {
          params.append(key, String(values));
        }
      }
    });

    return `/reports/sb-reports?${params.toString()}`;
  },
  getMasterReport: (
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
    start_date?: string | undefined,
    end_date?: string | undefined,
    search?: string,
  ) => {
    const params = new URLSearchParams();

    // mandatory params
    params.append("user_id", user_id);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);
    if (search) params.append("search", search);
    params.append("report_name", report_name);
    params.append("format", format);
    params.append("page", String(page));
    params.append("page_size", String(page_size));

    Object.entries(filters).forEach(([key, values]) => {
      if (key === "report_type") return;

      if (values) {
        if (Array.isArray(values) && values.length > 0) {
          params.append(key, values.join(","));
        } else if (!Array.isArray(values)) {
          params.append(key, String(values));
        }
      }
    });
    return `/reports/boe/master-reports?${params.toString()}`;
  },
  logout: `/logout`,
  dowload: (
    job_id: string,
    fileType: string,
    bill_name: string,
    user_id?: string,
  ) =>
    `/files/download/${job_id}?file_type=${fileType}&bill_name=${bill_name}${user_id ? `&user_id=${user_id}` : ""}`,
  status: (id: string, user_id?: string, bill_name?: string) =>
    `/files/status/${id}?user_id=${user_id || ""}&bill_name=${bill_name || "boe"}`,
  reextractRodtep: `/files/reextract-rodtep`,
  reextractRodtepStatus: (task_id: string) =>
    `/files/reextract-rodtep/status/${task_id}`,
};
