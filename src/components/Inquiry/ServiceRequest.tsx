"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  FaEnvelope,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { Dog, MapPin, Home as HomeIcon, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { createRequest } from "@/actions/service.action";
import toast from "react-hot-toast";
import { getUser } from "@/actions/user.action";
import { marketingType } from "@prisma/client";
import { cities } from "../../../public/constants/cities";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface Doggy {
  id: string;
  dogName: string;
  dogAge: string;
  dogBreed: string;
  dogWeight?: string;
}

interface ServiceRequestForm {
  dogCount: number;
  marketing: marketingType;
  brideName: string;
  groomName: string;
  weddingDate: string;
  serviceLength: string;
  houseSitting: boolean;
  weddingCity: string;
  weddingAddress: string;
  houseSittingLocation: string;
  content: string;
  dogs: Doggy[];
  servicePackage: string;
}

type users = Awaited<ReturnType<typeof getUser>>;
type user = users[number];

function ServiceRequest({ user }: { user: user }) {
  const router = useRouter();

  const [servicePackage, setServicePackage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestForm>({
    defaultValues: {
      dogs: [{ id: "1", dogName: "", dogAge: "", dogBreed: "" }],
      marketing: "OTHER",
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "dogs", control });
  const houseSitting = watch("houseSitting");

  const onSubmit = async (data: ServiceRequestForm) => {
    try {
      await createRequest(
        data.dogs.length,
        data.marketing,
        data.brideName,
        data.groomName,
        data.weddingDate,
        data.serviceLength,
        data.houseSitting,
        data.weddingCity,
        data.weddingAddress,
        data.houseSittingLocation,
        data.content,
        data.dogs,
        servicePackage
      );

      await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          firstName: user?.name,
          action: "inquirySubmission",
          content: null,
          dogName: data.dogs,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Response from API:", data))
        .catch((error) => console.error("Error sending email:", error));
      toast.success("Inquiry submitted successfully!", {
        position: "top-right",
      });
      setTimeout(() => {
        router.push(`/myinquiry/${user.username}`);
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit inquiry");
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">
              Wedding Service Request
            </h1>
            <p className="text-gray-600 text-lg">
              Tell us about your special day and how we can help include your
              furry family members
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {/* Pet Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Dog className="w-6 h-6 text-gold mr-2" />
                <h2 className="text-2xl font-semibold text-navy">
                  Pet Information
                </h2>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid md:grid-cols-5 gap-4 mb-4 items-center"
                >
                  <input
                    {...register(`dogs.${index}.dogName`)}
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    {...register(`dogs.${index}.dogAge`)}
                    placeholder="Age"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    {...register(`dogs.${index}.dogBreed`)}
                    placeholder="Breed"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    {...register(`dogs.${index}.dogWeight`)}
                    placeholder="Weight (lbs)"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex justify-center items-center text-red-500 hover:text-white hover:bg-red-500 border border-red-500 transition-colors rounded-lg p-2"
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
                    dogName: "",
                    dogAge: "",
                    dogBreed: "",
                    dogWeight: "",
                  })
                }
                className="flex items-center text-blue-600 mt-2 hover:underline"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Dog
              </button>
            </div>

            {/* Couple Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Couple Information
              </h2>
              <input
                {...register("brideName", {
                  required: true,
                })}
                placeholder="Bride's Name"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              {errors.brideName?.type === "required" && (
                <p role="alert" className="text-red-400">
                  Please enter bride's name
                </p>
              )}
              <input
                {...register("groomName", { required: true })}
                placeholder="Groom's Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.groomName?.type === "required" && (
                <p role="alert" className="text-red-400">
                  Please enter groom's name
                </p>
              )}
            </div>

            {/* Wedding Details Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Wedding Details
              </h2>
              <input
                {...register("weddingDate", { required: true })}
                type="date"
              />
              <input
                {...register("serviceLength", { required: true })}
                type="number"
                placeholder="Service Duration (hours)"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Location Details Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Location Details
              </h2>
              <div className="relative">
                <input
                  {...register("weddingCity", { required: true })}
                  placeholder="Wedding City"
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                />
              </div>

              <input
                {...register("weddingAddress", { required: true })}
                placeholder="Wedding Venue"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  {...register("houseSitting")}
                  className="w-4 h-4"
                />
                <label className="ml-2">Include House Sitting Service</label>
              </div>
              {houseSitting && (
                <input
                  {...register("houseSittingLocation", {
                    required: houseSitting,
                  })}
                  placeholder="House Sitting Address/Location"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              )}
            </div>

            {/* Interested Service Package */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Package of Interest
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {servicePackage || "Select a Package"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem
                    onClick={() => setServicePackage("Paws of Honour")}
                    textValue="Paws of Honour"
                  >
                    Paws of Honour
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setServicePackage("All Paws In")}
                  >
                    All Paws In
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setServicePackage("Royal Treatment")}
                  >
                    Royal Treatment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setServicePackage("Pet Boarding")}
                  >
                    Pet Boarding
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Additional Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-navy mb-6">
                Additional Information
              </h2>
              <textarea
                {...register("content", { required: true })}
                rows={4}
                placeholder="Tell us about your dogs and any special requirements"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Marketing Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-gold mr-2" />
                <h2 className="text-2xl font-semibold text-navy">
                  How did you hear about us?
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="FACEBOOK"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "FACEBOOK"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaFacebook className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </label>
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="INSTAGRAM"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "INSTAGRAM"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaInstagram className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </label>
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="GOOGLE"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "GOOGLE"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaGoogle className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Google</span>
                </label>
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="TIKTOK"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "TIKTOK"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaTiktok className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">TikTok</span>
                </label>
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="EMAIL"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "EMAIL"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Email</span>
                </label>
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="WORD_OF_MOUTH"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "WORD_OF_MOUTH"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Word of Mouth</span>
                </label>
                <label className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    value="OTHER"
                    {...register("marketing")}
                    className="sr-only"
                  />
                  <div
                    className={`p-3 rounded-full mb-2 ${
                      watch("marketing") === "OTHER"
                        ? "bg-gold text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Other</span>
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gold text-navy px-8 py-4 rounded-full text-lg font-semibold hover:bg-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequest;
