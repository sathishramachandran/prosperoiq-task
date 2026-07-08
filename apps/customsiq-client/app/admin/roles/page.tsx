import RolesPage from "@/src/components/Admin/RolesPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="bg-[#F8FAFC] ">
      <Suspense fallback={null}>
        <RolesPage />
      </Suspense>
    </div>
  );
};

export default page;
