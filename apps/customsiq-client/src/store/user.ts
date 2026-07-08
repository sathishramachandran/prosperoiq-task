import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserType = "admin" | "sub_user";

type BaseUser = {
  id: string;
  role: string;
  org_name: string;
  is_verified: boolean;
  user_type: UserType;
};

export type AdminUser = BaseUser & {
  user_type: "admin";
  ad_email_id: string;
  ad_name: string;
  ad_phone_num: string;
  billing_address: string;
  billing_gstin: string;
  billing_pan: string;
};

export type SubUser = BaseUser & {
  user_type: "sub_user";
  email: string;
  name: string;
  phone: string;
  subscriber_id: string;
};

export type UserData = AdminUser | SubUser;

// Type guards
export const isAdmin = (u: UserData | null): u is AdminUser =>
  u?.user_type === "admin";

export const isSubUser = (u: UserData | null): u is SubUser =>
  u?.user_type === "sub_user";

// Read-anywhere helpers — use these in shared components
export const getEmail = (u: UserData): string =>
  isAdmin(u) ? u.ad_email_id : u.email;

export const getName = (u: UserData): string =>{
  console.log(isAdmin(u))
 return isAdmin(u) ? u.ad_name : u.name;
}

export const getPhone = (u: UserData): string =>
  isAdmin(u) ? u.ad_phone_num : u.phone;

// ------------------------------------------------------------------
// UI state (unchanged)
// ------------------------------------------------------------------

type UIState = {
  BoeOpen: boolean;
  sbOpen: boolean;
};

type UIActions = {
  setSbUploadOpen: (val: boolean) => void;
  setBoeUploadOpen: (val: boolean) => void;
};

type UserState = {
  user: UserData | null;
};

export type userActions = {
  resetUser: () => void;
  setUser: (user: UserData) => void;
};

export const useUserStore = create(
  persist<UserState & userActions & UIState & UIActions>(
    (set) => ({
      // user state
      user: null,

      // UI state
      BoeOpen: false,
      sbOpen: false,

      // user actions
      resetUser: () => {
        set({ user: null });
        useUserStore.persist.clearStorage();
      },
      setUser: (state: UserData) => set({ user: { ...state } }),

      // UI actions
      setSbUploadOpen: (val: boolean) => set({ sbOpen: val }),
      setBoeUploadOpen: (val: boolean) => set({ BoeOpen: val }),
    }),
    {
      name: "custsiquserpd",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
