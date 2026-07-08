"use client";

import Button from "@/components/UI/button";
import InputField from "@/components/UI/Input";
import { useLogin } from "@/Hooks/useAuth/useAuth";
import { SignInValidation } from "@/Schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { CircleDashed } from "lucide-react";
import clsx from "clsx";
import { FaShip } from "react-icons/fa";
import { useUserStore } from "@/store/user";

const redirectMap: Record<string, string> = {
  gstiq: process.env.gstiq || "",
  customsiq: process.env.customsiq || "",
  invoiceiq: process.env.invoiceiq || "",
  complianceiq: process.env.complianceiq || "",
};

type signInType = z.infer<typeof SignInValidation>;

const SignIn = () => {
  const { mutateAsync, isPending, isError, data } = useLogin();
  const params = useSearchParams();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(params.toString());
  const pathFilter = pathname.split("/").pop() || "";
  const {setUser}  = useUserStore((s) => s)

  // const product = pathFilter

  const router = useRouter();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(SignInValidation),
  });

  const onSubmit = async (data: signInType) => {
    const response = await mutateAsync(data);
    // debugger
    if (response.status === 200) {
      setUser(response.data);
      router.push(
        `https://customsiq.prosperoiq.com/boeextraction`,
      );
    }
  };

  return (
    <section className="bg-[url('/login.jpg')] bg-cover bg-center h-screen flex bg-gst-primary justify-center items-center px-6     ">
      <div className=" max-w-6xl items-center grid grid-cols-[1fr_1fr] w-full">
        <div className="max-w-100 w-full">
          <div className="mb-7">
            <Image
              src={
                pathFilter === "customsiqlogin"
                  ? "customsiq_logo.svg"
                  : "logo.svg"
              }
              className="mx-auto"
              height={100}
              width={170}
              alt="logo"
            />
          </div>
          <form
            className="  space-y-4   text-white rounded-2xl"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="font-semibold text-[1.7rem]  mb-8">
              Login to your account
            </h1>

            <InputField
              required
              errors={errors}
              title="Email"
              type="text"
              register={register}
              name="email"
              placeholder="Enter  E-Mail ID"
            />
            <InputField
              required
              errors={errors}
              title="Password"
              type="password"
              register={register}
              name="password"
              placeholder="Enter Password"
            />

            {/* Forgot Password link */}
            <p className="text-sm text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-gst-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </p>

            <Button
              disabled={isPending}
              className="mt-5"
              varient="primary"
              size="sm"
            >
              {isPending ? (
                <CircleDashed className="animate-spin mx-auto" size={20} />
              ) : (
                " Login Now"
              )}
            </Button>
          </form>
          <p className="text-[#98A2B3] text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link
              className="text-gst-primary"
              href={`/signup/?product=${pathFilter === "customsiqlogin" ? "CUSTOMSIQ" : "GSTIQ"}`}
            >
              Sign Up
            </Link>
          </p>
        </div>
        <div className=" flex flex-col gap-12 max-lg:gap-6* ">
          <div className="w-70 border-gst-primary bg-[#FFFFFF1A] p-6 mr-26  relative overflow-hidden border-2 bg-[] ml-auto  rounded-2xl">
            <div className="flex justify-between items-start">
              <Image
                alt="icon"
                src={"/icons/icon1.svg"}
                width={30}
                height={40}
              />
              <p className="text-[#22A65F] border-[#00A991] border  text-xs px-6 font-medium py-1 rounded-full">
                Excellent
              </p>
            </div>
            <p className="text-white mt-3.5 font-medium text-sm uppercase">
              {pathFilter === "customsiqlogin"
                ? "Bill of entry"
                : "Compliance score"}
            </p>
            <p className="font-semibold text-2xl mt-2 text-white">₹ 98%</p>
            <div className="w-full relative rounded-full overflow-hidden h-2 mt-4">
              <div className="bg-white  h-full w-full"></div>
              <div className="w-[90%] absolute top-0 bg-gst-primary h-full"></div>
            </div>
          </div>
          <div className="w-70  border-gst-primary bg-[#FFFFFF1A] px-6 py-4 relative overflow-hidden border-2 bg-[] ml-auto  rounded-xl">
            <div className="flex gap-4 items-start">
              <Image
                alt="icon"
                src={"/icons/icon2.svg"}
                width={50}
                height={40}
              />
              <div>
                <p className="text-white  font-medium text-sm uppercase">{}</p>
                <p className="font-semibold text-2xl mt-1.5 text-white">
                  ₹ 14,250{" "}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-3 items-center">
              <p className="text-white text-xs font-light">Vs last month</p>
              <p className="text-[#22A65F] border-[#00A991] border text-[0.6rem] px-6 font-medium py-1 rounded-full">
                +12.5%
              </p>
            </div>
          </div>
          <div className="w-70  border-gst-primary mr-45  bg-[#FFFFFF1A] px-6 py-4 relative overflow-hidden border-2 bg-[] ml-auto  rounded-xl">
            <div className="flex gap-4 items-start">
              <div className="p-2 rounded-sm mt-2 bg-white">
                <FaShip size={30} className=" text-gst-primary" />
              </div>
              <div>
                <p className="font-semibold text-2xl mt-1.5 text-white">
                  Customs IQ
                </p>
                <p
                  className={clsx(
                    "text-gst-primary  font-medium text-sm",
                    pathFilter === "customsiqlogin" && "text-white",
                  )}
                >
                  Shipment insights ready
                </p>
                <Image
                  className="mt-2"
                  alt="icon"
                  src={"/icons/group.svg"}
                  width={50}
                  height={40}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
