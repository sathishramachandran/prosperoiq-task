import ExtractionDetails from "@/src/components/Dashboard/Boe/ExtractionDetails";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Suspense fallback={null}>
        <ExtractionDetails />
      </Suspense>
    </div>
  );
};

export default page;
