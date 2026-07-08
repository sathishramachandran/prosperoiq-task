import BOEContainer from "@/src/components/Dashboard/BOEContainer";
import Reports from "@/src/components/Dashboard/Reports";
import BoeReportMain from "@/src/components/Dashboard/Reports/BoeReportMain";
import BondBgMain from "@/src/components/Dashboard/Reports/BondBg/BondBgMain";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import Sidebar from "@/src/ui/sidebar";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bg-[#F8FAFC]">
      <Suspense fallback={null}>
        <BondBgMain />
      </Suspense>
    </div>
  );
};

export default page;
