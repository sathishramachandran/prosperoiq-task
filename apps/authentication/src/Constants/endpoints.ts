

export const authEndPoints = {
    login:()=>`/login`,
    register:'/register',
    verify_email:(token:string)=>`/verify_email?token=${token}`,
    token_provider:()=>`/token_provider`,
    singleUpload:()=>`/files/upload`,
    me:'/me',
    forgot_password_otp: () => `/forgot-password-otp`,
    verify_otp: () => `/verify-otp`,
    reset_password_otp: () => `/reset-password-otp`,
    resend_verification: () => "/resend-verification",
    change_signup_email: () => "/change-signup-email",
}