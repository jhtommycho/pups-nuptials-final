"use client";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTestimonials } from "@/actions/service.action";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateTestimonialSection } from "@/actions/admin.action";
import CreateTestimonial from "./CreateTestimonial";

type testimonials = Awaited<ReturnType<typeof getTestimonials>>[number];

const TestimonialsSectionUpdate = ({
  testimonials,
}: {
  testimonials: testimonials[];
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return testimonials.reduce(
      (acc, f) => {
        acc[f.id] = { ...f };
        return acc;
      },
      {} as Record<string, any>
    );
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (featureId: string) => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const data = formData[featureId];
      await updateTestimonialSection(
        data.id,
        data.client,
        data.description,
        data.image
      );

      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (
    testimonialId: string,
    field: keyof testimonials,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [testimonialId]: {
        ...prev[testimonialId],
        [field]: value,
      },
    }));
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(testimonials[0]?.id || "");

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Testimonial Section</h2>
        <Button onClick={() => setIsDialogOpen(true)}>Edit Testimonials</Button>
        <Button>
          <CreateTestimonial />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Features</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              {testimonials.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.client}
                </TabsTrigger>
              ))}
            </TabsList>

            {testimonials.map((t) => (
              <TabsContent key={t.id} value={t.id}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Client
                    </label>
                    <input
                      type="text"
                      value={formData[t.id]?.client || ""}
                      onChange={(e) =>
                        handleChange(t.id, "client", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={formData[t.id]?.description || ""}
                      onChange={(e) =>
                        handleChange(t.id, "description", e.target.value)
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
                      value={formData[t.id]?.image || ""}
                      onChange={(e) =>
                        handleChange(t.id, "image", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <Button
                    onClick={() => handleUpdate(t.id)}
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

export default TestimonialsSectionUpdate;
