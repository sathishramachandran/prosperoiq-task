"use client";

import { useUserStore } from "@/src/store/user";
import ValueDetails from "./ValueDetails";
import { useRouter, useSearchParams } from "next/navigation";
import Drawback from "./DrawBack";
import SBLicense from "./SBLicense";
import ItemDetail from "./ItemDetails";
import InvoiceDetail from "./InvoiceDetail";
import RodTep from "./RodTep";
import Export from "./Export";
import { useDownloadSBReport } from "@/src/hooks/useReports";
import { FaDownload } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const SBReportsMain = () => {
  const userData = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutateAsync, isPending } = useDownloadSBReport();
  const params = Object.fromEntries(searchParams.entries());

  const report_type = searchParams.get("report_type") || "";
  const handleReports = async () => {
    const res = await mutateAsync({
      user_id: userData?.id || "",
      report_name:
        report_type == "invoice-details" ? "p4-invoice-details" : report_type,
      formart: "excel",
      page: searchParams.get("page") || "1",
      page_size: searchParams.get("page_size") || "20",
      filters: params,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
      search: searchParams.get("search") || "",
    });
  };

  return (
    <div className="px-6 pt-3 bg-white">
      {report_type === "export-promotion" && (
        <Export user_id={userData?.id || ""} download_func={handleReports} />
      )}
      {report_type === "value-details" && (
        <ValueDetails download_func={handleReports} user_id={userData?.id || ""} />
      )}
      {report_type === "drawback-report" && (
        <Drawback download_func={handleReports} user_id={userData?.id || ""} />
      )}
      {report_type === "aa-license" && (
        <SBLicense download_func={handleReports} user_id={userData?.id || ""} />
      )}
      {report_type === "item-details" && (
        <ItemDetail download_func={handleReports} user_id={userData?.id || ""} />
      )}
      {report_type === "invoice-details" && (
        <InvoiceDetail download_func={handleReports}   user_id={userData?.id || ""} />
      )}
      {/* {report_type === "single-window" && (
        <Window user_id={userData?.id || ""} />
      )} */}
      {report_type === "rodtep-report" && (
        <RodTep download_func={handleReports} user_id={userData?.id || ""} />
      )}
    </div>
  );
};

export default SBReportsMain;
