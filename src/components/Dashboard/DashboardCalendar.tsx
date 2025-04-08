"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import React from "react";
import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";

type inquiries = Awaited<ReturnType<typeof getRequest>>;
type inquiry = inquiries[number];
type users = Awaited<ReturnType<typeof getUser>>;
type user = users[number];

const DashboardCalendar = ({
  inquiry,
  user,
}: {
  inquiry: inquiry;
  user: user;
}) => {
  const calendarEvents = inquiry.map((inq) => ({
    title: `${inq.user?.username} - ${inq.status} - ${inq.stage}`,
    date: inq.weddingDate,
    backgroundColor:
      inq.status === "APPROVED"
        ? "#22c55e"
        : inq.status === "REJECTED"
        ? "#ef4444"
        : "#eab308",
    extendedProps: {
      inq,
    },
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-rose-100">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
      />
      ;
    </div>
  );
};

export default DashboardCalendar;
