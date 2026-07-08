import { z } from "zod";

export const SignInValidation = z.object({
  email: z
    .string()
    .nonempty("E-mail is required")
    .email("Invalid e-mail address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
 
export const BillingSchema = z.object({
  org_name: z
    .string()
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name is too long"),

  billing_address: z
    .string()
    .min(10, "Billing address must be at least 10 characters")
    .max(250, "Billing address is too long"),

  billing_pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (Eg: ABCDE1234F)"),

  billing_gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    ),
});

export const addInfoSchema = z
  .object({
    ad_name: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Name can contain only letters and spaces"),

    ad_email_id: z.string().email("Invalid email address"),

    ad_phone_num: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number (10 digits, India)"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password is too long")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&#]/, "Must contain at least one special character"),

    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const ForgotPasswordSchema=z.object({
  email:z
  .string()
  .nonempty("E-mail is required")
  .email("Invalid e-mail address")
});
export const ForgotPasswordOtpSchema=z.object({
  otp:z
  .string()
  .regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});
export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password is too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&#]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}); 
