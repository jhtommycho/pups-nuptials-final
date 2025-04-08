"use client";
import React, { useState } from "react";
import { getHeroSection, updateHeroSection } from "@/actions/admin.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Hero = Awaited<ReturnType<typeof getHeroSection>>[number];

const HeroSectionUpdate = ({ hero }: { hero: Hero }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const initializeFormData = (hero: Hero) => {
    setFormData((prev) => ({
      ...prev,
      [hero.id]: {
        id: hero.id,
        title: hero.title,
        image: hero.image,
      },
    }));
  };

  const HandleOnSubmit = async (heroId: string) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const data = formData[heroId];
      await updateHeroSection(data.id, data.title, data.image);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex">
      {hero.map((heroItem) => (
        <div
          key={heroItem.id}
          className="flex items-center justify-between py-2 border-b last:border-b-0 gap-4"
        >
          <h2 className="text-lg font-semibold">Hero Section</h2>
          <Dialog
            onOpenChange={(open) => {
              if (open) initializeFormData(heroItem);
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">Edit Hero</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Hero Section</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  HandleOnSubmit(heroItem.id);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <Input
                    id="title"
                    value={formData[heroItem.id]?.title || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [heroItem.id]: {
                          ...prev[heroItem.id],
                          title: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <label
                    className="block mb-1 text-sm font-medium"
                    htmlFor="image"
                  >
                    Image URL
                  </label>
                  <Input
                    id="image"
                    value={formData[heroItem.id]?.image || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [heroItem.id]: {
                          ...prev[heroItem.id],
                          image: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
};

export default HeroSectionUpdate;
