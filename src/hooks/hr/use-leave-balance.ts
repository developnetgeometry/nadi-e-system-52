
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type LeaveBalance = {
  id: string;
  user_id: string;
  leave_type_id: number;
  leave_type: string;
  total_days: number;
  used_days: number;
  pending_days: number;
  remaining_days: number;
};

export function useLeaveBalance(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const targetUserId = userId || user?.id;
  
  const { data: leaveBalances, isLoading } = useQuery({
    queryKey: ["leave-balances", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      // In a real application, this would fetch from the database
      // Here we're returning mock data
      return [
        { 
          id: "1", 
          user_id: targetUserId, 
          leave_type_id: 1, 
          leave_type: "Annual", 
          total_days: 16, 
          used_days: 5, 
          pending_days: 2,
          remaining_days: 9 
        },
        { 
          id: "2", 
          user_id: targetUserId, 
          leave_type_id: 2, 
          leave_type: "Medical", 
          total_days: 14, 
          used_days: 2, 
          pending_days: 0,
          remaining_days: 12 
        },
        { 
          id: "3", 
          user_id: targetUserId, 
          leave_type_id: 3, 
          leave_type: "Emergency", 
          total_days: 3, 
          used_days: 1, 
          pending_days: 0,
          remaining_days: 2 
        },
        { 
          id: "4", 
          user_id: targetUserId, 
          leave_type_id: 4, 
          leave_type: "Replacement", 
          total_days: 5, 
          used_days: 0, 
          pending_days: 1,
          remaining_days: 4 
        },
      ] as LeaveBalance[];
    },
    enabled: !!targetUserId,
  });
  
  const updateBalanceMutation = useMutation({
    mutationFn: async (updates: Partial<LeaveBalance> & { id: string }) => {
      // In a real application, this would update the database
      // Here we're just simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-balances", targetUserId] });
      toast({
        title: "Leave balance updated",
        description: "The leave balance has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update leave balance.",
        variant: "destructive",
      });
    },
  });

  return {
    leaveBalances,
    isLoading,
    updateLeaveBalance: updateBalanceMutation.mutateAsync,
  };
}
