"use client";

import MainLayout from "@/src/components/MainLayout/MainLayout";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const boeTitles: Record<string, string> = {
  "bond-bg": "BOND BG",
  "invoice-details": "IMPORT INVOICE DETAILS",
  "import-item-detail": "IMPORT ITEM DETAILS",
  svb: "SPECIAL VALUATION BRANCH",
  license: "SCRIP / LICENSE UTILIZATION",
  certificate: "CERTIFICATE",
};

const sbTitles: Record<string, string> = {
  "export-promotion": "EXPORT INCENTIVES",
  "item-details": "EXPORT ITEM DETAILS",
  "value-details": "EXPORT VALUE DETAILS",
  "drawback-report": "DRAW BACK",
  "aa-license": "AA / EPCG LICENSE",
  "invoice-details": "EXPORT INVOICE DETAILS",
  "rodtep-report": "RODTEP REPORT",
};

const masterTitles: Record<string, string> = {
  "hsn-master": "IMPORT HSN / ITEM MASTER",
  "exemption-wise": "IMPORT EXEMPTION WISE",
  "same-desc-diff-hsn": "IMPORT SAME DESC DIFFERENT HSN",
  "same-hsn-diff-rate": "IMPORT SAME HSN DIFFERENT RATE",
};

const resolveTitle = (
  pathname: string,
  reportType: string,
  invoiceNo: string,
  bondNo: string,
): string => {
  if (pathname.includes("/reports/boe-reports/bondbg"))
    return bondNo ? `BOND BG: ${bondNo}` : "BOND BG";
  if (pathname.includes("/reports/boe-reports/invoice"))
    return invoiceNo
      ? `INVOICE NUMBER: ${invoiceNo}`
      : "IMPORT INVOICE DETAILS";
  if (pathname.includes("/reports/boe-reports"))
    return boeTitles[reportType] || "Reports";
  if (pathname.includes("/reports/sb-reports"))
    return sbTitles[reportType] || "Reports";
  if (pathname.includes("/reports/master-reports"))
    return masterTitles[reportType] || "Reports";
  return "Reports";
};

const ReportsLayoutShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reportType = searchParams.get("report_type") || "";
  const invoiceNo = searchParams.get("invoice_no") || "";
  const bondNo = searchParams.get("bond_no") || "";
  const title = resolveTitle(pathname, reportType, invoiceNo, bondNo);
  return <MainLayout title={title}>{children}</MainLayout>;
};

export default ReportsLayoutShell;
