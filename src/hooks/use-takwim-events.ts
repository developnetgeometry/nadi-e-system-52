
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export interface TakwimEvent {
  id: string;
  program_name: string;
  description?: string;
  start_datetime: string;
  end_datetime?: string;
  location_event?: string;
  category_id?: number;
  subcategory_id?: number;
  module_id?: number;
  category?: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
  module?: {
    name: string;
  };
  total_participant?: number;
  capacity?: number;
  created_at: string;
  created_by: string;
}

interface EventInput {
  program_name: string;
  description: string;
  category_id: number | null;
  subcategory_id: number | null;
  module_id: number | null;
  start_datetime: string;
  end_datetime: string | null;
  location_event: string;
  capacity: number | null;
}

export function useTakwimEvents() {
  const [events, setEvents] = useState<TakwimEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("nd_event")
        .select(`
          id, 
          program_name, 
          description, 
          start_datetime,
          end_datetime, 
          location_event,
          category_id,
          subcategory_id,
          module_id,
          total_participant,
          category:category_id(name),
          subcategory:subcategory_id(name),
          module:module_id(name),
          created_at,
          created_by
        `)
        .order("start_datetime", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        variant: "destructive",
        title: "Failed to load events",
        description: "There was an error loading the event data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: EventInput) => {
    try {
      const { data, error } = await supabase
        .from("nd_event")
        .insert({
          program_name: eventData.program_name,
          description: eventData.description,
          category_id: eventData.category_id,
          subcategory_id: eventData.subcategory_id,
          module_id: eventData.module_id,
          start_datetime: eventData.start_datetime,
          end_datetime: eventData.end_datetime,
          location_event: eventData.location_event,
          total_participant: 0, // Initial value
          created_by: user?.id,
        })
        .select();

      if (error) throw error;
      
      // Refresh events after creating
      await fetchEvents();
      return data[0];
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<EventInput>) => {
    try {
      const { data, error } = await supabase
        .from("nd_event")
        .update({
          ...eventData,
          updated_by: user?.id,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      // Refresh events after updating
      await fetchEvents();
      return data[0];
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nd_event")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Refresh events after deleting
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
