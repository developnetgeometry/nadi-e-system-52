
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StaffDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Placeholder data - would be replaced with actual API call
  const staffMember = {
    id: Number(id),
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    position: "Manager",
    department: "HR",
    site: "Main Office",
    joinDate: "2022-01-15",
    address: "123 Main St, City, Country",
    emergencyContact: "Jane Doe - +0987654321",
    employmentType: "Full-time",
    status: "Active"
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <PageHeader
            title={`Staff Details: ${staffMember.name}`}
            description={`View and manage details for ${staffMember.name}`}
          />
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate("/dashboard/staff")}>
              Back to Staff List
            </Button>
            <Button onClick={() => alert("Edit staff functionality would go here")}>
              Edit Details
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="personal" className="mt-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="employment">Employment Details</TabsTrigger>
            <TabsTrigger value="leave">Leave Records</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-lg">{staffMember.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-lg">{staffMember.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-lg">{staffMember.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-lg">{staffMember.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Emergency Contact</p>
                  <p className="text-lg">{staffMember.emergencyContact}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Position</p>
                  <p className="text-lg">{staffMember.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-lg">{staffMember.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Site</p>
                  <p className="text-lg">{staffMember.site}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Join Date</p>
                  <p className="text-lg">{staffMember.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Employment Type</p>
                  <p className="text-lg">{staffMember.employmentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-lg">{staffMember.status}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leave" className="mt-6">
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">Leave records will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payroll" className="mt-6">
            <Card>
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">Payroll information will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
