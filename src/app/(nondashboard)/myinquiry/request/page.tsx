import { getUser } from "@/actions/user.action";
import ServiceRequest from "@/components/Inquiry/ServiceRequest";
import React from "react";

async function page() {
  const user = await getUser();
  return (
    <div>
      <ServiceRequest user={user} />
    </div>
  );
}

export default page;
