
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type LeaveApplication = {
  id: string;
  user_id: string;
  user_name?: string;
  leave_type_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  period: "full_day" | "half_day_am" | "half_day_pm";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  attachment_url?: string;
  created_at: string;
  updated_at?: string;
};

export type LeaveApplicationFormData = {
  leave_type_id: number;
  leave_type: string;
  start_date: Date;
  end_date: Date;
  period: "full_day" | "half_day_am" | "half_day_pm";
  days: number;
  reason: string;
  attachment?: FileList;
};

export function useLeaveApplications(userId?: string, isAdmin = false) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const targetUserId = userId || user?.id;
  
  const { data: leaveApplications, isLoading } = useQuery({
    queryKey: ["leave-applications", targetUserId, isAdmin],
    queryFn: async () => {
      if (!targetUserId && !isAdmin) return [];
      
      // In a real app, this would fetch from the database
      // For admin view, fetch all applications, for staff view, fetch only their own
      if (isAdmin) {
        return [
          {
            id: "1",
            user_id: "101",
            user_name: "John Smith",
            leave_type_id: 1,
            leave_type: "Annual",
            start_date: "2025-05-15",
            end_date: "2025-05-17",
            days: 3,
            period: "full_day",
            reason: "Family vacation",
            status: "Pending",
            created_at: "2025-05-01T08:30:00Z"
          },
          {
            id: "2",
            user_id: "102",
            user_name: "Sarah Johnson",
            leave_type_id: 2,
            leave_type: "Medical",
            start_date: "2025-05-12",
            end_date: "2025-05-13",
            days: 2,
            period: "full_day",
            reason: "Doctor's appointment",
            status: "Approved",
            attachment_url: "/medical-certificate.pdf",
            created_at: "2025-05-03T10:15:00Z"
          },
          {
            id: "3",
            user_id: "103",
            user_name: "Michael Brown",
            leave_type_id: 3,
            leave_type: "Emergency",
            start_date: "2025-05-10",
            end_date: "2025-05-10",
            days: 1,
            period: "full_day",
            reason: "Family emergency",
            status: "Rejected",
            attachment_url: "/emergency-doc.pdf",
            created_at: "2025-05-02T14:45:00Z"
          },
          {
            id: "4",
            user_id: "104",
            user_name: "Emily Davis",
            leave_type_id: 4,
            leave_type: "Replacement",
            start_date: "2025-05-20",
            end_date: "2025-05-21",
            days: 2,
            period: "full_day",
            reason: "Personal matters",
            status: "Pending",
            created_at: "2025-05-05T09:20:00Z"
          },
        ] as LeaveApplication[];
      } else {
        return [
          {
            id: "1",
            user_id: targetUserId || "",
            leave_type_id: 1,
            leave_type: "Annual",
            start_date: "2025-05-15",
            end_date: "2025-05-17",
            days: 3,
            period: "full_day",
            reason: "Family vacation",
            status: "Pending",
            created_at: "2025-05-01T08:30:00Z"
          },
          {
            id: "2",
            user_id: targetUserId || "",
            leave_type_id: 2,
            leave_type: "Medical",
            start_date: "2025-04-10",
            end_date: "2025-04-11",
            days: 2,
            period: "full_day",
            reason: "Doctor's appointment",
            status: "Approved",
            attachment_url: "/medical-certificate.pdf",
            created_at: "2025-04-05T10:15:00Z"
          },
          {
            id: "3",
            user_id: targetUserId || "",
            leave_type_id: 3,
            leave_type: "Emergency",
            start_date: "2025-03-20",
            end_date: "2025-03-20",
            days: 1,
            period: "full_day",
            reason: "Family emergency",
            status: "Rejected",
            attachment_url: "/emergency-doc.pdf",
            created_at: "2025-03-19T14:45:00Z"
          }
        ] as LeaveApplication[];
      }
    },
    enabled: !!targetUserId || isAdmin,
  });
  
  const submitLeaveApplication = useMutation({
    mutationFn: async (data: LeaveApplicationFormData) => {
      // In a real app, this would submit to the database
      // Here we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle file upload if needed
      // let attachment_url = undefined;
      // if (data.attachment && data.attachment.length > 0) {
      //   const file = data.attachment[0];
      //   // Upload to storage and get URL
      // }
      
      return {
        id: Math.random().toString(36).substring(2, 9),
        user_id: targetUserId || "",
        leave_type_id: data.leave_type_id,
        leave_type: data.leave_type,
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: data.end_date.toISOString().split('T')[0],
        days: data.days,
        period: data.period,
        reason: data.reason,
        status: "Pending",
        created_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-applications", targetUserId] });
      toast({
        title: "Leave application submitted",
        description: "Your leave application has been submitted for approval.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit leave application.",
        variant: "destructive",
      });
    },
  });
  
  const updateLeaveStatus = useMutation({
    mutationFn: async ({ id, status, remarks }: { id: string; status: "Approved" | "Rejected"; remarks?: string }) => {
      // In a real app, this would update the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, status, remarks };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["leave-applications"] });
      toast({
        title: `Leave application ${data.status.toLowerCase()}`,
        description: `The leave application has been ${data.status.toLowerCase()}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update leave application status.",
        variant: "destructive",
      });
    },
  });

  return {
    leaveApplications,
    isLoading,
    submitLeaveApplication: submitLeaveApplication.mutateAsync,
    updateLeaveStatus: updateLeaveStatus.mutateAsync,
    isSubmitting: submitLeaveApplication.isPending,
    isUpdating: updateLeaveStatus.isPending,
  };
}
