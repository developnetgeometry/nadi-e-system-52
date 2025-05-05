
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SiteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Placeholder data - would be replaced with actual API call
  const site = {
    id: Number(id),
    name: "Main Office",
    address: "123 Main St, City, Country",
    manager: "John Doe",
    phone: "+1234567890",
    email: "info@example.com",
    status: "Active",
    operatingHours: "9:00 AM - 6:00 PM",
    offDays: "Saturday, Sunday",
    staffCount: 25
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <PageHeader
            title={`Site Details: ${site.name}`}
            description={`View and manage details for ${site.name}`}
          />
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/dashboard/site")}>
              Back to Sites
            </Button>
            <Button onClick={() => alert("Edit site functionality would go here")}>
              Edit Details
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="mt-6">
          <TabsList>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Site Name</p>
                  <p className="text-lg">{site.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-lg">{site.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Site Manager</p>
                  <p className="text-lg">{site.manager}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Phone</p>
                  <p className="text-lg">{site.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Email</p>
                  <p className="text-lg">{site.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-lg">{site.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Operating Hours</p>
                  <p className="text-lg">{site.operatingHours}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Off Days</p>
                  <p className="text-lg">{site.offDays}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Members ({site.staffCount})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-4">
                  Staff members assigned to this site will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="assets" className="mt-6">
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">Asset information will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedules" className="mt-6">
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">Schedule information will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
