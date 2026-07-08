import { create } from "zustand";

export type ReextractScope = "all" | "row";

type ActiveTask = {
  taskId: string;
  scope: ReextractScope;
  sbNo: string | null;
};

type State = {
  active: ActiveTask | null;
  setActive: (task: ActiveTask) => void;
  clear: () => void;
};

export const useReextractRodtepStore = create<State>((set) => ({
  active: null,
  setActive: (task) => set({ active: task }),
  clear: () => set({ active: null }),
}));

const storageKey = (userId: string) => `reextract_rodtep_task_${userId}`;

export const loadPersistedTask = (userId: string): ActiveTask | null => {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.taskId === "string" && parsed.scope) {
      return {
        taskId: parsed.taskId,
        scope: parsed.scope,
        sbNo: parsed.sbNo ?? null,
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const persistTask = (userId: string, task: ActiveTask) => {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(task));
  } catch {
    /* ignore quota errors */
  }
};

export const clearPersistedTask = (userId: string) => {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.localStorage.removeItem(storageKey(userId));
  } catch {
    /* ignore */
  }
};
