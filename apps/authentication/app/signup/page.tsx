import SignUpMain from "@/components/main_ui/Auth/Signup/SignupMain";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bg-[#1A1022] grid place-content-center h-screen">
      <Suspense fallback={null}>
        <SignUpMain />
      </Suspense>
    </div>
  );
};

export default page;
