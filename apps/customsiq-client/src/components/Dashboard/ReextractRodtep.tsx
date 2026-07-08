"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/Dialog";
import { useReextractRodtepStart } from "@/src/hooks/useBOE.tsx/useBOEApi";
import { useReextractRodtepTask } from "@/src/hooks/useSE/useReextractRodtepTask";
import {
  clearPersistedTask,
  loadPersistedTask,
  persistTask,
  useReextractRodtepStore,
} from "@/src/store/reextractRodtep";
import { useUserStore } from "@/src/store/user";
import clsx from "clsx";
import { RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { LuCircleDashed } from "react-icons/lu";

/* ------------------------------------------------------------------ */
/* Confirm dialog (page-level only — per-row clicks bypass this)       */
/* ------------------------------------------------------------------ */

type ConfirmProps = {
  children: ReactNode;
  onConfirm: () => Promise<void> | void;
  isPending: boolean;
  disabled?: boolean;
};

const ReextractRodtepConfirm = ({
  children,
  onConfirm,
  isPending,
  disabled,
}: ConfirmProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0!">
        <DialogTitle className="hidden" />
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Re-extract RoDTEP
            </h2>
          </div>
          <p className="px-8 text-slate-700">
            Reprocess RoDTEP for all your shipping bills? This may take a few
            minutes.
          </p>
          <div className="flex items-center justify-between px-8 py-5 rounded-b-2xl">
            <div className="flex gap-3 w-full justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-sm cursor-pointer text-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                className={clsx(
                  "bg-ciq-primary px-5 py-1 cursor-pointer rounded-sm border-0! text-white",
                  isPending && "cursor-default!",
                )}
                onClick={async () => {
                  await onConfirm();
                  setOpen(false);
                }}
              >
                {isPending ? (
                  <div className="animate-spin">
                    <LuCircleDashed size={21} />
                  </div>
                ) : (
                  "Reprocess all"
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ */
/* Failure list (rendered inside SUCCESS toast when failures present)  */
/* ------------------------------------------------------------------ */

type FailureListProps = {
  failures: { sb_no: string; reason: string }[];
};

const FailureList = ({ failures }: FailureListProps) => {
  const [open, setOpen] = useState(false);
  if (failures.length === 0) return null;
  return (
    <div className="mt-1 text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="underline text-blue-600 cursor-pointer"
      >
        {open ? "Hide" : "Show"} {failures.length} failure
        {failures.length === 1 ? "" : "s"}
      </button>
      {open && (
        <ul className="mt-1 max-h-40 overflow-auto pr-2">
          {failures.map((f, i) => (
            <li key={`${f.sb_no}-${i}`} className="text-slate-600">
              <span className="font-medium">{f.sb_no}</span>: {f.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Controller — owns task lifecycle, polling, toasts, persistence      */
/* ------------------------------------------------------------------ */

function useReextractController() {
  const userId = useUserStore((s) => s.user?.id || "");
  const active = useReextractRodtepStore((s) => s.active);
  const setActive = useReextractRodtepStore((s) => s.setActive);
  const clear = useReextractRodtepStore((s) => s.clear);
  const queryClient = useQueryClient();

  // Hydrate from localStorage once per user
  useEffect(() => {
    if (!userId || active) return;
    const persisted = loadPersistedTask(userId);
    if (persisted) setActive(persisted);
  }, [userId, active, setActive]);

  const taskView = useReextractRodtepTask(active?.taskId ?? null);

  // React to terminal status
  useEffect(() => {
    if (!active || !taskView.isTerminal) return;
    const { status, result, error } = taskView;

    if (status === "SUCCESS" && result) {
      const c = result.counters;
      const msg = `Re-extracted ${c.updated} SBs. Added ${c.rows_added} RoDTEP rows. ${c.error} error${c.error === 1 ? "" : "s"}.`;
      toast.success(
        (t) => (
          <div className="flex flex-col">
            <span>{msg}</span>
            <FailureList failures={result.failures || []} />
            <button
              onClick={() => toast.dismiss(t.id)}
              className="self-end text-xs text-gray-500 mt-1 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        ),
        { duration: result.failures?.length ? 12000 : 6000 },
      );
      queryClient.invalidateQueries({ queryKey: ["get_all_uploads_by_id"] });
      queryClient.invalidateQueries({ queryKey: ["get_boe_extraction_main"] });
    } else if (status === "FAILURE") {
      toast.error(`RoDTEP re-extraction failed: ${error || "unknown error"}`);
    } else if (status === "REVOKED") {
      toast.error("RoDTEP re-extraction was cancelled");
    }

    clearPersistedTask(userId);
    clear();
  }, [active, taskView, taskView.isTerminal, queryClient, clear, userId]);

  // Stall toast when polling has been failing > 30s
  useEffect(() => {
    if (taskView.isStalled) {
      toast.error(
        "Lost connection — task may still be running. Refresh to check.",
        { id: "reextract-rodtep-stall" },
      );
    }
  }, [taskView.isStalled]);

  return { active, taskView, setActive, userId };
}

/* ------------------------------------------------------------------ */
/* Page-level "Re-extract RoDTEP for all" button + progress bar         */
/* ------------------------------------------------------------------ */

export const ReextractRodtepPageButton = () => {
  const { active, taskView, setActive, userId } = useReextractController();
  const start = useReextractRodtepStart();

  const isRunning = !!active;

  const handleStartAll = async () => {
    try {
      const res = await start.mutateAsync(undefined);
      if (!res?.task_id) return;
      const task = {
        taskId: res.task_id,
        scope: "all" as const,
        sbNo: null,
      };
      setActive(task);
      persistTask(userId, task);
    } catch {
      /* error toast handled in the mutation */
    }
  };

  return (
    <div className="flex  items-center gap-2">
      <ReextractRodtepConfirm
        onConfirm={handleStartAll}
        isPending={start.isPending}
        disabled={isRunning}
      >
        <button
          disabled={isRunning || start.isPending}
          className={clsx(
            "bg-ciq-primary cursor-pointer text-xs rounded-sm text-white px-6 py-2 flex items-center gap-2",
            (isRunning || start.isPending) && "cursor-not-allowed opacity-60",
          )}
        >
          {isRunning && active?.scope === "all" ? (
            <span className="animate-spin">
              <LuCircleDashed size={18} />
            </span>
          ) : (
            <RefreshCcw size={16} />
          )}
          Re-extract RoDTEP for all
        </button>
      </ReextractRodtepConfirm>

      {isRunning && <ReextractRodtepProgressInline taskView={taskView} />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Inline progress bar shown while a task is running                    */
/* ------------------------------------------------------------------ */

const ReextractRodtepProgressInline = ({
  taskView,
}: {
  taskView: ReturnType<typeof useReextractRodtepTask>;
}) => {
  const { status, progress } = taskView;
  const current = progress?.current ?? 0;
  const total = progress?.total ?? 0;
  const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  const counters = progress?.counters;

  const label = useMemo(() => {
    if (status === "PENDING" || status === "STARTED") return "Queued…";
    if (status === "PROGRESS") return progress?.msg || "Re-extracting RoDTEP…";
    return "";
  }, [status, progress?.msg]);

  return (
    <div className="w-80 max-w-full rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span className="truncate">{label}</span>
        <span>
          {current}/{total || "?"}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded">
        <div
          className="h-2 bg-ciq-primary rounded transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {counters && (
        <div className="mt-2 text-xs text-slate-600">
          Updated {counters.updated} · Skipped {counters.skipped} · Errors{" "}
          {counters.error}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Per-row "Re-extract RoDTEP" button                                   */
/* ------------------------------------------------------------------ */

type RowProps = {
  sbNo: string;
  rowStatus: string;
};

export const ReextractRodtepRowButton = ({ sbNo, rowStatus }: RowProps) => {
  const userId = useUserStore((s) => s.user?.id || "");
  const active = useReextractRodtepStore((s) => s.active);
  const setActive = useReextractRodtepStore((s) => s.setActive);
  const start = useReextractRodtepStart();

  const isRunning = !!active;
  const isThisRow =
    isRunning && active?.scope === "row" && active?.sbNo === sbNo;
  const rowDisabled = rowStatus === "queued" || rowStatus === "processing";

  const handleClick = async () => {
    if (isRunning || rowDisabled) return;
    try {
      const res = await start.mutateAsync([sbNo]);
      if (!res?.task_id) return;
      const task = {
        taskId: res.task_id,
        scope: "row" as const,
        sbNo,
      };
      setActive(task);
      persistTask(userId, task);
    } catch {
      /* error toast handled in mutation */
    }
  };

  const disabled = isRunning || start.isPending || rowDisabled;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title="Re-extract RoDTEP"
      aria-label="Re-extract RoDTEP"
      className={clsx(
        "px-3 py-1 text-xs border rounded-md w-fit flex items-center gap-1 transition active:scale-95",
        isThisRow
          ? "bg-blue-50 text-blue-600 cursor-default"
          : disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-200",
      )}
    >
      {isThisRow ? (
        <span className="animate-spin">
          <LuCircleDashed size={14} />
        </span>
      ) : (
        <RefreshCcw size={14} />
      )}
      Re-extract RoDTEP
    </button>
  );
};
