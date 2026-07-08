"use client";
import { useEffect, useState } from "react";

type OtpTimerProps = {
  duration?: number;
  onExpire?: () => void;
  onResend?: () => Promise<any> | void;
};

const OtpTimer = ({ duration = 60, onExpire, onResend }: OtpTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  
  useEffect(() => {
    const expiry = localStorage.getItem("otp_expiry");

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

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  
  const handleResend = async () => {
    try {

      if (onResend) {
        const response = await onResend(); // call backend


        // update expiry in localStorage
        if (response?.data?.expires_at) {
          localStorage.setItem("otp_expiry", response.data.expires_at);
        }

        // reset timer
        setTimeLeft(duration);
      }
    } catch (err: any) {
      console.error("Resend error:", err?.response?.data || err);
    }
  };

  return (
    <div className="mt-3 text-sm text-gray-300 text-center">
      {timeLeft > 0 ? (
        <span>OTP expires in {formatTime(timeLeft)}</span>
      ) : (
        onResend && (
          <button
            type="button"
            onClick={handleResend}
            className="mt-1 text-purple-400 underline hover:text-purple-300 cursor-pointer"
          >
            Resend OTP
          </button>
        )
      )}
    </div>
  );
};

export default OtpTimer;