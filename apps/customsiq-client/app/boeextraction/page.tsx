import BOEContainer from "@/src/components/Dashboard/BOEContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import Sidebar from "@/src/ui/sidebar";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Suspense fallback={null}>
        <BOEContainer />
      </Suspense>
    </div>
  );
};

export default page;
