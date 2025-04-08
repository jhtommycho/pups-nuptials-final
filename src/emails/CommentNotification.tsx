import { getUser } from "@/actions/user.action";
import { Button, Html } from "@react-email/components";
import * as React from "react";

type user = Awaited<ReturnType<typeof getUser>>[number];

export default async function CommentNotification({
  name,
  content,
}: {
  name: string;
  content: string;
}) {
  const user = await getUser();

  return (
    <Html>
      <h1>
        Hey {name}! You have a new message from Dana on your Pups & Nuptials
        inquiry
      </h1>
      <h2>{content}</h2>

      <Button
        href={
          user
            ? `http://localhost:3001/myinquiry/${user?.username}`
            : `http://localhost:3001/landing`
        }
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me to see the new message!
      </Button>
    </Html>
  );
}
