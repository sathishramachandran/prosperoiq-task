"use client";

import { FiMenu, FiUser } from "react-icons/fi";
import { RiMenu2Line } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { LuCircleDashed } from "react-icons/lu";
import { useUserStore, getName, getEmail } from "../store/user";
import { useLogout } from "../hooks/useUser";

import Notification from "../components/Notification";
import { IoArrowBack, IoNotifications } from "react-icons/io5";
import { IoCloudUpload } from "react-icons/io5";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type Props = {
  minimize: boolean;
  title?: string;
  setMinimize: (value: boolean) => void;
};

const Navbar = ({ setMinimize, minimize, title }: Props) => {
  const userData = useUserStore((state) => state.user);
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  // console.log(getName(user))

  const hideNavbar =
    pathname.includes("sbextraction") || pathname.includes("boeextraction");
  const useBack =
    pathname.includes("/reports/boe-reports/invoice") ||
    pathname.includes("/reports/boe-reports/bondbg");
  const { setSbUploadOpen, setBoeUploadOpen } = useUserStore((state) => state);
  return (
    <nav className=" py-3 z-10 sticky top-0 bg-white px-6 flex justify-between shadow-sm items-center">
      <div>
        {hideNavbar ? (
          <div className="flex items-center gap-3.5">
            <div
              className="cursor-pointer select-none text-slate-500 text-2xl"
              onClick={() => setMinimize(!minimize)}
            >
              {!minimize ? <FiMenu /> : <RiMenu2Line />}
            </div>
            <p className="font-semibold text-lg text-slate-600">{title} </p>
          </div>
        ) : (
          <div
            onClick={() => (useBack ? router.back() : router.push("/reports"))}
            className="flex items-center cursor-pointer gap-3.5"
          >
            {title !== "Reports" && (
              <IoArrowBack size={26} className="text-slate-700" />
            )}

            <p className="font-semibold text-lg text-slate-600">{title} </p>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {hideNavbar && (
          <button
            onClick={() => {
              if (title === "Bill of Entry") {
                setBoeUploadOpen(true);
              } else {
                setSbUploadOpen(true);
              }
            }}
            className="px-5 cursor-pointer py-2.5 bg-ciq-primary text-white rounded-md text-sm inline-flex items-center gap-2 outline-none"
          >
            Upload
            <IoCloudUpload size={16} />
          </button>
        )}

        <Notification>
          <IoNotifications className="text-2xl text-ciq-primary cursor-pointer" />
        </Notification>
        <Progress
          user_name={user ? getName(user) : ""}
          email={user ? getEmail(user) : ""}
        />
      </div>
    </nav>
  );
};

export default Navbar;

const Progress = ({
  user_name,
  email,
}: {
  user_name: string;
  email: string;
}) => {
  const router = useRouter();
  const resetUser = useUserStore((s) => s.resetUser);
  const { mutateAsync: logoutAsync, isPending: loggingOut } = useLogout();

  const handleLogout = async () => {
    const response = await logoutAsync();
    if (response.status === 200) {
      resetUser();
      router.replace(process.env.CLIENT_AUTH_URL || "");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center justify-center cursor-pointer bg-white outline-none focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-full flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                 #E6AC32 0deg 230deg,
                 #861EAD 230deg 360deg
                )`,
                padding: "3px",
              }}
            >
              <div className="w-full h-full bg-white rounded-full" />
            </div>
            <span className="relative text-[#E6AC32] text-xl font-bold">
              {user_name?.slice(0, 1)?.toUpperCase()}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 p-0 bg-white border border-[#E2E8F0] shadow-lg rounded-md"
      >
        <div className="px-4 py-3 border-b border-[#E2E8F0]">
          <p className="text-sm font-semibold text-[#0F172A] truncate">
            {user_name || "—"}
          </p>
          {email && (
            <p className="text-xs text-[#64748B] truncate mt-0.5">{email}</p>
          )}
        </div>
        <div className="py-1">
          <MenuItem
            icon={<FiUser size={16} />}
            label="Profile"
            onClick={() => router.push("/profile")}
          />
          <MenuItem
            icon={
              loggingOut ? (
                <LuCircleDashed size={16} className="animate-spin" />
              ) : (
                <TbLogout2 size={16} />
              )
            }
            label={loggingOut ? "Logging out..." : "Logout"}
            onClick={handleLogout}
            disabled={loggingOut}
            destructive
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
  disabled,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        destructive
          ? "w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          : "w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      }
    >
      <span className={destructive ? "text-[#DC2626]" : "text-[#64748B]"}>
        {icon}
      </span>
      {label}
    </button>
  );
};
