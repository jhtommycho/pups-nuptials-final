"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import CreateTestimonial from "./CreateTestimonial";
import HeroSectionUpdate from "./HeroSectionUpdate";
import FeatureSectionUpdate from "./FeatureSectionUpdate";
import DiscoverySectionUpdate from "./DiscoverySectionUpdate";
import TestimonialsSectionUpdate from "./TestimonialsSectionUpdate";

const FrontEndUpdate = ({
  hero,
  discovery,
  feature,
  user,
  testimonials,
}: {
  hero: any;
  discovery: any;
  feature: any;
  user: any;
  testimonials: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-4xl ">
      <div className=" flex gap-4">
        <h1 className="text-2xl font-semibold mb-4">Home Page Editor</h1>
        <Button onClick={() => setIsOpen((prev) => !prev)} className="mb-6">
          {isOpen ? "Close Editor" : "Open Editor"}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-8">
          <HeroSectionUpdate hero={hero} />
          <FeatureSectionUpdate feature={feature} />
          <DiscoverySectionUpdate discovery={discovery} />
          <TestimonialsSectionUpdate testimonials={testimonials} />

          <Button variant="outline" className="w-full">
            Send Email
          </Button>
        </div>
      )}
    </div>
  );
};

export default FrontEndUpdate;
