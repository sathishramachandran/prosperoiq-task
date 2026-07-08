"use client";

import Button from "@/components/UI/button";
import { useGetToken, useVerifyEmail } from "@/Hooks/useAuth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import "../style.css";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import { CircleDashed } from "lucide-react";
import { email } from "zod";

type Props = {};

const redirectMap: Record<string, string> = {
  gstiq: "https://gstiq.prosperoiq.com",
  customsiq: "https://customsiq.prosperoiq.com/boeextraction",
  invoiceiq: "https://invoiceiq.prosperoiq.com",
  complianceiq: "https://complianceiq.prosperoiq.com",
};

const VerifiedPage = (props: Props) => {
  //  const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams.toString());
  const params = useSearchParams();
  const router = useRouter();
  const { mutateAsync, isError: tokenError } = useGetToken();

  const { data, isPending, isError } = useVerifyEmail(
    params.get("token") || "",
  );
  const productName = params.get("product") || "";
  //const email = params.get("email") || "";
  const encodedEmail = params.get("email");
  const email = params.get("email") 

  return (
    <div>
      <div>
        {" "}
        {isPending && (
          <div className=" flex text-white text-5xl justify-center items-center h-screen">
            {" "}
            Verifying...
          </div>
        )}{" "}
      </div>
      {!isPending && !isError && (
        <div>
          <form className="relative  max-w-120 w-full p-0.5 text-white overflow-hidden  rounded-3xl">
            <div className="card">
              <div className="relative z-10 w-full content  rounded-xl  bg-[#23152E]  px-9 py-8">
                {" "}
                <Image
                  src={"/icons/success.svg"}
                  className="mx-auto mb-8"
                  alt="icon"
                  width={70}
                  height={70}
                />
                <h1 className="text-center text-3xl font-bold mb-4">
                  Account Created
                </h1>
                <p className="text-slate-400 text-center text-sm">
                  Congratulations! You have successfully joined the GSTIQ
                  exclusive network. Your compliance journey begins now.
                </p>
                <Button
                  type="button"
                  onClick={async () => {
                    const res = await mutateAsync({
                      email: email || "",
                    });
                    if (res.status === 200) {
                      router.push(
                        `${redirectMap[productName.toLocaleLowerCase()]}`,
                      );
                    }
                  }}
                  className="mt-7"
                  size="sm"
                  varient="primary"
                >
                  {isPending ? (
                    <CircleDashed className="animate-spin mx-auto" size={20} />
                  ) : (
                    <div className="flex items-center justify-center gap-2.5">
                      Access Dashboard
                      <BsArrowRight className="-mb-0.5" size={20} />{" "}
                    </div>
                  )}
                </Button>
                <div className="text-xs flex mt-6 items-center gap-1 justify-center  text-slate-500 ">
                  <span>
                    <BsFillQuestionCircleFill size={18} />
                  </span>
                  <p>Need help? Contact Support</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      {isError && (
        <div className="text-white text-5xl">Invalid or expired link</div>
      )}
    </div>
  );
};

export default VerifiedPage;
