import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import InquiryFilter from "@/components/Inquiry/InquiryFilter";
import InquiryList from "@/components/Inquiry/InquiryList";
import { ServiceStatus, userRoleType } from "@prisma/client";
import React from "react";

async function page({
  searchParams,
}: {
  searchParams: {
    inquiryStatus: ServiceStatus;
    city: string;
    responder: userRoleType;
  };
}) {
  const inquiryStatus = searchParams.inquiryStatus;
  const city = searchParams.city;
  const responder = searchParams.responder;

  const user = await getUser();
  const inquiries = await getRequest(inquiryStatus, city, responder);
  const allInquiries = await getRequest();

  return (
    <div className="w-full">
      <div className="flex ">
        <InquiryFilter inquiries={allInquiries} />
        {/* Last Message By Filter */}
      </div>
      <InquiryList inquiry={inquiries} user={user} />
    </div>
  );
}

export default page;
