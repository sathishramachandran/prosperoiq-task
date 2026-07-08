"use client";

import { MotionDiv } from "@/components/Motion/framer_motion";
import Button from "@/components/UI/button";
import { useEffect, useState } from "react";
import { useResendSignupEmail } from "@/Hooks/useAuth/useAuth";
import InputField from "@/components/UI/Input";
import TextArea from "@/components/UI/TextArea";
import { addInfoSchema, BillingSchema } from "@/Schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoIosInformationCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { IoArrowForwardOutline, IoArrowBackOutline } from "react-icons/io5";
import z, { set } from "zod";
import "../style.css";
import { useRegister } from "@/Hooks/useAuth/useAuth";
import Verification from "./Verification";
//import { useEffect } from "react";


export type billingType = z.infer<typeof BillingSchema>;
export type addInfoType = z.infer<typeof addInfoSchema>;

const keys = ["org_name", "billing_address", "billing_pan", "billing_gstin"];

const SignUpMain = () => {
  const searchParams = useSearchParams();
  const rounter = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const productName = params.get("product") || "";

  const { isPending, data, mutateAsync } = useRegister();

  const {
    register: RegFormRegister,
    handleSubmit: HandleRegForm,
    reset: RegReset,
    formState: { errors: regErrors },
  } = useForm({
    resolver: zodResolver(BillingSchema),
  });
  const {
    register: AddInfoRegister,
    handleSubmit: HandleAddinfoForm,
    reset: AddInfoReset,
    formState: { errors: addInfoErros },
  } = useForm({
    resolver: zodResolver(addInfoSchema),
  });

  const onSubmit = (data: billingType) => {
    params.set("sub", "addinfo");
    params.set("org_name", btoa(data.org_name));
    params.set("billing_address", btoa(data.billing_address));
    params.set("billing_pan", btoa(data.billing_pan));
    params.set("billing_gstin", btoa(data.billing_gstin));
    rounter.push(`${pathname}?${params.toString()}`);
    RegReset();
  };

  const onSubmitInfo = async (data: addInfoType) => {
    const { org_name, billing_address, billing_pan, billing_gstin } =
      Object.fromEntries(
        ["org_name", "billing_address", "billing_pan", "billing_gstin"].map(
          (k) => [k, atob(params.get(k) || "")],
        ),
      );

    const response = await mutateAsync({
      org_name,
      billing_address,
      billing_pan,
      billing_gstin,
      ad_email_id: data.ad_email_id,
      ad_phone_num: data.ad_phone_num,
      ad_name: data.ad_name,
      password: data.password,
      plan: "FREE",
      product: productName,
      role: "admin",
    });
    if (response.status === 201) {
      localStorage.setItem(
      "signup_expiry",
      new Date(Date.now() + 60000).toISOString()
    );
      // setUser(response.data.user);
      params.set("sub", "verification");
      params.set("email", btoa(data.ad_email_id));
      AddInfoReset();
      rounter.push(`${pathname}?${params.toString()}`);
    }
  };

  useEffect(() => {
    const products = ["GSTIQ", "COMPLAINCEIQ", "CUSTOMSIQ", "INVOICEIQ"];
    if (!products.includes(productName)) {
      params.set("product", "GSTIQ");
      rounter.push(`${pathname}?${params.toString()}`);
    }
  }, []);

  return (
    <>
      {!searchParams.get("sub") && (
        <MotionDiv initial={{ x: 100 }} animate={{ x: 0 }}>
          <form
            onSubmit={HandleRegForm(onSubmit)}
            className="relative max-w-140 p-0.5 text-white overflow-hidden   rounded-3xl "
          >
            <div className="card">
              <div className="relative z-10 w-full  rounded-xl content  bg-[#23152E] px-9 py-8">
                <h1 className="text-3xl font-medium">Organization Details</h1>
                <p className="text-[#AC9CB8] text-sm mb-8 mt-2">
                  Please provide your business entity details for invoicing and
                  compliance{" "}
                </p>
                <InputField
                  errors={regErrors}
                  required
                  title="Organization Name"
                  register={RegFormRegister}
                  type="text"
                  name="org_name"
                  placeholder={` E.g. Acme Corp Private Limited `}
                />
                <TextArea
                  errors={regErrors}
                  required
                  title="Billing Address"
                  register={RegFormRegister}
                  type="text"
                  name="billing_address"
                  placeholder={` Enter full registered business address`}
                />
                <div className="gap-5 grid grid-cols-2">
                  <InputField
                    errors={regErrors}
                    required
                    title="Billing PAN"
                    register={RegFormRegister}
                    type="text"
                    name="billing_pan"
                    placeholder="ABCDE1234F"
                  />
                  <InputField
                    errors={regErrors}
                    required
                    title="Billing GSTIN"
                    register={RegFormRegister}
                    type="text"
                    name="billing_gstin"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div className="flex justify-between items-center mt-5">
                  <Link
                    href={"/"}
                    className="text-[#8E9CB1] font-medium text-sm "
                  >
                    Cancel Setup
                  </Link>
                  <Button
                    varient="primary"
                    className="flex w-fit! text-[#FCFCFD]! justify-center gap-2 items-center"
                    size="sm"
                  >
                    Next Step
                    <IoArrowForwardOutline size={18} className="-mb-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </MotionDiv>
      )}
      {searchParams.get("sub") === "addinfo" && (
        <MotionDiv initial={{ x: 100 }} animate={{ x: 0 }}>
          <form
            onSubmit={HandleAddinfoForm(onSubmitInfo)}
            className="relative max-w-158 w-full p-0.5 text-white overflow-hidden  rounded-3xl "
          >
            <div className="card">
              <div className="relative z-10 w-full content  rounded-xl  bg-[#23152E] px-9 py-8">
                <div className=" gap-5 grid grid-cols-2">
                  <InputField
                    errors={addInfoErros}
                    required
                    title="Admin Full Name"
                    register={AddInfoRegister}
                    type="text"
                    name="ad_name"
                    placeholder={`  Enter full legal name `}
                  />
                  <InputField
                    errors={addInfoErros}
                    required
                    title="Admin Email Address"
                    register={AddInfoRegister}
                    type="text"
                    name="ad_email_id"
                    placeholder={`name@company.com`}
                  />
                </div>
                <InputField
                  errors={addInfoErros}
                  required
                  title="Mobile Number"
                  register={AddInfoRegister}
                  type="text"
                  name="ad_phone_num"
                  placeholder={` Enter your mobile number`}
                />
                <div className=" gap-5 grid grid-cols-2">
                  <InputField
                    errors={addInfoErros}
                    title="Desired Password"
                    register={AddInfoRegister}
                    type="password"
                    name="password"
                    placeholder={`Min 8 characters`}
                  />
                  <InputField
                    errors={addInfoErros}
                    required
                    title="Confirm Password"
                    register={AddInfoRegister}
                    type="password"
                    name="confirmPassword"
                    placeholder={` Re- enter password`}
                  />
                </div>
                <div className="bg-[#241B39] flex gap-2 text-xs py-2.5 px-3 font-medium text-[#7DA6D8] border-[#222452] border rounded-sm">
                  <IoIosInformationCircle size={18} />
                  <p>
                    Password must contain at least 8 characters, one uppercase
                    letter, one number, and one special character.
                  </p>
                </div>
                <hr className="border-[#3B2A4A] mt-10" />
                <div className="flex justify-between items-center mt-5">
                  <Button
                    onClick={() => rounter.push("/signup")}
                    varient="outlined"
                    type="button"
                    className="flex w-fit! text-[#FCFCFD]! justify-center gap-2 items-center"
                    size="sm"
                  >
                    <IoArrowBackOutline size={18} className="-mb-0.5" />
                    Back
                  </Button>
                  <Button
                    varient="primary"
                    disabled={isPending}
                    className="flex w-fit! text-[#FCFCFD]! justify-center gap-2 items-center"
                    size="sm"
                  >
                    Register
                    <IoArrowForwardOutline size={18} className="-mb-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </MotionDiv>
      )}
      {searchParams.get("sub") === "verification" && (
        <MotionDiv initial={{ x: 100 }} animate={{ x: 0 }}>
          <Verification />
        </MotionDiv>
      )}
    </>
  );
};

export default SignUpMain;
