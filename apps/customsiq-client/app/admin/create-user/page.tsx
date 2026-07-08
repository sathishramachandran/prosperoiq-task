import CreateUserForm from "@/src/components/CreateUser/CreateUserForm";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div className="bg-[#F8FAFC] ">
      <Suspense fallback={null}>
        <CreateUserForm />
      </Suspense>
    </div>
  );
};

export default page;
