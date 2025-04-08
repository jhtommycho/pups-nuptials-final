"use client";

import React, { useState, useEffect } from "react";
import {
  getFeatureSection,
  updateFeatureSection,
} from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Feature = Awaited<ReturnType<typeof getFeatureSection>>[number];

const FeatureSectionUpdate = ({ feature }: { feature: Feature }) => {
  const [formData, setFormData] = useState<Record<string, Feature>>(() => {
    return feature.reduce(
      (acc, f) => {
        acc[f.id] = { ...f };
        return acc;
      },
      {} as Record<string, Feature>
    );
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(feature[0]?.id || "");

  const handleUpdate = async (featureId: string) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const data = formData[featureId];
      await updateFeatureSection(
        data.id,
        data.title,
        data.description,
        data.image
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (
    featureId: string,
    field: keyof Feature,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Feature Section</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Edit Features</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Features</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {feature.map((f) => (
                <TabsTrigger key={f.id} value={f.id}>
                  {f.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {feature.map((f) => (
              <TabsContent key={f.id} value={f.id}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData[f.id]?.title || ""}
                      onChange={(e) =>
                        handleChange(f.id, "title", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={formData[f.id]?.description || ""}
                      onChange={(e) =>
                        handleChange(f.id, "description", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={formData[f.id]?.image || ""}
                      onChange={(e) =>
                        handleChange(f.id, "image", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <Button
                    onClick={() => handleUpdate(f.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Feature"}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 text-right">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeatureSectionUpdate;
