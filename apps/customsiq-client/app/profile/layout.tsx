import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode, Suspense } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <MainAuthComponent>
        <MainLayout title="Bill of Entry">{children}</MainLayout>
      </MainAuthComponent>
    </div>
  );
};

export default layout;
