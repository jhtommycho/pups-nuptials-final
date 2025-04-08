"use client";
import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";
import NotificationBell from "../Dashboard/NotificationBell";
import { getAllNotifications } from "@/actions/notification.action";

type inquiries = Awaited<ReturnType<typeof getRequest>>;
type inquiry = inquiries[number];
type users = Awaited<ReturnType<typeof getUser>>;
type user = users[number];

const InquiryList = ({ inquiry, user }: { inquiry: inquiry; user: user }) => {
  // Only show the notification bell for managers
  const isManager = user?.userRole === "manager";

  return (
    <>
      {isManager ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-navy">
              Wedding Service Inquiries
            </h1>
            {isManager && <NotificationBell />}
          </div>

          <div className="space-y-4">
            {inquiry.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <Link href={`/myinquiry/${inq.user?.username}`}>
                  {/* Header - Always visible */}
                  <div className="p-4 cursor-pointer hover:bg-cream/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {inq.user?.userRole === "CLIENT" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cream text-gold">
                            {inq.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cream text-gold">
                            Created by a Manager
                          </span>
                        )}

                        <span className="text-navy font-medium">
                          {inq.brideName} & {inq.groomName}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Submitted on {format(inq.createdAt, "MMMM d, yyyy")}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Last Response By:{" "}
                          {inq.Comment?.[0]?.user?.userRole === "manager"
                            ? "Manager"
                            : inq.Comment?.[0]?.user?.userRole === "client"
                              ? "Client"
                              : "No Comments Yet"}{" "}
                          {inq.Comment?.[0]?.createdAt
                            ? format(
                                inq.Comment?.[0]?.createdAt,
                                "MMMM d, yyyy"
                              )
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-navy">
                          Wedding Date {""}
                          {format(inq.weddingDate, "MMMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>No Access</>
      )}
    </>
  );
};

export default InquiryList;
