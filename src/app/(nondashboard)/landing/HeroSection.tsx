"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";

const HeroSection = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="relative h-[60vh] pt-[55px]">
      <Image
        src="/pnn_landing_splash.png"
        alt="Pups and Nuptials Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 transform text-center w-full text-4xl"
      >
        <div className="max-w-4xl mx-auto px-16 sm:px-12">
          <h1 className="text-white font-bold mb-4">
            Make your perfect day that much more special with your
            <span className="text-pink-200"> fur </span>
            babies
          </h1>
          <p className="text-xl text-white mb-8">Place Holder...</p>
        </div>
        {isSignedIn ? (
          <Link href="/myinquiry/request">
            <Button className="hover:bg-gray-600  rounded-xl">
              Inquire Pups & Nuptials
            </Button>
          </Link>
        ) : (
          <Button className="hover:bg-gray-600 rounded-xl">
            <SignInButton mode="modal">
              Sign in to Inquire Pups & Nuptials
            </SignInButton>
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default HeroSection;
