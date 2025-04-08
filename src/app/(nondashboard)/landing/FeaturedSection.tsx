"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getFeature } from "@/actions/service.action";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type featureCards = Awaited<ReturnType<typeof getFeature>>;
type featureCard = featureCards[number];
const FeaturedSection = ({ featureCards }: featureCard) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto text-cream">
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-12 w-full sm:w-2/3 mx-auto "
        >
          Your Pups Big Day! Placeholder
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 lg:gap-16 xl:gap-16">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-full h-60 relative mb-4">
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({
  imageSrc,
  title,
  description,
  linkText,
  linkHref,
}: {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}) => (
  <div className="text-center">
    <div className="relative w-80 h-80 mx-auto p-4 rounded-lg mb-4 flex items-center justify-center bg-gray-50">
      <Image
        src={imageSrc}
        fill
        className="w-full h-full object-contain"
        alt={title}
      />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="mb-4">{description}</p>
    <Link
      href={linkHref}
      className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
      scroll={false}
    >
      {linkText}
    </Link>
  </div>
);
export default FeaturedSection;
