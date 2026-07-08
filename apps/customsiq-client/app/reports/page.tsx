import BOEContainer from "@/src/components/Dashboard/BOEContainer";
import Reports from "@/src/components/Dashboard/Reports";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import Sidebar from "@/src/ui/sidebar";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bg-[#F8FAFC]">
      <Suspense fallback={null}>
        <Reports />
      </Suspense>
    </div>
  );
};

export default page;
