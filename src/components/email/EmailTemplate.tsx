import { getUser } from "@/actions/user.action";
import React from "react";

type user = Awaited<ReturnType<typeof getUser>>[number];

const EmailTemplate = ({ user }: { user: user }) => {
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
    </div>
  );
};

export default EmailTemplate;
