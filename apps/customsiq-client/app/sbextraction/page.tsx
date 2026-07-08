import SBExtraction from "@/src/components/Dashboard/SBExtraction";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import Sidebar from "@/src/ui/sidebar";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
       <Suspense fallback={null}>

        <SBExtraction/>
       </Suspense>
    </div>
  );
};

export default page;
