
import { supabase } from "@/integrations/supabase/client";

// Helper function to get current user ID
export const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id;
};

// Calculate duration between two dates in hours
export const calculateDurationHours = (startDate: Date, endDate: Date): number => {
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
};
