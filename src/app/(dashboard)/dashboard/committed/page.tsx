import { getAllNotifications } from "@/actions/notification.action";
import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import InquiryList from "@/components/Inquiry/InquiryList";
import React from "react";

async function page() {
  const allInquiries = await getRequest();
  const allNotifications = await getAllNotifications();
  // Filter inquiries to only show those with status "PENDING"
  const pendingInquiries = allInquiries?.filter(
    (inquiry) => inquiry.status === "APPROVED"
  );
  const user = await getUser();

  return (
    <div>
      <InquiryList
        inquiry={pendingInquiries}
        user={user}
        noti={allNotifications}
      />
    </div>
  );
}

export default page;
