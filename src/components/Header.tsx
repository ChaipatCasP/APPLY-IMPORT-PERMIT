import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Header: React.FC = () => {
  const location = useLocation();
  const { authResult, username, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") {
      return "Purchase Order Overview";
      // } else if (path === "/poDetail") {
      //   return "PO Detail";
    } else if (path === "/purchase-orders") {
      return "PO Management";
    } else if (path === "/suppliers") {
      return "Suppliers";
    } else if (path === "/analytics") {
      return "Reports";
    } else if (path === "/settings") {
      return "Settings";
    } else if (path === "/comparing-result") {
      return "Comparing Result";
    }
    return "Purchase Order Overview";
  };

  return (
    // <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">

    <div className="w-full bg-white border-b border-gray-200 ">
      <header className="flex items-center justify-between px-6 py-3 mx-auto">
        {/* login */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-900 dark:text-black font-bold text-xl tracking-wide uppercase"
          >
            <img src="/logo.png" alt="TradeFlow Logo" className="w-25 h-6" />

            <span className="text-slate-400 text-lg">|</span>

            <h2 className="text-lg font-bold tracking-tight">
              APPLY IMPORT PERMIT MODULE
            </h2>
          </Link>

          {/* Page Title */}
          {/* <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-400 text-lg">|</span>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-black">
              {getPageTitle()}
            </h3>
          </div> */}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pl-6 border-l">
            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div
                  className="size-9 rounded-full bg-blue-500 ring-2 ring-whitecursor-pointer flex items-center justify-center"
                  style={{ borderRadius: "20px" }}
                >
                  <span className="text-white text-sm font-semibold">
                    {(authResult?.STAFF_NAME || username || "U")
                      .split(" ")
                      .map((name) => name.charAt(0))
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {authResult?.STAFF_NAME || "User"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {username || "Unknown"}
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  keyboard_arrow_down
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white  rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-200 ">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {authResult?.STAFF_NAME}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {username}
                    </p>
                  </div>
                  {/* <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      settings
                    </span>
                    Settings
                  </Link> */}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      logout
                    </span>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
