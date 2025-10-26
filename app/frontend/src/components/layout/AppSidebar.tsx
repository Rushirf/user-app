"use client";
import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { FiLogOut } from "react-icons/fi";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Users,
  ScrollText,
  CrownIcon,
  CreditCard,
  MoreHorizontal,
  Salad,
} from "lucide-react";

import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const pathname = usePathname();
  const { role } = useAuth();

  const navItemsByRole: Record<string, NavItem[]> = useMemo(
    () => ({
      user: [
        { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/" },
        { icon: <Users className="w-5 h-5" />, name: "Users", path: "/users" },
        
      ],
      admin: [
        { icon: <LayoutDashboard className="w-5 h-5" />, name: "Dashboard", path: "/" },
        { icon: <Users className="w-5 h-5" />, name: "Users", path: "/users" },
      ],
    }),
    []
  );

  const navItems = useMemo(() => {
    return navItemsByRole[role] || [];
  }, [role, navItemsByRole]);

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") return pathname === "/";
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-3">
      {navItems.map((nav) => (
        <li key={nav.name}>
          <Link
            href={nav.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
              ${isActive(nav.path)
                ? "bg-brand-500 text-white dark:bg-brand-400 dark:text-white"
                : "text-gray-700 hover:text-brand-500 dark:hover:text-brand-500  hover:bg-brand-25 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/50 dark:hover:bg-gray-800"}
              ${isExpanded || isMobileOpen ? "justify-start" : "justify-center"}`}
          >
            <span>{nav.icon}</span>
            {(isExpanded || isMobileOpen) && <span className="text-sm font-medium">{nav.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
  const handleLogout = async () => {
    showToast({
      tone: "success",
      variant: "solid",
      children: <p className="font-medium">{"Successfully logged out"}</p>,
    })
  }
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-[#191919] dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[240px] px-4" : "w-[80px] px-3"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className={`py-8 hidden lg:flex ${!isExpanded && !isMobileOpen ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/brandlogow.png" alt="Logo" width={200} height={40} />
              <Image className="hidden dark:block" src="/brandlogoblack.png" alt="Logo" width={200} height={40} />
            </>
          ) : (
            <Image src="/images/logo/icon-logo.png" alt="Logo" width={38} height={38} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar justify-between pt-6 sm:pt-0 pb-20 sm:pb-10 h-full">
        <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isMobileOpen ? "lg:justify-center" : "justify-start"}`}>
          {isExpanded || isMobileOpen ? "Menu" : <MoreHorizontal />}
        </h2>

        <nav className=" h-full flex flex-col gap-4 mb-4">
          {renderMenuItems(navItems)}
        </nav>
        {/* <Button
          onClick={handleLogout}
          className="h-12 text-lg"
        >
          <FiLogOut className="!w-6 !h-6 " />
          {(isExpanded || isMobileOpen) && "Sign Out"}
        </Button> */}

      </div>
    </aside>
  );
};

export default AppSidebar;
