import { getUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

async function page() {
  const user = await getUser();

  return (
    <>
      {user?.userRole === "MANAGER" ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
          <p className="text-gray-600">
            Select an option from the sidebar to view different sections.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">NO ACCESS</h1>
          <Link href="/landing">
            <Button>Let's go back to Home!</Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default page;
