import { getUser, syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser(); // POST Request
  const users = await getUser();

  console.log(users);
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: "55px" }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8">
        <Link href={"/"}>
          <div className="text-xl font-bold">
            Pups
            <span className="font-light hover:text-pink-400"> & Nuptials</span>
          </div>
        </Link>
        <div className="hidden md:flex">
          Enjoy the happiest day with your pup!
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href={`/myinquiry/${users?.username}`}>
              <Button className="hover:cursor-pointer">My Inquiries</Button>
            </Link>
            {users?.userRole === "MANAGER" && (
              <Link href={`/dashboard`}>
                <Button className="hover:cursor-pointer">Dashboard</Button>
              </Link>
            )}
            <Button className="hover:text-blue-400">
              <SignOutButton>Sign Out</SignOutButton>
            </Button>
          </div>
        ) : (
          <div>
            <Button className="md:ml-4 hover:text-blue-400">
              <SignInButton mode="modal">Sign In</SignInButton>
            </Button>
            <Button className="md:ml-4 hover:bg-pink-200 hover:text-blue-400">
              <SignUpButton mode="modal">Sign Up</SignUpButton>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
