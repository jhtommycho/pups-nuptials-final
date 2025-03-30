import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import InquiryFilter from "@/components/Inquiry/InquiryFilter";
import InquiryList from "@/components/Inquiry/InquiryList";
import { ServiceStatus } from "@prisma/client";
import React from "react";

async function page({
  searchParams,
}: {
  searchParams: { inquiryStatus: ServiceStatus; city: string };
}) {
  const inquiryStatus = searchParams.inquiryStatus;
  const city = searchParams.city;
  console.log(inquiryStatus);

  const user = await getUser();
  const inquiries = await getRequest(inquiryStatus, city);
  const allInquiries = await getRequest();

  return (
    <div className="w-full">
      <div className="flex border border-gray-500">
        <InquiryFilter inquiries={allInquiries} />
        {/* Last Message By Filter */}
      </div>
      <InquiryList inquiry={inquiries} user={user} />
    </div>
  );
}

export default page;
