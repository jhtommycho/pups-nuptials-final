import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DashboardCalendar from "@/components/Dashboard/DashboardCalendar";
import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";

async function page() {
  const inquiry = await getRequest();
  const user = await getUser();

  return (
    <div>
      <DashboardCalendar inquiry={inquiry} user={user} />
    </div>
  );
}

export default page;
