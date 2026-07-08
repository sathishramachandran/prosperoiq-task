"use client";
import OtpTimer from "@/components/OtpTimer";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import Button from "@/components/UI/button";
import InputField from "@/components/UI/Input";

import {
  ForgotPasswordSchema,
  ForgotPasswordOtpSchema,
  ResetPasswordSchema,
} from "@/Schemas/auth.schema";
import {
  useForgotPasswordOtp,
  useVerifyOtp,
  useResetPasswordOtp,
} from "@/Hooks/useAuth/useAuth";

const ForgotPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: sendOtp, isPending: otpLoading } = useForgotPasswordOtp();
  const { mutateAsync: verifyOtp, isPending: verifyLoading } = useVerifyOtp();
  const { mutateAsync: resetPassword, isPending: resetLoading } = useResetPasswordOtp();
  
  // State to store verified OTP
  const [verifiedOtp, setVerifiedOtp] = useState("");
  
  // Controls which stage of the forgot password flow you are in
  const step = searchParams.get("step") || "email";
  // Reads the email query parameter
  const emailParam = searchParams.get("email") || "";

  // Protect direct access
 useEffect(() => {
  if ((step === "otp" || step === "reset") && !emailParam) {
    router.replace("/forgot-password?step=email");
  }
}, [step, emailParam, router]);

  /* -----------------------------
     STEP 1 : EMAIL FORM
  ------------------------------ */
  const {
    register: EmailRegister,
    handleSubmit: HandleEmailSubmit,
    formState: { errors: emailErrors },
    getValues: GetEmailValues,
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  /* -----------------------------
     STEP 2 : OTP FORM
  ------------------------------ */
  const {
    register: OtpRegister,
    handleSubmit: HandleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(ForgotPasswordOtpSchema),
  });

  /* -----------------------------
     STEP 3 : RESET FORM
  ------------------------------ */
  const {
    register: ResetRegister,
    handleSubmit: HandleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });

  /* -----------------------------
     HANDLERS
  ------------------------------ */

  const goToOtp = async (data: { email: string }) => {
    const response = await sendOtp({
      email: data.email,
    });
    console.log("SEND OTP RESPONSE:", response);

    if (response) {
      localStorage.setItem("otp_expiry", response.data.expires_at);
      router.push(
         `/forgot-password?step=otp&email=${encodeURIComponent(data.email)}`
      );
    }
  };

  const goToReset = async (data: { otp: string }) => {
    const response = await verifyOtp({
      email: emailParam,
      otp: data.otp,
    });

    if (response) {
      // Store the verified OTP for the reset step
      setVerifiedOtp(data.otp);
      //router.replace("/customsiqlogin");
      router.replace(`/forgot-password?step=reset&email=${encodeURIComponent(emailParam)}`);
      
    }
  };

  const handleResetPassword = async (data: { password: string }) => {
    const response = await resetPassword({
      email: emailParam,
      otp: verifiedOtp, // Pass the verified OTP
      new_password: data.password,
    });

    if (response) {
      router.replace("/customsiqlogin");
    }
  };

  return (
    <section className="bg-[url('/login.jpg')] bg-cover bg-center h-screen flex justify-center items-center px-6">
      <div className="w-full max-w-[500px] rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl shadow-purple-900/30 px-8 py-8">
        {/* LOGO */}
        <div className="mb-7">
          <Image
            src="/customsiq_logo.svg"
            className="mx-auto"
            height={100}
            width={170}
            alt="logo"
          />
        </div>

        {/* TITLE */}
        <div className="space-y-4 text-white">
          <h1 className="font-semibold text-[1.7rem] mb-8">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verify OTP"}
            {step === "reset" && "Reset Password"}
          </h1>

          {/* --------------------------------
              STEP 1 : EMAIL
          -------------------------------- */}
          {step === "email" && (
            <form onSubmit={HandleEmailSubmit(goToOtp)}>
              <InputField
                register={EmailRegister}
                errors={emailErrors}
                title="Email"
                type="email"
                name="email"
                placeholder="Enter E-Mail ID"
              />

              <Button 
                type="submit" 
                disabled={otpLoading}
                size="md"
                varient="primary"
              >
                {otpLoading ? "Sending..." : "Generate OTP"}
              </Button>
            </form>
          )}

          {/* --------------------------------
              STEP 2 : OTP
          -------------------------------- */}
          {step === "otp" && (
           <>
            <form onSubmit={HandleOtpSubmit(goToReset)}>
            <InputField
              register={OtpRegister}
              errors={otpErrors}
              title="OTP"
              type="text"
              name="otp"
              placeholder="Enter OTP"
            />

           <Button 
            type="submit" 
            disabled={verifyLoading}
            size="md"
          varient="primary"
           >
        {verifyLoading ? "Verifying..." : "Verify OTP"}
        </Button>
        </form>

        <OtpTimer
          duration={60}
          onResend={async () => {
          return await sendOtp({ email: emailParam }); //  return response
        }}
        />
        </>
        )}

          {/* --------------------------------
              STEP 3 : RESET PASSWORD
          -------------------------------- */}
          {step === "reset" && (
            <form onSubmit={HandleResetSubmit(handleResetPassword)}>
              <InputField
                register={ResetRegister}
                errors={resetErrors}
                title="New Password"
                type="password"
                name="password"
                placeholder="Enter New Password"
              />

              <InputField
                register={ResetRegister}
                errors={resetErrors}
                title="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
              />

              <Button 
                type="submit" 
                disabled={resetLoading}
                size="md"
                varient="primary"
              >
                {resetLoading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;