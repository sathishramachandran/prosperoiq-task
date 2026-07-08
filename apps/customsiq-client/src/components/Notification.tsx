"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Download, RefreshCw } from "lucide-react";
import { useBulkDownload, useDownloadList } from "../hooks/useDownloads";
import { useUserStore } from "../store/user";
import toast from "react-hot-toast";
import clsx from "clsx";

const Notification = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state) => state.user);
  const { data, refetch } = useDownloadList(user?.id || "");
  const { mutateAsync, isPending: downloadPending } = useBulkDownload();

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "";

    // Fix ISO format issue
    const normalizedDate = dateString.includes("Z")
      ? dateString
      : dateString + "Z";

    const now = new Date();
    const past = new Date(normalizedDate);

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 0) return "Just now"; // safety

    if (diffInSeconds < 60) return "Just now";

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };
  const prevCount = useRef(0);
  const [showBadge, setShowBadge] = useState(false);

  const list = data?.data || [];
  const currentCount = list.length;

  useEffect(() => {
    if (currentCount > prevCount.current) {
      setShowBadge(true); // new notification வந்துருக்கு
    }
    prevCount.current = currentCount;
  }, [currentCount]);

const handleDownload = (downloadUrl: string) => {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", "");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
  return (
<Popover>
  <PopoverTrigger asChild>
    <button className="relative">
      {children}

      {/* 🔴 Notification Badge */}
      {showBadge && currentCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
          {currentCount}
        </span>
      )}
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-96 p-0 rounded-2xl shadow-xl border bg-white">
    
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-2xl">
      <h2 className="text-sm font-semibold text-gray-800">
        Notifications
      </h2>

      <button
        onClick={() => {
          refetch();
          setShowBadge(false);
          toast.success("Refreshed");
        }}
        className="p-2 rounded-md hover:bg-gray-200 transition"
      >
        <RefreshCw size={16} className="text-gray-600" />
      </button>
    </div>

    {/* List */}
    <div className="max-h-96 overflow-y-auto divide-y">
      
      {/* ✅ Empty State */}
      {!list?.length && (
        <div className="py-10 text-center text-sm text-gray-500">
          No notifications found
        </div>
      )}

      {/* ✅ Notification Items */}
      {list?.map((item: any, index: number) => (
        <div
          key={index}
          className="px-4 py-4 hover:bg-gray-50 transition"
        >
          {/* Top Row */}
          <div className="flex justify-between items-start gap-2">
            <span className="text-sm font-semibold text-gray-800">
              {item.bill_name === "boe"
                ? "Bill of Entry"
                : "Shipping Bill"}{" "}
              Download
            </span>

            <span className="text-xs text-gray-400 whitespace-nowrap">
              {getTimeAgo(item.created_at)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-1">
            Bulk Download • {item.total_records} reports
          </p>

          {/* Action Button */}
          <button
            disabled={downloadPending}
            onClick={() => handleDownload(item.download_url)}
            className={clsx(
              "flex items-center justify-center gap-2 mt-3 w-full px-3 py-2 text-sm rounded-lg border transition",
              downloadPending
                ? "opacity-50 cursor-not-allowed"
                : "border-green-400 text-green-600 hover:bg-green-50"
            )}
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>
      ))}
    </div>
  </PopoverContent>
</Popover>
  );
};

export default Notification;
