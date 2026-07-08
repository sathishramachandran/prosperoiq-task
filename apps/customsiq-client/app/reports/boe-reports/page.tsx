
import BoeReportMain from "@/src/components/Dashboard/Reports/BoeReportMain";

import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bg-[#F8FAFC]">
      <Suspense fallback={null}>
        <BoeReportMain />
      </Suspense>
    </div>
  );
};

export default page;
