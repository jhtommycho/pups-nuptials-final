"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import React from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const LastAction = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-navy py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gold mb-6">
          Ready to Include Your Dog in Your Special Day?
        </h2>
        <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
          Let us help create unforgettable memories with your four-legged family
          member
        </p>

        {isSignedIn ? (
          <Link href="/myinquiry/request">
            <Button className="hover:cursor-pointer  bg-gold text-navy px-8 py-4 rounded-full text-lg font-semibold hover:bg-gold/90 transition-colors flex items-center mx-auto">
              Schedule Your Consultation
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <>
            <Button className="hover:cursor-pointer  bg-gold text-navy px-8 py-4 rounded-full text-lg font-semibold hover:bg-gold/90 transition-colors flex items-center mx-auto">
              <SignInButton mode="modal">
                Schedule Your Consultation
              </SignInButton>
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LastAction;
