"use client";

import { useSearchParams } from "next/navigation";
import BondBg from "./BondBg/BondBg";
import Certificate from "./Certificate/Certificate";
import Invoice from "./Invoice/Invoice";
import SingleWindow from "./SingleWindow/SingleWindow";
import SVBMain from "./SVBDetails/SVBMain";
import BoeLicense from "./BoeLicense";
import { useUserStore } from "@/src/store/user";
import ItemDetail from "./ItemDetails";

const BoeReportMain = () => {
  const searchParams = useSearchParams();
  const userData = useUserStore((state) => state.user);
  const reportType = searchParams.get("report_type") || ""; 
  return (
    <div className="pt-3 px-6 bg-white">
      {reportType === "bond-bg" && <BondBg report_name={reportType} />}
      {reportType === "svb" && <SVBMain report_name={reportType} />}
      {reportType === "import-item-detail" && <ItemDetail report_name={reportType} />}
      {reportType === "certificate" && <Certificate report_name={reportType} />}
      {reportType === "invoice-details" && <Invoice report_name={reportType} />}
      {reportType === "license" && <BoeLicense user_id={userData?.id || ""} />}
      {/* {reportType === "single-window" && <SingleWindow report_name={reportType} />} */}
    </div>
  );
};

export default BoeReportMain;
