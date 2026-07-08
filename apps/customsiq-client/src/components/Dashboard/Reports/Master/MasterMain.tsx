"use client";

import { useUserStore } from "@/src/store/user";
import { useRouter, useSearchParams } from "next/navigation";

import {
  useDownloadMasterReport,
  useDownloadSBReport,
} from "@/src/hooks/useReports";
import { FaDownload } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import HSNMaster from "./ItemDes";
import ItemDes from "./ItemDes";
import HSN from "./HSN";
import DiffHSN from "./DiffHSN";
import Exemption from "./Exemption";
import DiffRate from "./DiifRate";

const MasterReportMain = () => {
  const userData = useUserStore((state) => state.user);
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const router = useRouter();
  const { mutateAsync, isPending } = useDownloadMasterReport();
  const report_type = searchParams.get("report_type") || "";
  const handleReports = async () => {
    const res = await mutateAsync({
      user_id: userData?.id || "",
      report_name: report_type,
      formart: "excel",
      filters: params,
      search: searchParams.get("search") || "",
    });
  };

  return (
    <div className="px-8 pt-4 bg-white">
      {report_type === "hsn-master" && <HSN user_id={userData?.id || ""} download_func={handleReports} />}
      {report_type === "item-description" && (
        <ItemDes user_id={userData?.id || ""} download_func={handleReports} />
      )}
      {report_type === "same-desc-diff-hsn" && (
        <DiffHSN user_id={userData?.id || ""} download_func={handleReports} />
      )}
      {report_type === "exemption-wise" && (
        <Exemption user_id={userData?.id || ""} download_func={handleReports} />
      )}
      {report_type === "same-hsn-diff-rate" && (
        <DiffRate
         user_id={userData?.id || ""} download_func={handleReports} />
      )}
    </div>
  );
};

export default MasterReportMain;
