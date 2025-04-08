"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Services", path: "/dashboard/status" },
    // { name: "Rejected", path: "/dashboard/rejected" },
    // { name: "Committed", path: "/dashboard/committed" },
    { name: "Calendar", path: "/dashboard/calendar" },
    { name: "Analytics", path: "/dashboard/analytics" },
    { name: "Notifications", path: "/dashboard/notifications" },
    { name: "Settings", path: "/dashboard/settings" },
    { name: "Home", path: "/landing" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-100 p-4 border-r border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block p-2 rounded hover:bg-gray-200 transition-colors ${
                  pathname === item.path ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardNavbar;
