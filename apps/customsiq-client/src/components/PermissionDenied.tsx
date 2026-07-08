"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePermissionStore } from "@/src/store/permission";

const humanize = (s: string) =>
  s
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const PermissionDenied = () => {
  const error = usePermissionStore((s) => s.permissionError);
  const clear = usePermissionStore((s) => s.clearPermissionError);
  const router = useRouter();

  if (!error) return null;

  const handleBack = () => {
    clear();
    router.back();
  };

  const handleHome = () => {
    clear();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldAlert size={28} className="text-red-500" />
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Access Denied
        </h2>

        <p className="text-sm text-slate-600 mb-2">
          {error.message || "You don't have permission to perform this action."}
        </p>

        {(error.resource || error.action) && (
          <p className="text-xs text-slate-400 mb-6">
            {humanize(error.action)} access to{" "}
            <span className="font-medium text-slate-500">
              {humanize(error.resource)}
            </span>{" "}
            is restricted for your role.
          </p>
        )}

        <p className="text-xs text-slate-400 mb-6">
          If you believe this is a mistake, please contact your administrator.
        </p>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={handleHome}
            className="px-4 py-2 text-sm bg-ciq-primary text-white rounded-md hover:opacity-90 cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied;
