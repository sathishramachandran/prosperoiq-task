import clsx from "clsx";
import React from "react";
import { MotionButton } from "../Motion/framer_motion";
import { CircleDashed } from "lucide-react";

type size = "lg" | "md" | "sm" | "xs";
type varient = "primary" | "outlined" | "Tertiary";

type ButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size: size;
  varient: varient;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const varients = {
  primary: "bg-[#7D0DA7]",
  outlined: "border-[#3F2E50] border bg-transperant text-white",
  Tertiary: "",
};

const sizes = {
  lg: "text-lg font-semibold rounded-lg ",
  md: "text-[0.94rem] font-medium rounded-md",
  sm: "text-sm font-medium rounded-sm",
  xs: "text-xs font-normal rounded-xs",
};

const Button = ({
  children,
  icon,
  className,
  disabled,
  size,
  varient,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "w-full py-3 px-4  cursor-pointer select-none",
        disabled && "cursor-default! bg-[#47095E]!",
        sizes[size],
        varients[varient],
        className,
      )}
    >
    
      {children}
    </button>
  );
};

export default Button;
