"use client";
import { getPackages, updatePackages } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useState } from "react";
import CreatePackage from "./CreatePackage";

type servicePackage = Awaited<ReturnType<typeof getPackages>>[number];

const PackageUpdate = ({ packages }: { packages: servicePackage }) => {
  const [formData, setFormData] = useState<Record<string, servicePackage>>(
    () => {
      return packages.reduce(
        (acc, p) => {
          acc[p.id] = { ...p };
          return acc;
        },
        {} as Record<string, servicePackage>
      );
    }
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState(packages[0]?.id || "");

  const handleChange = (
    packageId: string,
    field: keyof servicePackage,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (packageId: string) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const data = formData[packageId];
      await updatePackages(
        packageId,
        data.title,
        data.description,
        data.price,
        data.favorite,
        data.PackageFeatures
      );
      console.log("activated");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFeatureChange = (
    packageId: string,
    index: number,
    value: string
  ) => {
    const updatedFeatures = [...formData[packageId].PackageFeatures];
    updatedFeatures[index].content = value;
    handleChange(packageId, "PackageFeatures", updatedFeatures);
  };

  const handleAddFeature = (packageId: string) => {
    const updatedFeatures = [
      ...formData[packageId].PackageFeatures,
      { content: "" },
    ];
    handleChange(packageId, "PacakgeFeatures", updatedFeatures);
  };

  const handleRemoveFeature = (packageId: string, index: number) => {
    const updatedFeatures = formData[packageId].PackageFeatures.filter(
      (_, i) => i !== index
    );
    handleChange(packageId, "PackageFeatures", updatedFeatures);
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Packages</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Edit Packages</Button>
        <CreatePackage />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Packages</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4 ">
              {packages
                .sort((a, b) => a.price - b.price)
                .map((p) => (
                  <TabsTrigger key={p.id} value={p.id}>
                    {p.title}
                  </TabsTrigger>
                ))}
            </TabsList>

            {packages.map((p) => (
              <TabsContent key={p.id} value={p.id}>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor={`title-${p.id}`}
                      className="block text-sm font-medium mb-1"
                    >
                      Title
                    </label>
                    <input
                      id={`title-${p.id}`}
                      value={formData[p.id]?.title || ""}
                      onChange={(e) =>
                        handleChange(p.id, "title", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor={`description-${p.id}`}
                      className="block text-sm font-medium mb-1"
                    >
                      Description
                    </label>
                    <input
                      id={`description-${p.id}`}
                      value={formData[p.id]?.description || ""}
                      onChange={(e) =>
                        handleChange(p.id, "description", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      htmlFor={`price-${p.id}`}
                      className="block text-sm font-medium mb-1"
                    >
                      Price
                    </label>
                    <input
                      id={`price-${p.id}`}
                      type="number"
                      value={formData[p.id]?.price || ""}
                      onChange={(e) =>
                        handleChange(p.id, "price", Number(e.target.value))
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Package Features
                    </label>
                    <div className="space-y-2">
                      {formData[p.id]?.PackageFeatures?.map((f, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            value={f.content || ""}
                            onChange={(e) =>
                              handleFeatureChange(p.id, index, e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md p-2"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFeature(p.id, index)}
                            type="button"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleAddFeature(p.id)}
                      className="mt-2"
                      type="button"
                      variant="outline"
                    >
                      + Add Feature
                    </Button>
                  </div>

                  {/* Update Button */}
                  <div className="pt-4">
                    <Button
                      onClick={() => handleUpdate(p.id)}
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageUpdate;
