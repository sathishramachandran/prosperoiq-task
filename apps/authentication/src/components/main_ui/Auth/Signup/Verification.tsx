"use client";
import Button from "@/components/UI/button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";
import { IoReloadOutline } from "react-icons/io5";
import { MdInfo } from "react-icons/md";
import { useEffect, useState } from "react";
import { useResendSignupEmail,useChangeSignupEmail, } from "@/Hooks/useAuth/useAuth";


import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
type Props = {};

const Verification = (props: Props) => {
  
  const params = useSearchParams();
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const email = atob(params.get("email") || "");
  const [timeLeft, setTimeLeft] = useState(60);
  const { mutateAsync: resendSignupEmail } = useResendSignupEmail();
  const { mutateAsync: changeSignupEmail } =
  useChangeSignupEmail();
  //load timer from localstore
  useEffect(() => {
  const expiry = localStorage.getItem("signup_expiry");

  if (expiry) {
    const remaining = Math.floor(
      (new Date(expiry).getTime() - Date.now()) / 1000
    );

    if (remaining > 0) {
      setTimeLeft(remaining);
    } else {
      setTimeLeft(0);
    }
  }
}, []);
//countdown
useEffect(() => {
  if (timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft]);
//format timer
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };
  const handleResend = async () => {
    try {
      const res = await resendSignupEmail({ email });

      if (res?.data?.expires_at) {
        localStorage.setItem("signup_expiry", res.data.expires_at);
      }

      if (res?.data?.expires_at) {
        const expiryTime = new Date(res.data.expires_at).getTime();

        localStorage.setItem("signup_expiry", res.data.expires_at);

        const remaining = Math.floor((expiryTime - Date.now()) / 1000);

        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeEmail = async () => {
  try {
    const res = await changeSignupEmail({
      old_email: email,
      new_email: newEmail,
    });
    setOpenModal(false);

    const searchParams = new URLSearchParams(
  params.toString()
);

searchParams.set(
  "email",
  btoa(newEmail)
);

router.replace(
  `?${searchParams.toString()}`
);

setOpenModal(false);

    setOpenModal(false);

  } catch (err) {
    console.error(err);
  }
};
   return (
    <form className="relative max-w-120 w-full p-0.5 text-white overflow-hidden  rounded-3xl">
      <div className="card">
        <div className="relative z-10 w-full content  rounded-xl  bg-[#23152E]  pt-14">
          <div className="px-9">
            <div className="flex justify-center items-center">
              <Image
                src={"/icons/mailverification.svg"}
                width={80}
                height={80}
                alt="icon"
              />
            </div>

            <h3 className="text-center mb-4 mt-6 text-2xl">
              Check your inbox
            </h3>

            <p className="text-center text-sm text-slate-300">
              We’ve sent a verification link to{" "}
              <span className="font-medium text-white">
                {email ? email : "you E-Mail ID"}
              </span>
              To secure your account and complete your registration for GSTIQ
              please click the link in the email
            </p>



            {/* UPDATED RESEND SECTION */}
            <div className="flex justify-between text-sm mt-5 items-center">
              {timeLeft > 0 ? (
                <p className="text-slate-400">
                  Resend in {formatTime(timeLeft)}
                </p>
              ) : (
                <p
                  onClick={handleResend}
                  className="flex items-center cursor-pointer gap-1 text-purple-400 underline hover:text-purple-300"
                >
                  <IoReloadOutline /> Resend verification email
                </p>
              )}

              <p 
              onClick={() => setOpenModal(true)}
              className="text-gst-primary cursor-pointer"
              >
             Change email address
            </p>
            </div>
          </div>

          <div className="text-xs px-9 mt-10 flex gap-2 rounded-b-xl italic items-center py-3 border-t-[#342A3B] border-t  text-slate-500 bg-[#201728]">
            <span>
              <MdInfo size={20} />
            </span>
            <p>
              Can’t find the email? Please check your Spam or Junk folder. The
              link will expire in 24 hours.
            </p>
          </div>
        </div>
      </div>

     <Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogContent className="bg-[#1B1124] border border-[#342A3B] text-white rounded-2xl max-w-md p-0 overflow-hidden">

    {/* CONTENT */}
    <div className="px-6 py-6">

      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold text-center">
          Change Email Address
        </DialogTitle>
      </DialogHeader>

      <p className="text-center text-slate-400 mt-2 text-sm">
        Enter your new email address
      </p>

      {/* INPUT */}
      <div className="mt-6">
        <label className="text-sm text-slate-300">
          New Email Address
        </label>

        <div className="mt-2 flex items-center rounded-xl border border-[#342A3B] bg-[#241230] px-4 h-12 focus-within:border-[#A020F0] transition-all">

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter your new email"
            className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div className="grid grid-cols-2 gap-3 mt-7">

        <button
          type="button"
          onClick={() => setOpenModal(false)}
          className="h-11 rounded-xl border border-[#342A3B] text-sm hover:bg-[#241230] transition-all cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleChangeEmail}
          className="h-11 rounded-xl bg-[#A020F0] text-white text-sm font-medium hover:bg-[#9117dd] transition-all cursor-pointer"
        >
          Send Verification
        </button>

      </div>
    </div>

  </DialogContent>
</Dialog>
</form>
  );
};



export default Verification;
