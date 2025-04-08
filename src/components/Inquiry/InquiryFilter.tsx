"use client";
import { getRequest } from "@/actions/service.action";
import { ServiceStatus, userRoleType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type inquiries = Awaited<ReturnType<typeof getRequest>>;
type inquiry = inquiries[number];

const InquiryFilter = ({ inquiries }: { inquiries: inquiry[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cityLocation, setCityLocation] = useState(
    searchParams.get("city") || ""
  );

  const [lastResponder, setLastResponder] = useState(
    searchParams.get("responder") || ""
  );

  const [inquiryStatus, setInquiryStatus] = useState(
    searchParams.get("inquiryStatus") || ""
  );

  const uniqueCities = [
    ...new Set(inquiries.map((inq: any) => inq.weddingCity)),
  ];

  const updateURL = (status: string, city: string, responder: string) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (status) params.set("inquiryStatus", status);
    if (responder) params.set("responder", responder);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCityLocation(selectedCity);
    updateURL(inquiryStatus, selectedCity, lastResponder);
  };

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusUpdate = e.target.value;
    setInquiryStatus(statusUpdate);
    updateURL(statusUpdate, cityLocation, lastResponder);
  };

  const handleLastResponderSelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectResponder = e.target.value;
    setLastResponder(selectResponder);
    updateURL(inquiryStatus, cityLocation, selectResponder);
  };

  return (
    <div className="flex justify-between text-bold">
      {/* Status Filter */}
      <div className="flex gap-4">
        <select value={inquiryStatus} onChange={handleStatusSelect}>
          <option value="">Select Status</option>
          <option value={ServiceStatus.pending}>Pending</option>
          <option value={ServiceStatus.approved}>Approved</option>
          <option value={ServiceStatus.rejected}>Rejected</option>
        </select>

        {/* Unique City Filter */}
        <select value={cityLocation} onChange={handleCitySelect}>
          <option value="">Filter City</option>
          {uniqueCities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Last Responder Filter */}
        <select value={lastResponder} onChange={handleLastResponderSelect}>
          <option value="">Filter Last Responder</option>
          <option value={userRoleType.manager}>Manager</option>
          <option value={userRoleType.client}>Client</option>
        </select>
      </div>
    </div>
  );
};

export default InquiryFilter;
