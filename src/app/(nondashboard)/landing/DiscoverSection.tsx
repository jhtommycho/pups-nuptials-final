"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getDiscoverySection } from "@/actions/admin.action";

type Discovery = Awaited<ReturnType<typeof getDiscoverySection>>[number];

const DiscoverSection = ({ discovery }: { discovery: Discovery }) => {
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
            {discovery?.length > 0 &&
              discovery
                .sort((a, b) => a.year - b.year)
                .map((disc, index) => (
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
                        {disc.year}
                      </h3>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {disc.title}
                      </h4>
                      <p className="text-blush mb-2">{disc.description}</p>
                      <p className="text-white text-sm">{disc.achievement}</p>
                    </div>

                    {/* Center Point */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gold rounded-full border-4 border-blue-800"></div>

                    {/* Image */}
                    <div
                      className={`w-1/2 ${index % 2 === 0 ? "pl-16" : "pr-16"}`}
                    >
                      <div className="rounded-lg overflow-hidden shadow-xl">
                        <img
                          src={disc.image}
                          alt={disc.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
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
