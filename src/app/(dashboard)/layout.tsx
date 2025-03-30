import { getUser } from "@/actions/user.action";
import DashboardNavbar from "@/components/Navbar/DashboardNavbar";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <div className="flex">
      {user?.userRole === "MANAGER" ? <DashboardNavbar /> : <></>}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default layout;
