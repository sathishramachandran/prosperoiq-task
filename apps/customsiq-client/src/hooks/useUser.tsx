'use client'

import { apiGet, apiPost } from "@/lib/api_services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store/user";
import { uploadsEndPoints } from "../constants/endpoints";
import toast from "react-hot-toast";



export const useMeRoute = () => {
  return useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const res = await apiGet('/me');
      console.log(res)
      return res;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout_user"],
    mutationFn: async () => {
      const res = await apiPost(uploadsEndPoints.logout, {});
      return res;
    },

    onSuccess: (success) => {

      toast.success('Logged Out Successfully')
    },

    onError: (error) => {
      toast.success('Logout Failed')
    },
  });
};
