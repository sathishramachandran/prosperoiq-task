"use client";
import React, { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Settings,
  Search,
  Check,
  RotateCcw,
  LayoutGrid,
  Pin,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Table, Column } from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./Sheet";

// import { Sheet } from "./Sheet";

type PaginationProps<TData> = {
  totalPages: number;
  isPending?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize: number;
  downloadFunc?: () => void;
  sticky?: boolean;
  table?: Table<TData>;
};

const Pagination = <TData,>({
  totalPages,
  isPending,
  currentPage,
  onPageChange,
  totalItems = 0,
  pageSize,
  downloadFunc,
  sticky = true,
  table,
}: PaginationProps<TData>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingVisibility, setPendingVisibility] = useState<
    Record<string, boolean>
  >({});
  const [pendingPinning, setPendingPinning] = useState<{
    left?: string[];
    right?: string[];
  }>({});

  const pathname = usePathname();
  const searchParam = useSearchParams();

  // Initialize pending visibility and pinning when drawer opens
  const handleOpenChange = (open: boolean) => {
    if (open && table) {
      const currentVisibility: Record<string, boolean> = {};
      table.getAllColumns().forEach((col: Column<TData, unknown>) => {
        currentVisibility[col.id] = col.getIsVisible();
      });
      setPendingVisibility(currentVisibility);

      const currentPinning = table.getState().columnPinning || {
        left: [],
        right: [],
      };
      setPendingPinning(currentPinning);
    }
    setSearchQuery("");
  };

  const handleApply = () => {
    if (table) {
      table.setColumnVisibility(pendingVisibility);
      table.setColumnPinning(pendingPinning);
    }
  };

  const togglePending = (columnId: string) => {
    setPendingVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const togglePinning = (columnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingPinning((prev) => {
      const currentLeft = prev?.left || [];
      const currentRight = prev?.right || [];
      const isLeftPinned = currentLeft.includes(columnId);

      let newLeft: string[];
      if (isLeftPinned) {
        newLeft = currentLeft.filter((id) => id !== columnId);
      } else {
        newLeft = [...currentLeft, columnId];
      }

      return {
        left: newLeft,
        right: currentRight,
      };
    });
  };

  const selectAll = () => {
    const next: Record<string, boolean> = { ...pendingVisibility };
    table?.getAllColumns().forEach((col: Column<TData, unknown>) => {
      if (col.getCanHide()) next[col.id] = true;
    });
    setPendingVisibility(next);
  };

  const resetAll = () => {
    const next: Record<string, boolean> = { ...pendingVisibility };
    table?.getAllColumns().forEach((col: Column<TData, unknown>) => {
      if (col.getCanHide()) next[col.id] = false;
    });
    setPendingVisibility(next);

    setPendingPinning((prev) => ({
      left: prev?.left?.filter((id) => id === "select-col"),
      right: prev?.right,
    }));
  };

  const sheet_name = searchParam.get("sheet_name");

  const isExtraction =
    pathname.includes("boeextraction") || pathname.includes("sbextraction");

  const shouldShowTotalItems =
    typeof totalItems === "number" &&
    totalItems >= 0 &&
    !pathname.includes("/extractiondetails");

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={clsx(
        "flex items-center justify-between border border-slate-200 bg-white px-4 py-3",
        sticky && "sticky bottom-0 z-10",
      )}
    >
      {/* Left Section */}
      <div className="text-sm text-slate-500">
        {shouldShowTotalItems &&
          (totalItems === 0 ? (
            <span>Showing 0 documents</span>
          ) : (
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startItem.toLocaleString()} – {endItem.toLocaleString()}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {totalItems.toLocaleString()}
              </span>{" "}
              documents
            </span>
          ))}
      </div>

      {/* Center Pagination */}
      <div className="flex items-center gap-2">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Info */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Page</span>

          <div className="flex h-9 min-w-[42px] items-center justify-center rounded-md border border-slate-300 bg-white px-3 font-medium text-slate-700 shadow-sm">
            {currentPage}
          </div>

          <span>
            of <span className="font-medium text-slate-700">{totalPages}</span>
          </span>
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {table && (
          <Sheet onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <button className="p-2 text-slate-400 hover:text-ciq-primary hover:bg-ciq-primary/5 cursor-pointer rounded-full transition-all duration-300 outline-none">
                <Settings
                  size={20}
                  className="hover:rotate-90 transition-transform duration-500"
                />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[320px] p-0 flex flex-col bg-[#FDFCFD] border-l-0 shadow-2xl"
            >
              <SheetHeader className="p-4 bg-white border-b space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-ciq-primary/10 rounded-lg text-ciq-primary">
                      <LayoutGrid size={18} />
                    </div>
                    <SheetTitle className="text-lg font-bold text-slate-800">
                      Configure Table Columns
                    </SheetTitle>
                  </div>
                </div>

                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search columns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-ciq-primary/20 focus:ciq-primary transition-all outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={selectAll}
                    className="text-[10px] font-bold text-ciq-primary hover:underline flex items-center gap-1 uppercase tracking-tight"
                  >
                    Select All
                  </button>
                  <button
                    onClick={resetAll}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 uppercase tracking-tight"
                  >
                    <RotateCcw size={10} />
                    Reset
                  </button>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50/30">
                <div className="grid gap-2">
                  {table
                    .getAllColumns()
                    .filter(
                      (column: Column<TData, unknown>) =>
                        column.getCanHide() &&
                        column.id !== "select-col" &&
                        column.id !== "action" &&
                        (column.id
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) ??
                          true),
                    )
                    .map((column: Column<TData, unknown>) => {
                      const isVisible =
                        pendingVisibility[column.id] ?? column.getIsVisible();
                      const isPinned =
                        pendingPinning?.left?.includes(column.id) ??
                        column.getIsPinned() === "left";
                      return (
                        <div
                          key={column.id}
                          onClick={() => togglePending(column.id)}
                          className={clsx(
                            "group flex items-center justify-between px-3 py-2 cursor-pointer rounded-xl border transition-all duration-300",
                            isVisible
                              ? "bg-white border-[#7D1C4A]/20 shadow-sm"
                              : "bg-white/50 border-slate-100 opacity-60 hover:opacity-100",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={clsx(
                                "w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-300",
                                isVisible
                                  ? "bg-ciq-primary border-ciq-primary"
                                  : "border-slate-300 bg-white",
                              )}
                            >
                              {isVisible && (
                                <Check
                                  size={10}
                                  className="text-white"
                                  strokeWidth={4}
                                />
                              )}
                            </div>
                            <span
                              className={clsx(
                                "text-[11px] font-bold tracking-tight transition-colors",
                                isVisible ? "text-slate-800" : "text-slate-400",
                              )}
                            >
                              {column.id
                                .replace(/([A-Z])/g, " $1")
                                .replace(/_/g, " ")
                                .trim()
                                .toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => togglePinning(column.id, e)}
                              className={clsx(
                                "p-1.5 rounded-lg transition-all duration-200",
                                isPinned
                                  ? "bg-[#7D1C4A]/10 text-ciq-primary opacity-100"
                                  : "text-slate-300 hover:text-slate-500 opacity-40 group-hover:opacity-100",
                              )}
                              title={
                                isPinned ? "Unpin column" : "Pin column to left"
                              }
                            >
                              <Pin
                                size={14}
                                className={clsx(isPinned && "fill-ciq-primary")}
                              />
                            </button>
                            {isVisible && (
                              <div className="w-1 h-1 rounded-full bg-ciq-primary" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="px-4 py-3 bg-white border-t flex justify-center ">
                <SheetClose asChild>
                  <button
                    onClick={handleApply}
                    className="px-6 mx-auto bg-ciq-primary text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-ciq-primary/95 cursor-pointer shadow-lg shadow-[#7D1C4A]/10 active:scale-[0.98] transition-all duration-200"
                  >
                    Apply Changes
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {!sheet_name && (
          <button
            onClick={downloadFunc}
            disabled={isPending}
            className={clsx(
              "flex items-center gap-2 rounded-md bg-ciq-primary px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-md",
            )}
          >
            <Download size={16} />
            DOWNLOAD EXCEL
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
