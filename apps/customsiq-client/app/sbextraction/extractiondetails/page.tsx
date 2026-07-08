import ExtractionDetails from "@/src/components/Dashboard/Boe/ExtractionDetails";
import ShippingBill from "@/src/components/Dashboard/ShippingBill/ShippingBill";
import React, { Suspense } from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Suspense fallback={null}>
        <ShippingBill />
      </Suspense>
    </div>
  );
};

export default page;
