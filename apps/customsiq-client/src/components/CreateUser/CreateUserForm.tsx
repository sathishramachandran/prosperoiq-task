"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import {
  CreateSubUserPayload,
  useCreateSubUser,
} from "@/src/hooks/useCreateUser";
import { useUserStore } from "@/src/store/user";

type CreateUserPayload = CreateSubUserPayload;

const productOptions: {
  key: keyof CreateUserPayload["product"];
  label: string;
}[] = [
  { key: "GSTIQ", label: "GST IQ" },
  { key: "CUSTOMSIQ", label: "Customs IQ" },
  { key: "INVOICEIQ", label: "Invoice IQ" },
];

const fieldClass =
  "border bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] border-[#E2E8F0] py-2.5 px-3.5 w-full rounded-md focus:outline-0 focus:border-ciq-primary";

const ErrorText = ({ error }: { error?: FieldError }) =>
  error ? (
    <p className="text-[#DC2626] text-xs ml-1 mt-1">{error.message}</p>
  ) : null;

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="text-sm font-medium text-[#0F172A] inline-block mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const CreateUserForm = () => {
  const userData = useUserStore((state) => state.user);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync, isPending } = useCreateSubUser();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      product: {
        GSTIQ: false,
        CUSTOMSIQ: false,
        INVOICEIQ: false,
      },
    },
  });

  const productValues = watch("product");
  const noProductSelected =
    !productValues?.GSTIQ &&
    !productValues?.CUSTOMSIQ &&
    !productValues?.INVOICEIQ;

  const onSubmit = async (data: CreateUserPayload) => {
    if (
      !data.product.GSTIQ &&
      !data.product.CUSTOMSIQ &&
      !data.product.INVOICEIQ
    ) {
      toast.error("Please select at least one product");
      return;
    }
    try {
      const res = await mutateAsync({
        ...data,
        subscriber_id: userData?.id || "",
      });
      if (res.status >= 200 && res.status < 300) {
        reset();
      }
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="max-w-3xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
        <div className="px-8 py-6 border-b border-[#E2E8F0]">
          <h1 className="text-xl font-semibold text-[#0F172A]">Create User</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Add a new user and assign the products they should have access to.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            <div>
              <FieldLabel required>Full Name</FieldLabel>
              <input
                type="text"
                autoComplete="off"
                placeholder="Enter full name"
                className={fieldClass}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Name can contain only letters and spaces",
                  },
                })}
              />
              <ErrorText error={errors.name} />
            </div>

            <div>
              <FieldLabel required>Email Address</FieldLabel>
              <input
                type="text"
                autoComplete="off"
                placeholder="name@company.com"
                className={fieldClass}
                {...register("email", {
                  required: "E-mail is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid e-mail address",
                  },
                })}
              />
              <ErrorText error={errors.email} />
            </div>

            <div>
              <FieldLabel required>Mobile Number</FieldLabel>
              <input
                type="text"
                autoComplete="off"
                placeholder="10-digit mobile number"
                className={fieldClass}
                {...register("phone", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Invalid mobile number (10 digits, India)",
                  },
                })}
              />
              <ErrorText error={errors.phone} />
            </div>

            <div>
              <FieldLabel required>Password</FieldLabel>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Min 8 characters"
                  className={clsx(fieldClass, "pr-10")}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    maxLength: {
                      value: 32,
                      message: "Password is too long",
                    },
                    validate: {
                      uppercase: (v) =>
                        /[A-Z]/.test(v) ||
                        "Must contain at least one uppercase letter",
                      lowercase: (v) =>
                        /[a-z]/.test(v) ||
                        "Must contain at least one lowercase letter",
                      number: (v) =>
                        /[0-9]/.test(v) || "Must contain at least one number",
                      special: (v) =>
                        /[@$!%*?&#]/.test(v) ||
                        "Must contain at least one special character",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B] cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </button>
              </div>
              <ErrorText error={errors.password} />
            </div>
          </div>

          <div className="bg-[#F1F5F9] flex gap-2 text-xs py-2.5 px-3 font-medium text-[#475569] border-[#E2E8F0] border rounded-md mt-4">
            <IoIosInformationCircle size={18} />
            <p>
              Password must contain at least 8 characters, one uppercase letter,
              one number, and one special character.
            </p>
          </div>

          <div className="mt-6">
            <FieldLabel required>Products</FieldLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {productOptions.map((p) => (
                <label
                  key={p.key}
                  className="flex items-center gap-2 cursor-pointer select-none border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] rounded-md px-3 py-2.5 text-sm text-[#0F172A]"
                >
                  <input
                    type="checkbox"
                    className="accent-ciq-primary w-4 h-4"
                    {...register(`product.${p.key}` as const)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
            {noProductSelected && (
              <p className="text-[#DC2626] text-xs ml-1 mt-1.5">
                Please select at least one product
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-md hover:bg-[#F8FAFC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium text-white bg-ciq-primary rounded-md hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
