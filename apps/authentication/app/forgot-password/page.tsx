"use client";

import { Suspense } from "react";
import ForgotPassword from "@/components/main_ui/Auth/ForgotPassword";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}