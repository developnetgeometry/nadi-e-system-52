
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NadiClosure, CreateNadiClosureParams, UpdateNadiClosureParams } from '../types/nadi-closure';

// Fetch off days/closures for a site
export const useOffDaysQuery = (siteId: string | null) => {
  return useQuery({
    queryKey: ['offDays', siteId],
    queryFn: async () => {
      if (!siteId) return [];
      
      const { data, error } = await supabase
        .from('nd_off_days')
        .select('*')
        .eq('site_id', siteId)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      
      return data as NadiClosure[];
    },
    enabled: !!siteId,
  });
};

// Create a new off day/closure
export const useCreateOffDayMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: CreateNadiClosureParams) => {
      const { data, error } = await supabase
        .from('nd_off_days')
        .insert(params)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offDays', variables.site_id] });
    }
  });
};

// Update an existing off day/closure
export const useUpdateOffDayMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...params }: UpdateNadiClosureParams) => {
      const { data, error } = await supabase
        .from('nd_off_days')
        .update(params)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['offDays', data.site_id] });
    }
  });
};

// Delete an off day/closure
export const useDeleteOffDayMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, siteId }: { id: string; siteId: string }) => {
      const { error } = await supabase
        .from('nd_off_days')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { id, siteId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['offDays', data.siteId] });
    }
  });
};
