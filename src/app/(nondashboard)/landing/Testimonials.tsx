"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { getTestimonials } from "@/actions/service.action";

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

type Testimonial = {
  client: string;
  description: string;
  image: string;
};

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
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
            className="flex flex-nowrap space-x-8 lg:space-x-12"
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 10,
              ease: "linear",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex-shrink-0 w-[450px]"
              >
                <DiscoverCard {...testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  client,
  description,
  image,
}: {
  client: string;
  description: string;
  image: string;
}) => (
  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-[200px] flex flex-col justify-between">
    <div className="flex gap-6 items-start h-full">
      <div className="flex-shrink-0">
        <div className="w-24 h-35 rounded-full overflow-hidden border-4 border-amber-100 shadow-inner">
          <Image
            src={image}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            alt={image}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col h-full">
        <div className="flex mb-2 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className="w-4 h-4 text-amber-400 fill-amber-400"
            />
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {client}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1 break-words">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default Testimonials;
