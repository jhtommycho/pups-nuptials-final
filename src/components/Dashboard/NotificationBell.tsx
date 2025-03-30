"use client";
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  getUnreadNotificationsManager,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/actions/notification.action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

type Notification = Awaited<
  ReturnType<typeof getUnreadNotificationsManager>
>[number];

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    const data = await getUnreadNotificationsManager();
    if (data) {
      setNotifications(data);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    fetchNotifications();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No new notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                href={`/myinquiry/${notification.user?.username}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        notification.type === "NEW_REQUEST"
                          ? "bg-blue-500"
                          : "bg-gold"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(notification.createdAt),
                          "MMM d, h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
