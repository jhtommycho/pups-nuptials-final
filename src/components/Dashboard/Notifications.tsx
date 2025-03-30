import { getAllNotifications } from "@/actions/notification.action";
import { getUser } from "@/actions/user.action";

import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type notifications = Awaited<ReturnType<typeof getAllNotifications>>;
type notification = notifications[number];
type users = Awaited<ReturnType<typeof getUser>>;
type user = users[number];

const Notifications = ({
  notification,
  user,
}: {
  notification: notification;
  user: user;
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-navy">Notifications</h1>
      </div>

      <div>
        <Tabs defaultValue="All">
          <TabsList className="mb-4">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="New Request">New Request</TabsTrigger>
            <TabsTrigger value="New Comment">New Comment</TabsTrigger>
          </TabsList>

          <TabsContent value="All">
            <div className="space-y-4">
              {notification.map((noti) => (
                <div
                  key={noti.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <Link href={`/myinquiry/${noti.user?.username}`}>
                    <div className="p-4 cursor-pointer hover:bg-cream/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold text-navy">
                            {noti.type === "NEW_COMMENT" && "New Comment"}
                            {noti.type === "NEW_REQUEST" && "New Request"}
                          </span>
                          <span className="text-navy font-medium">
                            {noti.content}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className=" text-sm">Created At</span>
                          <span className="text-gray-500 text-sm">
                            {format(noti.createdAt, "MMMM d, yyyy, h:mm a")}
                          </span>
                          <span className="pl-2">
                            {formatDistanceToNow(new Date(noti.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="New Request">
            <div className="space-y-4">
              {notification
                .filter((noti) => noti.type === "NEW_REQUEST")
                .map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <Link href={`/myinquiry/${req.user?.username}`}>
                      <div className="p-4 cursor-pointer hover:bg-cream/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold text-navy">
                              {req.type === "NEW_COMMENT" && "New Comment"}
                              {req.type === "NEW_REQUEST" && "New Request"}
                            </span>
                            <span className="text-navy font-medium">
                              {req.content}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className=" text-sm">Created At</span>
                            <span className="text-gray-500 text-sm">
                              {format(req.createdAt, "MMMM d, yyyy, h:mm a")}
                            </span>
                            <span className="pl-2">
                              {formatDistanceToNow(new Date(req.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="New Comment">
            <div className="space-y-4">
              {notification
                .filter((noti) => noti.type === "NEW_COMMENT")
                .map((com) => (
                  <div
                    key={com.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <Link href={`/myinquiry/${com.user?.username}`}>
                      <div className="p-4 cursor-pointer hover:bg-cream/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold text-navy">
                              {com.type === "NEW_COMMENT" && "New Comment"}
                              {com.type === "NEW_REQUEST" && "New Request"}
                            </span>
                            <span className="text-navy font-medium">
                              {com.content}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className=" text-sm">Created At</span>
                            <span className="text-gray-500 text-sm">
                              {format(com.createdAt, "MMMM d, yyyy, h:mm a")}
                            </span>
                            <span className="pl-2">
                              {formatDistanceToNow(new Date(com.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
