import AdminGuard from "@/src/components/Admin/AdminGuard";
import MainAuthComponent from "@/src/components/Auth.tsx/AuthMainContainer";
import MainLayout from "@/src/components/MainLayout/MainLayout";
import type { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Administer roles and users for your Customs IQ workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <MainAuthComponent>
        <MainLayout title="Admin">
          <AdminGuard>{children}</AdminGuard>
        </MainLayout>
      </MainAuthComponent>
    </div>
  );
};

export default layout;
