import { create } from "zustand";

export type PermissionError = {
  code: string;
  resource: string;
  action: string;
  message: string;
};

type Store = {
  permissionError: PermissionError | null;
  setPermissionError: (e: PermissionError) => void;
  clearPermissionError: () => void;
};

export const usePermissionStore = create<Store>((set) => ({
  permissionError: null,
  setPermissionError: (e) => set({ permissionError: e }),
  clearPermissionError: () => set({ permissionError: null }),
}));
