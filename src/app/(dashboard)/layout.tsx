import { getUser } from "@/actions/user.action";
import DashboardNavbar from "@/components/Navbar/DashboardNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

async function layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <>
      {user?.userRole === "manager" ? (
        <div className="flex">
          <DashboardNavbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      ) : (
        <>
          {" "}
          No Access
          <Link href="/landing">
            <Button>Please return home</Button>
          </Link>
        </>
      )}
    </>
  );
}

export default layout;
