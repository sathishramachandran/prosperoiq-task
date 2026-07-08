import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  FiBarChart2,
  FiFileText,
  FiPackage,
  FiSettings,
  FiShield,
  FiUser,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";

type Props = {
  minimize: boolean;
};

type SidebarItem = {
  item: string;
  path: string;
  icon: ReactNode;
};

const ICON_SIZE = 18;

const default_items: SidebarItem[] = [
  {
    item: "BOE Extraction",
    path: "boeextraction",
    icon: <FiFileText size={ICON_SIZE} />,
  },
  {
    item: "SB Extraction",
    path: "sbextraction",
    icon: <FiPackage size={ICON_SIZE} />,
  },
  {
    item: "Reports",
    path: "reports",
    icon: <FiBarChart2 size={ICON_SIZE} />,
  },

];

const settings_items: SidebarItem[] = [
  {
    item: "Create User",
    path: "admin/create-user",
    icon: <FiUserPlus size={ICON_SIZE} />,
  },
  {
    item: "Roles",
    path: "admin/roles",
    icon: <FiShield size={ICON_SIZE} />,
  },
  {
    item: "Users",
    path: "admin/users",
    icon: <FiUsers size={ICON_SIZE} />,
  },
];

const Sidebar = ({ minimize }: Props) => {
  const pathname = usePathname();

  const isSettingsMode = pathname.startsWith("/admin");
  const visibleItems = isSettingsMode ? settings_items : default_items;

  const isActive = (path: string) => {
    const target = `/${path.trim()}`;
    return pathname === target || pathname.startsWith(target + "/");
  };

  return (
    <div
      className={clsx(
        "bg-ciq-primary w-55 h-screen  grid grid-rows-[auto_1fr_auto] transition-all overflow-hidden px-4 py-11 pt-5",
        minimize && "w-0! px-0!",
      )}
    >
      <Image
        src={"/logo.svg"}
        className="mx-auto"
        height={100}
        width={200}
        alt="logo"
      />

      <div className="text-white mt-11 space-y-3  ">

        {visibleItems.map((sidebarItem, index) => {
          return (
            <Link
              href={`/${sidebarItem.path.trim()}`}
              className={clsx(
                "border-[#FFFFFF33] select-none border-2 text-sm flex items-center gap-2.5 px-3 transition-colors hover:bg-[#FFFFFF33] py-1.5 rounded-md cursor-pointer",
                isActive(sidebarItem.path) &&
                  "bg-white text-ciq-primary hover:bg-white",
              )}
              key={index}
            >
              <span className="shrink-0">{sidebarItem.icon}</span>
              {sidebarItem.item}
            </Link>
          );
        })}
      </div>
      {!isSettingsMode && (
        <Link
          href="/admin/roles"
          className="border-[#FFFFFF33] text-white flex items-center gap-2 justify-center border-2 transition-colors cursor-pointer hover:bg-[#FFFFFF33] py-1.5 rounded-md text-center"
        >
          <FiSettings size={18} /> Settings
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
