"use client";

import { useEffect, useRef, useState } from "react";
import {
  ReextractRodtepProgress,
  ReextractRodtepResult,
  ReextractRodtepStatus,
  useReextractRodtepStatus,
} from "../useBOE.tsx/useBOEApi";

export type ReextractTaskView = {
  status: ReextractRodtepStatus | undefined;
  progress: ReextractRodtepProgress | undefined;
  result: ReextractRodtepResult | undefined;
  error: string | undefined;
  isStalled: boolean;
  isTerminal: boolean;
};

export function useReextractRodtepTask(
  taskId: string | null,
): ReextractTaskView {
  const query = useReextractRodtepStatus(taskId);
  const [isStalled, setIsStalled] = useState(false);
  const errorSinceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!taskId) {
      errorSinceRef.current = null;
      setIsStalled(false);
      return;
    }
    if (query.isError || query.isLoadingError) {
      const now = Date.now();
      if (errorSinceRef.current == null) {
        errorSinceRef.current = now;
      } else if (now - errorSinceRef.current > 30_000) {
        setIsStalled(true);
      }
    } else if (query.data) {
      errorSinceRef.current = null;
      setIsStalled(false);
    }
  }, [query.isError, query.isLoadingError, query.data, query.dataUpdatedAt, taskId]);

  useEffect(() => {
    return () => {
      errorSinceRef.current = null;
    };
  }, [taskId]);

  const status = query.data?.status;
  const isTerminal =
    status === "SUCCESS" || status === "FAILURE" || status === "REVOKED";

  return {
    status,
    progress: query.data?.progress,
    result: query.data?.result,
    error: query.data?.error,
    isStalled,
    isTerminal,
  };
}
