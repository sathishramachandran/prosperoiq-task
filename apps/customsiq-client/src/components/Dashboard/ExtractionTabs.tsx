"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { IoArrowBackOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

type Props = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack?: () => void;
  showBack?: boolean;
  visibleCount?: number;
};

const ExtractionTabs = ({
  tabs,
  activeTab,
  onTabChange,
  onBack,
  showBack = false,
  visibleCount = 9,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const visibleTabs = tabs.slice(0, visibleCount);
  const moreTabs = tabs.slice(visibleCount);
  const activeInMore = moreTabs.includes(activeTab);

  const scrollByDir = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center gap-1 border-b border-slate-200">
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2 pb-1 text-xl text-slate-600 hover:text-slate-900 cursor-pointer shrink-0"
          aria-label="Back"
        >
          <IoArrowBackOutline />
        </button>
      )}

      {/* <button
        onClick={() => scrollByDir("left")}
        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button> */}

      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto flex items-center"
        style={{ scrollbarWidth: "none" }}
      >
        {visibleTabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={clsx(
                "px-3 pb-1 pt text-sm whitespace-nowrap cursor-pointer transition-colors relative shrink-0",
                active
                  ? "text-ciq-primary font-semibold"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              {tab}
              {active && (
                <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-ciq-primary rounded" />
              )}
            </button>
          );
        })}
      </div>

      {moreTabs.length > 0 && (
        <div className="relative shrink-0 pb-3">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={clsx(
              "flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md cursor-pointer transition-colors",
              activeInMore
                ? "border-ciq-primary text-ciq-primary"
                : "border-slate-300 text-slate-700 hover:bg-slate-50",
            )}
          >
            More
            <ChevronDown
              size={14}
              className={clsx("transition-transform", moreOpen && "rotate-180")}
            />
          </button>

          {moreOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMoreOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-40 max-h-[60vh] overflow-y-auto">
                {moreTabs.map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        onTabChange(tab);
                        setMoreOpen(false);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-2 text-sm cursor-pointer transition-colors",
                        active
                          ? "text-ciq-primary font-semibold bg-ciq-primary/5"
                          : "text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* <button
        onClick={() => scrollByDir("right")}
        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button> */}
    </div>
  );
};

export default ExtractionTabs;
