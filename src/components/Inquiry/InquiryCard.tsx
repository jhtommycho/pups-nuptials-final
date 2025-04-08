"use client";
import React, { useState } from "react";

import { format } from "date-fns";
import {
  MessageSquare,
  Send,
  Clock,
  MapPin,
  Dog,
  Users,
  Calendar,
  Home,
  ArrowDownIcon,
  Check,
  Pencil,
  Package,
} from "lucide-react";
import {
  createComment,
  getInquiryComments,
  getRequest,
  updateRequest,
  updateServiceStage,
  updateServiceDetails,
} from "@/actions/service.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Link from "next/link";
import { getUser } from "@/actions/user.action";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type inquiries = Awaited<ReturnType<typeof getRequest>>;
type inquiry = inquiries[number];
type comments = Awaited<ReturnType<typeof getInquiryComments>>;
type comment = comments[number];
type users = Awaited<ReturnType<typeof getUser>>;
type user = users[number];

interface commentForm {
  userId: string;
  serviceId: string;
  content: string;
  createdAt: string;
}

function InquiryCard({
  inquiry,
  dbUserId,
  user,
  isAuthorized,
  routeUsername,
}: {
  inquiry: inquiry;
  dbUserId: string | null;
  user: user;
  isAuthorized: boolean;
  routeUsername: string;
}) {
  const timeZone = "America/New_York";
  const [isOpen, setIsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusPopovers, setStatusPopovers] = useState<Record<string, boolean>>(
    {}
  );
  const [isEditingService, setIsEditingService] = useState<
    Record<string, boolean>
  >({});

  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [isUpdatingService, setIsUpdatingService] = useState(false);

  const handleCommentSubmit = async (inquiryId: string, content: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const newComment = await createComment(inquiryId, content);
      const input = document.getElementById(
        `comment-${inquiryId}`
      ) as HTMLInputElement;
      if (input) input.value = "";
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatusPopover = (inquiryId: string, isOpen: boolean) => {
    setStatusPopovers((prev) => ({
      ...prev,
      [inquiryId]: isOpen,
    }));
  };

  const handleEditServiceDetails = async (inquiryId: string) => {
    if (isUpdatingService) return;

    try {
      setIsUpdatingService(true);
      const data = editFormData[inquiryId];

      await updateServiceDetails(
        inquiryId,
        parseInt(data.dogCount),
        data.weddingDate,
        data.serviceLength,
        data.houseSitting,
        data.houseSittingLocation,
        data.weddingCity,
        data.weddingAddress
      );

      // Close the dialog after successful update
      setIsEditingService((prev) => ({ ...prev, [inquiryId]: false }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingService(false);
    }
  };

  const initializeEditForm = (inq: inquiry) => {
    setEditFormData((prev) => ({
      ...prev,
      [inq.id]: {
        dogCount: inq.dogCount.toString(),
        weddingDate: inq.weddingDate,
        serviceLength: inq.serviceLength,
        weddingCity: inq.weddingCity,
        weddingAddress: inq.weddingAddress,
        houseSitting: inq.houseSitting,
        houseSittingLocation: inq.houseSittingLocation || "",
      },
    }));
  };

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-navy">
          Unauthorized Access
        </h1>
        <p className="mb-6">
          You don't have permission to view this page - inquiry.
        </p>
        <Link href={`/myinquiry/${user?.username || ""}`}>
          <Button>View your own inquiries or create a new one</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {inquiry && inquiry.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-navy">
            Wedding Service Inquiries
          </h1>

          {/* List View */}
          <div className="space-y-4">
            {inquiry.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Header - Always visible */}
                <div
                  className="p-4 cursor-pointer hover:bg-cream/50 transition-colors"
                  onClick={() =>
                    setExpandedInquiryId(
                      expandedInquiryId === inq.id ? null : inq.id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {user?.userRole === "client" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cream text-navy">
                          {inq.status === "pending" && (
                            <div className="text-yellow-500">PENDING</div>
                          )}
                          {inq.status === "approved" && (
                            <div className="text-green-500">APPROVED</div>
                          )}
                          {inq.status === "rejected" && (
                            <div className="text-red-500">REJECTED</div>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cream text-navy">
                          <Popover
                            open={statusPopovers[inq.id]}
                            onOpenChange={(open) =>
                              toggleStatusPopover(inq.id, open)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                className="relative p-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <ArrowDownIcon className="w-5 h-5" />
                                {inq.status === "pending" && (
                                  <div className="text-yellow-500">PENDING</div>
                                )}
                                {inq.status === "approved" && (
                                  <div className="text-green-500">APPROVED</div>
                                )}
                                {inq.status === "rejected" && (
                                  <div className="text-red-500">REJECTED</div>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">
                                  Update Status
                                </h4>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    className="justify-start"
                                    onClick={() => {
                                      updateRequest(inq.id, "pending");
                                      toggleStatusPopover(inq.id, false);
                                    }}
                                  >
                                    PENDING
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="justify-start"
                                    onClick={() => {
                                      updateRequest(inq.id, "approved");
                                      toggleStatusPopover(inq.id, false);
                                    }}
                                  >
                                    APPROVED
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="justify-start"
                                    onClick={() => {
                                      updateRequest(inq.id, "rejected");
                                      toggleStatusPopover(inq.id, false);
                                    }}
                                  >
                                    REJECTED
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </span>
                      )}

                      <span className="text-navy font-medium">
                        {inq.brideName} & {inq.groomName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Submitted on {format(inq.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-navy">
                        Wedding Date {""} - currently 1 day behind actual date
                        {format(inq.weddingDate, "MMMM d, yyyy")}
                      </span>
                      <ArrowDownIcon
                        className={`w-5 h-5 transition-transform ${
                          expandedInquiryId === inq.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedInquiryId === inq.id && (
                  <div className="border-t border-gray-200 p-6">
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="info" className="text-lg">
                          Inquiry Info
                        </TabsTrigger>
                        <TabsTrigger value="communication" className="text-lg">
                          Communication
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="info">
                        <div className="grid md:grid-cols-3 gap-8">
                          {/* Main Details */}
                          <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                              <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-navy">
                                  Service Details
                                </h2>

                                {user?.userRole === "manager" && (
                                  <Dialog
                                    open={isEditingService[inq.id]}
                                    onOpenChange={(open) => {
                                      setIsEditingService((prev) => ({
                                        ...prev,
                                        [inq.id]: open,
                                      }));
                                      if (open) initializeEditForm(inq);
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                      >
                                        <Pencil className="w-4 h-4" />
                                        Edit Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Service Details
                                        </DialogTitle>
                                      </DialogHeader>
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          handleEditServiceDetails(inq.id);
                                        }}
                                        className="space-y-4 pt-4"
                                      >
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="dogCount">
                                              Number of Dogs
                                            </Label>
                                            <Input
                                              id="dogCount"
                                              type="number"
                                              value={
                                                editFormData[inq.id]
                                                  ?.dogCount || ""
                                              }
                                              onChange={(e) =>
                                                setEditFormData((prev) => ({
                                                  ...prev,
                                                  [inq.id]: {
                                                    ...prev[inq.id],
                                                    dogCount: e.target.value,
                                                  },
                                                }))
                                              }
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="serviceLength">
                                              Service Duration (hours)
                                            </Label>
                                            <Input
                                              id="serviceLength"
                                              value={
                                                editFormData[inq.id]
                                                  ?.serviceLength || ""
                                              }
                                              onChange={(e) =>
                                                setEditFormData((prev) => ({
                                                  ...prev,
                                                  [inq.id]: {
                                                    ...prev[inq.id],
                                                    serviceLength:
                                                      e.target.value,
                                                  },
                                                }))
                                              }
                                            />
                                          </div>
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="weddingDate">
                                            Wedding Date
                                          </Label>
                                          <Input
                                            id="weddingDate"
                                            type="date"
                                            value={
                                              editFormData[inq.id]
                                                ?.weddingDate || ""
                                            }
                                            onChange={(e) =>
                                              setEditFormData((prev) => ({
                                                ...prev,
                                                [inq.id]: {
                                                  ...prev[inq.id],
                                                  weddingDate: e.target.value,
                                                },
                                              }))
                                            }
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="weddingCity">
                                            Wedding City
                                          </Label>
                                          <Input
                                            id="weddingCity"
                                            value={
                                              editFormData[inq.id]
                                                ?.weddingCity || ""
                                            }
                                            onChange={(e) =>
                                              setEditFormData((prev) => ({
                                                ...prev,
                                                [inq.id]: {
                                                  ...prev[inq.id],
                                                  weddingCity: e.target.value,
                                                },
                                              }))
                                            }
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="weddingAddress">
                                            Wedding Address
                                          </Label>
                                          <Input
                                            id="weddingAddress"
                                            value={
                                              editFormData[inq.id]
                                                ?.weddingAddress || ""
                                            }
                                            onChange={(e) =>
                                              setEditFormData((prev) => ({
                                                ...prev,
                                                [inq.id]: {
                                                  ...prev[inq.id],
                                                  weddingAddress:
                                                    e.target.value,
                                                },
                                              }))
                                            }
                                          />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id="houseSitting"
                                            checked={
                                              editFormData[inq.id]
                                                ?.houseSitting || false
                                            }
                                            onCheckedChange={(checked) =>
                                              setEditFormData((prev) => ({
                                                ...prev,
                                                [inq.id]: {
                                                  ...prev[inq.id],
                                                  houseSitting: checked,
                                                },
                                              }))
                                            }
                                          />
                                          <Label htmlFor="houseSitting">
                                            House Sitting Required
                                          </Label>
                                        </div>

                                        {editFormData[inq.id]?.houseSitting && (
                                          <div className="space-y-2">
                                            <Label htmlFor="houseSittingLocation">
                                              House Sitting Location
                                            </Label>
                                            <Input
                                              id="houseSittingLocation"
                                              value={
                                                editFormData[inq.id]
                                                  ?.houseSittingLocation || ""
                                              }
                                              onChange={(e) =>
                                                setEditFormData((prev) => ({
                                                  ...prev,
                                                  [inq.id]: {
                                                    ...prev[inq.id],
                                                    houseSittingLocation:
                                                      e.target.value,
                                                  },
                                                }))
                                              }
                                            />
                                          </div>
                                        )}

                                        <div className="flex justify-end gap-2 pt-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                              setIsEditingService((prev) => ({
                                                ...prev,
                                                [inq.id]: false,
                                              }))
                                            }
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            type="submit"
                                            disabled={isUpdatingService}
                                          >
                                            {isUpdatingService
                                              ? "Updating..."
                                              : "Save Changes"}
                                          </Button>
                                        </div>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>

                              <div className="space-y-6">
                                {/* Couple Details */}
                                <div className="flex items-start space-x-4">
                                  <Users className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                  <div>
                                    <h3 className="font-medium text-navy">
                                      Couple
                                    </h3>
                                    <p className="text-gray-600">
                                      {inq.brideName} & {inq.groomName}
                                    </p>
                                  </div>
                                </div>

                                {/* Dogs Details */}
                                <div className="flex items-start space-x-4">
                                  <Dog className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                  <div>
                                    <h3 className="font-medium text-navy">
                                      {inq.dogCount > 1 ? (
                                        <>{inq.dogCount} Dogs</>
                                      ) : (
                                        <>{inq.dogCount} Dog</>
                                      )}
                                    </h3>
                                    <p className="text-gray-600">
                                      {inq.Dog.map((dog) => (
                                        <>
                                          <div key={dog.id}>
                                            {dog.dogName} {dog.dogAge}{" "}
                                            {dog.dogBreed} {dog.dogWeight}
                                            {"lbs"}
                                          </div>
                                        </>
                                      ))}
                                    </p>
                                  </div>
                                </div>

                                {/* Wedding Details */}
                                <div className="flex items-start space-x-4">
                                  <Calendar className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                  <div>
                                    <h3 className="font-medium text-navy">
                                      Wedding Date
                                    </h3>
                                    <p className="text-gray-600">
                                      {format(inq.weddingDate, "MMMM d, yyyy")}
                                    </p>
                                  </div>
                                </div>

                                {/* Service Length */}
                                <div className="flex items-start space-x-4">
                                  <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                  <div>
                                    <h3 className="font-medium text-navy">
                                      Service Duration
                                    </h3>
                                    <p className="text-gray-600">
                                      {inq.serviceLength} hours
                                    </p>
                                  </div>
                                </div>

                                {/* Locations */}
                                <div className="flex items-start space-x-4">
                                  <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                  <div>
                                    <h3 className="font-medium text-navy">
                                      Wedding Address / Venue
                                    </h3>
                                    <p className="text-gray-600">
                                      {inq.weddingAddress}
                                    </p>
                                    <p className="text-gray-600">
                                      {inq.weddingCity}
                                    </p>
                                  </div>
                                </div>

                                {inq.houseSitting ? (
                                  <div className="flex items-start space-x-4">
                                    <Home className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                    <div>
                                      <h3 className="font-medium text-navy">
                                        House Sitting Location
                                      </h3>
                                      <p className="text-gray-600">
                                        {inq.houseSittingLocation}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start space-x-4">
                                    <Home className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                    <div>
                                      <h3 className="font-medium text-navy">
                                        House Sitting
                                      </h3>
                                      <h2 className="text-gray-600">
                                        Not Required
                                      </h2>
                                    </div>
                                  </div>
                                )}

                                {inq.servicePackage ? (
                                  <div className="flex items-start space-x-4">
                                    <Package className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                    <div>
                                      <h3 className="font-medium text-navy">
                                        Service Package of Interest
                                      </h3>
                                      <p className="text-gray-600">
                                        {inq.servicePackage}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start space-x-4">
                                    <Home className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                                    <div>
                                      <h3 className="font-medium text-navy">
                                        Service Package of Interest
                                      </h3>
                                      <h2 className="text-gray-600">{""}</h2>
                                    </div>
                                  </div>
                                )}

                                {/* Last Updated At */}
                                {isAuthorized && (
                                  <div className="border-t pt-6">
                                    <h3 className="font-sm text-gray-500 mb-2">
                                      Service Details Last Updated At:{" "}
                                      {format(inq.updatedAt, "MMMM d, yyyy")} -
                                      currently 1 day behind
                                    </h3>
                                  </div>
                                )}

                                {/* Additional Notes */}
                                <div className="border-t pt-6">
                                  <h3 className="font-medium text-navy mb-2">
                                    Additional Notes
                                  </h3>
                                  <p className="text-gray-600">{inq.content}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status Timeline */}
                          <div className="md:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                              <h2 className="text-xl font-semibold text-navy mb-6">
                                <span>
                                  Status Updates{" "}
                                  {user?.userRole === "manager" && (
                                    <Popover
                                      open={statusOpen}
                                      onOpenChange={setStatusOpen}
                                    >
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          <ArrowDownIcon className="w-5 h-5" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent>
                                        <div className="flex flex-col gap-2">
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateServiceStage(
                                                inq.id,
                                                "InquiryReceived"
                                              )
                                            }
                                          >
                                            Inquiry Received
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateServiceStage(
                                                inq.id,
                                                "ReviewInProgress"
                                              )
                                            }
                                          >
                                            Review In Progress
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateServiceStage(
                                                inq.id,
                                                "QuotePreparation"
                                              )
                                            }
                                          >
                                            Quote Preparation
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateServiceStage(
                                                inq.id,
                                                "ContractReview"
                                              )
                                            }
                                          >
                                            Contract Review
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateServiceStage(
                                                inq.id,
                                                "FinalConfirmation"
                                              )
                                            }
                                          >
                                            Final Confirmation
                                          </Button>
                                          <Button
                                            variant="outline"
                                            onClick={() =>
                                              updateServiceStage(
                                                inq.id,
                                                "Booked"
                                              )
                                            }
                                          >
                                            Booked
                                          </Button>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  )}
                                </span>
                              </h2>
                              <div className="space-y-6">
                                <div>
                                  {inq.stage === "InquiryReceived" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                                        <p className="font-medium text-navy">
                                          Inquiry Received
                                        </p>
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        {format(inq.createdAt, "MMM d, h:mm a")}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <Check className="text-green-500" />{" "}
                                        <p className="font-medium text-gray-500">
                                          Inquiry Received
                                        </p>
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        {format(inq.createdAt, "MMM d, h:mm a")}
                                      </p>
                                    </>
                                  )}
                                </div>
                                <div>
                                  {inq.stage === "InquiryReceived" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-gray-400">
                                            Review In Progress
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : inq.stage === "ReviewInProgress" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-black">
                                            Review In Progress
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <Check className="text-green-500" />
                                        <p className="font-medium text-gray-400">
                                          Review In Progress
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div>
                                  {inq.stage === "InquiryReceived" ||
                                  inq.stage === "ReviewInProgress" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-gray-400">
                                            Quote Preparation
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : inq.stage === "QuotePreparation" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-black">
                                            Quote Preparation
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <Check className="text-green-500" />
                                        <p className="font-medium text-gray-400">
                                          Quote Preparation
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div>
                                  {inq.stage === "InquiryReceived" ||
                                  inq.stage === "ReviewInProgress" ||
                                  inq.stage === "QuotePreparation" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-gray-400">
                                            Contract Review
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : inq.stage === "ContractReview" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-black">
                                            Contract Review
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <Check className="text-green-500" />
                                        <p className="font-medium text-gray-400">
                                          Contract Review
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div>
                                  {inq.stage === "InquiryReceived" ||
                                  inq.stage === "ReviewInProgress" ||
                                  inq.stage === "QuotePreparation" ||
                                  inq.stage === "ContractReview" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-gray-400">
                                            Final Review
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : inq.stage === "FinalConfirmation" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-black">
                                            Final Review
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <Check className="text-green-500" />
                                        <p className="font-medium text-gray-400">
                                          Final Review
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div>
                                  {inq.stage === "InquiryReceived" ||
                                  inq.stage === "ReviewInProgress" ||
                                  inq.stage === "QuotePreparation" ||
                                  inq.stage === "ContractReview" ||
                                  inq.stage === "FinalConfirmation" ? (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-gray-400">
                                            Booked & Finalized!
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                                        <div>
                                          <p className="font-medium text-black">
                                            Booked & Finalized!
                                          </p>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="communication">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex items-center mb-6">
                            <MessageSquare className="w-6 h-6 text-gold mr-2" />
                            <h2 className="text-2xl font-semibold text-navy">
                              Communication
                            </h2>
                          </div>

                          {/* Messages */}
                          <div className="space-y-4 mb-4">
                            {inq.Comment.sort(
                              (a, b) =>
                                new Date(a.createdAt).getTime() -
                                new Date(b.createdAt).getTime()
                            ).map((comment) => (
                              <div
                                key={comment.id}
                                className={`flex ${
                                  comment.user?.userRole === "CLIENT"
                                    ? "justify-start"
                                    : "justify-end"
                                }`}
                              >
                                <div
                                  className={`bg-gray-50 rounded-lg p-4 max-w-[80%] ${
                                    comment.user?.userRole === "CLIENT"
                                      ? "bg-gray-50"
                                      : "bg-gold/20"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="font-medium text-navy">
                                      {comment.user?.name || "Anonymous"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {format(
                                        new Date(comment.createdAt),
                                        "MMM d, h:mm a"
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-gray-700">
                                    {comment.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* New Message Form */}
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              const input = e.currentTarget.elements.namedItem(
                                "content"
                              ) as HTMLInputElement;
                              if (input.value.trim()) {
                                handleCommentSubmit(inq.id, input.value);
                              }

                              await fetch("/api/emails", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  email: inq?.user?.email,
                                  firstName: inq?.user?.name,
                                  action: "comment",
                                  content: input.value,
                                }),
                              })
                                .then((res) => res.json())
                                .then((data) =>
                                  console.log("Response from API:", data)
                                )
                                .catch((error) =>
                                  console.error("Error sending email:", error)
                                );
                            }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              name="content"
                              id={`comment-${inq.id}`}
                              placeholder="Type your message..."
                              className="flex-1 rounded-lg border-2 border-gray-200 p-2 focus:outline-none focus:border-gold"
                            />
                            <button
                              type="submit"
                              className="bg-gold text-navy px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors flex items-center gap-2"
                              disabled={isSubmitting}
                            >
                              <Send className="w-5 h-5" />
                              {isSubmitting ? "Sending..." : "Send"}
                            </button>
                          </form>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-navy">
            No Inquiries Found
          </h1>
          <p className="mb-6">You haven't created any inquiries yet.</p>
          <Link href="/myinquiry/request">
            <Button>Create an Inquiry</Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default InquiryCard;
