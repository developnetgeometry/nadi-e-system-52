
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface EventCategory {
  id: number;
  name: string;
  description?: string;
}

export interface EventSubcategory {
  id: number;
  name: string;
  category_id: number;
}

export interface EventModule {
  id: number;
  name: string;
  program_id?: number;
}

export function useTakwimCategories() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [subcategories, setSubcategories] = useState<EventSubcategory[]>([]);
  const [modules, setModules] = useState<EventModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("nd_event_category")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        variant: "destructive",
        title: "Failed to load categories",
        description: "There was an error loading the category data.",
      });
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from("nd_event_subcategory")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast({
        variant: "destructive",
        title: "Failed to load subcategories",
        description: "There was an error loading the subcategory data.",
      });
    }
  };

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from("nd_event_module")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
      toast({
        variant: "destructive",
        title: "Failed to load modules",
        description: "There was an error loading the module data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
        fetchModules(),
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return {
    categories,
    subcategories,
    modules,
    isLoading,
    refreshData: () => {
      fetchCategories();
      fetchSubcategories();
      fetchModules();
    }
  };
}
