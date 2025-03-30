import { getAllNotifications } from "@/actions/notification.action";
import { getUser } from "@/actions/user.action";
import Notifications from "@/components/Dashboard/Notifications";
import React from "react";

const page = async () => {
  const notifications = await getAllNotifications();
  const user = await getUser();
  return (
    <div>
      <Notifications notification={notifications} user={user} />
    </div>
  );
};

export default page;
