import React from "react";
import { getRequest } from "@/actions/service.action";
import { getUser } from "@/actions/user.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestsBarChart from "@/components/analytics/RequestsBarChart";
import RequestsLineChart from "@/components/analytics/RequestsLineChart";
import LocationPieChart from "@/components/analytics/LocationPieChart";
import RequestsStatusChart from "@/components/analytics/RequestsStatusChart";
import MarketingChannelsChart from "@/components/analytics/MarketingChannelsChart";

async function AnalyticsPage() {
  const user = await getUser();
  const allRequests = await getRequest();

  // Redirect or show access denied if not a manager
  if (user?.userRole !== "manager") {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need manager permissions to view analytics.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Weekly Requests</TabsTrigger>
          <TabsTrigger value="location">Locations</TabsTrigger>
          <TabsTrigger value="status">Request Status</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Requests Over Time</CardTitle>
              <CardDescription>
                View the number of service requests submitted per week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Tabs defaultValue="bar" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                  <TabsTrigger value="line">Line Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="bar">
                  <RequestsBarChart requests={allRequests || []} />
                </TabsContent>
                <TabsContent value="line">
                  <RequestsLineChart requests={allRequests || []} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requests by Location</CardTitle>
              <CardDescription>
                Distribution of service requests by wedding location
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LocationPieChart requests={allRequests || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
              <CardDescription>
                Overview of service requests by their current status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RequestsStatusChart requests={allRequests || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channel Distribution</CardTitle>
              <CardDescription>
                How clients are finding our services
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <MarketingChannelsChart requests={allRequests || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AnalyticsPage;
