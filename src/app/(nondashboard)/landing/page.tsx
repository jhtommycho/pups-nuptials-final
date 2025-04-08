import React from "react";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import DiscoverSection from "./DiscoverSection";
import Testimonials from "./Testimonials";
import LastAction from "./LastAction";
import { getFeature, getTestimonials } from "@/actions/service.action";
import { getDiscoverySection } from "@/actions/admin.action";

const page = async () => {
  const featureCards = await getFeature();
  const discoverySection = await getDiscoverySection();
  const testimonaiols = await getTestimonials();

  return (
    <div>
      <HeroSection />
      <FeaturedSection featureCards={featureCards} />
      <DiscoverSection discovery={discoverySection} />
      <Testimonials testimonials={testimonaiols} />
      <LastAction />
    </div>
  );
};

export default page;
