import { getUser } from "@/actions/user.action";
import { Button, Html } from "@react-email/components";
import * as React from "react";

type user = Awaited<ReturnType<typeof getUser>>[number];

export default async function Welcome({ name }: { name: string }) {
  const user = await getUser();

  return (
    <Html>
      <h1>Welcome {name}</h1>
      <Button
        href={
          user
            ? `http://localhost:3001/myinquiry/${user?.username}`
            : `http://localhost:3001/landing`
        }
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me
      </Button>
    </Html>
  );
}
