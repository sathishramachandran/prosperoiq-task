"use client";

import { apiGet, apiPost } from "@/lib/api_services";
import { authEndPoints } from "@/src/constants/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export type SubUser = {
  user_id: string;
  email: string;
  name?: string;
  user_type?: string;
  subscriber_id?: string;
  created_at?: string | null;
  products?: string[];
};

export const useSubUsers = () => {
  return useQuery({
    queryKey: ["sub-users"],
    queryFn: async (): Promise<SubUser[]> => {
      const res = await apiGet(authEndPoints.listSubUsers);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.users)) return data.users;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    },
  });
};

export type CreateSubUserPayload = {
  name: string;
  email: string;
  phone: string;
  subscriber_id:string
  password: string;
  product: {
    GSTIQ: boolean;
    CUSTOMSIQ: boolean;
    INVOICEIQ: boolean;
  };
};

export const useCreateSubUser = () => {
  return useMutation({
    mutationKey: ["create-sub-user"],
    mutationFn: async (data: CreateSubUserPayload) => {
      const res = await apiPost(authEndPoints.createSubUser, data);
      return res;
    },
    onSuccess: () => {
      toast.success("User created");
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(
          (detail[0]?.msg || "Failed to create user").replace(
            "Value error, ",
            "",
          ),
        );
      } else {
        toast.error(detail || "Failed to create user");
      }
    },
  });
};
