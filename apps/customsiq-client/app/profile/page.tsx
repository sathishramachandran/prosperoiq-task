// import ProfileMain from "@/src/components/Profile/ProfileMain";

import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Suspense fallback={null}>
        {/* <ProfileMain /> */}
        Profile Main
      </Suspense>
    </div>
  );
};

export default page;
