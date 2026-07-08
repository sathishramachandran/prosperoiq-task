"use client";

import { useUserStore } from "@/src/store/user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.user_type !== "admin") {
      router.replace("/boeextraction");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="px-6 py-10 text-sm text-[#64748B]">Loading...</div>
    );
  }

  if (user.user_type !== "admin") {
    return (
      <div className="px-6 py-10 text-sm text-[#B91C1C]">
        You don't have permission to access this page.
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
