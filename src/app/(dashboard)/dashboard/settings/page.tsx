import {
  getDiscoverySection,
  getFeatureSection,
  getHeroSection,
  getPackages,
} from "@/actions/admin.action";
import { getTestimonials } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import BackEndUpdate from "@/components/Dashboard/update/backend/BackEndUpdate";
import FrontEndUpdate from "@/components/Dashboard/update/frontend/FrontEndUpdate";

import React from "react";

const page = async () => {
  const heroSection = await getHeroSection();
  const discoverySection = await getDiscoverySection();
  const featureSection = await getFeatureSection();
  const user = await getUser();
  const testimonials = await getTestimonials();
  const packages = await getPackages();

  return (
    <div className="border border-red-50">
      <div className="border border-gray-500">
        <FrontEndUpdate
          hero={heroSection}
          discovery={discoverySection}
          feature={featureSection}
          user={user}
          testimonials={testimonials}
        />
        <BackEndUpdate packages={packages} />
      </div>
    </div>
  );
};

export default page;
