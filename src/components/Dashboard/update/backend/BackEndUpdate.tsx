"use client";

import React, { useState } from "react";
import CreatePackage from "./CreatePackage";
import PackageUpdate from "./PackageUpdate";
import { Button } from "@/components/ui/button";
import { getPackages } from "@/actions/admin.action";

type packages = Awaited<ReturnType<typeof getPackages>>[number];

const BackEndUpdate = ({ packages }: { packages: packages }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-4xl ">
      <div className="flex gap-4">
        <h1 className="text-2xl font-semibold mb-4">Service Package Editor</h1>
        <Button onClick={() => setIsOpen((prev) => !prev)} className={`mb-6 `}>
          {isOpen ? "Close Editor" : "Open Editor"}
        </Button>
      </div>
      {isOpen && (
        <div className="space-y-8">
          <div>
            <PackageUpdate packages={packages} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BackEndUpdate;
