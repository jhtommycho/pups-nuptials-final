"use client";
import { getRequest } from "@/actions/service.action";
import { ServiceStatus } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type inquiries = Awaited<ReturnType<typeof getRequest>>;
type inquiry = inquiries[number];

const InquiryFilter = ({ inquiries }: { inquiries: inquiry }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cityLocation, setCityLocation] = useState(
    searchParams.get("city") || ""
  );

  const [inquiryStatus, setInquiryStatus] = useState(
    searchParams.get("inquiryStatus") || ""
  );

  const uniqueCities = [...new Set(inquiries.map((inq) => inq.weddingCity))];

  const updateURL = (status: string, city: string) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (status) params.set("inquiryStatus", status);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCityLocation(selectedCity);
    updateURL(inquiryStatus, selectedCity);
  };

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusUpdate = e.target.value;
    setInquiryStatus(statusUpdate);
    updateURL(statusUpdate, cityLocation);
  };

  return (
    <div>
      <select value={inquiryStatus} onChange={handleStatusSelect}>
        <option value="">select status</option>
        <option value={ServiceStatus.pending}>Pending</option>
        <option value={ServiceStatus.approved}>Approved</option>
        <option value={ServiceStatus.rejected}>Rejected</option>
      </select>

      <select value={cityLocation} onChange={handleCitySelect}>
        <option value="">Filter City</option>
        {uniqueCities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InquiryFilter;
