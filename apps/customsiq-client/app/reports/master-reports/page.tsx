import MasterReportMain from "@/src/components/Dashboard/Reports/Master/MasterMain";
import SBReportsMain from "@/src/components/Dashboard/Reports/SBReports/SBReportsMain";

import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bg-[#F8FAFC]">
      <Suspense fallback={null}>
        <MasterReportMain />
      </Suspense>
    </div>
  );
};

export default page;
