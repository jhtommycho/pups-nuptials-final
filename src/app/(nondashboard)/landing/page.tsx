import React from "react";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import DiscoverSection from "./DiscoverSection";
import Testimonials from "./Testimonials";
import LastAction from "./LastAction";

const page = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <DiscoverSection />
      <Testimonials />
      <LastAction />
    </div>
  );
};

export default page;
