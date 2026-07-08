"use client";

import Navbar from "@/src/ui/Navbar";
import Sidebar from "@/src/ui/sidebar";
import PermissionDenied from "@/src/components/PermissionDenied";
import { usePermissionStore } from "@/src/store/permission";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

type Props = {};

const MainLayout = ({ children , title }: { children: ReactNode , title?:string}) => {
  const [minimize, setMinimize] = useState(false);
  const permissionError = usePermissionStore((s) => s.permissionError);
  const clearPermissionError = usePermissionStore(
    (s) => s.clearPermissionError,
  );
  const pathname = usePathname();

  // Clear any prior permission error when the route changes so a new page
  // can attempt its own data fetch and either render normally or trigger a
  // fresh denial.
  useEffect(() => {
    clearPermissionError();
  }, [pathname, clearPermissionError]);

  return (
    <div className="grid grid-cols-[auto_1fr]">
      <Sidebar minimize={minimize} />
      <div className=" h-screen overflow-auto">
        <Navbar title={title} setMinimize={setMinimize} minimize={minimize} />
        {permissionError ? <PermissionDenied /> : children}
      </div>
    </div>
  );
};

export default MainLayout;
