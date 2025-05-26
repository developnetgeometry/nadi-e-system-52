import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Eye } from "lucide-react";

interface LeaveRequest {
  id: string;
  staff_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  remark: string;
}

export function AdminLeaveManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("nd_leave_request")
        .select(`
          id,
          start_date,
          end_date,
          remark,
          leave_status,
          nd_staff_profile(fullname)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(request => ({
        id: request.id.toString(),
        staff_name: request.nd_staff_profile?.fullname || 'Unknown',
        leave_type: "Annual Leave", // Default type
        start_date: request.start_date,
        end_date: request.end_date,
        status: request.leave_status === 1 ? "Pending" : 
               request.leave_status === 2 ? "Approved" : "Rejected",
        remark: request.remark || '',
      })) || [];

      setRequests(transformedData);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leave requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nd_leave_request")
        .update({ leave_status: 2 })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Leave request approved successfully",
      });

      fetchLeaveRequests();
    } catch (error) {
      console.error("Error approving leave:", error);
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nd_leave_request")
        .update({ leave_status: 3 })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Leave request rejected successfully",
      });

      fetchLeaveRequests();
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading leave requests...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Leave Management</h2>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.staff_name}</CardTitle>
                <Badge variant={
                  request.status === "Approved" ? "default" :
                  request.status === "Rejected" ? "destructive" : "secondary"
                }>
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Leave Type</p>
                  <p className="font-medium">{request.leave_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {request.remark && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Remarks</p>
                  <p className="text-sm">{request.remark}</p>
                </div>
              )}

              {request.status === "Pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
