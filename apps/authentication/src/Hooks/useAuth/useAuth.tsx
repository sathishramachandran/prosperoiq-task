"use client";

import {
  addInfoType,
  billingType,
} from "@/components/main_ui/Auth/Signup/SignupMain";
import { authEndPoints } from "@/Constants/endpoints";
import { apiGet, apiPost } from "@/lib/api_services";
import { plan } from "@/types/general.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type formData = {
  email: string;
  password: string;
};

type BillingPayload = Omit<billingType & addInfoType, "confirmPassword"> & {
  plan: plan;
  role: string;
  product: string;
};

export const useMeRoute = () => {
  return useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const res = await apiGet(authEndPoints.me);
      return res;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (formData: formData) => {
      const res = await apiPost(authEndPoints.login(), formData);
      return res;
    },
    onSuccess: () => {
      toast.success("Login Successfully 🎉");
    },
    onError: (error: any) => {
      if (error.response?.data?.detail?.code === "EMAIL_NOT_VERIFIED") {
        toast.error(error.response?.data?.detail?.message);
        params.set("sub", "verification");
        router.push(`/signup?${params.toString()}`);
      } else {
        toast.error(error.response?.data?.detail?.message);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (formData: BillingPayload) => {
      const res = await apiPost(authEndPoints.register, formData);
      return res;
    },
    onSuccess: (success) => {
      toast.success("Verification Mail sent Successfully");
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail;


      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg.replace("Value error, ", ""));
      } else {
        toast.error(detail);
      }
    },
  });
};

export const useVerifyEmail = (token: string) => {
  return useQuery({
    queryKey: ["verify_email"],
    queryFn: async () => {
      const response = await apiGet(authEndPoints.verify_email(token));
      return response;
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetToken = () => {
  return useMutation({
    mutationKey: ["get_token"],
    mutationFn: async (data: { email: string }) => {
      const response = await apiPost(authEndPoints.token_provider(), data);
      return response;
    },
    onSuccess: (success) => {
      toast.success("Registered Successfully 🎉");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail);
    },
  });
};
export const useForgotPasswordOtp = () => {
  return useMutation({
    mutationKey: ["forgot_password_otp"],
    mutationFn: async (data: { email: string }) => {
      const res = await apiPost(authEndPoints.forgot_password_otp(), data);
      return res;
    },
    onSuccess: () => {
      toast.success("OTP sent to your email ");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Failed to send OTP");
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ["verify_otp"],
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await apiPost(authEndPoints.verify_otp(), data);
      return res;
    },
    onSuccess: () => {
      toast.success("OTP verified successfully ");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    },
  });
};

export const useResetPasswordOtp = () => {
  return useMutation({
    mutationKey: ["reset_password_otp"],
    mutationFn: async (data: { email: string; otp: string; new_password: string }) => {
      const res = await apiPost(authEndPoints.reset_password_otp(), data);
      return res;
    },
    onSuccess: () => {
      toast.success("Password reset successfully ");
    },
    onError: (err: any) => {
    const detail = err.response?.data?.detail;

    if(Array.isArray(detail)) {
      toast.error(detail[0]?.msg || "Failed to reset password");
    } else {
      toast.error(detail || "Failed to reset password");
    }
    },
  });
};
export const useResendSignupEmail = () => {
  return useMutation({
    mutationKey: ["resend_signup_email"],
    mutationFn: async (data: { email: string }) => {
      const res = await apiPost(authEndPoints.resend_verification(), data);
      return res;
    },
    onSuccess: () => {
      toast.success("Verification email resent 📩");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.detail || "Failed to resend verification email"
      );
    },
  });
};
export const useChangeSignupEmail = () => {
  return useMutation({
    mutationKey: ["change_signup_email"],

    mutationFn: async (data: {
      old_email: string;
      new_email: string;
    }) => {
      const res = await apiPost(
        authEndPoints.change_signup_email(),
        data
      );

      return res;
    },

    onSuccess: () => {
      toast.success("New verification email sent ");
    },

    onError: (err: any) => {
      toast.error(
        err.response?.data?.detail ||
          "Failed to change email"
      );
    },
  });
};