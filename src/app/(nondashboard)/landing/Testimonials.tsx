"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StarIcon, Stars } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Testimonials = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-cream"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Our Happy Lovers
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Include your Pups on your big day!
          </p>
        </motion.div>

        {/* Animated Scrolling Cards */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex flex-nowrap space-x-8 lg:space-x-0"
            animate={{
              x: ["0%", "-100%"], // Move from 0% to -100%
            }}
            transition={{
              repeat: Infinity, // Loop forever
              repeatType: "loop", // Reset to original position after one loop
              duration: 10, // Time it takes to complete one loop
              ease: "linear", // Smooth movement
            }}
          >
            {[
              {
                imageSrc: "/landing-search1.png",
                title: "Kona's Testimonial",
                description: "check",
              },
              {
                imageSrc: "/landing-icon-calendar.png",
                title: "Book Your Rental",
                description:
                  "I had the best experience with Dana / Pups and Nuptials. I had reached out and booked fairly last minute but Dana said it was no issue, she came so prepared and with the most loving and caring attitude for my special day....",
              },
              {
                imageSrc: "/landing-icon-heart.png",
                title: "Enjoy your New Home",
                description:
                  "Move into your new rental property and start enjoying your dream home.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex-shrink-0 w-auto"
              >
                <DiscoverCard {...card} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="w-full h-72 rounded-lg border border-red-700 grid grid-cols-4 ">
    {/* Image Section - 1/4 */}
    <div className="col-span-1 flex items-center justify-center p-4">
      <div className="w-24 h-24 rounded-full border border-amber-300 overflow-hidden">
        <Image
          src={imageSrc}
          width={96}
          height={96}
          className="w-full h-full object-cover"
          alt={title}
        />
      </div>
    </div>

    {/* Text Section - 3/4 */}
    <div className="col-span-3 p-6 border-l border-blue-400 text-wrap">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="fill-gold" />
        ))}
      </div>
      <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 line-clamp-3">{description}</p>
    </div>
  </div>
);

export default Testimonials;
