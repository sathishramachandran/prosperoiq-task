"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

// this is a basic flow of input but it would contain all the input ui inside of it like (password , error etc) when start working

type Props = {
  register: UseFormRegister<any>;
  name: string;
  password?: boolean;
  errors: any;
  placeholder: string;
  className?: string;
  required: boolean;
  title?: string;
  type:
    | "email"
    | "text"
    | "number"
    | "password"
    | "date"
    | "file"
    | "checkbox"
    | "radio"
    | "color";
};

const TextArea = ({
  title,
  name,
  errors,
  placeholder,
  className,
  type,
  password,
  register,
}: Props) => {

  return (
    <div className="mb-5">
   
      {title && <label className="mb-2 text-sm inline-block"> {title} </label>}

      <div className="relative">
        <textarea
            autoComplete="off"

          className={clsx(
            "border bg-[#1A1022] text-sm placeholder:text-[#98A2B3] resize-none h-24 border-[#3A2946] py-3 px-3.5 w-full rounded-md focus:outline-0",
            className
          )}
         
          placeholder={placeholder}
          {...register(name)}
        />
      
      </div>
      <p className="text-[#FFBF40] text-xs ml-2  ">
        {errors[name] && errors[name].message}{" "}
      </p>
    </div>
  );
};

export default TextArea;
