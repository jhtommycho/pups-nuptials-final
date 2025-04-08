import { createTestimonial } from "@/actions/admin.action";
import { getTestimonials } from "@/actions/service.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type testimonial = Awaited<ReturnType<typeof getTestimonials>>[number];

const CreateTestimonial = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<testimonial>();

  const onSubmit = async (data: testimonial) => {
    try {
      const newTest = await createTestimonial(
        data.client,
        data.description,
        data.image
      );
      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>Create a new Testimony</DialogTrigger>
        <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center text-gray-800">
              New Testimony
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <div className="space-y-2">
              <label
                htmlFor="client"
                className="text-sm font-medium text-gray-700"
              >
                Client's Name
              </label>
              <input
                id="client"
                placeholder="Bride, Groom, and Dog's name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("client", { required: "Client name is required" })}
              />
              {errors.client && (
                <p className="text-xs text-red-600">{errors.client.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Testimony
              </label>
              <textarea
                placeholder="Client's Testimony"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={4}
                {...register("description", {
                  required: "Testimony is required",
                })}
              />
              {errors.description && (
                <p className="text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                id="image"
                placeholder="Link to the image"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                {...register("image", { required: "Image is required" })}
              />
              {errors.image && (
                <p className="text-xs text-red-600">{errors.image.message}</p>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTestimonial;
