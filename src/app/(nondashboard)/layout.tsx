import React from "react";

import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="h-full w-full">
        <Navbar />
        <main
          className="h-full flex w-full flex-col"
          style={{ paddingTop: "55px" }}
        >
          {children}
        </main>
      </div>
    </ClerkProvider>
  );
};

export default layout;
