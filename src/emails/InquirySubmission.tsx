import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import { Button, Html } from "@react-email/components";
import * as React from "react";

type user = Awaited<ReturnType<typeof getUser>>[number];

export default async function InquirySubmission({
  name,
  dogName,
}: {
  name: string;
  dogName: string[];
}) {
  const user = await getUser();

  return (
    <Html>
      <h1>
        Hey {name}! We're so happy to see you're interested in including you fur
        babies in your special day! We will be in touch within 2 business days
        to learn more about {dogName.join(", ")}
      </h1>

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
