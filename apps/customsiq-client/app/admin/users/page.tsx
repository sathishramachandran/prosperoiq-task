import UsersPage from "@/src/components/Admin/UsersPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="bg-[#F8FAFC] ">
      <Suspense fallback={null}>
        <UsersPage />
      </Suspense>
    </div>
  );
};

export default page;
