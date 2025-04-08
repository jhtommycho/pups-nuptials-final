"use client";
import { createPackage, getPackages } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type servicePackages = Awaited<ReturnType<typeof getPackages>>[number];

const CreatePackage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<servicePackages>({
    defaultValues: {
      PackageFeatures: [{ id: "1", content: "" }],
      favorite: false,
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "PackageFeatures",
    control,
  });

  const onSubmit = async (data: servicePackages) => {
    try {
      await createPackage(
        data.title,
        data.description,
        data.price,
        data.favorite,
        data.PackageFeatures
      );

      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Create a Package</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              Create a New Package
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                id="title"
                placeholder="Package Title"
                className="w-full border rounded-md px-4 py-2"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">Title is required</p>
              )}
            </div>

            <div>
              <input
                id="description"
                placeholder="Package Description"
                className="w-full border rounded-md px-4 py-2"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  Description is required
                </p>
              )}
            </div>

            <div>
              <input
                id="price"
                type="number"
                placeholder="Package Price"
                className="w-full border rounded-md px-4 py-2"
                {...register("price", {
                  required: true,
                  valueAsNumber: true,
                  validate: (value) =>
                    Number.isInteger(value) || "Price must be an integer",
                })}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">Price is required</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-medium">Package Features</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`PackageFeatures.${index}.content`)}
                    placeholder="Package Feature"
                    className="flex-1 border rounded-md px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  append({
                    id: Date.now().toString(),
                    content: "",
                  })
                }
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Feature
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="favorite"
                type="checkbox"
                {...register("favorite")}
                className="accent-blue-600"
              />
              <label htmlFor="favorite" className="text-sm">
                Mark as People’s Favorite
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4"
            >
              {isSubmitting ? "Submitting..." : "Create Package"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePackage;
