"use client";

import {
  getDiscoverySection,
  updateDiscoverySection,
} from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useState } from "react";

type Discovery = Awaited<ReturnType<typeof getDiscoverySection>>[number];

const DiscoverySectionUpdate = ({ discovery }: { discovery: Discovery }) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return discovery.reduce(
      (acc, d) => {
        acc[d.id] = { ...d };
        return acc;
      },
      {} as Record<string, Discovery>
    );
  });

  const [isEditting, setIsEdditing] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(discovery[0]?.id || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (discoveryId: string) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const data = formData[discoveryId];
      await updateDiscoverySection(
        data.id,
        data.year,
        data.title,
        data.description,
        data.achievement,
        data.image
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (
    discoveryId: string,
    field: keyof Discovery,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [discoveryId]: {
        ...prev[discoveryId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Discovery Section</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Edit Discovery</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Discovery</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4 ">
              {discovery
                .sort((a, b) => a.year - b.year)
                .map((d) => (
                  <TabsTrigger key={d.id} value={d.id}>
                    {d.year}
                  </TabsTrigger>
                ))}
            </TabsList>

            {discovery.map((d) => (
              <TabsContent key={d.id} value={d.id}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium mb-1"
                    >
                      Year
                    </label>
                    <input
                      id="year"
                      value={formData[d.id]?.year || ""}
                      onChange={(e) =>
                        handleChange(d.id, "year", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      value={formData[d.id]?.title || ""}
                      onChange={(e) =>
                        handleChange(d.id, "title", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-1"
                    >
                      Description
                    </label>
                    <input
                      id="description"
                      value={formData[d.id]?.description || ""}
                      onChange={(e) =>
                        handleChange(d.id, "description", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="achievement"
                      className="block text-sm font-medium mb-1"
                    >
                      Achievement
                    </label>
                    <input
                      id="achievement"
                      value={formData[d.id]?.achievement || ""}
                      onChange={(e) =>
                        handleChange(d.id, "achievement", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium mb-1"
                    >
                      Image
                    </label>
                    <input
                      id="image"
                      value={formData[d.id]?.image || ""}
                      onChange={(e) =>
                        handleChange(d.id, "image", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    handleUpdate(d.id);
                  }}
                  disabled={isUpdating}
                  className="mt-4"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscoverySectionUpdate;
