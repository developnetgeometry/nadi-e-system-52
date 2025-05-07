
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUserMetadata } from "@/hooks/use-user-metadata";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { useSiteStaffData } from "@/hooks/hr/use-site-staff-data";
import { StaffManagementForm } from "@/components/hr/StaffManagementForm";
import { StaffTable } from "@/components/hr/StaffTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { deleteStaffMember, updateStaffStatus } from "@/lib/staff";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  "On Leave": "bg-yellow-100 text-yellow-800",
  Inactive: "bg-red-100 text-red-800",
};

const StaffManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<any>(null);
  const userMetadataString = useUserMetadata();
  const { user } = useAuth();
  const { userType } = useUserAccess();

  const [organizationInfo, setOrganizationInfo] = useState<{
    organization_id: string | null;
    organization_name: string | null;
  }>({
    organization_id: null,
    organization_name: null,
  });

  useEffect(() => {
    if (userMetadataString) {
      try {
        const metadata = JSON.parse(userMetadataString);
        setOrganizationInfo({
          organization_id: metadata.organization_id || null,
          organization_name: metadata.organization_name || null,
        });
      } catch (error) {
        console.error("Error parsing user metadata:", error);
      }
    }
  }, [userMetadataString]);

  const {
    staffList,
    isLoading,
    locationOptions,
    statusOptions,
    addStaffMember,
    updateStaffMember,
    removeStaffMember,
  } = useSiteStaffData(user, organizationInfo);

  const handleEditStaff = (staffId: string) => {
    navigate(`/dashboard/hr/staff/edit/${staffId}`);
  };

  const handleViewStaff = (staffId: string) => {
    navigate(`/dashboard/hr/staff/${staffId}`);
  };

  const handleDeleteStaff = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (staff) {
      setStaffToDelete(staff);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      await deleteStaffMember(staffToDelete.id);
      removeStaffMember(staffToDelete.id);

      toast({
        title: "Staff Deleted",
        description: `${staffToDelete.name} has been removed successfully.`,
      });
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return;

    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await updateStaffStatus(staffId, newStatus);
      updateStaffMember({
        ...staff,
        status: newStatus,
      });

      toast({
        title: "Status Updated",
        description: `${staff.name}'s status has been changed to ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Error updating staff status:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update staff status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Tabs defaultValue="manage" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Staff Management</h1>
              <p className="text-muted-foreground">
                {organizationInfo.organization_name
                  ? `Managing staff for ${organizationInfo.organization_name}`
                  : "Manage your staff members"}
              </p>
            </div>
            <TabsList className="mt-4 md:mt-0">
              <TabsTrigger value="manage">Manage Staff</TabsTrigger>
              <TabsTrigger value="add">Add Staff</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>
                  View and manage staff members in your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StaffTable
                  isLoading={isLoading}
                  filteredStaff={staffList.map(staff => ({
                    ...staff,
                    role: staff.userType?.replace(/_/g, " ") || "Unknown"
                  }))}
                  formatDate={formatDate}
                  statusColors={statusColors}
                  onEdit={handleEditStaff}
                  onDelete={handleDeleteStaff}
                  onView={handleViewStaff}
                  onToggleStatus={handleToggleStatus}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            {organizationInfo.organization_id ? (
              <StaffManagementForm
                organizationId={organizationInfo.organization_id}
                organizationName={organizationInfo.organization_name || "Your Organization"}
                onStaffAdded={addStaffMember}
                siteLocations={locationOptions}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You need to be associated with an organization to add staff members.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {staffToDelete?.name}'s record from
              the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStaff}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default StaffManagement;
