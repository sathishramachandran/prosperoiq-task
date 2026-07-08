"use client";

import { useMeRoute } from "@/src/hooks/useUser";
import { useUserStore } from "@/src/store/user";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = { children: ReactNode };

const MainAuthComponent = ({ children }: Props) => {
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isError } = useMeRoute();

  useEffect(() => {
    if (isPending) return;

    if (isError) {

      // The 401 interceptor already attempted a silent refresh and failed
      // (or the request errored for a non-recoverable reason). Either way,
      // the user is truly unauthenticated — bounce to SSO login.
      router.push(
        process.env.NEXT_PUBLIC_CLIENT_AUTH_URL ||
          process.env.CLIENT_AUTH_URL ||
          "/",
      );
      return;
    }

    if (data?.data) {
      setUser(data.data.profile);
    }
  }, [pathname, isPending, isError, data, router, setUser]);

  if (isPending) {
    return (
      <div className="grid place-content-center min-h-screen text-sm text-[#64748B]">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
};

export default MainAuthComponent;
