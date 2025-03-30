"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const timelineEvents = [
  {
    year: "2017",
    title: "Joined the Pet Industry",
    description: "Started our journey in professional pet care services",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1200",
  },
  {
    year: "2020",
    title: "Entered Wedding Industry",
    description: "Launched our specialized wedding dog chaperone service",
    image:
      "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?q=80&w=1200",
  },
  {
    year: "2023",
    title: "100th Wedding Milestone",
    description: "Celebrated our 100th successful wedding integration",
    image:
      "https://images.unsplash.com/photo-1520741412100-24cd6c2832e5?q=80&w=1200",
  },
  {
    year: "2024",
    title: "Service Acknowledgement",
    description: "Fianlist of 2024 Small Business in Pet Service Industry",
    image:
      "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1200",
  },
  {
    year: "2025",
    title: "Looking Forward",
    description: "Continuing to create magical moments",
    image:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200",
  },
];

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

const DiscoverSection = () => {
  return (
    <div className="bg-navy py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gold mb-16">
          Our Journey
        </h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-black/30"></div>

          {/* Timeline Events */}
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`mb-24 flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pr-16 text-right" : "pl-16 text-left"
                  }`}
                >
                  <h3 className="text-2xl font-bold text-gold mb-2">
                    {event.year}
                  </h3>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {event.title}
                  </h4>
                  <p className="text-blush">{event.description}</p>
                </div>

                {/* Center Point */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gold rounded-full border-4 border-blue-800"></div>

                {/* Image */}
                <div className={`w-1/2 ${index % 2 === 0 ? "pl-16" : "pr-16"}`}>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverSection;
